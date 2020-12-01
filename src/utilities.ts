export default function getCurrentSeason() {
  let currentSeason;
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) {
    currentSeason = 'Winter';
  } else if (currentMonth <= 4) {
    currentSeason = 'Spring';
  } else if (currentMonth <= 7) {
    currentSeason = 'Summer';
  } else {
    currentSeason = 'Fall';
  }
  return currentSeason;
}

export function getCurrentType() {
  let currentType;
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) {
    currentType = 'WI';
  } else if (currentMonth <= 4) {
    currentType = 'SP';
  } else if (currentMonth <= 7) {
    currentType = 'SU';
  } else {
    currentType = 'FA';
  }
  return currentType;
}

export function getCurrentYearSuffix() {
  // If current year is 2020, get string '20'
  const currentYear = new Date().getFullYear();
  return currentYear.toString().substring(2);
}

export function getRostersFromLastTwoYears() {
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

export const clickOutside = {
  bind(el: any, binding: any, vnode: any) {
    el.event = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event, binding.arg);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el: any) {
    document.body.removeEventListener('click', el.event);
  },
};
