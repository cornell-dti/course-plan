import {
  compareFriendPlans,
  displayName,
  emailToNetId,
  initials,
  majorAndYear,
  sharedCourseCodes,
  sharedPlanOf,
} from '../friends-utils';

const course = (code: string, uniqueID = 1): FirestoreSemesterCourse =>
  (({
    code,
    name: `${code} name`,
    credits: 4,
    color: '123456',
    uniqueID,
    type: 'CornellCourse',
    lastRoster: 'FA26',
  } as unknown) as FirestoreSemesterCourse);

const placeholder = ({
  name: 'Liberal Studies',
  uniqueID: 99,
  reqGroup: 'x',
  slot: 1,
  startingSemester: 1,
} as unknown) as FirestoreSemesterPlaceholder;

const semester = (
  season: FirestoreSemesterSeason,
  year: number,
  codes: string[]
): FirestoreSemester => ({ season, year, courses: codes.map(code => course(code)) });

describe('names', () => {
  it('turns a Cornell email into a NetID', () => {
    expect(emailToNetId('abc123@cornell.edu')).toBe('abc123');
    expect(emailToNetId('someone@gmail.com')).toBe('someone@gmail.com');
  });

  it('falls back to the NetID when there is no name', () => {
    expect(displayName({ firstName: 'Jerry', lastName: 'Chen' }, 'jc1@cornell.edu')).toBe(
      'Jerry Chen'
    );
    expect(displayName({ firstName: ' ', lastName: '' }, 'jc1@cornell.edu')).toBe('jc1');
    expect(displayName(null, 'jc1@cornell.edu')).toBe('jc1');
  });

  it('makes initials from the first and last word', () => {
    expect(initials('Jerry Chen')).toBe('JC');
    expect(initials('Mary Ann Smith')).toBe('MS');
    expect(initials('jc1')).toBe('JC');
    expect(initials('')).toBe('');
  });

  it('formats major and class year', () => {
    expect(majorAndYear(['Computer Science'], '2029')).toBe('Computer Science ’29');
    expect(majorAndYear([], '2029')).toBe('’29');
    expect(majorAndYear(['CS', 'Math'], '')).toBe('CS, Math');
  });
});

describe('sharedPlanOf', () => {
  const plans = [
    { name: 'Plan 1', semesters: [] },
    { name: 'Plan 2', semesters: [] },
  ];

  it('uses the shared plan, or the first plan when it is missing or gone', () => {
    expect(sharedPlanOf({ plans, sharedPlanName: 'Plan 2' }).name).toBe('Plan 2');
    expect(sharedPlanOf({ plans, sharedPlanName: 'Deleted' }).name).toBe('Plan 1');
    expect(sharedPlanOf({ plans }).name).toBe('Plan 1');
  });

  it('wraps top-level semesters for accounts without plans', () => {
    const semesters = [semester('Fall', 2026, ['CS 1110'])];
    expect(sharedPlanOf({ semesters })).toEqual({ name: 'Plan 1', semesters });
  });
});

describe('sharedCourseCodes', () => {
  it('lists codes in both plans once, ignoring placeholders', () => {
    const mine = [
      { season: 'Fall', year: 2026, courses: [course('CS 1110'), placeholder] },
      semester('Spring', 2027, ['MATH 1920']),
    ] as FirestoreSemester[];
    const theirs = [
      semester('Fall', 2026, ['MATH 1920', 'CS 1110']),
      semester('Spring', 2027, ['CS 1110']),
    ];
    expect(sharedCourseCodes(mine, theirs)).toEqual(['MATH 1920', 'CS 1110']);
  });
});

describe('compareFriendPlans', () => {
  const mine = [
    semester('Fall', 2026, ['CS 1110', 'MATH 1910', 'ENGL 1111']),
    semester('Spring', 2027, ['CS 2110', 'PHYS 1112']),
    semester('Fall', 2027, ['CS 3110']),
  ];
  const theirs = [
    semester('Fall', 2026, ['CS 1110', 'PSYCH 1101', 'CS 2110']),
    semester('Spring', 2027, ['PHYS 1112']),
    semester('Fall', 2027, ['MATH 1910']),
  ];
  const result = compareFriendPlans(mine, theirs, { season: 'Fall', year: 2026 });

  it('splits this semester into together and theirs only', () => {
    expect(result.together.map(c => c.code)).toEqual(['CS 1110']);
    expect(result.onlyTheirs.map(c => c.code)).toEqual(['PSYCH 1101', 'CS 2110']);
  });

  it('finds the same course in different semesters', () => {
    expect(
      result.differentSemester.map(c => [c.code, c.season, c.year, c.mySeason, c.myYear])
    ).toEqual([
      ['CS 2110', 'Fall', 2026, 'Spring', 2027],
      ['MATH 1910', 'Fall', 2027, 'Fall', 2026],
    ]);
  });

  it('finds classes together in later semesters only', () => {
    expect(result.togetherLater.map(c => [c.code, c.season, c.year])).toEqual([
      ['PHYS 1112', 'Spring', 2027],
    ]);
  });

  it('counts a course as together when one of several semesters matches', () => {
    const retake = compareFriendPlans(
      [semester('Fall', 2026, ['CS 1110']), semester('Fall', 2027, ['CS 1110'])],
      [semester('Fall', 2027, ['CS 1110'])],
      { season: 'Fall', year: 2026 }
    );
    expect(retake.differentSemester).toEqual([]);
    expect(retake.togetherLater.map(c => c.code)).toEqual(['CS 1110']);
  });
});
