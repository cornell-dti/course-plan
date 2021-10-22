import { getActiveSemesters } from '../semesters';

it('normal 4 yr plan', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
    { season: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = getActiveSemesters(2019, 'Fall', 2023, 'Spring').reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('graduating in 3 years', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
  ];
  const actualSems = getActiveSemesters(2019, 'Fall', 2022, 'Spring').reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('graduating semester early', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
  ];
  const actualSems = getActiveSemesters(2019, 'Fall', 2022, 'Fall').reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('entered 1 semester late', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
    { season: 'Spring', year: 2021, courses: [] },
    { season: 'Fall', year: 2021, courses: [] },
    { season: 'Spring', year: 2022, courses: [] },
    { season: 'Fall', year: 2022, courses: [] },
    { season: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = getActiveSemesters(2020, 'Spring', 2023, 'Spring').reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('just entering for 1 yr', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Fall', year: 2019, courses: [] },
    { season: 'Spring', year: 2020, courses: [] },
  ];
  const actualSems = getActiveSemesters(2019, 'Fall', 2020, 'Spring').reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('entering for 1 yr in spring', () => {
  const expectedSems: FirestoreSemester[] = [
    { season: 'Spring', year: 2020, courses: [] },
    { season: 'Fall', year: 2020, courses: [] },
  ];
  const actualSems = getActiveSemesters(2020, 'Spring', 2020, 'Fall').reverse();
  expect(expectedSems).toEqual(actualSems);
});
