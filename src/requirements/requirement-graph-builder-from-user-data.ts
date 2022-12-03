import {
  getMatchedRequirementFulfillmentSpecification,
  allowCourseDoubleCountingBetweenRequirements,
  getUserRequirements,
} from './requirement-frontend-utils';
import { RequirementFulfillmentGraph } from './graph';
import {
  AddArbitraryOptInChoices,
  AddOptOutChoices,
  AddSelectableChoices,
  AddToggleableChoices,
  BuildInitialGraph,
  process,
  RemoveConstraintViolationEdges,
} from './graph/visitor';
import { getConstraintViolations } from './requirement-constraints-utils';

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
            arbitraryOptIn: [...new Set(Object.keys(choice.arbitraryOptIn || {}))],
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
    new AddToggleableChoices({
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
    }),
    new AddSelectableChoices({ userChoiceOnRequirementOverrides }),
    new AddOptOutChoices({ userChoiceOnRequirementOverrides })
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
    courseToRequirementsInConstraintViolations,
    doubleCountedCourseUniqueIDSet,
  } = getConstraintViolations(dangerousRequirementFulfillmentGraph, (reqA, reqB) =>
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
