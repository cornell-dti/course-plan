import requirementJson from './typed-requirement-json';

/**
 * A collection of helper functions
 * that might be useful for both frontend components and requirement graph computation
 */

/**
 * The function converts a FireStoreSemesterCourse, the course structure stored in Firebase
 * user data, into a CourseTaken type used throughout the requirements sidebar.
 */
export function convertFirestoreSemesterCourseToCourseTaken(
  course: FirestoreSemesterCourse
): CourseTaken {
  const [subject, number] = course.code.split(' ');
  return { subject, courseId: course.crseId, number, credits: course.credits };
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
  readonly subRequirementProgress: 'every-course-needed' | 'any-can-count';
  readonly minCount: number;
} | null {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return null;
    case 'courses':
      return {
        fulfilledBy: requirement.fulfilledBy,
        eligibleCourses: requirement.courses,
        subRequirementProgress: requirement.subRequirementProgress,
        minCount: requirement.minCount,
      };
    case 'credits':
      return {
        fulfilledBy: requirement.fulfilledBy,
        eligibleCourses: requirement.courses,
        subRequirementProgress: 'any-can-count',
        minCount: requirement.minCount,
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
        subRequirementProgress:
          option.counting === 'courses' ? option.subRequirementProgress : 'any-can-count',
        minCount: option.minCount,
      };
    }
    default:
      throw new Error();
  }
}

export function getRelatedUnfulfilledRequirements(
  courseID: number,
  groupedRequirements: readonly GroupedRequirementFulfillmentReport[],
  toggleableRequirementChoices: AppToggleableRequirementChoices
): {
  readonly directlyRelatedRequirements: readonly RequirementWithIDSourceType[];
  readonly selfCheckRequirements: readonly RequirementWithIDSourceType[];
} {
  const directlyRelatedRequirements: RequirementWithIDSourceType[] = [];
  const selfCheckRequirements: RequirementWithIDSourceType[] = [];
  for (let i = 0; i < groupedRequirements.length; i += 1) {
    const subreqs = groupedRequirements[i].reqs.filter(
      it => it.minCountFulfilled < it.minCountRequired
    );
    for (let j = 0; j < subreqs.length; j += 1) {
      const subRequirement = subreqs[j].requirement;
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
        if (allEligibleCourses.includes(courseID)) {
          directlyRelatedRequirements.push(subRequirement);
          break;
        }
      }
    }
  }
  return { directlyRelatedRequirements, selfCheckRequirements };
}
