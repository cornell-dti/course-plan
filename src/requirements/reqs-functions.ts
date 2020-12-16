import buildRequirementFulfillmentGraph from './requirement-graph-builder';
import requirementJson from './typed-requirement-json';
import {
  CourseTaken,
  EligibleCourses,
  DecoratedCollegeOrMajorRequirement,
  RequirementFulfillmentStatistics,
  GroupedRequirementFulfillmentReport,
  Course,
} from './types';

export type RequirementMap = { readonly [code: string]: readonly string[] };
type MutableRequirementMapWithMutableChildren = { [code: string]: string[] };

function computeFulfillmentStatisticsFromCourses(
  coursesThatFulfilledRequirement: readonly (readonly CourseTaken[])[],
  counting: 'courses' | 'credits',
  operator: 'and' | 'or',
  minCountRequired: number,
  totalCountRequired?: number
): RequirementFulfillmentStatistics & { readonly courses: readonly (readonly CourseTaken[])[] } {
  let minCountFulfilled = 0;
  coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
    if (coursesThatFulfilledSubRequirement.length === 0) {
      return;
    }

    switch (counting) {
      case 'courses':
        minCountFulfilled += operator === 'or' ? coursesThatFulfilledSubRequirement.length : 1;
        break;
      case 'credits':
        minCountFulfilled +=
          operator === 'or'
            ? coursesThatFulfilledSubRequirement
                .map(course => course.credits)
                .reduce((a, b) => a + b, 0)
            : coursesThatFulfilledSubRequirement
                .map(course => course.credits)
                .reduce((a, b) => a + b);
        break;
      default:
        throw new Error('Fulfillment type unknown.');
    }
  });

  if (totalCountRequired === undefined) {
    return {
      fulfilledBy: counting,
      minCountFulfilled,
      minCountRequired,
      courses: coursesThatFulfilledRequirement,
    };
  }

  let totalCountFulfilled = 0;
  Array.from(new Set(coursesThatFulfilledRequirement.flat()).values()).forEach(
    courseThatFulfilledRequirement => {
      // depending on what it is fulfilled by, either increase the count or credits you took
      switch (counting) {
        case 'courses':
          totalCountFulfilled += 1;
          return;
        case 'credits':
          totalCountFulfilled += courseThatFulfilledRequirement.credits;
          return;
        default:
          throw new Error('Fulfillment type unknown.');
      }
    }
  );

  return {
    fulfilledBy: counting,
    minCountFulfilled,
    minCountRequired,
    totalCountFulfilled,
    totalCountRequired,
    courses: coursesThatFulfilledRequirement,
  };
}

/**
 * @param coursesTaken a list of all taken courses.
 * @param requirementCourses a list of eligible courses from requirement data.
 * @returns a naively computed list of courses that fulfill the requirement, partitioned into sub-requirement filfillment.
 */
function filterAndPartitionCoursesThatFulfillRequirement(
  coursesTaken: readonly CourseTaken[],
  requirementCourses: readonly EligibleCourses[]
): CourseTaken[][] {
  const coursesThatFulfilledRequirement: CourseTaken[][] = requirementCourses.map(() => []);
  coursesTaken.forEach(courseTaken => {
    const { roster, courseId } = courseTaken;
    requirementCourses.forEach((subRequirementCourses, subRequirementIndex) => {
      if (subRequirementCourses[roster] && subRequirementCourses[roster].includes(courseId)) {
        // add the course to the list of courses used to fulfill that one sub-requirement
        coursesThatFulfilledRequirement[subRequirementIndex].push(courseTaken);
      }
    });
  });
  return coursesThatFulfilledRequirement;
}

type RequirementWithIDSourceType = DecoratedCollegeOrMajorRequirement & {
  readonly id: string;
  readonly sourceType: 'College' | 'Major' | 'Minor';
  readonly sourceSpecificName: string;
};

function computeFulfillmentCoursesAndStatistics(
  requirement: RequirementWithIDSourceType,
  toggleableRequirementChoices: Readonly<Record<string, string>>,
  coursesTaken: readonly CourseTaken[]
): RequirementFulfillmentStatistics & { readonly courses: readonly (readonly CourseTaken[])[] } {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return { fulfilledBy: 'self-check', minCountFulfilled: 0, minCountRequired: 0, courses: [] };
    case 'courses':
    case 'credits':
      return computeFulfillmentStatisticsFromCourses(
        filterAndPartitionCoursesThatFulfillRequirement(coursesTaken, requirement.courses),
        requirement.fulfilledBy,
        requirement.operator,
        requirement.minCount,
        requirement.totalCount
      );
    case 'toggleable': {
      const option =
        requirement.fulfillmentOptions[
          toggleableRequirementChoices[requirement.id] ||
            Object.keys(requirement.fulfillmentOptions)[0]
        ];
      return computeFulfillmentStatisticsFromCourses(
        filterAndPartitionCoursesThatFulfillRequirement(coursesTaken, option.courses),
        option.counting,
        option.operator,
        option.minCount,
        option.totalCount
      );
    }
    default:
      throw new Error();
  }
}

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

