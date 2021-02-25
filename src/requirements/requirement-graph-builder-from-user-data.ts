import { getUserRequirements } from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './requirement-graph';
import buildRequirementFulfillmentGraph from './requirement-graph-builder';

/**
 * Removes all AP/IB equivalent course credit if it's a duplicate crseId.
 * In the future, we may need to implement a more fleshed-out system.
 * Eg. "A student taking CHEM 1560, CHEM 2070, or 2090 will forfeit AP [CHEM] credit."
 *
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 */
function forfeitTransferCredit(coursesTaken: readonly CourseTaken[]): readonly CourseTaken[] {
  const equivalentCourses = coursesTaken.filter(course => !course.code.startsWith('CREDITS '));
  const equivalentCourseIds = new Set(equivalentCourses.map(({ courseId }) => courseId));
  let transferCreditCourses = coursesTaken.filter(course => course.code.startsWith('CREDITS'));
  transferCreditCourses = transferCreditCourses.filter(
    ({ courseId }) => !equivalentCourseIds.has(courseId)
  );
  return equivalentCourses.concat(transferCreditCourses);
}

export default function buildRequirementFulfillmentGraphFromUserData(
  coursesTaken: readonly CourseTaken[],
  onboardingData: AppOnboardingData,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  selectableRequirementChoices: AppSelectableRequirementChoices
): {
  readonly userRequirements: readonly RequirementWithIDSourceType[];
  readonly userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  readonly illegallyDoubleCountedCourseIDs: ReadonlySet<number>;
} {
  const userRequirements = getUserRequirements(onboardingData);
  const userRequirementsMap = Object.fromEntries(userRequirements.map(it => [it.id, it]));

  const {
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourses,
  } = buildRequirementFulfillmentGraph<string, CourseTaken>({
    requirements: userRequirements.map(it => it.id),
    userCourses: forfeitTransferCredit(coursesTaken),
    userChoiceOnFulfillmentStrategy: Object.fromEntries(
      userRequirements
        .map(requirement => {
          if (requirement.fulfilledBy !== 'toggleable') return null;
          const optionName =
            toggleableRequirementChoices[requirement.id] ||
            Object.keys(requirement.fulfillmentOptions)[0];
          const courses = requirement.fulfillmentOptions[optionName].courses.flatMap(courseIds =>
            // Only courseId are used for equality comparison,
            // so other dummy values doesn't matter.
            courseIds.map(courseId => ({ courseId, uniqueId: -1, code: 'DUMMY', credits: 0 }))
          );
          return [requirement.id, courses] as const;
        })
        .filter((it): it is [string, CourseTaken[]] => it != null)
    ),
    userChoiceOnDoubleCountingElimination: Object.entries(selectableRequirementChoices)
      .map(([courseIDString, requirementID]) => {
        const courseID = parseInt(courseIDString, 10);
        const courseTaken = coursesTaken.find(it => it.courseId === courseID);
        if (courseTaken == null) return null;
        return [requirementID, courseTaken] as const;
      })
      .filter((it): it is readonly [string, CourseTaken] => it != null),
    getCourseUniqueID: course => course.courseId,
    getAllCoursesThatCanPotentiallySatisfyRequirement: requirementID => {
      const requirement = userRequirementsMap[requirementID];
      let eligibleCoursesList: readonly (readonly number[])[];
      switch (requirement.fulfilledBy) {
        case 'self-check':
          return [];
        case 'courses':
        case 'credits':
          eligibleCoursesList = requirement.courses;
          break;
        case 'toggleable':
          eligibleCoursesList = Object.values(requirement.fulfillmentOptions)
            .map(it => it.courses)
            .flat();
          break;
        default:
          throw new Error();
      }
      return eligibleCoursesList
        .map((courseIds): readonly CourseTaken[] =>
          // Only courseId are used for equality comparison,
          // so other dummy values doesn't matter.
          courseIds.map(courseId => ({ courseId, uniqueId: -1, code: 'DUMMY', credits: 0 }))
        )
        .flat();
    },
    allowDoubleCounting: requirementID =>
      userRequirementsMap[requirementID].allowCourseDoubleCounting || false,
  });

  return {
    userRequirements,
    userRequirementsMap,
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourseIDs: new Set(illegallyDoubleCountedCourses.map(it => it.courseId)),
  };
}
