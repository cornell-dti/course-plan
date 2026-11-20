/**
 * Pure helpers for the Friends panel and Compare view. Nothing here touches Firestore or the
 * store, so it can be unit tested directly.
 */

import { CORNELL_EMAIL_DOMAIN } from '../../global-firestore-data/user-friends-utils';

type SemesterKey = { readonly season: FirestoreSemesterSeason; readonly year: number };

const SEASON_ORDER: Record<FirestoreSemesterSeason, number> = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

const semesterOrdinal = ({ season, year }: SemesterKey): number => year * 4 + SEASON_ORDER[season];

/** 'abc123@cornell.edu' → 'abc123'. Other emails are returned unchanged. */
export const emailToNetId = (email: string): string =>
  email.endsWith(CORNELL_EMAIL_DOMAIN) ? email.slice(0, -CORNELL_EMAIL_DOMAIN.length) : email;

/** 'Jerry Chen', or the NetID when the user has no name on file. */
export const displayName = (name: FirestoreUserName | null | undefined, email: string): string => {
  const full = [name?.firstName, name?.lastName]
    .map(part => (part ?? '').trim())
    .filter(Boolean)
    .join(' ');
  return full || emailToNetId(email);
};

/** 'Jerry Chen' → 'JC'; 'abc123' → 'AB'. */
export const initials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return (words[0] ?? '').slice(0, 2).toUpperCase();
};

/** 'Computer Science ’29'. Either part may be missing. */
export const majorAndYear = (
  majorNames: readonly string[],
  gradYear: string | undefined
): string => {
  const year = gradYear && /^\d{4}$/.test(gradYear) ? `’${gradYear.slice(2)}` : '';
  return [majorNames.filter(Boolean).join(', '), year].filter(Boolean).join(' ');
};

/**
 * The plan a friend compares against: the one they chose to share, or their first plan. Older
 * accounts without plans keep their semesters at the top level.
 */
export const sharedPlanOf = (data: {
  readonly plans?: readonly Plan[];
  readonly semesters?: readonly FirestoreSemester[];
  readonly sharedPlanName?: string;
}): Plan => {
  const plans = data.plans ?? [];
  return (
    plans.find(plan => plan.name === data.sharedPlanName) ??
    plans[0] ?? { name: 'Plan 1', semesters: data.semesters ?? [] }
  );
};

export type CompareCourse = {
  readonly code: string;
  readonly name: string;
  readonly credits: number;
  readonly color: string;
};

export type CompareEntry = CompareCourse & {
  /** When the course is taken; for 'diff' entries, the friend's semester. */
  readonly season: FirestoreSemesterSeason;
  readonly year: number;
};

export type DiffEntry = CompareEntry & {
  readonly mySeason: FirestoreSemesterSeason;
  readonly myYear: number;
};

export type FriendComparison = {
  /** In the given semester, taken by both of you. */
  readonly together: readonly CompareCourse[];
  /** In the given semester, taken only by the friend. */
  readonly onlyTheirs: readonly CompareCourse[];
  /** Taken by both of you, but never in the same semester. */
  readonly differentSemester: readonly DiffEntry[];
  /** Taken by both of you in the same semester, after the given one. */
  readonly togetherLater: readonly CompareEntry[];
};

type PlanCourse = FirestoreSemesterCourse | FirestoreSemesterPlaceholder;

const isRealCourse = (course: PlanCourse): course is FirestoreSemesterCourse =>
  !(course as FirestoreSemesterPlaceholder).startingSemester && 'code' in course;

const toCompareCourse = (course: FirestoreSemesterCourse): CompareCourse => ({
  code: course.code,
  name: course.name,
  credits: course.credits,
  color: course.color,
});

/** Every course in a plan with the semester it is in, earliest semester first. */
const coursesBySemester = (semesters: readonly FirestoreSemester[]) =>
  [...semesters]
    .sort((a, b) => semesterOrdinal(a) - semesterOrdinal(b))
    .flatMap(semester =>
      semester.courses.filter(isRealCourse).map(course => ({ course, semester }))
    );

/** Course codes in both plans, in any semester, in the friend's plan order. */
export const sharedCourseCodes = (
  mine: readonly FirestoreSemester[],
  theirs: readonly FirestoreSemester[]
): string[] => {
  const myCodes = new Set(coursesBySemester(mine).map(({ course }) => course.code));
  const shared = coursesBySemester(theirs)
    .map(({ course }) => course.code)
    .filter(code => myCodes.has(code));
  return [...new Set(shared)];
};

export const compareFriendPlans = (
  mine: readonly FirestoreSemester[],
  theirs: readonly FirestoreSemester[],
  current: SemesterKey
): FriendComparison => {
  const myCourses = coursesBySemester(mine);
  const theirCourses = coursesBySemester(theirs);
  const isCurrent = (semester: SemesterKey) =>
    semester.season === current.season && semester.year === current.year;
  const sameSemester = (a: SemesterKey, b: SemesterKey) =>
    a.season === b.season && a.year === b.year;

  const myCurrentCodes = new Set(
    myCourses.filter(({ semester }) => isCurrent(semester)).map(({ course }) => course.code)
  );
  const theirCurrent = theirCourses.filter(({ semester }) => isCurrent(semester));
  const together = theirCurrent
    .filter(({ course }) => myCurrentCodes.has(course.code))
    .map(({ course }) => toCompareCourse(course));
  const onlyTheirs = theirCurrent
    .filter(({ course }) => !myCurrentCodes.has(course.code))
    .map(({ course }) => toCompareCourse(course));

  const togetherLater: CompareEntry[] = [];
  const differentSemester: DiffEntry[] = [];
  const seen = new Set<string>();
  theirCourses.forEach(({ course, semester }) => {
    if (seen.has(course.code)) return;
    const myMatches = myCourses.filter(entry => entry.course.code === course.code);
    if (myMatches.length === 0) return;
    // a course both of you take in the same semester counts as together, not different
    const sameTerm = theirCourses.find(
      entry =>
        entry.course.code === course.code &&
        myMatches.some(mineEntry => sameSemester(mineEntry.semester, entry.semester))
    );
    seen.add(course.code);
    if (sameTerm) {
      if (semesterOrdinal(sameTerm.semester) > semesterOrdinal(current)) {
        togetherLater.push({
          ...toCompareCourse(sameTerm.course),
          season: sameTerm.semester.season,
          year: sameTerm.semester.year,
        });
      }
      return;
    }
    differentSemester.push({
      ...toCompareCourse(course),
      season: semester.season,
      year: semester.year,
      mySeason: myMatches[0].semester.season,
      myYear: myMatches[0].semester.year,
    });
  });

  return { together, onlyTheirs, differentSemester, togetherLater };
};
