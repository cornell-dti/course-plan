import { CREDITS_COURSE_ID, FWS_COURSE_ID, SWIM_TEST_COURSE_ID } from './data/constants';
import getCourseEquivalentsFromUserExams from './data/exams/ExamCredit';
import {
  convertFirestoreSemesterCourseToCourseTaken,
  getMatchedRequirementFulfillmentSpecification,
} from './requirement-frontend-utils';
import RequirementFulfillmentGraph from './requirement-graph';
import buildRequirementFulfillmentGraphFromUserData from './requirement-graph-builder-from-user-data';

type FulfillmentStatistics = {
  readonly requirement: RequirementWithIDSourceType;
  readonly courses: readonly (readonly CourseTaken[])[];
} & RequirementFulfillmentStatistics;

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is AP/IB equivalent course or credit
 */
const courseIsAPIB = (course: CourseTaken): boolean =>
  [CREDITS_COURSE_ID, FWS_COURSE_ID].includes(course.courseId) ||
  ['AP', 'IB', 'CREDITS'].includes(course.code.split(' ')[0]);

/**
 * Used for total academic credit requirements for all colleges except EN and AR
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is not PE or 10** level
 */
const courseIsAllEligible = (course: CourseTaken): boolean => {
  if (course.courseId === CREDITS_COURSE_ID) return true;
  if (courseIsAPIB(course)) return false;
  const [subject, number] = course.code.split(' ');
  return subject !== 'PE' && !number.startsWith('10');
};

const getTotalCreditsFulfillmentStatistics = (
  college: string,
  courses: readonly CourseTaken[]
): FulfillmentStatistics | null => {
  const requirementCommon = {
    sourceType: 'College',
    sourceSpecificName: college,
    name: 'Total Academic Credits',
    courses: [],
    fulfilledBy: 'credits',
    minCount: 120,
  } as const;
  let requirement: RequirementWithIDSourceType;
  switch (college) {
    case 'AG':
      requirement = {
        ...requirementCommon,
        id: 'College-AG-total-credits',
        description:
          '120 academic credits are required for graduation. ' +
          'A minimum of 100 credits must be in courses for which a letter grade was recieved. ' +
          'PE courses do not count.',
        source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11561',
      };
      break;
    case 'AS':
      requirement = {
        ...requirementCommon,
        id: 'College-AS-total-credits',
        description:
          '120 academic credits are required. ' +
          'PE courses and courses numbered 1000-1099 do not count towards the 120 credits.',
        source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11570#credit-req',
      };
      break;
    case 'HE':
      requirement = {
        ...requirementCommon,
        id: 'College-HE-total-credits',
        description:
          '120 academic credits are required. ' +
          'PE courses and courses numbered 1000-1099 do not count towards the 120 credits.',
        source:
          'http://courses.cornell.edu/content.php?catoid=41&navoid=11600#Cornell_Credit_Requirements',
      };
      break;
    case 'IL':
      requirement = {
        ...requirementCommon,
        id: 'College-IL-total-credits',
        description:
          '120 academic credits are required. ' +
          'PE courses and courses numbered 1000-1099 do not count towards the 120 credits.',
        source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11587',
      };
      break;
    case 'BU':
      requirement = {
        ...requirementCommon,
        id: 'College-BU-total-credits',
        description:
          '120 academic credits are required. ' +
          'PE courses and courses numbered 1000-1099 do not count towards the 120 credits.',
        source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11715',
      };
      break;
    default:
      return null;
  }

  let minCountFulfilled = 0;
  let minCountRequired = 120;
  const courseCodeSet = new Set<string>();
  const eligibleCourses =
    college === 'AG'
      ? courses.filter(course => !course.code.startsWith('PE '))
      : courses.filter(courseIsAllEligible);

  eligibleCourses.forEach(course => {
    minCountFulfilled += course.credits;
    if (courseCodeSet.has(course.code)) {
      minCountRequired += course.credits;
    } else {
      courseCodeSet.add(course.code);
    }
  });

  return {
    requirement,
    courses: [],
    fulfilledBy: 'credits',
    minCountFulfilled,
    minCountRequired,
  };
};

const getSwimTestFulfillmentStatistics = (
  college: string,
  courses: readonly CourseTaken[],
  tookSwimTest: boolean
): FulfillmentStatistics => {
  const requirement: RequirementWithIDSourceType = {
    id: 'College-UNI-SwimTest',
    sourceType: 'College',
    sourceSpecificName: college,
    name: 'Swim Test',
    description:
      'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming ' +
      'and water safety competency requirement for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637',
    courses: [[SWIM_TEST_COURSE_ID]],
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
  };
  const swimClasses = courses.filter(it => it.courseId === SWIM_TEST_COURSE_ID);
  if (tookSwimTest) {
    swimClasses.push({
      courseId: SWIM_TEST_COURSE_ID,
      uniqueId: -1,
      code: 'Swim Test',
      credits: 0,
    });
  }
  return {
    requirement,
    courses: [swimClasses],
    fulfilledBy: 'courses',
    minCountFulfilled: swimClasses.length > 0 ? 1 : 0,
    minCountRequired: 1,
  };
};

