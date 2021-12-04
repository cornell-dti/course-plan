import { FWS_COURSE_ID } from '../constants';

/**
 * Describes how exams can be converted to a representation understood by CoursePlan.
 * If the user takes an exam, our algorithm determines the best fulfillment option for the user's score.
 * There can be multiple exam fulfillments (for different minimum scores) associated with a single exam.
 */
export type ExamFulfillment = {
  readonly courseId: number;
  readonly courseEquivalents?: Record<string, number[]>;
  readonly minimumScore: number;
  readonly credits: number;
  readonly majorsExcluded?: string[];
};
export type ExamFulfillments = Record<string, ExamFulfillment[]>;
export type ExamData = Record<'AP' | 'IB', ExamFulfillments>;

// If the user's college is not in the keys of courseEquivalents, their college is generalized to OTHER_COLLEGES
export const OTHER_COLLEGES = 'OTHER_COLLEGES';

const examData: ExamData = {
  AP: {
    Biology: [
      { courseId: 100, minimumScore: 4, credits: 4 },
      { courseId: 101, minimumScore: 5, credits: 8 },
    ],
    Chemistry: [
      {
        courseId: 102,
        courseEquivalents: {
          [OTHER_COLLEGES]: [351265], // CHEM 2070
          EN: [359187], // CHEM 2090
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    'Computer Science A': [
      {
        courseId: 103,
        courseEquivalents: {
          [OTHER_COLLEGES]: [358526], // CS 1110
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    Microeconomics: [
      {
        courseId: 104,
        courseEquivalents: {
          [OTHER_COLLEGES]: [350025], // ECON 1110
        },
        minimumScore: 4,
        credits: 3,
      },
      {
        courseId: 105,
        courseEquivalents: {
          [OTHER_COLLEGES]: [350025], // ECON 1110
          BU: [350025, 351468], // ECON 1110, HADM 1410
        },
        minimumScore: 5,
        credits: 3,
      },
    ],
    Macroeconomics: [
      {
        courseId: 106,
        courseEquivalents: {
          [OTHER_COLLEGES]: [350038], // ECON 1120
        },
        minimumScore: 4,
        credits: 3,
      },
    ],
    'English Literature and Composition': [
      {
        courseId: 107,
        courseEquivalents: {
          [OTHER_COLLEGES]: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 4,
        credits: 3,
      },
    ],
    'English Language and Composition': [
      {
        courseId: 108,
        courseEquivalents: {
          [OTHER_COLLEGES]: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 4,
        credits: 3,
      },
    ],
    'French Language': [
      {
        courseId: 109,
        courseEquivalents: {
          [OTHER_COLLEGES]: [353172], // FREN 2090
        },
        minimumScore: 4,
        credits: 3,
      },
    ],
    'French Literature': [{ courseId: 110, minimumScore: 4, credits: 3 }],
    'Italian Language': [{ courseId: 111, minimumScore: 4, credits: 3 }],
    'Italian Literature': [{ courseId: 112, minimumScore: 4, credits: 3 }],
    'Mathematics BC (Non-Engineering)': [
      {
        courseId: 113,
        courseEquivalents: {
          [OTHER_COLLEGES]: [352116, 352120], // MATH 1110, MATH 1120
          EN: [],
        },
        minimumScore: 4,
        credits: 8,
      },
    ],
    'Mathematics BC (Engineering)': [
      {
        courseId: 114,
        courseEquivalents: {
          [OTHER_COLLEGES]: [],
          EN: [352255], // MATH 1910
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    'Mathematics AB': [
      {
        courseId: 115,
        courseEquivalents: {
          [OTHER_COLLEGES]: [352116], // MATH 1110
        },
        minimumScore: 4,
        credits: 4,
      },
    ],
    'Physics I': [
      {
        courseId: 116,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355142], // PHYS 1101
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    'Physics II': [
      {
        courseId: 117,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355143], // PHYS 1102
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    'Physics C-Mechanics': [
      {
        courseId: 118,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355197], // PHYS 2207
          EN: [355146], // PHYS 1112
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    'Physics C-Electricity & Magnetism': [
      {
        courseId: 119,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355207], // PHYS 2213
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
    Psychology: [
      {
        courseId: 120,
        courseEquivalents: {
          [OTHER_COLLEGES]: [351438], // PSYCH 1101
        },
        minimumScore: 4,
        credits: 3,
      },
    ],
    'Spanish Language': [
      {
        courseId: 120,
        minimumScore: 4,
        credits: 3,
      },
    ],
    'Spanish Literature': [
      {
        courseId: 120,
        minimumScore: 4,
        credits: 3,
      },
    ],
    Statistics: [
      {
        courseId: 121,
        courseEquivalents: {
          [OTHER_COLLEGES]: [
            350500, // AEM 2100
            360952, // BTRY 3010
            352353, // BTRY 6010
            350154, // ILRST 2100
            352353, // ILRST 6100
            352245, // MATH 1710
            351485, // PAM 2100
            363824, // PAM 2101
            351674, // PSYCH 2500
            354665, // SOC 3010
            350154, // STSCI 2100
            365785, // STSCI 2150
            360952, // STSCI 2200
          ],
          AG: [],
          BU: [],
          EN: [],
        },
        minimumScore: 4,
        credits: 4,
        majorsExcluded: ['Biological Sciences'],
      },
      {
        courseId: 122,
        courseEquivalents: {
          [OTHER_COLLEGES]: [
            350500, // AEM 2100
            360952, // BTRY 3010
            352353, // BTRY 6010
            350154, // ILRST 2100
            352353, // ILRST 6100
            352245, // MATH 1710
            351485, // PAM 2100
            363824, // PAM 2101
            351674, // PSYCH 2500
            354665, // SOC 3010
            350154, // STSCI 2100
            365785, // STSCI 2150
            360952, // STSCI 2200
          ],
          BU: [],
          EN: [],
        },
        minimumScore: 5,
        credits: 4,
      },
    ],
  },
  IB: {
    'Chemical and Physical Systems': [
      {
        courseId: 200,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355142, 355143], // PHYS 1101, PHYS 1102
        },
        minimumScore: 6,
        credits: 8,
      },
    ],
    Chemistry: [
      {
        courseId: 202,
        courseEquivalents: {
          [OTHER_COLLEGES]: [351265], // CHEM 2070
          EN: [359187], // CHEM 2090
        },
        minimumScore: 6,
        credits: 4,
      },
    ],
    'Computer Science': [
      {
        courseId: 203,
        courseEquivalents: {
          [OTHER_COLLEGES]: [358526], // CS 1110
        },
        minimumScore: 6,
        credits: 4,
      },
    ],
    Economics: [
      {
        courseId: 204,
        courseEquivalents: {
          [OTHER_COLLEGES]: [350025, 350038], // ECON 1110, ECON 1120
        },
        minimumScore: 6,
        credits: 6,
      },
    ],
    'English Literature A': [
      {
        courseId: 205,
        courseEquivalents: {
          [OTHER_COLLEGES]: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 7,
        credits: 3,
      },
    ],
    'English Language and Literature': [
      {
        courseId: 206,
        courseEquivalents: {
          [OTHER_COLLEGES]: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 7,
        credits: 3,
      },
    ],
    Mathematics: [
      {
        courseId: 207,
        courseEquivalents: {
          [OTHER_COLLEGES]: [352111, 352116], // MATH 1106, MATH 1110
        },
        minimumScore: 6,
        credits: 4,
      },
    ],
    'Physical Science': [
      {
        courseId: 208,
        courseEquivalents: {
          [OTHER_COLLEGES]: [351265, 355142], // CHEM 2070, PHYS 1101
        },
        minimumScore: 6,
        credits: 8,
      },
    ],
    Physics: [
      {
        courseId: 209,
        courseEquivalents: {
          [OTHER_COLLEGES]: [355142, 355197], // PHYS 1101, PHYS 2207
          EN: [355146], // PHYS 1112
        },
        minimumScore: 6,
        credits: 4,
      },
    ],
  },
};

export default examData;
