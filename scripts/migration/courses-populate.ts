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
import axios from 'axios';
import { coursesCollection } from '../firebase-config';

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
  const courses: readonly string[] = await fetch(
    `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}`
  )
    .then(res => res.json())
    .then(jsonRes => jsonRes.data.classes)
    .then(jsonCourses => jsonCourses.map(jsonCourse => jsonCourse.catalogNbr));
  return courses;
};

/* TODO */
const extractData = (jsonCourse: string) => jsonCourse;

const migrateCourses = async (roster: string, subject: string, courses: string[]) => {
  courses.forEach(course =>
    coursesCollection.doc(roster).collection(subject).doc(course).set({ course })
  );
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
  for (const subject of rosterSubjectPairs) {
    const semesterCourses = await retrieveAvailableCourses(subject.roster, subject.subject);
    await wait(50);
    subjectCount += 1;
    console.log(
      `There are ${semesterCourses.length} courses in ${subject.subject} in ${subject.roster}.`
    );
    console.log(`We fetched ${subjectCount} out of ${rosterSubjectPairs.length} subjects`);
  }
};
/*
['FA14', 'SP15]
[[{roster: 'FA14', {subject: 'MATH'}], [{roster: 'SP15', {subject: 'MATH'}, {roster: 'SP15', {subject: 'ECON'}]] 
  => [{roster: 'FA14', {subject: 'MATH'}, {roster: 'SP15', {subject: 'MATH'}, {roster: 'SP15', {subject: 'ECON'}]
*/
populate();
