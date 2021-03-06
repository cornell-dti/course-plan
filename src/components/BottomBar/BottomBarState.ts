import Vue from 'vue';

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
  fetch(`https://www.cureviews.org/classInfo/${subject}/${number}/CY0LG2ukc2EOBRcoRbQy`).then(res =>
    res.json().then(reviews => reviews[0])
  );

export const addCourseToBottomBar = (course: FirestoreSemesterCourse): void => {
  for (let i = 0; i < vueForBottomBar.bottomCourses.length; i += 1) {
    const existingCourse = vueForBottomBar.bottomCourses[i];
    if (existingCourse.uniqueID === course.uniqueID) {
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

export const toggleBottomBar = (): void => {
  vueForBottomBar.isExpanded = !vueForBottomBar.isExpanded;
};

export const closeBottomBar = (): void => {
  vueForBottomBar.isExpanded = false;
};

export const changeBottomBarCourseFocus = (index: number): void => {
  vueForBottomBar.bottomCourseFocus = index;
};

export const deleteBottomBarCourse = (index: number): void => {
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
