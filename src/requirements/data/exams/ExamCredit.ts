import { FWS_COURSE_ID } from '../constants';

export type ExamRequirements = {
  readonly name: string;
  readonly fulfillment: {
    readonly courseEquivalents?: Record<string, number[]>;
    readonly minimumScore: number;
    readonly credits: number;
    readonly majorsExcluded?: string[];
  };
};
export type ExamData = Record<'AP' | 'IB', ExamRequirements[]>;

const examData: ExamData = {
  AP: [
    {
      name: 'Biology',
      fulfillment: {
        minimumScore: 4,
        credits: 4,
      },
    },
    {
      name: 'Biology',
      fulfillment: {
        minimumScore: 5,
        credits: 8,
      },
    },
    {
      name: 'Chemistry',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [351265], // CHEM 2070
          EN: [359187], // CHEM 2090
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Computer Science A',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [358526], // CS 1110
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Microeconomics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [350025], // ECON 1110
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Microeconomics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [350025], // ECON 1110
          BU: [350025, 351468], // ECON 1110, HADM 1410
        },
        minimumScore: 5,
        credits: 3,
      },
    },
    {
      name: 'Macroeconomics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [350038], // ECON 1120
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'English Literature and Composition',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'English Language and Composition',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'French Language',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [353172], // FREN 2090
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'French Literature',
      fulfillment: {
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Italian Language',
      fulfillment: {
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Italian Literature',
      fulfillment: {
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Mathematics BC (Non-Engineering)',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [352116, 352120], // MATH 1110, MATH 1120
          EN: [],
        },
        minimumScore: 4,
        credits: 8,
      },
    },
    {
      name: 'Mathematics BC (Engineering)',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [],
          EN: [352255], // MATH 1910
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Mathematics AB',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [352116], // MATH 1110
        },
        minimumScore: 4,
        credits: 4,
      },
    },
    {
      name: 'Physics I',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355142], // PHYS 1101
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Physics II',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355143], // PHYS 1102
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Physics C-Mechanics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355197], // PHYS 2207
          EN: [355146], // PHYS 1112
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Physics C-Electricity & Magnetism',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355207], // PHYS 2213
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Psychology',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [351438], // PSYCH 1101
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Spanish Language',
      fulfillment: {
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Spanish Literature',
      fulfillment: {
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'Statistics',
      fulfillment: {
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
    },
    {
      name: 'Statistics',
      fulfillment: {
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
    },
  ],
  IB: [
    {
      name: 'Chemical and Physical Systems',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355142, 355143], // PHYS 1101, PHYS 1102
        },
        minimumScore: 6,
        credits: 8,
      },
    },
    {
      name: 'Chemistry',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [351265], // CHEM 2070
          EN: [359187], // CHEM 2090
        },
        minimumScore: 6,
        credits: 4,
      },
    },
    {
      name: 'Computer Science',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [358526], // CS 1110
        },
        minimumScore: 6,
        credits: 4,
      },
    },
    {
      name: 'Economics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [350025, 350038], // ECON 1110, ECON 1120
        },
        minimumScore: 6,
        credits: 6,
      },
    },
    {
      name: 'English Literature A',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 7,
        credits: 3,
      },
    },
    {
      name: 'English Language and Literature',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [FWS_COURSE_ID], // FWS
        },
        minimumScore: 7,
        credits: 3,
      },
    },
    {
      name: 'Mathematics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [352111, 352116], // MATH 1106, MATH 1110
        },
        minimumScore: 6,
        credits: 4,
      },
    },
    {
      name: 'Physical Science',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [351265, 355142], // CHEM 2070, PHYS 1101
        },
        minimumScore: 6,
        credits: 8,
      },
    },
    {
      name: 'Physics',
      fulfillment: {
        courseEquivalents: {
          DEFAULT: [355142, 355197], // PHYS 1101, PHYS 2207
          EN: [355146], // PHYS 1112
        },
        minimumScore: 6,
        credits: 4,
      },
    },
  ],
};

export default examData;
