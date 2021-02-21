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

export function getRostersFromLastTwoYears(): string[] {
  // If current roster is FA20, get all rosters thru FA18
  const currentType = getCurrentType();
  const currentYearSuffix = getCurrentYearSuffix();

  const currentRoster = currentType + currentYearSuffix;
  const numRosters = 9; // Number of most recent rosters we want
  const mostRecentRosters = [currentRoster];
  let roster = currentRoster;
  while (mostRecentRosters.length < numRosters) {
    // Go backwards until we hit 2 years and add to list of rosters
    let rosterType = roster.substring(0, 2);
    let rosterYear = roster.substring(2);
    if (rosterType === 'FA') {
      rosterType = 'SU';
    } else if (rosterType === 'SU') {
      rosterType = 'SP';
    } else if (rosterType === 'SP') {
      rosterType = 'WI';
    } else if (rosterType === 'WI') {
      rosterType = 'FA';
      rosterYear = (parseInt(rosterYear, 10) - 1).toString();
    }
    roster = rosterType + rosterYear;
    mostRecentRosters.push(roster);
  }
  return mostRecentRosters;
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

export function shouldModalClose(e: MouseEvent, elemRef: Element) {
  const rect = elemRef.getBoundingClientRect();
  return !( // Test if mouse clicked inside the modal's bounds
    e.x >= rect.x &&
    e.x <= rect.x + rect.width &&
    e.y >= rect.y &&
    e.y <= rect.y + rect.height
  );
}