/**
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 * @param toggleableRequirementChoices an object map from toggleable requirement IDs to choices
 * @param college user's college.
 * @param majors user's list of majors.
 * @param minors user's list of minors.
 * @returns all requirements fulfillments, grouped by University, College, Major.
 */
export function computeRequirements(
  coursesTaken: readonly CourseTaken[],
  toggleableRequirementChoices: Readonly<Record<string, string>>,
  college: string,
  majors: readonly string[] | null,
  minors: readonly string[] | null
): readonly GroupedRequirementFulfillmentReport[] {
  // prepare grouped fulfillment summary
  const groups: GroupedRequirementFulfillmentReport[] = [];

  // check university & college & major & minor requirements
  if (!(college in requirementJson.college)) throw new Error('College not found.');

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
    ...(majors || [])
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
    ...(minors || [])
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
        toggleableRequirementChoices[requirement.id] ||
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

  const {
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourses,
  } = buildRequirementFulfillmentGraph<
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

  type FulfillmentStatistics = {
    readonly id: string;
    readonly requirement: RequirementWithIDSourceType;
    readonly courses: readonly (readonly CourseTaken[])[];
  } & RequirementFulfillmentStatistics;
  const collegeFulfillmentStatistics: FulfillmentStatistics[] = [];
  const majorFulfillmentStatisticsMap = new Map<string, FulfillmentStatistics[]>();
  const minorFulfillmentStatisticsMap = new Map<string, FulfillmentStatistics[]>();
  requirementFulfillmentGraph.getAllRequirements().forEach(requirement => {
    const courses = requirementFulfillmentGraph.getConnectedCoursesFromRequirement(requirement);
    const fulfillmentStatistics = {
      id: requirement.id,
      requirement,
      ...computeFulfillmentCoursesAndStatistics(requirement, toggleableRequirementChoices, courses),
    };

    switch (requirement.sourceType) {
      case 'College':
        collegeFulfillmentStatistics.push(fulfillmentStatistics);
        break;
      case 'Major': {
        const existingArray = majorFulfillmentStatisticsMap.get(requirement.sourceSpecificName);
        if (existingArray != null) {
          existingArray.push(fulfillmentStatistics);
        } else {
          majorFulfillmentStatisticsMap.set(requirement.sourceSpecificName, [
            fulfillmentStatistics,
          ]);
        }
        break;
      }
      case 'Minor': {
        const existingArray = minorFulfillmentStatisticsMap.get(requirement.sourceSpecificName);
        if (existingArray != null) {
          existingArray.push(fulfillmentStatistics);
        } else {
          minorFulfillmentStatisticsMap.set(requirement.sourceSpecificName, [
            fulfillmentStatistics,
          ]);
        }
        break;
      }
      default:
        throw new Error();
    }
  });

  groups.push({
    groupName: 'College',
    specific: college,
    reqs: collegeFulfillmentStatistics,
  });

  majorFulfillmentStatisticsMap.forEach((fulfillmentStatistics, majorName) => {
    groups.push({ groupName: 'Major', specific: majorName, reqs: fulfillmentStatistics });
  });
  minorFulfillmentStatisticsMap.forEach((fulfillmentStatistics, minorName) => {
    groups.push({ groupName: 'Minor', specific: minorName, reqs: fulfillmentStatistics });
  });

  return groups;
}

/**
 * @param groups all requirements fulfillments, grouped by University, College, Major.
 * @returns a object where keys are course code and values are a list of requirement a class fulfills.
 */
export function computeRequirementMap(
  groups: readonly GroupedRequirementFulfillmentReport[]
): RequirementMap {
  const requirementsMap: MutableRequirementMapWithMutableChildren = {};
  groups.forEach(group => {
    group.reqs.forEach(
      ({ requirement: { name: requirementName }, courses: coursesThatFulfilledRequirement }) => {
        coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
          coursesThatFulfilledSubRequirement.forEach(({ code }) => {
            // Add course to dictionary with name
            if (code in requirementsMap) requirementsMap[code].push(requirementName);
            else requirementsMap[code] = [requirementName];
          });
        });
      }
    );
  });
  return requirementsMap;
}
