import {
  getMatchedRequirementFulfillmentSpecification,
  allowCourseDoubleCountingBetweenRequirements,
  getUserRequirements,
} from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './graph';
import { removeIllegalEdgesFromRequirementFulfillmentGraph } from './graph/builder';
import {
  AddBasicUserFulfillmentChoices,
  AddArbitraryOptInChoices,
  BuildInitialGraph,
  RemoveConstraintViolationEdges,
  process,
} from './graph/processor';

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

  const userChoiceOnRequirementOverrides = Object.fromEntries(
    coursesTaken.flatMap(course => {
      const uniqueId = course.uniqueId.toString();
      const choice = overriddenFulfillmentChoices[uniqueId];
      if (choice == null) return [];
      return [
        [
          uniqueId,
          {
            arbitraryOptIn: [...new Set(Object.keys(choice.arbitraryOptIn))],
            acknowledgedCheckerWarningOptIn: [...new Set(choice.acknowledgedCheckerWarningOptIn)],
            optOut: [...new Set(choice.optOut)],
          },
        ],
      ];
    })
  );

  const basicUserFulfillmentGraph = process(
    undefined, // initial graph is undefined, so the pipeline creates it for us
    new BuildInitialGraph({
      requirements: userRequirements.map(it => it.id),
      courses: coursesTaken,
      getAllCoursesThatCanPotentiallySatisfyRequirement: requirementID => {
        const requirement = userRequirementsMap[requirementID];
        // When a requirement has checker warning, we do not add those edges in phase 1.
        // All edges will be explictly opt-in only from stage 3.
        const spec = getMatchedRequirementFulfillmentSpecification(
          requirement,
          toggleableRequirementChoices
        );
        if (spec == null || spec.hasRequirementCheckerWarning) {
          return [];
        }
        return spec.eligibleCourses.flat();
      },
    }),
    new AddBasicUserFulfillmentChoices({
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
      userChoiceOnRequirementOverrides,
    })
  );

  // TODO @bshen rename to optimisticGraph
  const dangerousRequirementFulfillmentGraph = process(
    basicUserFulfillmentGraph,
    new AddArbitraryOptInChoices({
      userChoiceOnRequirementOverrides,
    })
  );

  const safeRequirementFulfillmentGraph = process(
    dangerousRequirementFulfillmentGraph,
    new RemoveConstraintViolationEdges({
      requirementConstraintHolds: (reqA, reqB) =>
        allowCourseDoubleCountingBetweenRequirements(
          userRequirementsMap[reqA],
          userRequirementsMap[reqB]
        ),
    })
  );

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
