/**
 * A collection of helper functions
 * that might be useful for both frontend components and requirement graph computation
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
  readonly eligibleCourses: readonly EligibleCourses[];
  readonly subRequirementProgress: 'every-course-needed' | 'any-can-count';
  readonly minCount: number;
} | null {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return null;
    case 'courses':
    case 'credits':
      return {
        fulfilledBy: requirement.fulfilledBy,
        eligibleCourses: requirement.courses,
        subRequirementProgress: requirement.subRequirementProgress,
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
        subRequirementProgress: option.subRequirementProgress,
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
        const { eligibleCourses } = requirementSpec;
        for (let k = 0; k < eligibleCourses.length; k += 1) {
          for (const [, ids] of Object.entries(eligibleCourses[k])) {
            if (ids.includes(courseID)) {
              directlyRelatedRequirements.push(subRequirement);
              break;
            }
          }
        }
      }
    }
  }
  return { directlyRelatedRequirements, selfCheckRequirements };
}
