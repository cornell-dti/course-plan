/* eslint-disable max-len */
import { CourseTaken } from '../../types';

export type ExamRequirements = {
  readonly name: string;
  readonly fulfillment: {
    readonly courseEquivalents: Record<string, number>;
    readonly minimumScore: number;
    readonly credits: number;
    readonly majorsExcluded?: string[];
  };
};
export type ExamData = Record<'AP' | 'IB', ExamRequirements[]>;

export type ExamTaken = {
  readonly name: string;
  readonly score: number;
};
export type ExamsTaken = Record<'AP' | 'IB', ExamTaken[]>;

function userDataToCourses(
  college: string,
  major: string,
  userData: ExamsTaken,
  examType: 'AP' | 'IB'
): CourseTaken[] {
  const userExams = userData[examType];
  const exams = examData[examType];
  const courses: CourseTaken[] = [];
  userExams.forEach(userExam => {
    // match exam to user-taken exam
    const exam = exams.reduce((prev: ExamRequirements | undefined, curr: ExamRequirements) => {
      // check if exam name matches and score is high enough
      if (curr.name.includes(userExam.name) && userExam.score >= curr.fulfillment.minimumScore) {
        // update exam variable if this exam has a higher minimum score
        if (!prev || prev.fulfillment.minimumScore < curr.fulfillment.minimumScore) {
          return curr;
        }
      }
      return prev;
    }, undefined);
    // generate the equivalent course
    if (exam) {
      const roster = 'FA20'; // TODO this is hardcoded
      const courseId = exam.fulfillment.courseEquivalents[college];
      const excludedMajor =
        exam.fulfillment.majorsExcluded && exam.fulfillment.majorsExcluded.includes(major);
      if (courseId && !excludedMajor) {
        courses.push({
          roster,
          courseId,
          code: `${examType} ${exam.name}`,
          subject: examType,
          number: exam.name,
          credits: exam.fulfillment.credits,
        });
      }
    }
  });
  return courses;
}

export default function getCourseEquivalents(
  college: string,
  major: string,
  userData: ExamsTaken
): CourseTaken[] {
  const APCourseEquivalents = userDataToCourses(college, major, userData, 'AP');
  const IBCourseEquivalents = userDataToCourses(college, major, userData, 'IB');
  return APCourseEquivalents.concat(IBCourseEquivalents);
}

export const examData: ExamData = {
  AP: [
    {
      name: 'Computer Science A',
      fulfillment: {
        courseEquivalents: {
          EN: 358526, // CS 1110
          AS: 358526, // CS 1110
        },
        minimumScore: 5,
        credits: 4,
      },
    },
    {
      name: 'Chemistry',
      fulfillment: {
        courseEquivalents: {
          EN: 359187, // CHEM 2090
          AS: 351265, // CHEM 2070
          AR: 351265, // CHEM 2070
        },
        minimumScore: 5,
        credits: 4,
        majorsExcluded: ['CHEM'],
      },
    },
  ],
  IB: [
    {
      name: 'Chemical And Physical Systems',
      fulfillment: {
        courseEquivalents: {
          EN: 359187, // CHEM 2090
          AS: 351265, // CHEM 2070
          AR: 351265, // CHEM 2070
        },
        minimumScore: 5,
        credits: 4,
        majorsExcluded: ['CHEM'],
      },
    },
  ],
};

