import { fullCoursesArray } from './assets/courses/typed-full-courses';
import requirementJSON from './requirements/typed-requirement-json';

export function checkNotNull<T>(value: T | null | undefined): T {
  if (value == null) throw new Error();
  return value;
}

export default function getCurrentSeason(): FirestoreSemesterType {
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) return 'Winter';
  if (currentMonth <= 4) return 'Spring';
  if (currentMonth <= 7) return 'Summer';
  return 'Fall';
}

export function getCurrentType(): 'WI' | 'SP' | 'SU' | 'FA' {
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) return 'WI';
  if (currentMonth <= 4) return 'SP';
  if (currentMonth <= 7) return 'SU';
  return 'FA';
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCurrentYearSuffix(): string {
  // If current year is 2020, get string '20'
  const currentYear = new Date().getFullYear();
  return currentYear.toString().substring(2);
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

export function getGradFullName(acronym: string): string {
  // Return empty string if minor is not in requirementJSON
  const grad = requirementJSON.grad[acronym];
  return grad ? grad.name : '';
}

function getAllSubjects(): ReadonlySet<string> {
  const set = new Set<string>();
  fullCoursesArray.forEach(it => set.add(it.subject));
  return set;
}

const SUBJECT_COLORS = [
  {
    text: 'Red',
    hex: 'DA4A4A',
  },
  {
    text: 'Orange',
    hex: 'FFA53C',
  },
  {
    text: 'Green',
    hex: '58C913',
  },
  {
    text: 'Blue',
    hex: '139DC9',
  },
  {
    text: 'Purple',
    hex: 'C478FF',
  },
  {
    text: 'Pink',
    hex: 'F296D3',
  },
];

export function allocateAllSubjectColor(
  subjectColors: Record<string, string>
): Record<string, string> {
  const subjectsColorsCopy = { ...subjectColors };
  getAllSubjects().forEach(subject => {
    if (subjectsColorsCopy[subject]) return;
    subjectsColorsCopy[subject] =
      SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)].hex;
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
