import type { FirestoreSemesterType } from './user-data';

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

export const getSubjectColor = (subjectColors: Record<string, string>, subject: string): string => {
  if (subjectColors[subject]) return subjectColors[subject];

  const colors = [
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

  // Create list of used colors
  const colorsUsedMap: Record<string, boolean> = {};
  for (const subjectKey of Object.keys(subjectColors)) {
    const subjectColor = subjectColors[subjectKey];
    colorsUsedMap[subjectColor] = true;
  }

  // Filter out used colors
  const unusedColors = colors.filter(color => !colorsUsedMap[color.hex]);

  let randomColor;

  // pick a color from unusedColors if there are any
  if (unusedColors.length !== 0) {
    randomColor = unusedColors[Math.floor(Math.random() * unusedColors.length)].hex;
    // otherwise pick a color following the random order set by the first 7 subjects
  } else {
    const colorIndex = Object.keys(subjectColors).length;
    const key = Object.keys(subjectColors)[colorIndex % colors.length];
    randomColor = subjectColors[key];
  }

  subjectColors[subject] = randomColor;
  return randomColor;
};

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
