/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

/**
 * This script retrieves data from all courses from a desired
 * class roster (latest roster by default) and pushes them to the
 * 'courses' collection in Firebase.
 *
 * This script also creates a mapping from courses to the rosters
 * that the course is available in.
 *
 *
 * This script also creates a mapping from crseId to its
 * catalogNbr.
 *
 *  Motivation for this script as well as the schema
 * for the 'courses' collection can be found here:
 * https://tinyurl.com/5n86j4p7
 */
import fetch from 'node-fetch';
import { FieldValue } from 'firebase-admin/firestore';
import {
  coursesCollection,
  availableRostersForCourseCollection,
  crseIdToCatalogNbrCollection,
} from '../firebase-config';
import { Course, CourseFullDetail } from '../../src/requirements/types';

/** A helper function to generate a wait promise. Used for cooldown to limit API usage. */
const wait = (time: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  });

const classRosterURL = 'https://classes.cornell.edu/api/2.0';

/* Retrieves the desired roster (e.g 'FA21'), returns the latest roster by default */
const retrieveRoster = async (roster?: string) => {
  if (roster) return [roster];
  const res = await fetch(`${classRosterURL}/config/rosters.json`);
  return [(await res.json()).data.rosters.map(jsonRoster => jsonRoster.slug).at(-1)];
};

/* Retrieves the subjects across for a roster and creates a list of {roster: string, subject: string} objects */
const retrieveAvailableSubjects = async (
  roster: string
): Promise<readonly { roster: string; subject: string }[]> => {
  const res = await fetch(
    `https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${roster}`
  );
  return (await res.json()).data.subjects.map(({ value }) => ({ roster, subject: value }));
};

/* Retrieves and formats available courses for a {roster: string, subject: string} object */

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
}: Course): Course => ({
  subject: cleanField(subject) || '',
  crseId,
  catalogNbr: cleanField(catalogNbr) || '',
  titleLong: cleanField(titleLong) || '',
  enrollGroups: enrollGroups.map(({ unitsMaximum, unitsMinimum }) => ({
    unitsMaximum,
    unitsMinimum,
  })),
  catalogWhenOffered: cleanField(catalogWhenOffered),
  catalogBreadth: cleanField(catalogBreadth),
  catalogDistr: cleanField(catalogDistr),
  catalogComments: cleanField(catalogComments),
  catalogSatisfiesReq: cleanField(catalogSatisfiesReq),
  catalogCourseSubfield: cleanField(catalogCourseSubfield),
  catalogAttribute: cleanField(catalogAttribute),
  acadCareer: cleanField(acadCareer) || '',
  acadGroup: cleanField(acadGroup) || '',
});

const retrieveAvailableCourses = async (
  roster: string,
  subject: string
): Promise<CourseFullDetail[]> => {
  const res = await fetch(
    `${classRosterURL}/search/classes.json?roster=${roster}&subject=${subject}`
  );
  return (await res.json()).data.classes.map(jsonCourse => courseFieldFilter(jsonCourse));
};

/* 
  Populates firebase with the retrieved course data, and meta data structures for future migration. 

  availableRosterForCoursesCollection - contains a mapping from each course to a list of rosters that it is available in
  crseToCatalogNbrCollection - contains a mapping from each course's crseId to its catalogNbr (which is a subject + code)
  coursesCollection - contains all courses ever offered by the class roster API from FA14 - present. 
*/
const populateCourses = (roster: string, subject: string, courses: CourseFullDetail[]) =>
  Promise.all(
    courses.map(async course => {
      /* Computing a mapping that maps a course to a list of semesters it is offered in */
      const courseAndRostersDoc = await availableRostersForCourseCollection
        .doc(`${subject} ${course.catalogNbr.toString()}`)
        .get();
      if (courseAndRostersDoc.exists) {
        await availableRostersForCourseCollection
          .doc(`${subject} ${course.catalogNbr.toString()}`)
          .update({ rosters: FieldValue.arrayUnion(roster) });
      } else {
        await availableRostersForCourseCollection
          .doc(`${subject} ${course.catalogNbr.toString()}`)
          .set({ rosters: [roster] });
      }
      /* Mapping that maps from a course's crseId to their course code */
      await crseIdToCatalogNbrCollection
        .doc(course.crseId.toString())
        .set({ catalogNbr: `${subject} ${course.catalogNbr}` });
      /* Writing each course to the 'courses' collection */
      await coursesCollection
        .doc(roster)
        .collection(subject)
        .doc(course.catalogNbr)
        .set({ course });
    })
  );

/* 
  A promise pipeline that maps a list of rosters to a list of courses using 
  above functions which are then populated in firebase.

  Also logs live status of script during execution.
*/
const populate = async (roster?: string) => {
  const rosterSubjectPairs = await retrieveRoster(roster)
    .then(rosters => rosters.map(retrievedRoster => retrieveAvailableSubjects(retrievedRoster)))
    .then(subjectsPromise => Promise.all(subjectsPromise))
    .then(subjects => subjects.flat());

  let subjectCount = 0;
  let coursesCount = 0;
  for (const subject of rosterSubjectPairs) {
    const subjectCourses = await retrieveAvailableCourses(subject.roster, subject.subject);
    populateCourses(subject.roster, subject.subject, subjectCourses);
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

/* Enter the desired roster as a string argument (e.g 'FA21'). Fetches latest roster data by default */
populate();
