import { FWS_COURSE_ID } from '../constants';

export type ExamFulfillment = {
  readonly courseEquivalents?: Record<string, number[]>;
  readonly minimumScore: number;
  readonly credits: number;
  readonly majorsExcluded?: string[];
};
type ExamRequirements = {
  readonly courseId: number;
  readonly fulfillmentOptions: ExamFulfillment[];
};
export type ExamRequirementsMapping = Record<string, ExamRequirements>;
export type ExamData = Record<'AP' | 'IB', ExamRequirementsMapping>;

const examData: ExamData = {
  AP: {
    Biology: {
      courseId: 100,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 4,
        },
        { minimumScore: 5, credits: 8 },
      ],
    },
    Chemistry: {
      courseId: 101,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [351265], // CHEM 2070
            EN: [359187], // CHEM 2090
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    'Computer Science A': {
      courseId: 102,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [358526], // CS 1110
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    Microeconomics: {
      courseId: 103,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [350025], // ECON 1110
          },
          minimumScore: 4,
          credits: 3,
        },
        {
          courseEquivalents: {
            DEFAULT: [350025], // ECON 1110
            BU: [350025, 351468], // ECON 1110, HADM 1410
          },
          minimumScore: 5,
          credits: 3,
        },
      ],
    },
    Macroeconomics: {
      courseId: 104,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [350038], // ECON 1120
          },
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'English Literature and Composition': {
      courseId: 105,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [FWS_COURSE_ID], // FWS
          },
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'English Language and Composition': {
      courseId: 106,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [FWS_COURSE_ID], // FWS
          },
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'French Language': {
      courseId: 107,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [353172], // FREN 2090
          },
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'French Literature': {
      courseId: 108,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'Italian Language': {
      courseId: 109,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'Italian Literature': {
      courseId: 110,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'Mathematics BC (Non-Engineering)': {
      courseId: 111,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [352116, 352120], // MATH 1110, MATH 1120
            EN: [],
          },
          minimumScore: 4,
          credits: 8,
        },
      ],
    },
    'Mathematics BC (Engineering)': {
      courseId: 112,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [],
            EN: [352255], // MATH 1910
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    'Mathematics AB': {
      courseId: 113,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [352116], // MATH 1110
          },
          minimumScore: 4,
          credits: 4,
        },
      ],
    },
    'Physics I': {
      courseId: 114,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355142], // PHYS 1101
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    'Physics II': {
      courseId: 115,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355143], // PHYS 1102
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    'Physics C-Mechanics': {
      courseId: 116,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355197], // PHYS 2207
            EN: [355146], // PHYS 1112
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    'Physics C-Electricity & Magnetism': {
      courseId: 117,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355207], // PHYS 2213
          },
          minimumScore: 5,
          credits: 4,
        },
      ],
    },
    Psychology: {
      courseId: 118,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [351438], // PSYCH 1101
          },
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'Spanish Language': {
      courseId: 119,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    'Spanish Literature': {
      courseId: 120,
      fulfillmentOptions: [
        {
          minimumScore: 4,
          credits: 3,
        },
      ],
    },
    Statistics: {
      courseId: 121,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [
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
          courseEquivalents: {
            DEFAULT: [
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
  },
  IB: {
    'Chemical and Physical Systems': {
      courseId: 201,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355142, 355143], // PHYS 1101, PHYS 1102
          },
          minimumScore: 6,
          credits: 8,
        },
      ],
    },
    Chemistry: {
      courseId: 202,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [351265], // CHEM 2070
            EN: [359187], // CHEM 2090
          },
          minimumScore: 6,
          credits: 4,
        },
      ],
    },
    'Computer Science': {
      courseId: 203,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [358526], // CS 1110
          },
          minimumScore: 6,
          credits: 4,
        },
      ],
    },
    Economics: {
      courseId: 204,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [350025, 350038], // ECON 1110, ECON 1120
          },
          minimumScore: 6,
          credits: 6,
        },
      ],
    },
    'English Literature A': {
      courseId: 205,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [FWS_COURSE_ID], // FWS
          },
          minimumScore: 7,
          credits: 3,
        },
      ],
    },
    'English Language and Literature': {
      courseId: 206,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [FWS_COURSE_ID], // FWS
          },
          minimumScore: 7,
          credits: 3,
        },
      ],
    },
    Mathematics: {
      courseId: 207,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [352111, 352116], // MATH 1106, MATH 1110
          },
          minimumScore: 6,
          credits: 4,
        },
      ],
    },
    'Physical Science': {
      courseId: 208,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [351265, 355142], // CHEM 2070, PHYS 1101
          },
          minimumScore: 6,
          credits: 8,
        },
      ],
    },
    Physics: {
      courseId: 209,
      fulfillmentOptions: [
        {
          courseEquivalents: {
            DEFAULT: [355142, 355197], // PHYS 1101, PHYS 2207
            EN: [355146], // PHYS 1112
          },
          minimumScore: 6,
          credits: 4,
        },
      ],
    },
  },
};

export default examData;
