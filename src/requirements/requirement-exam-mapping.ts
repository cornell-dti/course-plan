import examData, {
  DEFAULT_COLLEGES,
  ExamFulfillment,
  ExamFulfillments,
} from './data/exams/ExamCredit';
import { colleges } from './data';

export type ExamCondition = {
  colleges?: string[]; // if the user IS NOT in one of these colleges, the course id cannot fulfill the requirement
  majorsExcluded?: string[]; // if the user IS in one of these majors, the course id cannot fulfill the requirement
};

/**
 * Flat list of exam fulfillments, i.e.
 * [
 *   { courseId: 100, minimumScore: 4, credits: 4 },
 *   { courseId: 101, minimumScore: 5, credits: 8 },
 *   {
 *     courseId: 102,
 *     courseEquivalents: { DEFAULT: [Array], EN: [Array] },
 *     minimumScore: 5,
 *     credits: 4
 *   },
 *   ...
 * ]
 */
const examFulfillmentList: ExamFulfillment[] = Object.values(examData)
  .map((examFulfillments: ExamFulfillments) => [...Object.values(examFulfillments)])
  .flat(2);

/**
 * Mapping from exam id to course equivalents and exam conditions, i.e.
 * {
 *   "100": {},
 *   "101": {},
 *   "102": {
 *     "colleges": {
 *       "351265": [
 *         "AG",
 *         "AR",
 *         "AS1",
 *         "AS2",
 *         "HE",
 *         "IL",
 *         "BU"
 *       ],
 *       "359187": [
 *         "EN"
 *       ]
 *     }
 *   },
 *   ...
 * }
 */
const examCourseEquivalentsMapping = examFulfillmentList.reduce((mapping, fulfillment) => {
  const { courseId, courseEquivalents, majorsExcluded } = fulfillment;

  if (!courseEquivalents) {
    // if no course equivalents, return empty mapping for exam
    return { ...mapping, [courseId]: {} };
  }

  // for each id, assign a list of colleges for which the exam can fulfill requirements
  const nonDefaultColleges = Object.keys(courseEquivalents);
  const collegeConditions = Object.entries(courseEquivalents).reduce(
    (conditions: Record<number, string[]>, [college, courses]) => {
      const defaultColleges = colleges.filter(c => !nonDefaultColleges.includes(c));
      courses.forEach(course => {
        if (college === DEFAULT_COLLEGES) {
          conditions[course] = defaultColleges;
          return;
        }
        if (!conditions[course]) conditions[course] = [];
        if (conditions[course].includes(college)) return;
        conditions[course] = [...conditions[course], college];
      });
      return conditions;
    },
    {}
  );
  if (majorsExcluded) {
    return {
      ...mapping,
      [courseId]: {
        colleges: collegeConditions,
        majorsExcluded,
      },
    };
  }
  return {
    ...mapping,
    [courseId]: {
      colleges: collegeConditions,
    },
  };
}, {});

export default examCourseEquivalentsMapping;
