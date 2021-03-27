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

export function getCollegeFullName(acronym: string): string {
  return requirementJSON.college[acronym].name;
}

export function getMajorFullName(acronym: string): string {
  return requirementJSON.major[acronym].name;
}

export function getMinorFullName(acronym: string): string {
  return requirementJSON.minor[acronym].name;
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
  bind(el: any, binding: any, vnode: any): void {
    el.event = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event, binding.arg);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  unbind(el: any): void {
    document.body.removeEventListener('click', el.event);
  },
};
