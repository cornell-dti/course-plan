import { SPECIAL_COURSES } from './data/constants';
import requirementJson from './typed-requirement-json';
import specialized from './specialize';
import { getConstraintViolationsForSingleCourse } from './requirement-constraints-utils';
import { examCourseIds } from './requirement-exam-mapping';

/**
 * A collection of helper functions
 * that might be useful for both frontend components and requirement graph computation
 */

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is AP/IB equivalent course or credit
 */
export const courseIsAPIB = (course: CourseTaken): boolean =>
  // TODO @bshen simplify logic, deprecate special courses
  Object.values(SPECIAL_COURSES).includes(course.courseId) ||
  ['AP', 'IB'].includes(course.code.split(' ')[0]) ||
  examCourseIds.has(course.courseId);

/**
 * The function converts a FireStoreSemesterCourse, the course structure stored in Firebase
 * user data, into a CourseTaken type used throughout the requirements sidebar.
 */
export function convertFirestoreSemesterCourseToCourseTaken({
  crseId,
  uniqueID,
  code,
  credits,
}: FirestoreSemesterCourse): CourseTaken {
  return { courseId: crseId, uniqueId: uniqueID, code, credits };
}

/**
 * This returns a function that filters out courses that cannot fulfill a requirement with requirementId
 * based on whether it is an eligible course or not. Used to filter out data for the self-check add modal.
 */
export const getFilter = (
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  requirementId: string
): ((course: CornellCourseRosterCourse) => boolean) => {
  const requirement = userRequirementsMap[requirementId];
  // If we cannot find the relevant requirement, then default to true to be permissive.
  if (requirement == null) return () => true;
  const requirementSpec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  // If a requirement is truly self-check, then all courses can be used.
  if (requirementSpec == null) return () => true;
  const eligibleCourseIds = new Set(requirementSpec.eligibleCourses.flat());
  return course => eligibleCourseIds.has(course.crseId);
};

/**
 * The function returns a boolean representing whether a course can fulfill requirement with requirementId based on
 * whether or not it is eligible. Used to filter out data for the self-check dropdown, and is based on the above filter.
 */
export function canFulfillChecker(
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  requirementId: string,
  crseId: number
): boolean {
  const requirement = userRequirementsMap[requirementId];
  // If we cannot find the relevant requirement, then default to true to be permissive.
  if (requirement == null) return true;
  const requirementSpec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  // If a requirement is truly self-check, then all courses can be used.
  if (requirementSpec == null) return true;
  const eligibleCourseIds = new Set(requirementSpec.eligibleCourses.flat());
  return eligibleCourseIds.has(crseId);
}

/**
 * @deprecated TODO @bshen
 */
export function requirementAllowDoubleCounting(
  requirement: RequirementWithIDSourceType,
  majors: readonly string[]
): boolean {
  // All minor requirements are automatically double-countable.
  if (requirement.sourceType === 'Minor') return true;
  if (requirement.sourceType === 'Major') {
    if (majors == null) throw new Error("shouldn't get here since we have major requirements!");
    // If it's not the first major, then it's double countable.
    if (requirement.sourceSpecificName !== majors[0]) return true;
  }
  return requirement.allowCourseDoubleCounting || false;
}

export function allowCourseDoubleCountingBetweenRequirements(
  requirementA: RequirementWithIDSourceType,
  requirementB: RequirementWithIDSourceType
): boolean {
  // at least one requirement has the allowCourseDoubleCounting flag
  if (requirementA.allowCourseDoubleCounting || requirementB.allowCourseDoubleCounting) {
    return true;
  }
  // requirement source type is the same
  if (requirementA.sourceType === requirementB.sourceType) {
    // at least one source type is minor
    if (requirementA.sourceType == 'Minor') {
      return true; // TODO confirm this
    }
    return requirementA.sourceSpecificName !== requirementB.sourceSpecificName;
  }
  // requirement source type is not the same
  else {
    // exactly one source type is minor
    if (requirementA.sourceType === 'Minor' || requirementB.sourceType === 'Minor') {
      return true; // TODO confirm this
    }
    return false;
  }

  // return (
  //   requirementA.sourceType === 'Minor' ||
  //   requirementB.sourceType === 'Minor' ||
  //   (requirementA.sourceType === requirementB.sourceType &&
  //     requirementA.sourceSpecificName !== requirementB.sourceSpecificName)
  // );
}

