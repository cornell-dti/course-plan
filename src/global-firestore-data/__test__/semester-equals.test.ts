import { semesterEquals } from '../semesters';

it('correct season and correct year', () => {
  const year = 2022;
  const season: FirestoreSemesterSeason = 'Fall';
  const semester: FirestoreSemester = { year, season, courses: [] };
  expect(semesterEquals(semester, year, season)).toBe(true);
});

it('incorrect season and correct year', () => {
  const year = 2022;
  const season: FirestoreSemesterSeason = 'Fall';
  const wrongSeason: FirestoreSemesterSeason = 'Spring';
  const semester: FirestoreSemester = { year, season, courses: [] };
  expect(semesterEquals(semester, year, wrongSeason)).toBe(false);
});
it('correct season and incorrect year', () => {
  const year = 2022;
  const wrongYear = 2021;
  const season: FirestoreSemesterSeason = 'Fall';
  const semester: FirestoreSemester = { year, season, courses: [] };
  expect(semesterEquals(semester, wrongYear, season)).toBe(false);
});

it('incorrect season and incorrect year', () => {
  const year = 2022;
  const wrongYear = 2021;
  const season: FirestoreSemesterSeason = 'Fall';
  const wrongSeason: FirestoreSemesterSeason = 'Spring';
  const semester: FirestoreSemester = { year, season, courses: [] };
  expect(semesterEquals(semester, wrongYear, wrongSeason)).toBe(false);
});

// TODO @bshen remove after data migration for semester type
it('correct season and correct year with matching type', () => {
  const year = 2022;
  const season: FirestoreSemesterSeason = 'Fall';
  const type: FirestoreSemesterSeason = 'Fall';
  const semester: FirestoreSemester = { year, season, type, courses: [] };
  expect(semesterEquals(semester, year, season)).toBe(true);
});

// TODO @bshen remove after data migration for semester type
it('incorrect season and correct year with matching type', () => {
  const year = 2022;
  const season: FirestoreSemesterSeason = 'Fall';
  const type: FirestoreSemesterSeason = 'Fall';
  const wrongSeason: FirestoreSemesterSeason = 'Spring';
  const semester: FirestoreSemester = { year, season, type, courses: [] };
  expect(semesterEquals(semester, year, wrongSeason)).toBe(false);
});
