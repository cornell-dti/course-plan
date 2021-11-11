import { ExamsTaken, userExamsToExamCourses } from '../requirement-exam-utils';
import { NO_EQUIVALENT_COURSES_COURSE_ID, CREDITS_COURSE_ID } from '../data/constants';

/**
 * Tests for userExamsToExamCourses
 */
it('Exam is converted to correct course', () => {
  const exams: ExamsTaken = [
    {
      examType: 'AP',
      subject: 'Computer Science A',
      score: 5,
    },
  ];
  const examCourses = userExamsToExamCourses(exams);
  const expected = {
    code: 'AP Computer Science A',
    uniqueId: 'AP Computer Science A',
    credits: 4,
    courseId: 103, // dependent on data/ExamCredit.ts
  };
  expect(examCourses[0]).toEqual(expected);
});

it('Exam score is too low', () => {
  const exams: ExamsTaken = [
    {
      examType: 'AP',
      subject: 'Computer Science A',
      score: 0,
    },
  ];
  const examCourses = userExamsToExamCourses(exams);
  const expected = {
    code: 'AP Computer Science A',
    uniqueId: 'AP Computer Science A',
    credits: 0,
    courseId: NO_EQUIVALENT_COURSES_COURSE_ID,
  };
  expect(examCourses[0]).toEqual(expected);
});

it('Two exams are converted to the correct courses', () => {
  const exams: ExamsTaken = [
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
  const examCourses = userExamsToExamCourses(exams);
  const codes = new Set(examCourses.map(({ code }) => code));
  const expectedCodes = new Set(['AP Computer Science A', 'AP Chemistry']);
  expect(codes).toEqual(expectedCodes);
});
