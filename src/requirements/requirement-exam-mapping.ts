import examData, {
  OTHER_COLLEGES,
  ExamFulfillment,
  ExamFulfillments,
} from './data/exams/ExamCredit';
import { colleges, College } from './data';

// TODO @bshen try to refactor these types
type ExamRequirementsCollegeConditions = Record<number, College[]>;
type ExamRequirementsConditions = {
  /** If the user IS NOT in one of these colleges, the course id cannot fulfill the requirement. */
  collegeConditions: ExamRequirementsCollegeConditions;
  /** If the user IS in one of these majors, the course id cannot fulfill the requirement. */
  majorsExcluded?: string[];
};

/**
 * Flat list of exam fulfillments, i.e.
 * [
 *   {
 *     "courseId": 100,
 *     "minimumScore": 4,
 *     "credits": 4
 *   },
 *   {
 *     "courseId": 101,
 *     "minimumScore": 5,
 *     "credits": 8
 *   },
 *   {
 *     "courseId": 102,
 *     "courseEquivalents": {
 *       "OTHER_COLLEGES": [
 *         351265
 *       ],
 *       "EN": [
 *         359187
 *       ]
 *     },
 *     "minimumScore": 5,
 *     "credits": 4
 *   },
 *   ...
 * ]
 */
const examFulfillmentList: ExamFulfillment[] = Object.values(examData)
  .map((examFulfillments: ExamFulfillments) => Object.values(examFulfillments))
  .flat(2);

export const examCourseIds: number[] = examFulfillmentList.map(({ courseId }) => courseId);

/**
 * Mapping for exams from course id to requirements info.
 * The requirements info includes:
 *   - for each equivalent course, the colleges for which the exam considers it a valid equivalent course
 *   - the excluded majors
 * i.e.
 * {
 *   "102": {
 *     "collegeConditions": {
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
export const examRequirementsMapping: Record<
  number,
  ExamRequirementsConditions
> = examFulfillmentList.reduce((mapping, fulfillment) => {
  const { courseId, courseEquivalents, majorsExcluded } = fulfillment;

  if (!courseEquivalents) {
    // if no course equivalents, exam will never be looked up
    return mapping;
  }

  // for each id, assign a list of colleges for which the exam can fulfill requirements
  const definedColleges = new Set(Object.keys(courseEquivalents));
  const otherColleges = colleges.filter((c: College) => !definedColleges.has(c)); // explicit expansion of OTHER_COLLEGES
  const collegeConditions = Object.entries(courseEquivalents).reduce(
    (conditions: ExamRequirementsCollegeConditions, [college, courses]) => {
      courses.forEach(course => {
        if (college === OTHER_COLLEGES) {
          conditions[course] = otherColleges;
          return;
        }
        if (!conditions[course]) conditions[course] = [];
        if (conditions[course].includes(college as College)) return;
        conditions[course] = [...conditions[course], college as College];
      });
      return conditions;
    },
    {}
  );

  if (!majorsExcluded) {
    // if no majors excluded, just add the college conditions
    return {
      ...mapping,
      [courseId]: {
        collegeConditions,
      },
    };
  }

  return {
    ...mapping,
    [courseId]: {
      collegeConditions,
      majorsExcluded,
    },
  };
}, {});

export const examToCourseMapping: Record<string, number[]> = Object.fromEntries(
  Object.entries(examRequirementsMapping).map(([id, conditions]) => [
    id,
    Object.keys(conditions.collegeConditions).map(k => parseInt(k, 10)),
  ])
);

export const courseToExamMapping: Record<string, number[]> = Object.entries(
  examToCourseMapping
).reduce((mapping: Record<number, number[]>, [id, courses]) => {
  courses.forEach(course => {
    if (!mapping[course]) mapping[course] = [];
    mapping[course] = [...mapping[course], parseInt(id, 10)];
  });
  return mapping;
}, {});
