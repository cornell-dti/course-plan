import { CREDITS_COURSE_ID, FWS_COURSE_ID } from './data/constants';
import requirementJson from './typed-requirement-json';

/**
 * A collection of helper functions
 * that might be useful for both frontend components and requirement graph computation
 */

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is AP/IB equivalent course or credit
 */
export const courseIsAPIB = (course: CourseTaken): boolean =>
  [CREDITS_COURSE_ID, FWS_COURSE_ID].includes(course.courseId) ||
  ['AP', 'IB'].includes(course.code.split(' ')[0]);

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

export function getUserRequirements({
  college,
  major: majors,
  minor: minors,
}: AppOnboardingData): readonly RequirementWithIDSourceType[] {
  // check university & college & major & minor requirements
  if (!(college in requirementJson.college)) throw new Error(`College ${college} not found.`);

  const universityReqs = requirementJson.university.UNI;
  const collegeReqs = requirementJson.college[college];

  return [
    ...universityReqs.requirements.map(
      it =>
        ({
          ...it,
          id: `College-UNI-${it.name}`,
          sourceType: 'College',
          sourceSpecificName: college,
        } as const)
    ),
    ...collegeReqs.requirements.map(
      it =>
        ({
          ...it,
          id: `College-${college}-${it.name}`,
          sourceType: 'College',
          sourceSpecificName: college,
        } as const)
    ),
    ...majors
      .map(major => {
        const majorRequirement = requirementJson.major[major];
        if (majorRequirement == null) return [];
        return majorRequirement.requirements.map(
          it =>
            ({
              ...it,
              id: `Major-${major}-${it.name}`,
              sourceType: 'Major',
              sourceSpecificName: major,
            } as const)
        );
      })
      .flat(),
    ...minors
      .map(minor => {
        const minorRequirement = requirementJson.minor[minor];
        if (minorRequirement == null) return [];
        return minorRequirement.requirements.map(
          it =>
            ({
              ...it,
              id: `Minor-${minor}-${it.name}`,
              sourceType: 'Minor',
              sourceSpecificName: minor,
            } as const)
        );
      })
      .flat(),
  ].map(requirement => ({
    ...requirement,
    allowCourseDoubleCounting: requirementAllowDoubleCounting(requirement, majors) || undefined,
  }));
}

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
): {
  readonly fulfilledBy: 'courses' | 'credits';
  readonly eligibleCourses: readonly (readonly number[])[];
  readonly perSlotMinCount: readonly number[];
  readonly minNumberOfSlots?: number;
} | null {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return null;
    case 'courses':
    case 'credits':
      return {
        fulfilledBy: requirement.fulfilledBy,
        eligibleCourses: requirement.courses,
        perSlotMinCount: requirement.perSlotMinCount,
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
        eligibleCourses: option.courses,
        perSlotMinCount: option.perSlotMinCount,
        minNumberOfSlots: option.minNumberOfSlots,
      };
    }
    default:
      throw new Error();
  }
}

/**
 * @param requirement the requirement which we want sub-requirement progress report.
 * @param coursesTaken a list of courses that are associated with the requirement in the graph.
 * @param toggleableRequirementChoices user's choices on toggleable requirements.
 * @returns requirement fulfillment stat, and partitioned courses into sub-requirement slots.
 */
export function computeFulfillmentCoursesAndStatistics(
  requirement: RequirementWithIDSourceType,
  coursesTaken: readonly CourseTaken[],
  toggleableRequirementChoices: AppToggleableRequirementChoices
): RequirementFulfillmentStatistics & { readonly courses: readonly (readonly CourseTaken[])[] } {
  const spec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  if (spec == null) {
    // Give self-check 1 required course and 0 fulfilled to prevent it from being fulfilled.
    return { fulfilledBy: 'self-check', minCountFulfilled: 0, minCountRequired: 1, courses: [] };
  }
  const { fulfilledBy, eligibleCourses, perSlotMinCount, minNumberOfSlots } = spec;

  const coursesThatFulfilledSubRequirements: CourseTaken[][] = eligibleCourses.map(() => []);
  const subRequirementProgress: number[] = eligibleCourses.map(() => 0);
  coursesTaken.forEach(courseTaken => {
    const { courseId } = courseTaken;
    if (!(requirement.disallowTransferCredit && courseIsAPIB(courseTaken))) {
      for (
        let subRequirementIndex = 0;
        subRequirementIndex < eligibleCourses.length;
        subRequirementIndex += 1
      ) {
        if (
          eligibleCourses[subRequirementIndex].includes(courseId) &&
          subRequirementProgress[subRequirementIndex] < perSlotMinCount[subRequirementIndex]
        ) {
          // add the course to the list of courses used to fulfill that one sub-requirement
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
}

export function getRelatedUnfulfilledRequirements(
  {
    crseId: courseId,
    subject,
    catalogNbr,
    enrollGroups: [{ unitsMaximum: credits }],
  }: CornellCourseRosterCourse,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  toggleableRequirementChoices: AppToggleableRequirementChoices
): {
  readonly directlyRelatedRequirements: readonly RequirementWithIDSourceType[];
  readonly selfCheckRequirements: readonly RequirementWithIDSourceType[];
} {
  const code = `${subject} ${catalogNbr}`;
  const directlyRelatedRequirements: RequirementWithIDSourceType[] = [];
  const selfCheckRequirements: RequirementWithIDSourceType[] = [];
  for (let i = 0; i < groupedRequirements.length; i += 1) {
    const subreqs = groupedRequirements[i].reqs.filter(
      it => it.minCountFulfilled < it.minCountRequired
    );
    for (let j = 0; j < subreqs.length; j += 1) {
      const {
        requirement: subRequirement,
        courses: existingCoursesInSlots,
        minCountFulfilled: existingMinCountFulfilled,
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
            toggleableRequirementChoices
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
