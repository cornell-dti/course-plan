import store from '../store';
import RequirementFulfillmentGraph from './requirement-graph';
import buildRequirementFulfillmentGraph from './requirement-graph-builder';
import requirementJson from './typed-requirement-json';
import { CourseTaken, RequirementWithIDSourceType, EligibleCourses } from './types';

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
  coursesTaken: readonly CourseTaken[]
): {
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<
    RequirementWithIDSourceType,
    CourseTaken
  >;
  readonly illegallyDoubleCountedCourses: readonly CourseTaken[];
} {
  const { college, major: majors, minor: minors } = store.state.onboardingData;

  // check university & college & major & minor requirements
  if (!(college in requirementJson.college)) throw new Error(`College ${college} not found.`);

  const universityReqs = requirementJson.university.UNI;
  const collegeReqs = requirementJson.college[college];

  const requirementsToBeConsideredInGraph: readonly RequirementWithIDSourceType[] = [
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
  ];
  type UserChoiceOnFulfillmentStrategy = {
    readonly correspondingRequirement: RequirementWithIDSourceType;
    readonly coursesOfChosenFulfillmentStrategy: readonly CourseTaken[];
  };
  const userChoiceOnFulfillmentStrategy = requirementsToBeConsideredInGraph
    .map((requirement): UserChoiceOnFulfillmentStrategy | null => {
      if (requirement.fulfilledBy !== 'toggleable') {
        return null;
      }
      const optionName =
        store.state.toggleableRequirementChoices[requirement.id] ||
        Object.keys(requirement.fulfillmentOptions)[0];

      const courses: CourseTaken[] = [];
      requirement.fulfillmentOptions[optionName].courses.forEach(eligibleCourses => {
        Object.entries(eligibleCourses).forEach(([roster, courseIds]) => {
          courseIds.forEach(courseId =>
            courses.push({
              roster,
              courseId,
              // Only roster and courseId are used for equality comparison,
              // so other dummy values doesn't matter.
              code: 'DUMMY',
              subject: 'DUMMY',
              number: 'DUMMY',
              credits: 0,
            })
          );
        });
      });
      return { correspondingRequirement: requirement, coursesOfChosenFulfillmentStrategy: courses };
    })
    .filter((it): it is UserChoiceOnFulfillmentStrategy => it != null);

  return buildRequirementFulfillmentGraph<
    RequirementWithIDSourceType,
    CourseTaken,
    UserChoiceOnFulfillmentStrategy
  >({
    requirements: requirementsToBeConsideredInGraph,
    userCourses: forfeitTransferCredit(coursesTaken),
    userChoiceOnFulfillmentStrategy,
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: requirement => requirement.id,
    getCourseUniqueID: course => `${course.roster} ${course.courseId}`,
    getAllCoursesThatCanPotentiallySatisfyRequirement: requirement => {
      let eligibleCoursesList: readonly EligibleCourses[];
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
        .map((eligibleCourses): readonly CourseTaken[] => {
          const courses: CourseTaken[] = [];
          Object.entries(eligibleCourses).forEach(([roster, courseIds]) => {
            courseIds.forEach(courseId =>
              courses.push({
                roster,
                courseId,
                // Only roster and courseId are used for equality comparison,
                // so other dummy values doesn't matter.
                code: 'DUMMY',
                subject: 'DUMMY',
                number: 'DUMMY',
                credits: 0,
              })
            );
          });
          return courses;
        })
        .flat();
    },
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy: it => it,
    allowDoubleCounting: requirement => {
      // All minor requirements are automatically double-countable.
      if (requirement.sourceType === 'Minor') return true;
      if (requirement.sourceType === 'Major') {
        if (majors == null) throw new Error("shouldn't get here since we have major requirements!");
        // If it's not the first major, then it's double countable.
        if (requirement.sourceSpecificName !== majors[0]) return true;
      }
      return requirement.allowCourseDoubleCounting || false;
    },
  });
}
