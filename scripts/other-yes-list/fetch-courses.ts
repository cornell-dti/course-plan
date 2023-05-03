import { genTextContextMatrix } from 'pdf-to-excel';
import { writeFile } from 'fs/promises';
import { getValidCourses } from './parse';

const otherYesListURL =
  'https://apps.engineering.cornell.edu/liberalstudies/ApprovedLiberalStudies.pdf';

// Fetch the other yes list and parse the returned data into a `CourseWithId`
<<<<<<< HEAD
export async function fetchOtherLiberalStudiesCoursesJSON() {
=======
async function fetchOtherLiberalStudiesCourses() {
>>>>>>> 5f0a73a6efe1643dc1a127033c14f18adaf506f9
  const pdf = await genTextContextMatrix(otherYesListURL);
  return JSON.stringify(getValidCourses(pdf));
}

<<<<<<< HEAD
export async function fetchOtherLiberalStudiesCourses() {
  const pdf = await genTextContextMatrix(otherYesListURL);
  return getValidCourses(pdf);
}

export async function writeOtherLiberalStudiesCourses(path) {
  const courses = await fetchOtherLiberalStudiesCoursesJSON();
  await writeFile(`${path}otherYesCourses.json`, courses);
}

writeOtherLiberalStudiesCourses('./scripts/other-yes-list/');
=======
async function writeOtherLiberalStudiesCourses(path) {
  const courses = await fetchOtherLiberalStudiesCourses();
  await writeFile(`${path}otherYesCourses.json`, courses);
}

writeOtherLiberalStudiesCourses('../../src/assets/courses/');
>>>>>>> 5f0a73a6efe1643dc1a127033c14f18adaf506f9
