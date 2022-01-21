import {
  allowCourseDoubleCountingBetweenRequirements,
  getUserRequirements,
} from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './requirement-graph';
import {
  BuildRequirementFulfillmentGraphParameters,
  buildRequirementFulfillmentGraph,
  removeIllegalEdgesFromRequirementFulfillmentGraph,
} from './requirement-graph-builder';

export default function buildRequirementFulfillmentGraphFromUserData(
  coursesTaken: readonly CourseTaken[],
  onboardingData: AppOnboardingData,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices
): {
  readonly userRequirements: readonly RequirementWithIDSourceType[];
  readonly userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  readonly dangerousRequirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  readonly safeRequirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  readonly doubleCountedCourseUniqueIDSet: ReadonlySet<string | number>;
  readonly courseToRequirementsInConstraintViolations: Map<string | number, Set<string[]>>;
} {
  const userRequirements = getUserRequirements(onboardingData);
  const userRequirementsMap = Object.fromEntries(userRequirements.map(it => [it.id, it]));

  const requirementGraphBuilderParameters: BuildRequirementFulfillmentGraphParameters<
    string,
    CourseTaken
  > = {
    requirements: userRequirements.map(it => it.id),
    userCourses: coursesTaken,
    userChoiceOnFulfillmentStrategy: Object.fromEntries(
      userRequirements
        .map(requirement => {
          if (requirement.fulfilledBy !== 'toggleable') return null;
          const optionName =
            toggleableRequirementChoices[requirement.id] ||
            Object.keys(requirement.fulfillmentOptions)[0];
          const courses = requirement.fulfillmentOptions[optionName].courses.flat();
          return [requirement.id, courses] as const;
        })
        .filter((it): it is [string, number[]] => it != null)
    ),
    userChoiceOnRequirementOverrides: Object.fromEntries(
      coursesTaken.flatMap(course => {
        const uniqueId = course.uniqueId.toString();
        const choice = overriddenFulfillmentChoices[uniqueId];
        if (choice == null) return [];
        return [
          [
            uniqueId,
            {
              optIn: Array.from(
                new Set([
                  ...Object.keys(choice.arbitraryOptIn),
                  ...choice.acknowledgedCheckerWarningOptIn,
                ])
              ),
              optOut: choice.optOut,
            },
          ],
        ];
      })
    ),
    getAllCoursesThatCanPotentiallySatisfyRequirement: requirementID => {
      const requirement = userRequirementsMap[requirementID];
      // When a requirement has checker warning, we do not add those edges in phase 1.
      // All edges will be explictly opt-in only from stage 3.
      if (requirement.checkerWarning != null) return [];
      let eligibleCoursesList: readonly (readonly number[])[];
      switch (requirement.fulfilledBy) {
        case 'self-check':
          return [];
        case 'courses':
        case 'credits':
          eligibleCoursesList = requirement.courses;
          break;
        case 'toggleable':
          eligibleCoursesList = Object.values(requirement.fulfillmentOptions).flatMap(
            it => it.courses
          );
          break;
        default:
          throw new Error();
      }
      return eligibleCoursesList.flat();
    },
  };
  const dangerousRequirementFulfillmentGraph = buildRequirementFulfillmentGraph(
    requirementGraphBuilderParameters
  );
  const safeRequirementFulfillmentGraph = dangerousRequirementFulfillmentGraph.copy();
  const {
    doubleCountedCourseUniqueIDSet,
    courseToRequirementsInConstraintViolations,
  } = removeIllegalEdgesFromRequirementFulfillmentGraph(
    safeRequirementFulfillmentGraph,
    (reqA, reqB) =>
      allowCourseDoubleCountingBetweenRequirements(
        userRequirementsMap[reqA],
        userRequirementsMap[reqB]
      )
  );

  return {
    userRequirements,
    userRequirementsMap,
    dangerousRequirementFulfillmentGraph,
    safeRequirementFulfillmentGraph,
    courseToRequirementsInConstraintViolations,
    doubleCountedCourseUniqueIDSet,
  };
}
