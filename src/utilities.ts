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

export function getAllSubjects(): ReadonlySet<string> {
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

export function allocateSubjectColor(subjectColors: Record<string, string>, subject: string): void {
  if (subjectColors[subject]) return;
  const usedColors = new Set(Object.values(subjectColors));
  // Filter out used colors
  const unusedSubjectColors = SUBJECT_COLORS.filter(color => !usedColors.has(color.hex));
  const subjectColorCandidates =
    unusedSubjectColors.length !== 0 ? unusedSubjectColors : SUBJECT_COLORS;
  subjectColors[subject] =
    subjectColorCandidates[Math.floor(Math.random() * subjectColorCandidates.length)].hex;
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
