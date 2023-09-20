import { semesterEquals, getActiveSemesters } from '../user-semesters';

const semestersEqual = (
  expected: readonly FirestoreSemester[],
  actual: readonly FirestoreSemester[],
) =>
  expected.length === actual.length &&
  [...actual.keys()].every(i => semesterEquals(actual[i], expected[i].year, expected[i].season));

it('normal 4 yr plan', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
    { season: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2019, 'Fall', 2023, 'Spring')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});

it('graduating in 3 years', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2019, 'Fall', 2022, 'Spring')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});

it('graduating semester early', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2019, 'Fall', 2022, 'Fall')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});

it('entered 1 semester late', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
    { season: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2020, 'Spring', 2023, 'Spring')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});

it('just entering for 1 yr', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2019, 'Fall', 2020, 'Spring')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});

it('entering for 1 yr in spring', () => {
  const expectedSems: readonly FirestoreSemester[] = [
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
  ];
  const actualSems = [...getActiveSemesters(2020, 'Spring', 2020, 'Fall')].reverse();
  expect(semestersEqual(expectedSems, actualSems)).toBe(true);
});
