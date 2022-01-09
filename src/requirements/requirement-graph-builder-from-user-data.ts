import { CREDITS_COURSE_ID } from './data/constants';
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

/**
 * Removes all AP/IB equivalent course credit if it's a duplicate crseId.
 * In the future, we may need to implement a more fleshed-out system.
 * Eg. "A student taking CHEM 1560, CHEM 2070, or 2090 will forfeit AP [CHEM] credit."
 *
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 */
function forfeitTransferCredit(coursesTaken: readonly CourseTaken[]): readonly CourseTaken[] {
  // filter out AP/IB equivalent courses with legitimate course ids
  const equivalentCourses = coursesTaken.filter(course => course.courseId !== CREDITS_COURSE_ID);

  // generate set for all forfeited equivalent course ids
  const equivalentCourseIds = new Set(equivalentCourses.map(({ courseId }) => courseId));
  // filter out any credits-only courses generated from AP/IB exams
  const transferCreditCourses = coursesTaken.filter(
    course => course.courseId === CREDITS_COURSE_ID && !equivalentCourseIds.has(course.courseId)
  );

  // return the filtered array of courses taken
  return equivalentCourses.concat(transferCreditCourses);
}

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
} {
  const userRequirements = getUserRequirements(onboardingData);
  const userRequirementsMap = Object.fromEntries(userRequirements.map(it => [it.id, it]));

  const requirementGraphBuilderParameters: BuildRequirementFulfillmentGraphParameters<
    string,
    CourseTaken
  > = {
    requirements: userRequirements.map(it => it.id),
    userCourses: forfeitTransferCredit(coursesTaken),
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
    doubleCountedCourseUniqueIDSet,
  };
}
