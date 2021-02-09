import buildRequirementFulfillmentGraphFromUserData from './requirement-graph-builder-from-user-data';
import {
  CourseTaken,
  EligibleCourses,
  DecoratedCollegeOrMajorRequirement,
  RequirementFulfillmentStatistics,
  GroupedRequirementFulfillmentReport,
} from './types';

function computeFulfillmentStatisticsFromCourses(
  coursesThatFulfilledRequirement: readonly (readonly CourseTaken[])[],
  counting: 'courses' | 'credits',
  subRequirementProgress: 'every-course-needed' | 'any-can-count',
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
        minCountFulfilled +=
          subRequirementProgress === 'any-can-count'
            ? coursesThatFulfilledSubRequirement.length
            : 1;
        break;
      case 'credits':
        minCountFulfilled +=
          subRequirementProgress === 'any-can-count'
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
        requirement.subRequirementProgress,
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
        option.subRequirementProgress,
        option.minCount,
        option.totalCount
      );
    }
    default:
      throw new Error();
  }
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
export default function computeRequirements(
  coursesTaken: readonly CourseTaken[],
  toggleableRequirementChoices: Readonly<Record<string, string>>,
  college: string,
  majors: readonly string[] | null,
  minors: readonly string[] | null
): readonly GroupedRequirementFulfillmentReport[] {
  const { requirementFulfillmentGraph } = buildRequirementFulfillmentGraphFromUserData(
    coursesTaken,
    toggleableRequirementChoices,
    college,
    majors,
    minors
  );

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

  return [
    { groupName: 'College', specific: college, reqs: collegeFulfillmentStatistics },
    ...Array.from(majorFulfillmentStatisticsMap.entries()).map(
      ([majorName, fulfillmentStatistics]) =>
        ({ groupName: 'Major', specific: majorName, reqs: fulfillmentStatistics } as const)
    ),
    ...Array.from(minorFulfillmentStatisticsMap.entries()).map(
      ([minorName, fulfillmentStatistics]) =>
        ({ groupName: 'Minor', specific: minorName, reqs: fulfillmentStatistics } as const)
    ),
  ];
}
