import examData, { ExamFulfillment, ExamFulfillments } from './data/exams/ExamCredit';
import { NO_EQUIVALENT_COURSES_COURSE_ID, CREDITS_COURSE_ID } from './data/constants';

/** @deprecated old infra */
type ExamTakenOld = {
  readonly subject: string;
  readonly score: number;
};
/** @deprecated old infra */
export type ExamsTakenOld = Record<'AP' | 'IB', ExamTakenOld[]>;

type ExamType = keyof typeof examData;
type ExamTaken = {
  readonly examType: ExamType;
  readonly subject: string;
  readonly score: number;
};
export type ExamsTaken = ExamTaken[];
type ExamSubjects = Record<ExamType, string[]>;

/** @deprecated old infra */
function userDataToCourses(
  college: string | undefined,
  major: string | undefined,
  userData: ExamsTakenOld,
  examType: 'AP' | 'IB'
): CourseTaken[] {
  // If there is no college, that means that the user only has a grad program, so they cannot get any course credit.
  if (!college) return [];

  const userExams = userData[examType];
  const exams = examData[examType];
  const courses: CourseTaken[] = [];
  userExams.forEach(userExam => {
    // match exam to user-taken exam
    const exam = exams[userExam.subject];
    const fulfillment = exam.reduce((prev: ExamFulfillment | undefined, curr: ExamFulfillment) => {
      // check if exam name matches and score is high enough
      if (userExam.score >= curr.minimumScore) {
        // update exam variable if this exam has a higher minimum score
        if (!prev || prev.minimumScore < curr.minimumScore) {
          return curr;
        }
      }
      return prev;
    }, undefined);
    // generate the equivalent course(s)
    // multiple equivalent courses for the same exam can share a unique id, i.e., the unique id represents the exam id
    let courseEquivalentsExist = false;
    const name = `${examType} ${userExam.subject}`;
    if (fulfillment) {
      const courseEquivalents =
        (fulfillment.courseEquivalents &&
          (fulfillment.courseEquivalents[college] ||
            fulfillment.courseEquivalents.OTHER_COLLEGES)) ||
        [];
      const excludedMajor =
        major && fulfillment.majorsExcluded && fulfillment.majorsExcluded.includes(major);
      if (!excludedMajor) {
        // AP/IB credit can be potentially applied towards the user's requirements
        courseEquivalentsExist = true;
        if (courseEquivalents.length === 1) {
          const courseId = courseEquivalents[0];
          courses.push({
            courseId,
            uniqueId: name,
            code: name,
            credits: fulfillment.credits,
          });
        } else {
          // separate credits from equivalent course
          courses.push({
            courseId: CREDITS_COURSE_ID,
            uniqueId: name,
            code: name,
            credits: fulfillment.credits,
          });
          courseEquivalents.forEach(courseId => {
            courses.push({
              courseId,
              uniqueId: name,
              code: name,
              credits: 0,
            });
          });
        }
      }
    }
    if (!courseEquivalentsExist) {
      courses.push({
        courseId: NO_EQUIVALENT_COURSES_COURSE_ID,
        uniqueId: name,
        code: name,
        credits: 0,
      });
    }
  });
  return courses;
}

/** @deprecated old infra */
export function getCourseEquivalentsFromOneMajor(
  college: string | undefined,
  major: string | undefined,
  userData: ExamsTakenOld
): readonly CourseTaken[] {
  const APCourseEquivalents = userDataToCourses(college, major, userData, 'AP');
  const IBCourseEquivalents = userDataToCourses(college, major, userData, 'IB');
  return APCourseEquivalents.concat(IBCourseEquivalents);
}

/** @deprecated old infra */
export default function getCourseEquivalentsFromOneUserExam(
  user: AppOnboardingData
): readonly CourseTaken[] {
  const examKeys = new Set<{ code: string; courseId: number }>();
  const { college, major: majors } = user;
  const userExamData: ExamsTakenOld = { AP: [], IB: [] };
  user.exam.forEach((exam: FirestoreAPIBExam) => {
    const examTaken: ExamTakenOld = { subject: exam.subject, score: exam.score };
    userExamData[exam.type].push(examTaken);
  });
  if (majors.length === 0) {
    return getCourseEquivalentsFromOneMajor(college, undefined, userExamData);
  }
  return [
    ...majors.map((major: string) =>
      getCourseEquivalentsFromOneMajor(college, major, userExamData).filter(
        ({ code, courseId }) => {
          if (!examKeys.has({ code, courseId })) {
            examKeys.add({ code, courseId });
            return true;
          }
          return false;
        }
      )
    ),
  ].flat();
}

const getExamFulfillment = (userExam: ExamTaken): ExamFulfillment | undefined => {
  const exam = examData[userExam.examType][userExam.subject];
  const fulfillment = exam.reduce((prev: ExamFulfillment | undefined, curr: ExamFulfillment) => {
    // check if exam name matches and score is high enough
    if (userExam.score >= curr.minimumScore) {
      // update exam variable if this exam has a higher minimum score
      if (!prev || prev.minimumScore < curr.minimumScore) {
        return curr;
      }
    }
    return prev;
  }, undefined);
  return fulfillment;
};

export const examsTakenToExamCourses = (exams: ExamsTaken): CourseTaken[] => {
  const examCourses: CourseTaken[] = [];
  exams.forEach(exam => {
    // match exam to fulfillment
    const fulfillment = getExamFulfillment(exam);

    // generate exam course
    const examName = `${exam.examType} ${exam.subject}`;
    if (fulfillment) {
      const { courseId, credits } = fulfillment;
      examCourses.push({
        courseId,
        uniqueId: examName,
        code: examName,
        credits,
      });
    } else {
      examCourses.push({
        courseId: NO_EQUIVALENT_COURSES_COURSE_ID,
        uniqueId: examName,
        code: examName,
        credits: 0,
      });
    }
  });
  return examCourses;
};

// TODO @bshen make this default export
export const userDataToExamCourses = (user: AppOnboardingData): CourseTaken[] => {
  const examsTaken = user.exam.map(({ type: examType, subject, score }) => ({
    examType,
    subject,
    score,
  }));
  return examsTakenToExamCourses(examsTaken);
};

const toSubjects = (data: ExamFulfillments) => {
  const subjects = [...new Set(Object.keys(data))];
  subjects.sort();
  return subjects;
};

export const examSubjects: ExamSubjects = {
  AP: toSubjects(examData.AP),
  IB: toSubjects(examData.IB),
};

export const getExamCredit = (examTaken: FirestoreAPIBExam): number => {
  const exam = examData[examTaken.type][examTaken.subject];
  const mostPossibleCredit = exam.reduce((credit, fulfillment) => {
    if (examTaken.score >= fulfillment.minimumScore) {
      return Math.max(credit, fulfillment.credits);
    }
    return credit;
  }, 0);
  return mostPossibleCredit;
};
