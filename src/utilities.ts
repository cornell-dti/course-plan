import { fullCoursesArray } from './assets/courses/typed-full-courses';
import requirementJSON from './requirements/typed-requirement-json';
import { coursesColorSet } from './assets/constants/colors';

/** Enumerated type to define seasons as integers in season order */
export const SeasonOrdinal = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
} as const;

/**
 * Returns given semesters sorted in either increasing or decreasing order of date
 * @param semesters the semesters to return sorted
 * @param orderByNewest whether to sort the semesters in decreasing order
 * @returns semesters sorted according to orderByNewest
 */
export const sortedSemesters = (
  semesters: readonly FirestoreSemester[],
  orderByNewest = true
): readonly FirestoreSemester[] =>
  semesters.slice().sort((a, b) => {
    // sort in increasing order iff orderByNewest is false, increasing otherwise
    const order = orderByNewest ? -1 : 1;
    const byYear = a.year - b.year;
    return order * (byYear === 0 ? SeasonOrdinal[a.season] - SeasonOrdinal[b.season] : byYear);
  });

export function checkNotNull<T>(value: T | null | undefined): T {
  if (value == null) throw new Error();
  return value;
}

export function getCurrentSeason(): FirestoreSemesterSeason {
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) return 'Winter';
  if (currentMonth <= 4) return 'Spring';
  if (currentMonth <= 7) return 'Summer';
  return 'Fall';
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCollegeFullName(acronym: string | undefined): string {
  // Return empty string if college is not in requirementJSON
  const college = acronym ? requirementJSON.college[acronym] : null;
  return college ? college.name : '';
}

export function getMajorFullName(acronym: string): string {
  // Return empty string if major is not in requirementJSON
  const major = requirementJSON.major[acronym];
  return major ? major.name : '';
}

export function getMinorFullName(acronym: string): string {
  // Return empty string if minor is not in requirementJSON
  const minor = requirementJSON.minor[acronym];
  return minor ? minor.name : '';
}

export function getGradFullName(acronym: string | undefined): string {
  // Return empty string if grad is not in requirementJSON
  const grad = acronym ? requirementJSON.grad[acronym] : null;
  return grad ? grad.name : '';
}

function getAllSubjects(): ReadonlySet<string> {
  const set = new Set<string>();
  fullCoursesArray.forEach(it => set.add(it.subject));
  return set;
}

export function allocateAllSubjectColor(
  subjectColors: Record<string, string>
): Record<string, string> {
  const subjectsColorsCopy = { ...subjectColors };
  getAllSubjects().forEach(subject => {
    if (subjectsColorsCopy[subject]) return;
    subjectsColorsCopy[subject] = coursesColorSet[
      Math.floor(Math.random() * coursesColorSet.length)
    ].hex.substring(1);
  });
  return subjectsColorsCopy;
}

export function updateSubjectColor(
  subjectColors: Record<string, string>,
  color: string,
  code: string
): Record<string, string> {
  const subjectsColorsCopy = { ...subjectColors };
  getAllSubjects().forEach(subject => {
    if (subject === code) {
      subjectsColorsCopy[subject] = color;
    }
  });
  return subjectsColorsCopy;
}

export const clickOutside = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  beforeMount(el: any, binding: any): void {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  unmounted(el: any): void {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

// reqGroupColorList determines the colors of the first 3 types of requirements the user has in their plan
// if they have 4 - wraps around
const reqGroupColorList = ['4D7D92', '148481', '105351'];

// get the color for a given requirement type in the requirements sidebar
export function getReqColor(groupName: string, onboardingData: AppOnboardingData): string {
  // college will always be the first color
  if (groupName === 'College') {
    return reqGroupColorList[0];
  }
  // if the user has major(s), it must be the second group in the requirements bar
  if (groupName === 'Major') {
    return reqGroupColorList[1];
  }
  // if the user has minors, use the second color if the majors section does not display, otherwise use the third color
  if (groupName === 'Minor') {
    if (onboardingData.major.length === 0) {
      return reqGroupColorList[1];
    }
    return reqGroupColorList[2];
  }
  // if the user has a grad program, display the first color if no college present, second color if no majors and minors,
  // the third color if one of them, or wrap around if all are present
  if (!onboardingData.college) {
    return reqGroupColorList[0];
  }
  if (onboardingData.major.length === 0 && onboardingData.minor.length === 0) {
    return reqGroupColorList[1];
  }
  if (onboardingData.minor.length === 0 || onboardingData.major.length === 0) {
    return reqGroupColorList[2];
  }
  return reqGroupColorList[0];
}