/**
 * Get the requirements for a provided collection of majors/minors
 *
 * @param sourceType The type of the field of study, e.g. 'Major' or 'Minor'
 * @param fields the names of the majors/minors
 * @returns An array of requirements corresponding to every field of study in `fields`
 */
const fieldOfStudyReqs = (sourceType: 'Major' | 'Minor', fields: readonly string[]) => {
  const jsonKey = sourceType.toLowerCase() as 'major' | 'minor';
  const fieldRequirements = requirementJson[jsonKey];
  return fields
    .map(field => {
      const fieldRequirement = fieldRequirements[field];
      return fieldRequirement?.requirements.map(
        it =>
          (({
            ...it,
            id: `${sourceType}-${field}-${it.name}`,
            sourceType,
            sourceSpecificName: field,
          } as const) ?? [])
      );
    })
    .flat();
};

/**
 * Get the majors corresponding to a list of major names
 *
 * @param majorNames the majors of the majors
 * @returns An array of `Major<DecoratedCollegeOrMajorRequirement>` representing
 * with the provided names. Names corresponding to no known major are ignored.
 */
const getMajors = (majorNames: readonly string[]) =>
  majorNames.map(name => requirementJson.major[name]).filter(major => major !== undefined);

/**
 * Get the specialized requirements for a college given a list of majors
 *
 * @param collegeName the name of the college the user is enrolled in
 * @param majorNames an array of the names of the majors the user is planning for
 * @returns An array of college requirements specialized for the user based on
 * their majors
 */
const specializedForCollege = (collegeName: string, majorNames: readonly string[]) => {
  const majors = getMajors(majorNames);
  const collegeReqs = requirementJson.college[collegeName].requirements;
  const spec = specialized(collegeReqs, majors);
  return spec.map(
    req =>
      ({
        ...req,
        id: `College-${collegeName}-${req.name}`,
        sourceType: 'College',
        sourceSpecificName: collegeName,
      } as const)
  );
};

export function getUserRequirements({
  college,
  major: majors,
  minor: minors,
  grad,
}: AppOnboardingData): readonly RequirementWithIDSourceType[] {
  // check university & college & major & minor requirements
  if (college && !(college in requirementJson.college))
    throw new Error(`College ${college} not found.`);

  const rawUniReqs = requirementJson.university.UNI;
  // University requirements only added if college is defined, i.e. if the user has selected an undergraduate program.
  const uniReqs = college
    ? rawUniReqs.requirements.map(
        it =>
          ({
            ...it,
            id: `College-UNI-${it.name}`,
            sourceType: 'College',
            sourceSpecificName: college,
          } as const)
      )
    : [];
  const collegeReqs = college ? specializedForCollege(college, majors) : [];
  const majorReqs = fieldOfStudyReqs('Major', majors);
  const minorReqs = fieldOfStudyReqs('Minor', minors);
  const gradReqs = grad
    ? requirementJson.grad[grad].requirements.map(
        it =>
          ({
            ...it,
            id: `Grad-${grad}-${it.name}`,
            sourceType: 'Grad',
            sourceSpecificName: grad,
          } as const)
      )
    : [];
  // flatten all requirements into single array
  return [uniReqs, collegeReqs, majorReqs, minorReqs, gradReqs].flat();
}

/**
 * The base type for requirement specification.
 * A requirement specification is a condensed object tells you exactly
 * how a requirement can be fulfilled on each slot.
 * Specifically, the toggleable requirement choice has already been made,
 * so only the one the user chosen is here.
 */
type MatchedRequirementFulfillmentSpecificationBase = {
  readonly fulfilledBy: 'courses' | 'credits';
  readonly hasRequirementCheckerWarning: boolean;
  readonly eligibleCourses: readonly (readonly number[])[];
  readonly perSlotMinCount: readonly number[];
  readonly slotNames: readonly string[];
  readonly minNumberOfSlots?: number;
};

/**
 * Same as `MatchedRequirementFulfillmentSpecificationBase`,
 * but also including additional requirements.
 */
type MatchedRequirementFulfillmentSpecification =
  | (MatchedRequirementFulfillmentSpecificationBase & {
      readonly additionalRequirements?: {
        readonly [name: string]: MatchedRequirementFulfillmentSpecificationBase;
      };
    })
  | null;

/**
 * The function respects the user choice on toggleable requirement, and provides the already decided
 * fulfillment strategy to follow.
 *
 * @returns a spec telling how the requirement progress should be computed, or null if the requirement
 * is self-check.
 */
