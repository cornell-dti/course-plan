import userDataToExamCourses, { examsTakenToExamCourses } from '../requirement-exam-utils';
import { NO_FULFILLMENTS_COURSE_ID } from '../../data/constants';

/**
 * Tests for examsTakenToExamCourses
 */
it('Exam is converted to correct course', () => {
  const exams: FirestoreTransferExam[] = [
    {
      examType: 'AP',
      subject: 'Computer Science A',
      score: 5,
    },
  ];
  const examCourses = examsTakenToExamCourses(exams);
  const expected = {
    code: 'AP Computer Science A',
    uniqueId: 'AP Computer Science A',
    credits: 4,
    courseId: 103, // dependent on data/ExamCredit.ts
  };
  expect(examCourses[0]).toEqual(expected);
});

it('Exam score is too low', () => {
  const exams: FirestoreTransferExam[] = [
    {
      examType: 'AP',
      subject: 'Computer Science A',
      score: 0,
    },
  ];
  const examCourses = examsTakenToExamCourses(exams);
  const expected = {
    code: 'AP Computer Science A',
    uniqueId: 'AP Computer Science A',
    credits: 0,
    courseId: NO_FULFILLMENTS_COURSE_ID,
  };
  expect(examCourses[0]).toEqual(expected);
});

it('Two exams are converted to the correct courses', () => {
  const exams: FirestoreTransferExam[] = [
    {
      examType: 'AP',
      subject: 'Computer Science A',
      score: 5,
    },
    {
      examType: 'AP',
      subject: 'Chemistry',
      score: 5,
    },
  ];
  const examCourses = examsTakenToExamCourses(exams);
  const codes = new Set(examCourses.map(({ code }) => code));
  const expectedCodes = new Set(['AP Computer Science A', 'AP Chemistry']);
  expect(codes).toEqual(expectedCodes);
});

/**
 * Tests for userDataToExamCourses
 */
it('Exam is converted to correct course', () => {
  const userData: AppOnboardingData = {
    gradYear: '2020',
    gradSem: 'Spring',
    entranceYear: '2016',
    entranceSem: 'Fall',
    college: 'EN',
    major: [],
    exam: [{ examType: 'AP', score: 5, subject: 'Computer Science A' }],
    minor: [],
    tookSwim: 'no',
    sawMultiplePlans: false,
  };
  const examCourses = userDataToExamCourses(userData);
  const expected = {
    code: 'AP Computer Science A',
    uniqueId: 'AP Computer Science A',
    credits: 4,
    courseId: 103, // dependent on data/ExamCredit.ts
  };
  expect(examCourses[0]).toEqual(expected);
});
