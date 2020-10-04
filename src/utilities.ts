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
