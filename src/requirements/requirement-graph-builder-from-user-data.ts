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
  const equivalentCourses = coursesTaken.filter(course => course.subject !== 'CREDITS');
  const equivalentCourseIds = new Set(equivalentCourses.map(({ courseId }) => courseId));
  let transferCreditCourses = coursesTaken.filter(course => course.subject === 'CREDITS');
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
  type UserChoiceOnFulfillmentStrategy = {
    readonly correspondingRequirement: string;
    readonly coursesOfChosenFulfillmentStrategy: readonly CourseTaken[];
  };
  const userChoiceOnFulfillmentStrategy = userRequirements
    .map((requirement): UserChoiceOnFulfillmentStrategy | null => {
      if (requirement.fulfilledBy !== 'toggleable') return null;
      const optionName =
        toggleableRequirementChoices[requirement.id] ||
        Object.keys(requirement.fulfillmentOptions)[0];

      const courses: CourseTaken[] = requirement.fulfillmentOptions[optionName].courses.flatMap(
        courseIds =>
          // Only courseId are used for equality comparison,
          // so other dummy values doesn't matter.
          courseIds.map(courseId => ({ courseId, subject: 'DUMMY', number: 'DUMMY', credits: 0 }))
      );
      return {
        correspondingRequirement: requirement.id,
        coursesOfChosenFulfillmentStrategy: courses,
      };
    })
    .filter((it): it is UserChoiceOnFulfillmentStrategy => it != null);

  const {
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourses,
  } = buildRequirementFulfillmentGraph<string, CourseTaken, UserChoiceOnFulfillmentStrategy>({
    requirements: userRequirements.map(it => it.id),
    userCourses: forfeitTransferCredit(coursesTaken),
    userChoiceOnFulfillmentStrategy,
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: id => id,
    getCourseUniqueID: course => String(course.courseId),
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
          courseIds.map(courseId => ({ courseId, subject: 'DUMMY', number: 'DUMMY', credits: 0 }))
        )
        .flat();
    },
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy: it => it,
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
