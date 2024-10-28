/**
 * Put all functions that can use and change the firestore data here.
 */
import store from '../store';

import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '../user-data-converter';
import incrementUniqueID from './user-unique-incrementer';

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourse(course, store, incrementUniqueID);

export {
  setAppOnboardingData,
  deleteTransferCredit,
  updateSawNewFeature,
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
  deletePlan,
  deleteSemester,
  addCourseToSemester,
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
export { incrementUniqueID };

export { default as retrieveAnalytics } from './track-users';
