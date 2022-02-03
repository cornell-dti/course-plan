import examData, { ExamFulfillment, ExamFulfillments } from './data/exams/ExamCredit';
import { NO_FULFILLMENTS_COURSE_ID } from './data/constants';

type ExamType = keyof typeof examData;
type ExamTaken = {
  readonly examType: ExamType;
  readonly subject: string;
  readonly score: number;
};
export type ExamsTaken = ExamTaken[];
type ExamSubjects = Record<ExamType, string[]>;

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
        courseId: NO_FULFILLMENTS_COURSE_ID,
        uniqueId: examName,
        code: examName,
        credits: 0,
      });
    }
  });
  return examCourses;
};

export default function userDataToExamCourses(user: AppOnboardingData): CourseTaken[] {
  const examsTaken = user.exam.map(({ type: examType, subject, score }) => ({
    examType,
    subject,
    score,
  }));
  return examsTakenToExamCourses(examsTaken);
}

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
