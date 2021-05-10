import { CREDITS_COURSE_ID } from './data/constants';
import { courseIsAPIB, getUserRequirements } from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './requirement-graph';
import buildRequirementFulfillmentGraph, {
  OverridenRequirements,
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
  selectableRequirementChoices: AppSelectableRequirementChoices
): {
  readonly userRequirements: readonly RequirementWithIDSourceType[];
  readonly userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
} {
  const userRequirements = getUserRequirements(onboardingData);
  const userRequirementsMap = Object.fromEntries(userRequirements.map(it => [it.id, it]));
  const userExamsTaken = new Set(onboardingData.exam.map(exam => `${exam.type} ${exam.subject}`));

  const requirementFulfillmentGraph = buildRequirementFulfillmentGraph<string, CourseTaken>({
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
        const uniqueId = parseInt(uniqueIDString, 10);
        return [uniqueId, requirementID] as const;
      })
    ),
    userChoiceOnRequirementOverrides: Object.fromEntries(
      coursesTaken
        .filter(course => {
          if (!courseIsAPIB(course) || !userExamsTaken.has(course.code)) return false;
          const userExam = onboardingData.exam.find(
            ({ type, subject }) => `${type} ${subject}` === course.code
          );
          if (!userExam) return false;
          return (
            (userExam.optIn && Object.keys(userExam.optIn).length !== 0) ||
            (userExam.optOut && Object.keys(userExam.optOut).length !== 0)
          );
        })
        .map(course => {
          const userExam = onboardingData.exam.find(
            ({ type, subject }) => `${type} ${subject}` === course.code
          );
          if (!userExam) return null;
          const overridenRequirements: OverridenRequirements<string> = {
            optIn: new Set(),
            optOut: new Set(),
          };
          if (userExam.optIn)
            Object.keys(userExam.optIn).forEach(requirementName => {
              overridenRequirements.optIn.add(requirementName);
            });
          if (userExam.optOut)
            Object.keys(userExam.optOut).forEach(requirementName => {
              overridenRequirements.optOut.add(requirementName);
            });
          return [course.uniqueId, overridenRequirements];
        })
        .filter((it): it is [number, OverridenRequirements<string>] => it != null)
    ),
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
  });

  return { userRequirements, userRequirementsMap, requirementFulfillmentGraph };
}
