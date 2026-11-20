import { fullCoursesArray, specificRosterCoursesArray } from '../typed-full-courses';

const codes = (roster: string) =>
  new Set(
    specificRosterCoursesArray(roster).map(({ subject, catalogNbr }) => `${subject} ${catalogNbr}`)
  );

it('only includes courses offered in a known roster', () => {
  const fa24 = codes('FA24');
  expect(fa24.has('CS 1110')).toBe(true);
  expect(fa24.has('CS 4210')).toBe(true);
  expect(fa24.has('CS 4410')).toBe(false);
  expect(codes('SP24').has('CS 4410')).toBe(true);
});

it('includes all courses for a roster CoursePlan does not have', () => {
  expect(specificRosterCoursesArray('FA30')).toBe(fullCoursesArray);
});
