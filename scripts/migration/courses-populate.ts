/* eslint-disable no-await-in-loop */
/**
 * This script retrieves data from all courses from all available
 * class rosters and pushes them to the 'courses' collection in
 * Firebase.
 *
 *  Motivation for this script as well as the schema
 * for the 'courses' collection can be found here:
 * https://tinyurl.com/5n86j4p7
 */

/**
 * Initalization:
 * - Retrieve list of all available rosters
 *    - https://classes.cornell.edu/api/2.0/config/rosters.json
 * - Extract semester codes
 *    - response.data.map((roster) -> roster.slug)
 *
 * Subject Retrieval per Semester:
 * - Retrieve list of available subjects in a roster
 *    - https://classes.cornell.edu/api/2.0/config/subjects.json?roster=<SEM_CODE>
 * - Extract subject codes
 *    - response.data.subjects.map((subject) -> subject.value)
 *
 * Courses Retrieval per Subject:
 * - Retrieve list of available courses from each subject
 *    - https://classes.cornell.edu/api/2.0/search/classes.json?roster=<SEM_CODE>&subject=<SUB_ID>
 * - Extract relevant course data
 *    - response.data.classes.map((course) -> extractData(course))
 *    - Design and implement extractData function
 *
 * Core Logic:
 * - For semester in semesters:
 *       //create firestore document in 'courses' collection
 *       For subject in semester:
 *            //create firestore collection for 'subject' in 'semester' document
 *            subject_courses := available courses for a subject
 *            For course in subject_courses:
 *                //create firestore document for 'course' in 'subject'
 */
import fetch from 'node-fetch';
import { coursesCollection } from '../firebase-config';
import { CourseFullDetail } from '../../src/requirements/types';

/** A helper function to generate a wait promise. Used for cooldown to limit API usage. */
const wait = (time: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  });

const retrieveAvailableRosters = async () => {
  const rosters: readonly string[] = await fetch(
    'https://classes.cornell.edu/api/2.0/config/rosters.json'
  )
    .then(res => res.json())
    .then(jsonRes => jsonRes.data.rosters)
    .then(jsonRosters => jsonRosters.map(jsonRoster => jsonRoster.slug));

  return rosters;
};

const retrieveAvailableSubjects = async (roster: string) => {
  const subjects: readonly { roster: string; subject: string }[] = await fetch(
    `https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${roster}`
  )
    .then(res => res.json())
    .then(jsonRes => jsonRes.data.subjects)
    .then(jsonSubjects =>
      jsonSubjects.map(jsonSubject => ({ roster, subject: jsonSubject.value }))
    );
  return subjects;
};

const retrieveAvailableCourses = async (roster: string, subject: string) => {
  const courses: CourseFullDetail[] = await fetch(
    `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}`
  )
    .then(res => res.json())
    .then(jsonRes => jsonRes.data.classes)
    .then(jsonCourses => jsonCourses.map(jsonCourse => courseFieldFilter(jsonCourse)));
  return courses;
};

/* TODO */
// const extractData = (jsonCourse: string) => jsonCourse;

const cleanField = (value: string | null | undefined) =>
  value?.replace(/\u00a0/g, ' ') || undefined;

const courseFieldFilter = ({
  subject,
  crseId,
  catalogNbr,
  titleLong,
  enrollGroups,
  catalogWhenOffered,
  catalogBreadth,
  catalogDistr,
  catalogComments,
  catalogSatisfiesReq,
  catalogCourseSubfield,
  catalogAttribute,
  acadCareer,
  acadGroup,
  description,
  catalogPrereqCoreq,
}: CourseFullDetail): CourseFullDetail => ({
  subject: cleanField(subject) || '',
  crseId,
  catalogNbr: cleanField(catalogNbr) || '',
  titleLong: cleanField(titleLong) || '',
  enrollGroups,
  catalogWhenOffered: cleanField(catalogWhenOffered),
  catalogBreadth: cleanField(catalogBreadth),
  catalogDistr: cleanField(catalogDistr),
  catalogComments: cleanField(catalogComments),
  catalogSatisfiesReq: cleanField(catalogSatisfiesReq),
  catalogCourseSubfield: cleanField(catalogCourseSubfield),
  catalogAttribute: cleanField(catalogAttribute),
  acadCareer: cleanField(acadCareer) || '',
  acadGroup: cleanField(acadGroup) || '',
  description: cleanField(description) || '',
  catalogPrereqCoreq: cleanField(catalogPrereqCoreq) || '',
});

const migrateCourses = async (roster: string, subject: string, courses: CourseFullDetail[]) => {
  courses.forEach(async course => {
    await coursesCollection.doc(roster).collection(subject).doc(course.catalogNbr).set({ course });
  });
};

const populate = async () => {
  // retrieveAvailableRosters()
  //   .then(rosters => rosters.map(roster => retrieveAvailableSubjects(roster)))
  //   .then(subjectsPromise => Promise.all(subjectsPromise))
  //   .then(subjects => subjects.flat())
  //   .then(subjects =>
  //     subjects.map(subject => retrieveAvailableCourses(subject.roster, subject.subject))
  //   )
  //   .then(coursesPromise => Promise.all(coursesPromise))
  //   .then(courses => courses.flat());

  const rosterSubjectPairs = await retrieveAvailableRosters()
    .then(rosters => rosters.map(roster => retrieveAvailableSubjects(roster)))
    .then(subjectsPromise => Promise.all(subjectsPromise))
    .then(subjects => subjects.flat());

  let subjectCount = 0;
  let coursesCount = 0;
  for (const subject of rosterSubjectPairs) {
    const subjectCourses = await retrieveAvailableCourses(subject.roster, subject.subject);
    migrateCourses(subject.roster, subject.subject, subjectCourses);
    await wait(50);
    coursesCount += subjectCourses.length;
    subjectCount += 1;
    console.log(
      `There are ${subjectCourses.length} courses in ${subject.subject} in ${subject.roster}.`
    );
    console.log(`We fetched ${subjectCount} out of ${rosterSubjectPairs.length} subjects`);
  }

  console.log(`There are ${coursesCount} total courses.`);
};
/*
['FA14', 'SP15]
[[{roster: 'FA14', {subject: 'MATH'}], [{roster: 'SP15', {subject: 'MATH'}, {roster: 'SP15', {subject: 'ECON'}]] 
  => [{roster: 'FA14', {subject: 'MATH'}, {roster: 'SP15', {subject: 'MATH'}, {roster: 'SP15', {subject: 'ECON'}]
*/
populate();
