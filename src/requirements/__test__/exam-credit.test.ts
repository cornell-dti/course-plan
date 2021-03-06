import getCourseEquivalentsFromUserExams, {
  ExamsTaken,
  getCourseEquivalentsFromOneMajor,
} from '../data/exams/ExamCredit';
import { FWS_COURSE_ID } from '../data/constants';

/**
 * Tests for getCourseEquivalentsFromOneMajor
 */
it('Exam is converted to correct course', () => {
  const exams: ExamsTaken = {
    AP: [
      {
        subject: 'Computer Science A',
        score: 5,
      },
    ],
    IB: [],
  };
  const courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Computer Science A']);
  expect(courseCodes).toEqual(expected);
});

it('Exam score is too low', () => {
  const exams: ExamsTaken = {
    AP: [
      {
        subject: 'Computer Science A',
        score: 0,
      },
    ],
    IB: [],
  };
  const courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set();
  expect(courseCodes).toEqual(expected);
});

it('Two exams are converted to the correct courses', () => {
  const exams: ExamsTaken = {
    AP: [
      {
        subject: 'Computer Science A',
        score: 5,
      },
      {
        subject: 'Chemistry',
        score: 5,
      },
    ],
    IB: [],
  };
  const courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Computer Science A', 'AP Chemistry']);
  expect(courseCodes).toEqual(expected);
});

it('Exam is correctly converted to two courses', () => {
  const exams: ExamsTaken = {
    AP: [],
    IB: [
      {
        subject: 'Chemical and Physical Systems',
        score: 6,
      },
    ],
  };
  const courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  expect(courseEquivalents.length >= 2).toBeTruthy();
  const courseIds = new Set(courseEquivalents.map(c => c.courseId));
  const expected = new Set([10, 355142, 355143]);
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(courseIds).toEqual(expected);
});

it('Exams are converted to the correct number of credits', () => {
  let exams: ExamsTaken = {
    AP: [
      {
        subject: 'Biology',
        score: 5,
      },
    ],
    IB: [],
  };
  let courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  let courseCredits: { [code: string]: number } = courseEquivalents.reduce(
    (a, c) => ({ ...a, [c.code]: c.credits }),
    {}
  );
  expect(courseCredits['AP Biology']).toBe(8);

  exams = {
    AP: [
      {
        subject: 'Biology',
        score: 4,
      },
    ],
    IB: [],
  };
  courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  courseCredits = courseEquivalents.reduce((a, c) => ({ ...a, [c.code]: c.credits }), {});
  expect(courseCredits['AP Biology']).toBe(4);
});

it('Different colleges have different equivalent courses', () => {
  const exams: ExamsTaken = {
    AP: [],
    IB: [
      {
        subject: 'Chemistry',
        score: 6,
      },
    ],
  };
  let courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  const equivalentCourseIdEN = courseEquivalents[0].courseId;
  const expectedCourseIdEN = 359187;
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(equivalentCourseIdEN).toBe(expectedCourseIdEN);

  courseEquivalents = getCourseEquivalentsFromOneMajor('AS', 'CS', exams);
  const equivalentCourseIdAS = courseEquivalents[0].courseId;
  const expectedCourseIdAS = 351265;
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(equivalentCourseIdAS).toBe(expectedCourseIdAS);

  expect(equivalentCourseIdEN).not.toBe(equivalentCourseIdAS);
});

it("Some colleges don't have an equivalent course", () => {
  const exams: ExamsTaken = {
    AP: [
      {
        subject: 'English',
        score: 5,
      },
    ],
    IB: [],
  };
  let courseEquivalents = getCourseEquivalentsFromOneMajor('EN', 'CS', exams);
  let courseIds = new Set(courseEquivalents.map(c => c.courseId));
  expect(courseIds.size).toBe(1);
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(courseIds.has(FWS_COURSE_ID)).toBeTruthy();

  courseEquivalents = getCourseEquivalentsFromOneMajor('AG', 'CS', exams);
  courseIds = new Set(courseEquivalents.map(c => c.courseId));
  if (courseIds.size) {
    // If this fails, first check if the AP/IB equivalent course logic has changed.
    expect(courseIds).not.toContain(FWS_COURSE_ID);
  }
});

/**
 * Tests for getCourseEquivalentsFromUserExams
 */
it('Exam is counted correctly for one major', () => {
  const userData: AppOnboardingData = {
    college: 'EN',
    major: ['CS'],
    exam: [{ type: 'AP', score: 5, subject: 'Computer Science A' }],
    minor: [],
    transferCourse: [],
    tookSwim: 'no',
  };
  const courseEquivalents = getCourseEquivalentsFromUserExams(userData);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Computer Science A']);
  expect(courseCodes).toEqual(expected);
});

it('Two exams are counted correctly for one major', () => {
  const userData: AppOnboardingData = {
    college: 'EN',
    major: ['CS'],
    exam: [
      { type: 'AP', score: 5, subject: 'Computer Science A' },
      { type: 'AP', score: 5, subject: 'Chemistry' },
    ],
    minor: [],
    transferCourse: [],
    tookSwim: 'no',
  };
  const courseEquivalents = getCourseEquivalentsFromUserExams(userData);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Computer Science A', 'AP Chemistry']);
  expect(courseCodes).toEqual(expected);
});

it('One exam is only counted once for multiple majors', () => {
  const userData: AppOnboardingData = {
    college: 'EN',
    major: ['CS', 'Biological Sciences'],
    exam: [{ type: 'AP', score: 5, subject: 'Computer Science A' }],
    minor: [],
    transferCourse: [],
    tookSwim: 'no',
  };
  const courseEquivalents = getCourseEquivalentsFromUserExams(userData);
  expect(courseEquivalents.length).toBe(1);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Computer Science A']);
  expect(courseCodes).toEqual(expected);
});

it('Equivalent course appears if it matches one major but not the other', () => {
  let userData: AppOnboardingData = {
    college: 'EN',
    major: ['Biological Sciences'],
    exam: [{ type: 'AP', score: 4, subject: 'Statistics' }],
    minor: [],
    transferCourse: [],
    tookSwim: 'no',
  };
  let courseEquivalents = getCourseEquivalentsFromUserExams(userData);
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(courseEquivalents.length).toBe(0);

  userData = {
    college: 'EN',
    major: ['CS', 'Biological Sciences'],
    exam: [{ type: 'AP', score: 4, subject: 'Statistics' }],
    minor: [],
    transferCourse: [],
    tookSwim: 'no',
  };
  courseEquivalents = getCourseEquivalentsFromUserExams(userData);
  const courseCodes = new Set(courseEquivalents.map(c => c.code));
  const expected = new Set(['AP Statistics']);
  // If this fails, first check if the AP/IB equivalent course logic has changed.
  expect(courseCodes).toEqual(expected);
});
