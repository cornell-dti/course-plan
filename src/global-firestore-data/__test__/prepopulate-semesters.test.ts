import { getActiveSemesters } from '../semesters';

it('normal 4 yr plan', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Fall', year: 2019, courses: [] },
    { type: 'Spring', year: 2020, courses: [] },
    { type: 'Fall', year: 2020, courses: [] },
    { type: 'Spring', year: 2021, courses: [] },
    { type: 'Fall', year: 2021, courses: [] },
    { type: 'Spring', year: 2022, courses: [] },
    { type: 'Fall', year: 2022, courses: [] },
    { type: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = getActiveSemesters('Fall', 2019, 'Spring', 2023).reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('graduating in 3 years', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Fall', year: 2019, courses: [] },
    { type: 'Spring', year: 2020, courses: [] },
    { type: 'Fall', year: 2020, courses: [] },
    { type: 'Spring', year: 2021, courses: [] },
    { type: 'Fall', year: 2021, courses: [] },
    { type: 'Spring', year: 2022, courses: [] },
  ];
  const actualSems = getActiveSemesters('Fall', 2019, 'Spring', 2022).reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('graduating semester early', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Fall', year: 2019, courses: [] },
    { type: 'Spring', year: 2020, courses: [] },
    { type: 'Fall', year: 2020, courses: [] },
    { type: 'Spring', year: 2021, courses: [] },
    { type: 'Fall', year: 2021, courses: [] },
    { type: 'Spring', year: 2022, courses: [] },
    { type: 'Fall', year: 2022, courses: [] },
  ];
  const actualSems = getActiveSemesters('Fall', 2019, 'Fall', 2022).reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('entered 1 semester late', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Spring', year: 2020, courses: [] },
    { type: 'Fall', year: 2020, courses: [] },
    { type: 'Spring', year: 2021, courses: [] },
    { type: 'Fall', year: 2021, courses: [] },
    { type: 'Spring', year: 2022, courses: [] },
    { type: 'Fall', year: 2022, courses: [] },
    { type: 'Spring', year: 2023, courses: [] },
  ];
  const actualSems = getActiveSemesters('Spring', 2020, 'Spring', 2023).reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('just entering for 1 yr', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Fall', year: 2019, courses: [] },
    { type: 'Spring', year: 2020, courses: [] },
  ];
  const actualSems = getActiveSemesters('Fall', 2019, 'Spring', 2020).reverse();
  expect(expectedSems).toEqual(actualSems);
});

it('entering for 1 yr in spring', () => {
  const expectedSems: FirestoreSemester[] = [
    { type: 'Spring', year: 2020, courses: [] },
    { type: 'Fall', year: 2020, courses: [] },
  ];
  const actualSems = getActiveSemesters('Spring', 2020, 'Fall', 2020).reverse();
  expect(expectedSems).toEqual(actualSems);
});
