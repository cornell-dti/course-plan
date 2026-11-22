import { reactive } from 'vue';
import { VueGtag } from 'vue-gtag-next';
import { GTagEvent } from '../../gtag';
import { loadCourseDetails, loadCourseReviews } from '../../course-information';
import { extractSubjectAndNumber } from '../../global-firestore-data/courses';

import {
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

export const addCourseToBottomBar = async (
  course: FirestoreSemesterCourse,
  season: string,
  year: number
): Promise<void> => {
  if (course.type !== 'CornellCourse') return; // Only add Cornell courses to the bottom bar
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
  const { roster, information } = await loadCourseDetails(
    seasonAndYearToRosterIdentifier(season as FirestoreSemesterSeason, year),
    courseSubjectAndNumber.subject,
    courseSubjectAndNumber.number
  );
  const seasonAndYear = rosterIdentifierToSeasonAndYear(roster);

  vueForBottomBar.bottomCourses = [
    {
      ...firestoreSemesterCourseToBottomBarCourse(course, seasonAndYear.season, seasonAndYear.year),
      ...information,
    },
    ...vueForBottomBar.bottomCourses,
  ];
  vueForBottomBar.bottomCourseFocus = 0;

  loadCourseReviews(courseSubjectAndNumber.subject, courseSubjectAndNumber.number)
    .then(reviews => {
      const bottomBarCourse = vueForBottomBar.bottomCourses.find(
        ({ uniqueID, code }) => uniqueID === course.uniqueID && code === course.code
      );
      if (bottomBarCourse) Object.assign(bottomBarCourse, reviews);
    })
    // Keep the existing N/A presentation when the reviews service is unavailable.
    .catch(() => undefined);
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