export function getMatchedRequirementFulfillmentSpecification(
  requirement: RequirementWithIDSourceType,
  toggleableRequirementChoices: AppToggleableRequirementChoices
): MatchedRequirementFulfillmentSpecification {
  /**
   * Given a map of additional requirements, keep the requirement name key, but extract out the
   * requirement spec for each additional requirement.
   * This enables us to run the name fulfillment computation algorithm on additional requirements.
   */
  const convertAdditionalRequirements = (additionalRequirements?: {
    readonly [name: string]: RequirementFulfillmentInformationCourseOrCreditBase<{
      readonly courses: readonly (readonly number[])[];
    }>;
  }): { readonly [name: string]: MatchedRequirementFulfillmentSpecificationBase } | undefined =>
    additionalRequirements == null
      ? undefined
      : Object.fromEntries(
          Object.entries(additionalRequirements).map(([name, subRequirement]) => {
            const slotNames =
              subRequirement.fulfilledBy === 'courses' ? subRequirement.slotNames : [];
            return [
              name,
              {
                fulfilledBy: subRequirement.fulfilledBy,
                hasRequirementCheckerWarning: false,
                eligibleCourses: subRequirement.courses,
                perSlotMinCount: subRequirement.perSlotMinCount,
                slotNames,
                minNumberOfSlots: subRequirement.minNumberOfSlots,
              },
            ];
          })
        );

  const hasRequirementCheckerWarning = requirement.checkerWarning != null;
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return null;
    case 'courses':
      return {
        fulfilledBy: requirement.fulfilledBy,
        hasRequirementCheckerWarning,
        eligibleCourses: requirement.courses,
        additionalRequirements: convertAdditionalRequirements(requirement.additionalRequirements),
        perSlotMinCount: requirement.perSlotMinCount,
        slotNames: requirement.slotNames,
        minNumberOfSlots: requirement.minNumberOfSlots,
      };
    case 'credits':
      return {
        fulfilledBy: requirement.fulfilledBy,
        hasRequirementCheckerWarning,
        eligibleCourses: requirement.courses,
        additionalRequirements: convertAdditionalRequirements(requirement.additionalRequirements),
        perSlotMinCount: requirement.perSlotMinCount,
        slotNames: [],
        minNumberOfSlots: requirement.minNumberOfSlots,
      };
    case 'toggleable': {
      const option =
        requirement.fulfillmentOptions[
          toggleableRequirementChoices[requirement.id] ||
            Object.keys(requirement.fulfillmentOptions)[0]
        ];
      return {
        fulfilledBy: option.counting,
        hasRequirementCheckerWarning,
        eligibleCourses: option.courses,
        perSlotMinCount: option.perSlotMinCount,
        slotNames: option.counting === 'courses' ? option.slotNames : [],
        minNumberOfSlots: option.minNumberOfSlots,
      };
    }
    default:
      throw new Error();
  }
}