// const transferJSON: ExamData = {
//   AP: [
//     {
//       subject: 'Computer Science A',
//       credits: [
//         {
//           operator: 'or',
//           collegesApplied: ['EN', 'AS'],
//           majorExcluded: [],
//           mininmumScore: 5,
//           courseEquivalents: ['CS 1110'],
//           requirementEquivalents: [],
//           credits: 4,
//         },
//       ],
//     },
//     {
//       subject: 'Chemistry',
//       credits: [
//         {
//           operator: 'or',
//           collegesApplied: ['EN', 'AS', 'AR'],
//           majorExcluded: ['CHEM'],
//           mininmumScore: 5,
//           courseEquivalents: ['CHEM 2070', 'CHEM 2090'],
//           requirementEquivalents: [],
//           credits: 4,
//         },
//       ],
//     },
//     {
//       subject: 'Microeconomics',
//       credits: [
//         {
//           collegesApplied: ['EN', 'AS'],
//           majorExcluded: [],
//           mininmumScore: 4,
//           operator: 'and',
//           courseEquivalents: ['ECON 1110', 'HADM 1410'], // and?
//           requirementEquivalents: [],
//           credits: 4,
//         },
//       ],
//     },
//     {
//       subject: 'Macroeconomics',
//       credits: [
//         {
//           operator: 'and',
//           collegesApplied: ['EN', 'AS'],
//           majorExcluded: [],
//           mininmumScore: 4,
//           courseEquivalents: ['ECON 1120'],
//           requirementEquivalents: [],
//           credits: 4,
//         },
//       ],
//     } /* ,
//         {
//             /*
//             // TODO
//             subject: "English Literature and Composition",
//             credits: [4],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             // TODO
//             subject: "English Language and Composition",
//             credits: [4],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             subject: "French Language",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             subject: "French Literature",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [['FREN 2090']],
//             requirementEquivalents: []
//         },
//         {
//             subject: "German",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [], // TODO
//             requirementEquivalents: []
//         },
//         {
//             // TODO
//             subject: "Greek, Ancient",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             // TODO
//             subject: "Italian Language",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             // TODO
//             subject: "Italian Literature",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [],
//             requirementEquivalents: []
//         },
//         {
//             subject: "Mathematics BC",
//             credits: [8],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [['MATH 1106', 'MATH 1110'],
//                                 ['MATH 1210', 'MATH 1220', 'Math 1910']],
//             requirementEquivalents: []
//         },
//         {
//             subject: "Mathematics AB",
//             credits: [4],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [['MATH 1106', 'MATH 1110']],
//             requirementEquivalents: []
//         },
//         {
//             // TODO
//             subject: "Physics I",
//             credits: [4],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [['PHYS 1101']],
//             requirementEquivalents: [],
//             compositeRequirement: [
//                 {
//                     subject: 'Mathematics BC',
//                     score: 5,
//                     classEquivalent: [['PHYS 2207']]
//                 }
//             ]
//         },
//         {
//             // TODO
//             subject: "Physics II",
//             credits: [4],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [['PHYS 1102']],
//             requirementEquivalents: [],
//             compositeRequirement: [
//                 {
//                     subject: 'Mathematics BC',
//                     score: 5,
//                     classEquivalent: [['PHYS 2208']]
//                 }
//             ]
//         },
//         {
//             // TODO
//             subject: "Physics C-Mechanism",
//             credits: [4],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [['PHYS 1102', 'PHYS 2207']],
//             requirementEquivalents: [],
//         },
//         {
//             // TODO
//             subject: "Physics C-Electricity/Magnetism",
//             credits: [4],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 5,
//             courseEquivalents: [['PHYS 2213']],
//             requirementEquivalents: [],
//         },
//         {
//             // TODO
//             subject: "Psychology",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [['PYSCH 1101']],
//             requirementEquivalents: [],
//         },
//         {
//             // TODO
//             subject: "Spanish Language",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [],
//             requirementEquivalents: [],
//         },
//         {
//             // TODO
//             subject: "Spanish Literature",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [],
//             requirementEquivalents: [],
//         },
//         {
//             // TODO
//             subject: "Statistics",
//             credits: [3],
//             collegesApplied: [],
//             majorExcluded: [],
//             mininmumScore: 4,
//             courseEquivalents: [[ 'AEM 2100', 'BTRY 3010', 'BTRY 6010',
//             'ILRST 2100', 'ILRST 6100', 'MATH 1710', 'PAM 2100',
//             'PAM 2101', 'PSYCH 2500', 'SOC 3010', 'STSCI 2100', 'STSCI 2150', 'STSCI 2200']],
//             requirementEquivalents: [],
//         }
//         */,
//   ],

//   IB: [
//     {
//       subject: 'Chemical And Physical Systems',
//       credits: [
//         {
//           operator: 'or',
//           collegesApplied: ['EN', 'AS', 'AR'],
//           majorExcluded: ['CHEM'],
//           mininmumScore: 5,
//           courseEquivalents: ['CHEM 2070', 'CHEM 2090'],
//           requirementEquivalents: [],
//           credits: 4,
//         },
//       ],
//     },
//     /*
//         {
//             subject: "Chemistry",
//             credits: [4],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 6,
//             courseEquivalents: [['CHEM 2070', 'CHEM 2090']],
//             requirementEquivalents: []
//         },
//         {
//             subject: "Computer Science",
//             credits: [4],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 6,
//             courseEquivalents: [['CS 1110']],
//             requirementEquivalents: []
//         },
//         {
//             subject: "Economics",
//             credits: [6],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 6,
//             courseEquivalents: [['CS 1110']],
//             requirementEquivalents: []
//             // varies

//         },
//         {
//             subject: "English",
//             credits: [6],
//             collegesApplied: ["EN", "AS"],
//             majorExcluded: [],
//             mininmumScore: 6,
//             courseEquivalents: [['CS 1110']],
//             requirementEquivalents: []
//             // varies
//         },
//         */
//   ],
// };
