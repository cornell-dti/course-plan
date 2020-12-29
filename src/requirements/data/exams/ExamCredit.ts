import { AppUser, FirestoreAPIBExam } from '../../../user-data';
import { CourseTaken } from '../../types';

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
export type ReqsData = Record<'AP' | 'IB', string[]>;

export type ExamTaken = {
  readonly subject: string;
  readonly score: number;
};
export type ExamsTaken = Record<'AP' | 'IB', ExamTaken[]>;

export const examData: ExamData = {
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
          // ECON 1120
          DEFAULT: [350038],
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'English Literature and Composition',
      fulfillment: {
        courseEquivalents: {
          AS: [11], // FWS
          EN: [11], // FWS
        },
        minimumScore: 4,
        credits: 3,
      },
    },
    {
      name: 'English Language and Composition',
      fulfillment: {
        courseEquivalents: {
          AS: [11], // FWS
          EN: [11], // FWS
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
      name: 'Chemical And Physical Systems',
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
          AS: [11], // FWS
          EN: [11], // FWS
        },
        minimumScore: 7,
        credits: 3,
      },
    },
    {
      name: 'English Language and Literature',
      fulfillment: {
        courseEquivalents: {
          AS: [11], // FWS
          EN: [11], // FWS
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
      if (curr.name.includes(userExam.subject) && userExam.score >= curr.fulfillment.minimumScore) {
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
      const courseEquivalents =
        (exam.fulfillment.courseEquivalents &&
          (exam.fulfillment.courseEquivalents[college] ||
            exam.fulfillment.courseEquivalents.DEFAULT)) ||
        [];
      const excludedMajor =
        exam.fulfillment.majorsExcluded && exam.fulfillment.majorsExcluded.includes(major);
      if (!excludedMajor) {
        if (courseEquivalents.length === 1) {
          const courseId = courseEquivalents[0];
          courses.push({
            roster,
            courseId,
            code: `${examType} ${exam.name}`,
            subject: examType,
            number: exam.name,
            credits: exam.fulfillment.credits,
          });
        } else {
          // separate credits from equivalent course
          courseEquivalents.forEach(courseId => {
            courses.push({
              roster,
              courseId,
              code: `${examType} ${exam.name}`,
              subject: examType,
              number: exam.name,
              credits: 0,
            });
          });
          courses.push({
            roster,
            courseId: 10,
            code: `CREDITS ${examType} ${exam.name}`,
            subject: 'CREDITS',
            number: exam.fulfillment.credits.toString(),
            credits: exam.fulfillment.credits,
          });
        }
      }
    }
  });
  return courses;
}

function getCourseEquivalentsFromOneMajor(
  college: string,
  major: string,
  userData: ExamsTaken
): readonly CourseTaken[] {
  const APCourseEquivalents = userDataToCourses(college, major, userData, 'AP');
  const IBCourseEquivalents = userDataToCourses(college, major, userData, 'IB');
  return APCourseEquivalents.concat(IBCourseEquivalents);
}

export default function getCourseEquivalentsFromUserExams(user: AppUser): readonly CourseTaken[] {
  const courses: CourseTaken[] = [];
  const examCourseCodeSet = new Set<string>();
  const userExamData: ExamsTaken = { AP: [], IB: [] };
  user.exam.forEach((exam: FirestoreAPIBExam) => {
    const examTaken: ExamTaken = { subject: exam.subject, score: exam.score };
    userExamData[exam.type].push(examTaken);
  });
  user.major.forEach((major: string) =>
    getCourseEquivalentsFromOneMajor(user.college, major, userExamData).forEach(course => {
      if (!examCourseCodeSet.has(course.code)) {
        examCourseCodeSet.add(course.code);
        courses.push(course);
      }
    })
  );
  return courses;
}

function toReqsData(data: ExamRequirements[]) {
  const exams = data.map(({ name }) => name);
  return [...new Set(exams)];
}

export const reqsData: ReqsData = {
  AP: toReqsData(examData.AP),
  IB: toReqsData(examData.IB),
};