const computeFulfillmentStatistics = (
  requirementName: string,
  coursesTaken: readonly CourseTaken[],
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices,
  disallowTransferCredit: boolean,
  {
    fulfilledBy,
    hasRequirementCheckerWarning,
    eligibleCourses,
    perSlotMinCount,
    slotNames,
    minNumberOfSlots,
  }: MatchedRequirementFulfillmentSpecificationBase
): RequirementFulfillmentStatisticsWithCourses => {
  const coursesThatFulfilledSubRequirements: CourseTaken[][] = eligibleCourses.map(() => []);
  const subRequirementProgress: number[] = eligibleCourses.map(() => 0);
  coursesTaken.forEach(courseTaken => {
    const overrideOptions = overriddenFulfillmentChoices[courseTaken.uniqueId] || {
      arbitraryOptIn: [],
      acknowledgedCheckerWarningOptIn: [],
      optOut: [],
    };
    // If a requirement has checker warning, do not match it the course unless it's acknowledged.
    if (
      overrideOptions.optOut.includes(requirementName) ||
      (hasRequirementCheckerWarning &&
        !overrideOptions.acknowledgedCheckerWarningOptIn.includes(requirementName))
    ) {
      return;
    }
    const arbitraryOptInSlotNames = new Set(overrideOptions.arbitraryOptIn[requirementName] || []);

    // block AP/IB equivalent courses if disallowTransferCredit
    if (
      !(disallowTransferCredit && courseIsAPIB(courseTaken)) ||
      arbitraryOptInSlotNames.size > 0
    ) {
      for (
        let subRequirementIndex = 0;
        subRequirementIndex < eligibleCourses.length;
        subRequirementIndex += 1
      ) {
        const slotName = fulfilledBy === 'courses' ? slotNames[subRequirementIndex] : 'Course';
        if (arbitraryOptInSlotNames.has(slotName)) {
          // the user wants to use this course to override this sub-requirement
          coursesThatFulfilledSubRequirements[subRequirementIndex].push(courseTaken);
          subRequirementProgress[subRequirementIndex] +=
            fulfilledBy === 'courses' ? 1 : courseTaken.credits;
          // don't break, in case the user wants to override more sub-requirements with the same course
        } else if (
          eligibleCourses[subRequirementIndex].includes(courseTaken.courseId) &&
          subRequirementProgress[subRequirementIndex] < perSlotMinCount[subRequirementIndex]
        ) {
          // this course is eligible to fulfill this sub-requirement, and the user did not opt out
          coursesThatFulfilledSubRequirements[subRequirementIndex].push(courseTaken);
          subRequirementProgress[subRequirementIndex] +=
            fulfilledBy === 'courses' ? 1 : courseTaken.credits;
          break;
        }
      }
    }
  });

  if (minNumberOfSlots != null) {
    const minCountFulfilled = subRequirementProgress.reduce(
      (acc, progress, index) => acc + (progress >= perSlotMinCount[index] ? 1 : 0),
      0
    );
    return {
      fulfilledBy,
      minCountFulfilled,
      minCountRequired: minNumberOfSlots,
      courses: coursesThatFulfilledSubRequirements,
    };
  }

  const minCountFulfilled = subRequirementProgress.reduce((acc, progress) => acc + progress, 0);
  const minCountRequired = perSlotMinCount.reduce((acc, progress) => acc + progress, 0);
  return {
    fulfilledBy,
    minCountFulfilled,
    minCountRequired,
    courses: coursesThatFulfilledSubRequirements,
  };
};

/**
 * @param requirement the requirement which we want sub-requirement progress report.
 * @param coursesTaken a list of courses that are associated with the requirement in the graph.
 * @param toggleableRequirementChoices user's choices on toggleable requirements.
 * @returns requirement fulfillment stat, and partitioned courses into sub-requirement slots.
 */
export function computeFulfillmentCoursesAndStatistics(
  requirement: RequirementWithIDSourceType,
  coursesTaken: readonly CourseTaken[],
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices
): RequirementFulfillmentStatisticsWithCoursesWithAdditionalRequirements {
  const spec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  if (spec == null) {
    // Give self-check 1 required course and 0 fulfilled to prevent it from being fulfilled.
    return { fulfilledBy: 'self-check', minCountFulfilled: 0, minCountRequired: 1, courses: [] };
  }
  const disallowTransferCredit = requirement.disallowTransferCredit || false;
  const base = computeFulfillmentStatistics(
    requirement.id,
    coursesTaken,
    overriddenFulfillmentChoices,
    disallowTransferCredit,
    spec
  );
  if (spec.additionalRequirements == null) return base;
  return {
    ...base,
    additionalRequirements: Object.fromEntries(
      Object.entries(spec.additionalRequirements).map(([name, subSpec]) => [
        name,
        computeFulfillmentStatistics(
          name,
          coursesTaken,
          overriddenFulfillmentChoices,
          disallowTransferCredit,
          subSpec
        ),
      ])
    ),
  };
}

export function getAllEligibleRelatedRequirementIds(
  courseId: number,
  uniqueId: number,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>
): readonly string[] {
  const requirements = groupedRequirements
    .flatMap(it => it.reqs)
    .flatMap(({ requirement }) => {
      const spec = getMatchedRequirementFulfillmentSpecification(
        requirement,
        toggleableRequirementChoices
      );
      if (spec == null) return [];
      const allEligibleCourses = spec.eligibleCourses.flat();
      if (allEligibleCourses.includes(courseId) && requirement.checkerWarning == null) {
        return [requirement.id];
      }
      return [];
    });
  // only return the requirements that are in a constraint violation
  const constraintViolations = getConstraintViolationsForSingleCourse(
    { uniqueId },
    requirements,
    (reqA, reqB) =>
      allowCourseDoubleCountingBetweenRequirements(
        userRequirementsMap[reqA],
        userRequirementsMap[reqB]
      )
  );
  if (constraintViolations) {
    const { constraintViolationsGraph } = constraintViolations;
    return constraintViolationsGraph.getAllRequirements();
  }
  return [];
}

