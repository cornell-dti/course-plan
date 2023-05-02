import { genTextContextMatrix } from 'pdf-to-excel';
import { writeFile } from 'fs/promises';
import { getValidCourses } from './parse';

const otherYesListURL =
  'https://apps.engineering.cornell.edu/liberalstudies/ApprovedLiberalStudies.pdf';

// Fetch the other yes list and parse the returned data into a `CourseWithId`
async function fetchOtherLiberalStudiesCourses() {
  const pdf = await genTextContextMatrix(otherYesListURL);
  return JSON.stringify(getValidCourses(pdf));
}

async function writeOtherLiberalStudiesCourses(path) {
  const courses = await fetchOtherLiberalStudiesCourses();
  await writeFile(`${path}otherYesCourses.json`, courses);
}

writeOtherLiberalStudiesCourses('../../src/assets/courses/');
