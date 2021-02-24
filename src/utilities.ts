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

/**
 * The function to be passed to move prop for <draggable /> to prevent a course being dropped into
 * requirement course container.
 */
export function onDraggedCourseMove(event: { to?: HTMLElement }): boolean {
  const target = event.to;
  if (target == null) return true;
  // Use this data on the DOM to denote that it's not a droppable target.
  // This is the recommended way according to
  // https://github.com/SortableJS/Vue.Draggable/issues/897
  return target.getAttribute('data-not-droppable') !== 'true';
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
