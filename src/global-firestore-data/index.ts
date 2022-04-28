/**
 * Put all functions that can use and change the firestore data here.
 */
import store from '../store';

import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '../user-data-converter';
import { incrementUniqueID } from './utils';

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourse(course, store, incrementUniqueID);

export { incrementUniqueID };
export { setAppOnboardingData, deleteTransferCredit } from './onboarding-data';
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
} from './semesters';
export { default as chooseToggleableRequirementOption } from './toggleable-requirement-choices';
export {
  updateRequirementChoices,
  updateRequirementChoice,
  deleteCoursesFromRequirementChoices,
  deleteCourseFromRequirementChoices,
  optInRequirementChoices,
  optOutRequirementChoices,
} from './override-fulfillment-choices';

export { default as retrieveAnalytics } from './analytics';
