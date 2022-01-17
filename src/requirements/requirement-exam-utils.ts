import examData, {
  ExamFulfillmentBase,
  ExamFulfillmentWithMinimumScore,
  ExamFulfillments,
} from './data/exams/ExamCredit';
import { NO_FULFILLMENTS_COURSE_ID } from './data/constants';

type ExamSubjects = Record<TransferExamType, string[]>;

const getExamFulfillment = (
  userExam: FirestoreTransferExam
): ExamFulfillmentBase | ExamFulfillmentWithMinimumScore | undefined => {
  switch (userExam.examType) {
    case 'AP':
    case 'IB': {
      const apibExam = examData[userExam.examType][userExam.subject];
      return apibExam.reduce(
        (
          prev: ExamFulfillmentWithMinimumScore | undefined,
          curr: ExamFulfillmentWithMinimumScore
        ) => {
          // check if exam name matches and score is high enough
          if ((userExam.score || 0) >= curr.minimumScore) {
            // update exam variable if this exam has a higher minimum score
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
      const caseExam = examData[userExam.examType][userExam.subject];
      return caseExam;
    }
    default:
      throw new Error('Invalid exam type.');
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

const toSubjects = (data: ExamFulfillments) => {
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
