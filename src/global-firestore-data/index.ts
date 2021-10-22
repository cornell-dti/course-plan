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
export { default as setOnboardingData } from './onboarding-data';
export {
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
  addCourseToSelectableRequirements,
  deleteCourseFromSelectableRequirements,
} from './selectable-requirement-choices';
export {
  addOverriddenFulfillmentAPIB,
  clearOverriddenFulfillmentsAPIB,
} from './overridden-fulfillment-choices';
