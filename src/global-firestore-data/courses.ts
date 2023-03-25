import { doc, getDoc } from 'firebase/firestore';
import {
  coursesCollection,
  availableRostersForCoursesCollection,
  crseIdToCatalogNbrCollection,
} from '../firebase-config';

/**
 * This function uses the subject and number of a course to retrieve the course information from 'courses' collection
 * @param season The season that the course is under in the user's semester view
 * @param year The year the course is under in the user's semester view
 * @param subject The subject of the course
 * @param number The number of the course
 * @returns `Promise<CornellCourseRosterCourseFullDetail>`
 */
export const getCourseWithSeasonAndYear = async (
  season: FirestoreSemesterSeason,
  year: number,
  subject: string,
  number: string
): Promise<CornellCourseRosterCourseFullDetail> => {
  const roster = seasonAndYearToRosterIdentifier(season, year);
  const course = await getDoc(doc(coursesCollection, `${roster}/${subject}/${number}`));
  if (!course.exists()) {
    const availableRostersForCourse = (
      await getDoc(doc(availableRostersForCoursesCollection, `${subject} ${number}`))
    ).data() as { rosters: string[] };
    const lastRoster = availableRostersForCourse.rosters.length - 1;
    const latestCourse = await getDoc(
      doc(
        coursesCollection,
        `${availableRostersForCourse.rosters[lastRoster]}/${subject}/${number}`
      )
    );
    return latestCourse.data()?.course as CornellCourseRosterCourseFullDetail;
  }
  return course.data()?.course as CornellCourseRosterCourseFullDetail;
};

/**
 * This function uses the crseId and desired roster of a course to retrieve the course information from 'courses' collection
 * @param roster The roster from which we want to fetch the course
 * @param crseId  The course id of the course
 * @returns `Promise<CornellCourseRosterCourseFullDetail>`
 */
export const getCourseWithCrseIdAndRoster = async (
  roster: string,
  crseId: number
): Promise<CornellCourseRosterCourseFullDetail> => {
  // use crseId to retrieve course subject and code
  const courseSubjectAndNumber = await getDoc(doc(crseIdToCatalogNbrCollection, `${crseId}`));
  const subject = courseSubjectAndNumber.data()?.split(' ')[0];
  const number = courseSubjectAndNumber.data()?.split(' ')[1];

  const course = await getDoc(doc(coursesCollection, `${roster}/${subject}/${number}`));
  if (!course.exists()) {
    const availableRostersForCourse = (
      await getDoc(doc(availableRostersForCoursesCollection, `${subject} ${number}`))
    ).data() as { rosters: string[] };
    const lastRoster = availableRostersForCourse.rosters.length - 1;
    const latestCourse = await getDoc(
      doc(
        coursesCollection,
        `${availableRostersForCourse.rosters[lastRoster]}/${subject}/${number}`
      )
    );
    return latestCourse.data()?.course as CornellCourseRosterCourseFullDetail;
  }
  return course.data()?.course as CornellCourseRosterCourseFullDetail;
};
/**
 * This function transforms semester and year to a roster ID. EX: Spring 2023 -> SP23
 * */
const seasonAndYearToRosterIdentifier = (season: string, year: number): string => {
  const seasonToSemesterMap = new Map([
    ['Fall', 'FA'],
    ['Spring', 'SP'],
    ['Winter', 'WI'],
    ['Summer', 'SU'],
  ]);

  return `${seasonToSemesterMap.get(season)}${year - 2000}`;
};
