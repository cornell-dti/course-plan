import examData, {
  DEFAULT_COLLEGES,
  ExamFulfillment,
  ExamFulfillments,
} from './data/exams/ExamCredit';
import { colleges, College } from './data';

type ExamRequirementsColleges = Record<number, College[]>;
type ExamRequirements = {
  colleges?: ExamRequirementsColleges; // if the user IS NOT in one of these colleges, the course id cannot fulfill the requirement
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
  .map((examFulfillments: ExamFulfillments) => Object.values(examFulfillments))
  .flat(2);

/**
 * Mapping from exam id to requirements info (course equivalents and exam conditions), i.e.
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
export const examRequirementsMapping: Record<number, ExamRequirements> = examFulfillmentList.reduce(
  (mapping, fulfillment) => {
    const { courseId, courseEquivalents, majorsExcluded } = fulfillment;

    if (!courseEquivalents) {
      // if no course equivalents, return empty mapping for exam
      return { ...mapping, [courseId]: {} };
    }

    // for each id, assign a list of colleges for which the exam can fulfill requirements
    const nonDefaultColleges = Object.keys(courseEquivalents);
    const collegeConditions = Object.entries(courseEquivalents).reduce(
      (conditions: ExamRequirementsColleges, [college, courses]) => {
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
  },
  {}
);

export const examToCourseMapping: Record<number, string[]> = Object.entries(
  examRequirementsMapping
).reduce((mapping: Record<number, string[]>, [id, conditions]) => {
  if (!conditions.colleges) return { ...mapping, [id]: [] };
  return {
    ...mapping,
    [id]: Object.keys(conditions.colleges),
  };
}, {});

export const courseToExamMapping: Record<number, string[]> = Object.entries(
  examToCourseMapping
).reduce((mapping: Record<number, string[]>, [id, courses]) => {
  courses
    .map(c => parseInt(c, 10))
    .forEach(course => {
      if (!mapping[course]) mapping[course] = [];
      mapping[course] = [...mapping[course], id];
    });
  return mapping;
}, {});
