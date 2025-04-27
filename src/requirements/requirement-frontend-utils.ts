import requirementJson from './typed-requirement-json';
import specialized from './specialize';
import { examCourseIds } from './requirement-exam-mapping';
import { getConstraintViolationsForSingleCourse } from './requirement-constraints-utils';
import featureFlagCheckers from '../feature-flags';

/**
 * A collection of helper functions
 * that might be useful for both frontend components and requirement graph computation
 */

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is AP/IB equivalent course or credit
 */
export const courseIsAPIB = (course: CourseTaken): boolean =>
  ['AP', 'IB'].includes(course.code.split(' ')[0]) || examCourseIds.has(course.courseId);

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
export const getFilterForRequirementFulfillment = (
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
 * Course double counting is a constraint relation between two requirements.
 * Instead of asking "does a requirement allow double counting with all other requirements?",
 * we frame it as "does requirementA and requirementB allow double counting with each other?"
 *
 * If true, a course can fulfill requirement A and requirement B without a constraint violation.
 * If false, edges from course c to requirementA and requirementB cause a constraint violation (c,(rA,rB)).
 */
export function allowCourseDoubleCountingBetweenRequirements(
  requirementA: RequirementWithIDSourceType,
  requirementB: RequirementWithIDSourceType
): boolean {
  // console.log("Entered allow course double counting thing")
  if (!requirementA || !requirementB) {
    // If requirement is undefined, handle accordingly
    return false; // Or any other value, or skip this item
  }
  // console.log(requirementA)
  // console.log(requirementB)
  const allowCourseDoubleCounting =
    requirementA.allowCourseDoubleCounting || requirementB.allowCourseDoubleCounting || false;

  // requirement source type is the same
  if (requirementA.sourceType === requirementB.sourceType) {
    return (
      // at least one requirement has the allowCourseDoubleCounting flag
      allowCourseDoubleCounting ||
      // or the source specific name is different
      requirementA.sourceSpecificName !== requirementB.sourceSpecificName
    );
  }
  // requirement source type is not the same
  // one source type is minor and one source type is college or major
  if (
    (requirementA.sourceType === 'Minor' && requirementB.sourceType !== 'Grad') ||
    (requirementA.sourceType !== 'Grad' && requirementB.sourceType === 'Minor')
  ) {
    return true;
  }
  // one source type is college and one source type is major
  if (
    (requirementA.sourceType === 'College' && requirementB.sourceType === 'Major') ||
    (requirementA.sourceType === 'Major' && requirementB.sourceType === 'College')
  ) {
    return allowCourseDoubleCounting;
  }

  // one source type is college or major or minor and one source type is grad
  return false;
}

const reqWithSourceInfo = (
  req: DecoratedCollegeOrMajorRequirement,
  sourceType: 'Major' | 'Minor',
  sourceSpecificName: string
) => ({
  ...req,
  id: `${sourceType}-${sourceSpecificName}-${req.name}`,
  sourceType,
  sourceSpecificName,
});

/**
 * Get the requirements for a provided collection of majors/minors
 *
 * @param sourceType The type of the field of study, e.g. 'Major' or 'Minor'
 * @param fields the names of the majors/minors
 * @returns An array of requirements corresponding to every field of study in `fields`
 */
const fieldOfStudyReqs = (
  sourceType: 'Major' | 'Minor',
  fields: readonly string[],
  entryYear: string
) => {
  const jsonKey = sourceType.toLowerCase() as 'major' | 'minor';
  const fieldRequirements = requirementJson[jsonKey];

  return fields
    .map(field => {
      const fieldRequirement = fieldRequirements[field];
      const requirementMigrations = fieldRequirement?.migrations || [];

      // Filter migrations based on entryYear
      const filteredMigrations = requirementMigrations.filter(
        migration => parseInt(entryYear, 10) <= migration.entryYear
      );

      // Collect all requirements corresponding to 'Add' migrations in one array
      const addMigrationNewValues = filteredMigrations
        .filter(migration => migration.type === 'Add')
        .map(migration => migration.newValue);

      return (
        fieldRequirement?.requirements
          // Find migrations that match existing requirements - must be 'Delete' or 'Modify'
          .filter(it => {
            const matchingMigration = filteredMigrations.find(
              migration => migration.fieldName === it.name
            );

            // If a reqiurement matches a 'Delete' migration, return false (filter it out of overall requirements)
            if (matchingMigration) {
              if (matchingMigration.type === 'Delete') {
                return false;
              }
            }
            return true;
          })
          .map(it => {
            const matchingMigration = filteredMigrations.find(
              migration => migration.fieldName === it.name
            );

            // If a requirement matches a 'Modify' migration, map it to it's new value
            if (matchingMigration) {
              if (matchingMigration.type === 'Modify') {
                return matchingMigration.newValue as DecoratedCollegeOrMajorRequirement;
              }
            }
            return it;
          })
          .concat(addMigrationNewValues.filter(Boolean) as DecoratedCollegeOrMajorRequirement[])
          // Use helper to map requirements to requirements with source info
          .map(it => reqWithSourceInfo(it, sourceType, field))
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
 * @param entryYear the year the user entered Cornell
 * @returns An array of college requirements specialized for the user based on
 * their majors and entry year
 */
const specializedForCollege = (
  collegeName: string,
  majorNames: readonly string[],
  entryYear: string
) => {
  const majors = getMajors(majorNames);
  const collegeObj = requirementJson.college[collegeName];
  const collegeReqs = collegeObj.requirements;
  const requirementMigrations = collegeObj.migrations || [];

  const filteredMigrations = requirementMigrations.filter(
    migration => parseInt(entryYear, 10) <= migration.entryYear
  );

  const addMigrationNewValues = filteredMigrations
    .filter(migration => migration.type === 'Add')
    .map(migration => migration.newValue);

  const migratedReqs = collegeReqs
    .filter(it => {
      const matchingMigration = filteredMigrations.find(
        migration => migration.fieldName === it.name
      );

      if (matchingMigration) {
        if (matchingMigration.type === 'Delete') {
          return false;
        }
      }
      return true;
    })
    .map(it => {
      const matchingMigration = filteredMigrations.find(
        migration => migration.fieldName === it.name
      );

      if (matchingMigration) {
        if (matchingMigration.type === 'Modify') {
          return matchingMigration.newValue as DecoratedCollegeOrMajorRequirement;
        }
      }
      return it;
    })
    .concat(addMigrationNewValues.filter(Boolean) as DecoratedCollegeOrMajorRequirement[]);

  const spec = specialized(migratedReqs, majors);

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
  entranceYear,
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
  const collegeReqs = college ? specializedForCollege(college, majors, entranceYear) : [];
  const majorReqs = fieldOfStudyReqs('Major', majors, entranceYear);
  const minorReqs = fieldOfStudyReqs('Minor', minors, entranceYear);
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
  return [uniReqs, collegeReqs, majorReqs, minorReqs, ...gradReqs]
    .flat()
    .filter(Boolean) as RequirementWithIDSourceType[];
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
 * fulfillment strategy to follow. It also filters eligible courses based on the user's college/major.
 *
 * @returns a spec telling how the requirement progress should be computed, or null if the requirement
 * is self-check.
 */
export function getMatchedRequirementFulfillmentSpecification(
  requirement: RequirementWithIDSourceType,
  toggleableRequirementChoices: AppToggleableRequirementChoices
): MatchedRequirementFulfillmentSpecification {
  const { sourceType, sourceSpecificName } = requirement;
  const filterEligibleCoursesByRequirementConditions = (
    coursesList: readonly (readonly number[])[],
    conditions: RequirementCourseConditions | undefined
  ) =>
    coursesList.map(courses =>
      courses.filter(courseId => {
        // do not include ap/ib course if feature flag is not toggled (TEMPORARILY TURNED OFF)
        // if (!featureFlagCheckers.isAPIBFulfillmentEnabled() && examCourseIds.has(courseId))
        //   return false;
        // allow course if there are no requirement conditions
        if (!(conditions && courseId in conditions)) return true;
        // otherwise, inspect conditions to see if we should disallow course
        const { colleges, majorsExcluded } = conditions[courseId];
        // requirement is not in colleges list
        if (sourceType === 'College' && !colleges.includes(sourceSpecificName)) return false;
        // requirement is in majorsExcluded list
        if (majorsExcluded && sourceType === 'Major' && majorsExcluded.includes(sourceSpecificName))
          return false;
        // course passes all conditions
        return true;
      })
    );
  /**
   * Given a map of additional requirements, keep the requirement name key, but extract out the
   * requirement spec for each additional requirement.
   * This enables us to run the name fulfillment computation algorithm on additional requirements.
   */
  const convertAdditionalRequirements = (additionalRequirements?: {
    readonly [name: string]: RequirementFulfillmentInformationCourseOrCreditBase<{
      readonly courses: readonly (readonly number[])[];
      readonly conditions?: Readonly<RequirementCourseConditions>;
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
                eligibleCourses: filterEligibleCoursesByRequirementConditions(
                  subRequirement.courses,
                  subRequirement.conditions
                ),
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
        eligibleCourses: filterEligibleCoursesByRequirementConditions(
          requirement.courses,
          requirement.conditions
        ),
        additionalRequirements: convertAdditionalRequirements(requirement.additionalRequirements),
        perSlotMinCount: requirement.perSlotMinCount,
        slotNames: requirement.slotNames,
        minNumberOfSlots: requirement.minNumberOfSlots,
      };
    case 'credits':
      return {
        fulfilledBy: requirement.fulfilledBy,
        hasRequirementCheckerWarning,
        eligibleCourses: filterEligibleCoursesByRequirementConditions(
          requirement.courses,
          requirement.conditions
        ),
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
        eligibleCourses: filterEligibleCoursesByRequirementConditions(
          option.courses,
          option.conditions
        ),
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
  const base = computeFulfillmentStatistics(
    requirement.id,
    coursesTaken,
    overriddenFulfillmentChoices,
    spec
  );
  if (spec.additionalRequirements == null) return base;
  return {
    ...base,
    additionalRequirements: Object.fromEntries(
      Object.entries(spec.additionalRequirements).map(([name, subSpec]) => [
        name,
        computeFulfillmentStatistics(name, coursesTaken, overriddenFulfillmentChoices, subSpec),
      ])
    ),
  };
}

/**
 * Find related requirement ids to opt out of. This maintains the invariant that
 * there are no constraint violations when adding a course to the semester.
 * It should be deprecated after the new add modal is implemented.
 */
export function getRelatedRequirementIdsForCourseOptOut(
  courseId: number,
  associatedRequirementId: string,
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
      if (
        requirement.id === associatedRequirementId ||
        (allEligibleCourses.includes(courseId) && requirement.checkerWarning == null)
      ) {
        return [requirement.id];
      }
      return [];
    });
  // only return the requirements that are in a constraint violation
  const uniqueId = -1; // dummy unique id
  const { requirementsThatDoNotAllowDoubleCounting } = getConstraintViolationsForSingleCourse(
    { uniqueId },
    requirements,
    (reqA, reqB) =>
      allowCourseDoubleCountingBetweenRequirements(
        userRequirementsMap[reqA],
        userRequirementsMap[reqB]
      )
  );
  // order does not need to be preserved
  return Array.from(requirementsThatDoNotAllowDoubleCounting).filter(
    it => it !== associatedRequirementId
  );
}

// display the entire number of fulfillents, including those that are dangerous
export function fulfillmentProgressString({
  fulfilledBy,
  dangerousMinCountFulfilled,
  safeMinCountFulfilled,
  minCountRequired,
}: MixedRequirementFulfillmentStatistics) {
  return featureFlagCheckers.isRequirementConflictsEnabled()
    ? `${dangerousMinCountFulfilled}/${minCountRequired} ${fulfilledBy}`
    : `${safeMinCountFulfilled}/${minCountRequired} ${fulfilledBy}`;
}

export function getRelatedUnfulfilledRequirements(
  {
    crseId: courseId,
    subject,
    catalogNbr,
    enrollGroups: [{ unitsMaximum: credits }],
  }: CornellCourseRosterCourse,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  onboardingData: AppOnboardingData,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices,
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>
): {
  readonly relatedRequirements: readonly RequirementWithIDSourceType[];
  readonly selfCheckRequirements: readonly RequirementWithIDSourceType[];
  readonly automaticallyFulfilledRequirements: readonly RequirementWithIDSourceType[];
} {
  const code = `${subject} ${catalogNbr}`;
  const relatedRequirements: RequirementWithIDSourceType[] = [];
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
              relatedRequirements.push(subRequirement);
            } else {
              selfCheckRequirements.push(subRequirement);
            }
          }
        }
      } else {
        selfCheckRequirements.push(subRequirement);
      }
    }
  }
  const allRequirements = [...relatedRequirements, ...selfCheckRequirements];
  const { requirementsThatDoNotAllowDoubleCounting } = getConstraintViolationsForSingleCourse(
    { uniqueId: -1 },
    allRequirements.map(({ id }) => id),
    (reqA, reqB) =>
      allowCourseDoubleCountingBetweenRequirements(
        userRequirementsMap[reqA],
        userRequirementsMap[reqB]
      )
  );
  const automaticallyFulfilledRequirements = relatedRequirements.filter(
    ({ id }) => !requirementsThatDoNotAllowDoubleCounting.has(id)
  );

  return { relatedRequirements, selfCheckRequirements, automaticallyFulfilledRequirements };
}
