/**
 * Put all functions that can use and change the firestore data here.
 */
import store from '@/store';

import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';
import { SeasonsEnum, incrementUniqueID } from './utils';
import setOnboardingData from './onboarding-data';
import {
  editSemester,
  addSemester,
  deleteSemester,
  addCourseToSemester,
  deleteCourseFromSemester,
  deleteCourseFromSemesters,
} from './semesters';
import chooseToggleableRequirementOption from './toggleable-requirement-choices';
import {
  addCourseToSelectableRequirements,
  deleteCourseFromSelectableRequirements,
} from './selectable-requirement-choices';
import {
  addOverridenRequirementAPIB,
  clearOverridenRequirementsAPIB,
} from './overridden-fulfillment-choices';

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourse(course, store, incrementUniqueID);

export { SeasonsEnum, incrementUniqueID };
export { setOnboardingData };
export {
  editSemester,
  addSemester,
  deleteSemester,
  addCourseToSemester,
  deleteCourseFromSemester,
  deleteCourseFromSemesters,
};
export { chooseToggleableRequirementOption };
export { addCourseToSelectableRequirements, deleteCourseFromSelectableRequirements };
export { addOverridenRequirementAPIB, clearOverridenRequirementsAPIB };
