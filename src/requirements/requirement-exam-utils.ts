import examData, {
  ExamFulfillmentBase,
  ExamFulfillmentWithMinimumScore,
  ExamFulfillments,
} from '../data/exams/ExamCredit';
import { NO_FULFILLMENTS_COURSE_ID } from '../data/constants';

type ExamSubjects = Record<TransferExamType, string[]>;

const getExamFulfillment = (
  userExam: FirestoreTransferExam
): ExamFulfillmentBase | ExamFulfillmentWithMinimumScore | undefined => {
  switch (userExam.examType) {
    case 'AP':
    case 'IB': {
      const score =
        typeof userExam.score === 'number' ? userExam.score : parseInt(userExam.score, 10);
      const apibExamFulfillments = examData[userExam.examType][userExam.subject];
      return apibExamFulfillments.reduce(
        (
          prev: ExamFulfillmentWithMinimumScore | undefined,
          curr: ExamFulfillmentWithMinimumScore
        ) => {
          // check if score is high enough
          if (score >= curr.minimumScore) {
            // update accumulator variable if this exam has a higher minimum score
            if (!prev || prev.minimumScore < curr.minimumScore) {
              return curr;
            }
          }
          return prev;
        },
        undefined
      );
    }
    case 'CASE': {
      const caseExamFulfillments = examData[userExam.examType][userExam.subject];
      return caseExamFulfillments.find(
        fulfillment => userExam.score.toString() === fulfillment.score
      );
    }
    default:
      return undefined;
  }
};

export const examsTakenToExamCourses = (exams: FirestoreTransferExam[]): CourseTaken[] => {
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
  const examsTaken = user.exam.map(({ examType, subject, score }) => ({
    examType,
    subject,
    score,
  }));
  return examsTakenToExamCourses(examsTaken);
}

const toSubjects = (data: ExamFulfillments<ExamFulfillmentBase>) => {
  const subjects = [...new Set(Object.keys(data))];
  subjects.sort();
  return subjects;
};

export const examSubjects: ExamSubjects = {
  AP: toSubjects(examData.AP),
  IB: toSubjects(examData.IB),
  CASE: toSubjects(examData.CASE),
};

export const getExamCredit = (examTaken: FirestoreTransferExam): number => {
  const fulfillment = getExamFulfillment(examTaken);
  return fulfillment?.credits || 0;
};

export const getExamScores = (examType: string, subject: string): string[] | number[] => {
  switch (examType) {
    case 'AP':
      return Array.from(Array(5).keys(), n => n + 1);
    case 'IB':
      return Array.from(Array(7).keys(), n => n + 1);
    case 'CASE': {
      const fulfillments = examData[examType][subject];
      return fulfillments?.map(({ score }) => score) || [];
    }
    default:
      return [];
  }
};

export const getExamScoresFromExamTaken = (
  examTaken: FirestoreTransferExam
): string[] | number[] => {
  const { examType, subject } = examTaken;
  return getExamScores(examType, subject);
};
