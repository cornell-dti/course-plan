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
  updateSawGiveaway,
} from './user-onboarding-data';
export {
  editPlans,
  editPlan,
  editSemesters,
  editSemester,
  addSemester,
  addPlan,
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
