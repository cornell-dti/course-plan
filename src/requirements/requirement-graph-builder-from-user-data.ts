import { CREDITS_COURSE_ID } from './data/constants';
import { courseIsAPIB, getUserRequirements } from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './requirement-graph';
import buildRequirementFulfillmentGraph, {
  BuildRequirementFulfillmentGraphParameters,
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
  selectableRequirementChoices: AppSelectableRequirementChoices,
  overriddenFulfillmentChoices: AppOverriddenFulfillmentChoices,
  /** A flag for data migration. Prod code should never use this */
  keepCoursesWithoutDoubleCountingEliminationChoice = false
): {
  readonly userRequirements: readonly RequirementWithIDSourceType[];
  readonly userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
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
    userChoiceOnDoubleCountingElimination: Object.fromEntries(
      Object.entries(selectableRequirementChoices).map(([uniqueIDString, requirementID]) => {
        const uniqueId = Number.isNaN(uniqueIDString)
          ? uniqueIDString
          : parseInt(uniqueIDString, 10);
        return [uniqueId, requirementID] as const;
      })
    ),
    userChoiceOnRequirementOverrides: {
      ...Object.fromEntries(
        coursesTaken
          .map(course => {
            const uniqueId = course.uniqueId.toString();
            if (!(uniqueId in overriddenFulfillmentChoices)) return null;
            const overriddenFulfillments = new Set(
              Object.keys(overriddenFulfillmentChoices[uniqueId].optIn)
            );
            return [uniqueId, overriddenFulfillments];
          })
          .filter((it): it is [string, Set<string>] => it != null)
      ),
    },
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
          eligibleCoursesList = Object.values(requirement.fulfillmentOptions).flatMap(
            it => it.courses
          );
          break;
        default:
          throw new Error();
      }
      return eligibleCoursesList.flat();
    },
    allowDoubleCounting: requirementID =>
      userRequirementsMap[requirementID].allowCourseDoubleCounting || false,
  };
  const requirementFulfillmentGraph = buildRequirementFulfillmentGraph(
    requirementGraphBuilderParameters,
    keepCoursesWithoutDoubleCountingEliminationChoice
  );

  return { userRequirements, userRequirementsMap, requirementFulfillmentGraph };
}

export type FirestoreCourseOptInOptOutChoicesBuilder = (
  c: CourseTaken
) => FirestoreCourseOptInOptOutChoices;

/**
 * @returns a function that given a course, return a `FirestoreCourseOptInOptOutChoices`.
 *
 * Frontend code can use the returned function to compute the equivalent opt-out data,
 * and the data migration code can use the returned function to compute opt-out choice for all courses.
 * This function should be deleted once we fully finish the migration.
 */
export function getFirestoreCourseOptInOptOutChoicesBuilder(
  coursesTaken: readonly CourseTaken[],
  onboardingData: AppOnboardingData,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  selectableRequirementChoices: AppSelectableRequirementChoices,
  overriddenFulfillmentChoices: AppOverriddenFulfillmentChoices
): FirestoreCourseOptInOptOutChoicesBuilder {
  // In this graph, each course is connected to all requirements that course can be used to satisfy.
  const {
    requirementFulfillmentGraph: graphWithoutDoubleCountingAccounted,
    userRequirementsMap,
  } = buildRequirementFulfillmentGraphFromUserData(
    coursesTaken,
    onboardingData,
    toggleableRequirementChoices,
    {}, // Provide no double counting choices, so all the edges will be kept
    overriddenFulfillmentChoices,
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  // In this graph, each course is only connected to the selected requirement and the requirements
  // that allow double counting.
  const graphWithDoubleCountingAccounted = buildRequirementFulfillmentGraphFromUserData(
    coursesTaken,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    overriddenFulfillmentChoices,
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ false
  ).requirementFulfillmentGraph;

  /**
   * The table below summerizes the type of all possible requirement-course edges before
   * double-counting elimination, and where they will go in the new format.
   *
   * -------------------------------------------------------------------------------------------------
   * | Requirement Type | edge exists after double-counting elim | where is it in the new format     |
   * | ---------------- | -------------------------------------- | --------------------------------- |
   * | selected         | True                                   | implicit (connected by default)   |
   * | (no warning)     |                                        |                                   |
   * |                  |                                        |                                   |
   * | selected         | True                                   | `acknowledgedCheckerWarningOptIn` |
   * | (has warning)    |                                        |                                   |
   * |                  |                                        |                                   |
   * | allow double     | True                                   | implicit (connected by default)   |
   * | counting         |                                        |                                   |
   * |                  |                                        |                                   |
   * | not connected    | False                                  | `optOut`                          |
   * | (no warning)     |                                        |                                   |
   * |                  |                                        |                                   |
   * | not connected    | False                                  | implicit (unconnected by default) |
   * | (has warning)    |                                        |                                   |
   */
  return function builder(course) {
    const requirementsWithDoubleCountingRemoved = graphWithDoubleCountingAccounted.getConnectedRequirementsFromCourse(
      course
    );
    const allRelevantRequirements = graphWithoutDoubleCountingAccounted.getConnectedRequirementsFromCourse(
      course
    );
    /**
     * complementary == All unconnected requirement after double counting elimination
     *
     * It's true that
     * ```
     * union(
     *  selectableRequirementChoices[course],
     *  requirements that allow double counting and the given course can be used to satisfy,
     *  complementary,
     * ) == all requirements that course can be used to satisfy
     * ```
     */
    const complementary = new Set(allRelevantRequirements);
    requirementsWithDoubleCountingRemoved.forEach(r => complementary.delete(r));

    // We only need to explicitly opt-out of requirements without checker warnings, since requirement
    // with checker warnings need to be explicitly opt-in.
    const optOut = Array.from(complementary).filter(
      it => userRequirementsMap[it].checkerWarning == null
    );
    // Find requirements with checker warnings that needs to be explictly opt-in.
    const acknowledgedCheckerWarningOptIn = courseIsAPIB(course)
      ? []
      : requirementsWithDoubleCountingRemoved.filter(
          it => userRequirementsMap[it].checkerWarning != null
        );

    return { optOut, arbitraryOptIn: {}, acknowledgedCheckerWarningOptIn };
  };
}