export function getRelatedUnfulfilledRequirements(
  {
    crseId: courseId,
    subject,
    catalogNbr,
    enrollGroups: [{ unitsMaximum: credits }],
  }: CornellCourseRosterCourse,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices
): {
  readonly directlyRelatedRequirements: readonly RequirementWithIDSourceType[];
  readonly selfCheckRequirements: readonly RequirementWithIDSourceType[];
} {
  const code = `${subject} ${catalogNbr}`;
  const directlyRelatedRequirements: RequirementWithIDSourceType[] = [];
  const selfCheckRequirements: RequirementWithIDSourceType[] = [];
  for (let i = 0; i < groupedRequirements.length; i += 1) {
    const subreqs = groupedRequirements[i].reqs.filter(
      it => it.fulfillment.safeMinCountFulfilled < it.fulfillment.minCountRequired
    );
    for (let j = 0; j < subreqs.length; j += 1) {
      const {
        requirement: subRequirement,
        fulfillment: {
          safeCourses: existingCoursesInSlots,
          safeMinCountFulfilled: existingMinCountFulfilled,
        },
      } = subreqs[j];
      const existingCourses = existingCoursesInSlots.flat();
      const requirementSpec = getMatchedRequirementFulfillmentSpecification(
        subRequirement,
        toggleableRequirementChoices
      );
      // potential self-check requirements
      if (requirementSpec == null && !subRequirement.allowCourseDoubleCounting) {
        selfCheckRequirements.push(subRequirement);
      }
      if (requirementSpec != null) {
        const allEligibleCourses = requirementSpec.eligibleCourses.flat();
        if (allEligibleCourses.includes(courseId)) {
          const fulfillmentStatisticsWithNewCourse = computeFulfillmentCoursesAndStatistics(
            subRequirement,
            [...existingCourses, { uniqueId: -1, courseId, code, credits }],
            toggleableRequirementChoices,
            {
              ...overriddenFulfillmentChoices,
              // Very loose choice to make the course count towards fulfillment
              // Careful computation of choice is done during actual adding time.
              [-1]: {
                acknowledgedCheckerWarningOptIn: [subRequirement.id],
                optOut: [],
                arbitraryOptIn: {},
              },
            }
          );
          if (fulfillmentStatisticsWithNewCourse.minCountFulfilled > existingMinCountFulfilled) {
            if (subRequirement.checkerWarning == null) {
              directlyRelatedRequirements.push(subRequirement);
            } else {
              selfCheckRequirements.push(subRequirement);
            }
          }
        }
      }
    }
  }
  return { directlyRelatedRequirements, selfCheckRequirements };
}

export function getAllEligibleRequirements(
  courseId: number,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  toggleableRequirementChoices: AppToggleableRequirementChoices
): {
  readonly requirementsThatAllowDoubleCounting: readonly RequirementWithIDSourceType[];
  readonly relatedRequirements: readonly RequirementWithIDSourceType[];
  readonly selfCheckRequirements: readonly RequirementWithIDSourceType[];
} {
  const requirementsThatAllowDoubleCounting: RequirementWithIDSourceType[] = [];
  const relatedRequirements: RequirementWithIDSourceType[] = [];
  const selfCheckRequirements: RequirementWithIDSourceType[] = [];
  for (let i = 0; i < groupedRequirements.length; i += 1) {
    const requirements = groupedRequirements[i].reqs;
    for (let j = 0; j < requirements.length; j += 1) {
      const { requirement } = requirements[j];
      const requirementSpec = getMatchedRequirementFulfillmentSpecification(
        requirement,
        toggleableRequirementChoices
      );
      // potential self-check requirements
      if (requirementSpec == null && !requirement.allowCourseDoubleCounting) {
        selfCheckRequirements.push(requirement);
      }
      if (requirementSpec != null) {
        const allEligibleCourses = requirementSpec.eligibleCourses.flat();
        if (allEligibleCourses.includes(courseId)) {
          if (requirement.allowCourseDoubleCounting) {
            requirementsThatAllowDoubleCounting.push(requirement);
          } else if (requirement.checkerWarning == null) {
            relatedRequirements.push(requirement);
          } else {
            selfCheckRequirements.push(requirement);
          }
        }
      }
    }
  }

  return {
    requirementsThatAllowDoubleCounting,
    relatedRequirements,
    selfCheckRequirements,
  };
}