function computeFulfillmentStatisticsFromCourses(
  coursesThatFulfilledRequirement: readonly (readonly CourseTaken[])[],
  counting: 'courses' | 'credits',
  subRequirementProgress: 'every-course-needed' | 'any-can-count',
  minCountRequired: number
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
        minCountFulfilled += coursesThatFulfilledSubRequirement
          .map(course => course.credits)
          .reduce((a, b) => a + b, 0);
        break;
      default:
        throw new Error('Fulfillment type unknown.');
    }
  });

  return {
    fulfilledBy: counting,
    minCountFulfilled,
    minCountRequired,
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
  requirementCourses: readonly (readonly number[])[]
): CourseTaken[][] {
  const coursesThatFulfilledRequirement: CourseTaken[][] = requirementCourses.map(() => []);
  coursesTaken.forEach(courseTaken => {
    const { courseId } = courseTaken;
    requirementCourses.forEach((subRequirementCourses, subRequirementIndex) => {
      if (subRequirementCourses.includes(courseId)) {
        // add the course to the list of courses used to fulfill that one sub-requirement
        coursesThatFulfilledRequirement[subRequirementIndex].push(courseTaken);
      }
    });
  });
  return coursesThatFulfilledRequirement;
}

function computeFulfillmentCoursesAndStatistics(
  requirement: RequirementWithIDSourceType,
  coursesTaken: readonly CourseTaken[],
  toggleableRequirementChoices: AppToggleableRequirementChoices
): RequirementFulfillmentStatistics & { readonly courses: readonly (readonly CourseTaken[])[] } {
  const spec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  if (spec == null) {
    // Give self-check 1 required course and 0 fulfilled to prevent it from being fulfilled.
    return { fulfilledBy: 'self-check', minCountFulfilled: 0, minCountRequired: 1, courses: [] };
  }
  const { fulfilledBy, eligibleCourses, subRequirementProgress, minCount } = spec;
  return computeFulfillmentStatisticsFromCourses(
    filterAndPartitionCoursesThatFulfillRequirement(coursesTaken, eligibleCourses),
    fulfilledBy,
    subRequirementProgress,
    minCount
  );
}

function getCourseCodesArray(
  semesters: readonly FirestoreSemester[],
  onboardingData: AppOnboardingData
): readonly CourseTaken[] {
  const courses: CourseTaken[] = [];
  semesters.forEach(semester => {
    semester.courses.forEach(course => {
      courses.push(convertFirestoreSemesterCourseToCourseTaken(course));
    });
  });
  courses.push(...getCourseEquivalentsFromUserExams(onboardingData));
  return courses;
}

/** Compute everything needed for displaying requirement on the frontend. */
export default function computeGroupedRequirementFulfillmentReports(
  semesters: readonly FirestoreSemester[],
  onboardingData: AppOnboardingData,
  toggleableRequirementChoices: AppToggleableRequirementChoices,
  selectableRequirementChoices: AppSelectableRequirementChoices
): {
  readonly userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  readonly illegallyDoubleCountedCourseUniqueIDs: ReadonlySet<number>;
  readonly groupedRequirementFulfillmentReport: readonly GroupedRequirementFulfillmentReport[];
} {
  const coursesTaken = getCourseCodesArray(semesters, onboardingData);
  const { college } = onboardingData;

  const {
    userRequirements,
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourseUniqueIDs,
  } = buildRequirementFulfillmentGraphFromUserData(
    coursesTaken,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices
  );

  const collegeFulfillmentStatistics: FulfillmentStatistics[] = [];
  const totalCreditsFulfillmentStatistics = getTotalCreditsFulfillmentStatistics(
    college,
    coursesTaken
  );
  if (totalCreditsFulfillmentStatistics != null) {
    collegeFulfillmentStatistics.push(totalCreditsFulfillmentStatistics);
  }
  collegeFulfillmentStatistics.push(
    getSwimTestFulfillmentStatistics(college, coursesTaken, onboardingData.tookSwim === 'yes')
  );
  const majorFulfillmentStatisticsMap = new Map<string, FulfillmentStatistics[]>();
  const minorFulfillmentStatisticsMap = new Map<string, FulfillmentStatistics[]>();
  userRequirements.forEach(requirement => {
    const courses = requirementFulfillmentGraph.getConnectedCoursesFromRequirement(requirement.id);
    const fulfillmentStatistics = {
      id: requirement.id,
      requirement,
      ...computeFulfillmentCoursesAndStatistics(requirement, courses, toggleableRequirementChoices),
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

  const groupedRequirementFulfillmentReport: readonly GroupedRequirementFulfillmentReport[] = [
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

  return {
    userRequirementsMap: Object.fromEntries(userRequirements.map(it => [it.id, it])),
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourseUniqueIDs,
    groupedRequirementFulfillmentReport,
  };
}
