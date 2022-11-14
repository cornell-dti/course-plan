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

export { setAppOnboardingData, deleteTransferCredit } from './user-onboarding-data';
export {
  editSemesters,
  editSemester,
  addSemester,
  deleteSemester,
  addCourseToSemester,
  deleteCourseFromSemester,
  deleteAllCoursesFromSemester,
  deleteCourseFromSemesters,
  populateSemesters,
} from './user-semesters';
export { default as chooseToggleableRequirementOption } from './user-toggleable-requirement-choices';
export {
  updateRequirementChoices,
  updateRequirementChoice,
  deleteCoursesFromRequirementChoices,
  deleteCourseFromRequirementChoices,
  addOptOut,
  addAcknowledgedCheckerWarningOptIn,
  addArbitraryOptIn,
  resolveConflicts,
} from './overridden-fulfillment-choices';

export { default as retrieveAnalytics } from './track-users';
