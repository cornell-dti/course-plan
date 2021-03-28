import Vue from 'vue';
import { GTag, GTagEvent } from '../../gtag';
import { checkNotNull } from '../../utilities';

import {
  cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation,
  firestoreSemesterCourseToBottomBarCourse,
} from '../../user-data-converter';

export type BottomBarState = {
  bottomCourses: readonly AppBottomBarCourse[];
  bottomCourseFocus: number;
  isExpanded: boolean;
};

const vueForBottomBar: BottomBarState & Vue = new Vue({
  data: {
    bottomCourses: [] as AppBottomBarCourse[],
    bottomCourseFocus: 0,
    isExpanded: false,
  },
});

export const immutableBottomBarState: Readonly<BottomBarState> = vueForBottomBar;

export const reportCourseColorChange = (courseUniqueID: number, color: string): void => {
  vueForBottomBar.bottomCourses = vueForBottomBar.bottomCourses.map(course =>
    course.uniqueID === courseUniqueID ? { ...course, color } : course
  );
};

const getDetailedInformationForBottomBar = async (
  roster: string,
  subject: string,
  number: string
) => {
  const courses: readonly CornellCourseRosterCourseFullDetail[] = (
    await fetch(
      `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}`
    ).then(response => response.json())
  ).data.classes;
  return cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation(
    checkNotNull(courses.find(it => it.catalogNbr === number))
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
  fetch('https://www.cureviews.org/v2/getCourseByInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: subject.toLowerCase(), number }),
  }).then(res => res.json().then(reviews => reviews.result));

export const addCourseToBottomBar = (course: FirestoreSemesterCourse): void => {
  for (let i = 0; i < vueForBottomBar.bottomCourses.length; i += 1) {
    const existingCourse = vueForBottomBar.bottomCourses[i];
    // Must check both uniqueID and code (e.g. CS 1110) to handle req courses that share uniqueID -1
    if (existingCourse.uniqueID === course.uniqueID && existingCourse.code === course.code) {
      vueForBottomBar.bottomCourseFocus = i;
      return;
    }
  }

  if (vueForBottomBar.bottomCourses.length === 0) {
    vueForBottomBar.isExpanded = true;
  }

  const bottomBarCourse = firestoreSemesterCourseToBottomBarCourse(course);
  const [subject, number] = bottomBarCourse.code.split(' ');
  getReviews(subject, number).then(({ classRating, classDifficulty, classWorkload }) => {
    bottomBarCourse.overallRating = classRating;
    bottomBarCourse.difficulty = classDifficulty;
    bottomBarCourse.workload = classWorkload;
  });
  getDetailedInformationForBottomBar(course.lastRoster, subject, number).then(
    ({ description, prereqs, enrollment, lectureTimes, instructors, distributions }) => {
      bottomBarCourse.description = description;
      bottomBarCourse.prereqs = prereqs;
      bottomBarCourse.enrollment = enrollment;
      bottomBarCourse.lectureTimes = lectureTimes;
      bottomBarCourse.instructors = instructors;
      bottomBarCourse.distributions = distributions;
    }
  );

  vueForBottomBar.bottomCourses = [bottomBarCourse, ...vueForBottomBar.bottomCourses];
  vueForBottomBar.bottomCourseFocus = 0;
};

export const toggleBottomBar = (gtag?: GTag): void => {
  vueForBottomBar.isExpanded = !vueForBottomBar.isExpanded;
  if (vueForBottomBar.isExpanded) {
    GTagEvent(gtag, 'bottom-bar-open');
  } else {
    GTagEvent(gtag, 'bottom-bar-close');
  }
};

export const closeBottomBar = (gtag?: GTag): void => {
  vueForBottomBar.isExpanded = false;
  GTagEvent(gtag, 'bottom-bar-close');
};

export const changeBottomBarCourseFocus = (index: number): void => {
  vueForBottomBar.bottomCourseFocus = index;
};

export const deleteBottomBarCourse = (index: number, gtag?: GTag): void => {
  GTagEvent(gtag, 'bottom-bar-delete-tab');
  vueForBottomBar.bottomCourses = vueForBottomBar.bottomCourses.filter((_, i) => i !== index);
  if (vueForBottomBar.bottomCourseFocus >= vueForBottomBar.bottomCourses.length) {
    vueForBottomBar.bottomCourseFocus = vueForBottomBar.bottomCourses.length - 1;
  }
};

export const moveBottomBarCourseToFirst = (index: number): void => {
  const courseToMove = vueForBottomBar.bottomCourses[index];
  vueForBottomBar.bottomCourses = [
    courseToMove,
    ...vueForBottomBar.bottomCourses.slice(0, index),
    ...vueForBottomBar.bottomCourses.slice(index + 1),
  ];
  vueForBottomBar.bottomCourseFocus = 0;
};
