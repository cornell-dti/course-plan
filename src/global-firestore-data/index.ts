/**
 * Put all functions that can use and change the firestore data here.
 */
import store from '../store';

import {
  cornellCourseRosterCourseToFirebaseSemesterCourse,
  cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor,
} from '../user-data-converter';
import {
  incrementUniqueID,
  incrementUniqueIDBy,
  incrementBlankCourseCrseID,
} from './user-unique-incrementer';

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourse(course, store, incrementUniqueID);

export const cornellCourseRosterCoursesWithSchedulesToFirebaseSemesterCoursesWithGlobalData = (
  entries: readonly {
    readonly course: CornellCourseRosterCourse;
    readonly schedule: FirestoreCourseSchedule;
  }[]
): readonly FirestoreSemesterCourse[] => {
  const ids = incrementUniqueIDBy(entries.length);
  return entries.map(({ course, schedule }, index) => ({
    ...cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
      course,
      ids[index],
      store.state.subjectColors[course.subject] || '32A0F2'
    ),
    schedule,
  }));
};

export {
  setAppOnboardingData,
  deleteTransferCredit,
  updateSawNewFeature,
  updateSawGiveaway,
  updateFA25Giveaway,
} from './user-onboarding-data';
export {
  editCollections,
  editCollection,
  editDefaultCollection,
  editPlans,
  editPlan,
  editSemesters,
  editSemester,
  addCollection,
  addCourseToCollections,
  addSemester,
  addPlan,
  deleteCollection,
  deleteCourseFromCollection,
  deleteCourseFromAllCollections,
  deletePlan,
  deleteSemester,
  addCourseToSemester,
  addCoursesToSemester,
  deleteCourseFromSemester,
  deleteAllCoursesFromSemester,
  deleteCourseFromSemesters,
  populateSemesters,
} from './user-semesters';
export { default as chooseToggleableRequirementOption } from './user-toggleable-requirement-choices';
export {
  updateRequirementChoice,
  toggleRequirementChoice,
  updateRequirementChoices,
  deleteCourseFromRequirementChoices,
} from './user-overridden-fulfillment-choices';
export { incrementUniqueID, incrementUniqueIDBy, incrementBlankCourseCrseID };

export { default as retrieveAnalytics } from './track-users';
