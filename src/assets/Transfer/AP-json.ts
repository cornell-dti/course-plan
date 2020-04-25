/* eslint-disable max-len */
import { ExamData } from '../../requirements/types';

const transferJSON: ExamData = {
  AP:
    [
      {
        subject: 'Chemistry',
        credits:
            [
              {
                collegesApplied: ['EN', 'AS', 'AR'],
                majorExcluded: ['CHEM'],
                mininmumScore: 5,
                courseEquivalents: [['CHEM 2070', 'CHEM 2090']],
                requirementEquivalents: [],
                credits: 4
              }
            ]
      },
      {
        subject: 'Computer Science A',
        credits:
            [
              {
                collegesApplied: ['EN', 'AS'],
                majorExcluded: [],
                mininmumScore: 5,
                courseEquivalents: [['CS 1110']],
                requirementEquivalents: [],
                credits: 4
              }
            ]
      },
      {
        subject: 'Microeconomics',
        credits:
            [
              {
                collegesApplied: ['EN', 'AS'],
                majorExcluded: [],
                mininmumScore: 4,
                courseEquivalents: [['ECON 1110'], ['HADM 1410']], // and?
                requirementEquivalents: [],
                credits: 4

              }
            ]
      },
      {
        subject: 'Macroeconomics',
        credits:
            [
              {
                collegesApplied: ['EN', 'AS'],
                majorExcluded: [],
                mininmumScore: 4,
                courseEquivalents: [['ECON 1120']],
                requirementEquivalents: [],
                credits: 4
              }
            ]
      } /* ,
        {
            /*
            // TODO
            subject: "English Literature and Composition",
            credits: [4],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            // TODO
            subject: "English Language and Composition",
            credits: [4],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            subject: "French Language",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            subject: "French Literature",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [['FREN 2090']],
            requirementEquivalents: []
        },
        {
            subject: "German",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [], // TODO
            requirementEquivalents: []
        },
        {
            // TODO
            subject: "Greek, Ancient",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            // TODO
            subject: "Italian Language",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            // TODO
            subject: "Italian Literature",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [],
            requirementEquivalents: []
        },
        {
            subject: "Mathematics BC",
            credits: [8],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [['MATH 1106', 'MATH 1110'],
                                ['MATH 1210', 'MATH 1220', 'Math 1910']],
            requirementEquivalents: []
        },
        {
            subject: "Mathematics AB",
            credits: [4],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [['MATH 1106', 'MATH 1110']],
            requirementEquivalents: []
        },
        {
            // TODO
            subject: "Physics I",
            credits: [4],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [['PHYS 1101']],
            requirementEquivalents: [],
            compositeRequirement: [
                {
                    subject: 'Mathematics BC',
                    score: 5,
                    classEquivalent: [['PHYS 2207']]
                }
            ]
        },
        {
            // TODO
            subject: "Physics II",
            credits: [4],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [['PHYS 1102']],
            requirementEquivalents: [],
            compositeRequirement: [
                {
                    subject: 'Mathematics BC',
                    score: 5,
                    classEquivalent: [['PHYS 2208']]
                }
            ]
        },
        {
            // TODO
            subject: "Physics C-Mechanism",
            credits: [4],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [['PHYS 1102', 'PHYS 2207']],
            requirementEquivalents: [],
        },
        {
            // TODO
            subject: "Physics C-Electricity/Magnetism",
            credits: [4],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 5,
            courseEquivalents: [['PHYS 2213']],
            requirementEquivalents: [],
        },
        {
            // TODO
            subject: "Psychology",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [['PYSCH 1101']],
            requirementEquivalents: [],
        },
        {
            // TODO
            subject: "Spanish Language",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [],
            requirementEquivalents: [],
        },
        {
            // TODO
            subject: "Spanish Literature",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [],
            requirementEquivalents: [],
        },
        {
            // TODO
            subject: "Statistics",
            credits: [3],
            collegesApplied: [],
            majorExcluded: [],
            mininmumScore: 4,
            courseEquivalents: [[ 'AEM 2100', 'BTRY 3010', 'BTRY 6010',
            'ILRST 2100', 'ILRST 6100', 'MATH 1710', 'PAM 2100',
            'PAM 2101', 'PSYCH 2500', 'SOC 3010', 'STSCI 2100', 'STSCI 2150', 'STSCI 2200']],
            requirementEquivalents: [],
        }
        */
    ],

  IB:
    [/*
        {
            subject: "Chemical And Physical Systems",
            credits: [8],
            collegesApplied: ["EN", "AS"],
            majorExcluded: ['CHEM'],
            mininmumScore: 6,
            courseEquivalents: [['PHYSC 1101'], ['PHYS 1102']],
            requirementEquivalents: []
        },
        {
            subject: "Chemistry",
            credits: [4],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 6,
            courseEquivalents: [['CHEM 2070', 'CHEM 2090']],
            requirementEquivalents: []
        },
        {
            subject: "Computer Science",
            credits: [4],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 6,
            courseEquivalents: [['CS 1110']],
            requirementEquivalents: []
        },
        {
            subject: "Economics",
            credits: [6],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 6,
            courseEquivalents: [['CS 1110']],
            requirementEquivalents: []
            // varies

        },
        {
            subject: "English",
            credits: [6],
            collegesApplied: ["EN", "AS"],
            majorExcluded: [],
            mininmumScore: 6,
            courseEquivalents: [['CS 1110']],
            requirementEquivalents: []
            // varies
        },
        */
    ]

};

export default transferJSON;
