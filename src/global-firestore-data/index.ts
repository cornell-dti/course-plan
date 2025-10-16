/**
 * Put all functions that can use and change the firestore data here.
 */
import store from '../store';

import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '../user-data-converter';
import { incrementUniqueID, incrementBlankCourseCrseID } from './user-unique-incrementer';

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourse(course, store, incrementUniqueID);

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
export { incrementUniqueID, incrementBlankCourseCrseID };

export { default as retrieveAnalytics } from './track-users';
