import { reactive } from 'vue';
import { VueGtag } from 'vue-gtag-next';
import { GTagEvent } from '../../gtag';
import { checkNotNull } from '../../utilities';
import {
  getCourseWithSeasonAndYear,
  getCourse,
  extractSubjectAndNumber,
} from '../../global-firestore-data/courses';

import {
  cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation,
  firestoreSemesterCourseToBottomBarCourse,
  rosterIdentifierToSeasonAndYear,
  seasonAndYearToRosterIdentifier,
} from '../../user-data-converter';

export type BottomBarState = {
  bottomCourses: readonly AppBottomBarCourse[];
  bottomCourseFocus: number;
  isExpanded: boolean;
};

const vueForBottomBar = reactive({
  bottomCourses: [] as AppBottomBarCourse[],
  bottomCourseFocus: 0,
  isExpanded: false,
});

export const immutableBottomBarState: Readonly<BottomBarState> = vueForBottomBar;

export const reportCourseColorChange = (courseUniqueID: number, color: string): void => {
  vueForBottomBar.bottomCourses = vueForBottomBar.bottomCourses.map(course =>
    course.uniqueID === courseUniqueID ? { ...course, color } : course
  );
};

export const reportSubjectColorChange = (code: string, color: string): void => {
  vueForBottomBar.bottomCourses = vueForBottomBar.bottomCourses.map(course =>
    course.code.split(' ')[0] === code.split(' ')[0] ? { ...course, color } : course
  );
};

const getDetailedInformationForBottomBar = async (
  roster: string,
  subject: string,
  number: string
) => {
  const seasonAndYear = rosterIdentifierToSeasonAndYear(roster);
  const course = await getCourseWithSeasonAndYear(
    seasonAndYear.season,
    seasonAndYear.year,
    subject,
    number
  );
  return cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation(
    checkNotNull(course)
  );
};

const getReviews = (
  subject: string,
  number: string
): Promise<{
  classRating: number;
  classDifficulty: number;
  classWorkload: number;
}> =>
  fetch('https://www.cureviews.org/api/courses/get-by-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: subject.toLowerCase(), number }),
  }).then(
    res =>
      (res.ok && res.json().then(reviews => reviews.result)) || {
        classRating: null,
        classDifficulty: null,
        classWorkload: null,
      }
  );

export const addCourseToBottomBar = async (
  course: FirestoreSemesterCourse,
  season: string,
  year: number
): Promise<void> => {
  vueForBottomBar.isExpanded = true;

  for (let i = 0; i < vueForBottomBar.bottomCourses.length; i += 1) {
    const existingCourse = vueForBottomBar.bottomCourses[i];
    // Must check both uniqueID and code (e.g. CS 1110) to handle req courses that share uniqueID -1
    if (existingCourse.uniqueID === course.uniqueID && existingCourse.code === course.code) {
      vueForBottomBar.bottomCourseFocus = i;
      return;
    }
  }
  const courseSubjectAndNumber = extractSubjectAndNumber(course.code);
  const classRosterCourseData = await getCourse(
    seasonAndYearToRosterIdentifier(season as FirestoreSemesterSeason, year),
    courseSubjectAndNumber.subject,
    courseSubjectAndNumber.number
  );
  const seasonAndYear = rosterIdentifierToSeasonAndYear(classRosterCourseData.roster);

  vueForBottomBar.bottomCourses = [
    firestoreSemesterCourseToBottomBarCourse(course, seasonAndYear.season, seasonAndYear.year),
    ...vueForBottomBar.bottomCourses,
  ];

  vueForBottomBar.bottomCourseFocus = 0;

  const [subject, number] = course.code.split(' ');
  Promise.all([
    getReviews(subject, number).then(({ classRating, classDifficulty, classWorkload }) => {
      const bottomBarCourse = vueForBottomBar.bottomCourses.find(
        ({ uniqueID, code }) => uniqueID === course.uniqueID && code === course.code
      );
      if (bottomBarCourse) {
        bottomBarCourse.overallRating = classRating;
        bottomBarCourse.difficulty = classDifficulty;
        bottomBarCourse.workload = classWorkload;
      }
    }),
    getDetailedInformationForBottomBar(
      vueForBottomBar.bottomCourses[vueForBottomBar.bottomCourseFocus].currRoster,
      subject,
      number
    ).then(({ description, prereqs, enrollment, lectureTimes, instructors, distributions }) => {
      const bottomBarCourse = vueForBottomBar.bottomCourses.find(
        ({ uniqueID, code }) => uniqueID === course.uniqueID && code === course.code
      );
      if (bottomBarCourse) {
        Object.assign(bottomBarCourse, {
          description,
          prereqs,
          enrollment,
          lectureTimes,
          instructors,
          distributions,
        });
      }
    }),
  ]);
};

export const toggleBottomBar = (gtag?: VueGtag): void => {
  vueForBottomBar.isExpanded = !vueForBottomBar.isExpanded;
  if (vueForBottomBar.isExpanded) {
    GTagEvent(gtag, 'bottom-bar-open');
  } else {
    GTagEvent(gtag, 'bottom-bar-close');
  }
};

export const closeBottomBar = (gtag?: VueGtag): void => {
  vueForBottomBar.isExpanded = false;
  GTagEvent(gtag, 'bottom-bar-close');
};

export const changeBottomBarCourseFocus = (index: number): void => {
  vueForBottomBar.bottomCourseFocus = index;
};

export const deleteBottomBarCourse = (index: number, gtag?: VueGtag): void => {
  GTagEvent(gtag, 'bottom-bar-delete-tab');
  vueForBottomBar.bottomCourses = vueForBottomBar.bottomCourses.filter((_, i) => i !== index);
  if (vueForBottomBar.bottomCourseFocus >= vueForBottomBar.bottomCourses.length) {
    vueForBottomBar.bottomCourseFocus = vueForBottomBar.bottomCourses.length - 1;
  }
};

export const moveBottomBarCourseToFirst = (index: number): void => {
  vueForBottomBar.isExpanded = true;
  const courseToMove = vueForBottomBar.bottomCourses[index];
  vueForBottomBar.bottomCourses = [
    courseToMove,
    ...vueForBottomBar.bottomCourses.slice(0, index),
    ...vueForBottomBar.bottomCourses.slice(index + 1),
  ];
  vueForBottomBar.bottomCourseFocus = 0;
};
