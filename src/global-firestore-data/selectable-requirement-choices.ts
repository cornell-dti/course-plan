import { selectableRequirementChoicesCollection } from '../firebase-frontend-config';
import store from '../store';

const chooseSelectableRequirementOption = (
  selectableRequirementChoices: AppSelectableRequirementChoices
): void => {
  selectableRequirementChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(selectableRequirementChoices);
};

export const addCourseToSelectableRequirements = (
  courseUniqueID: string | number,
  requirementID: string | undefined
): void => {
  console.log('ADD');
  if (!requirementID) return;
  console.log('RETURN');
  chooseSelectableRequirementOption({
    ...store.state.selectableRequirementChoices,
    [courseUniqueID]: requirementID,
  });
};

export const deleteCourseFromSelectableRequirements = (courseUniqueID: string | number): void => {
  deleteCoursesFromSelectableRequirements([courseUniqueID]);
};

export const deleteCoursesFromSelectableRequirements = (
  courseUniqueIds: (string | number)[]
): void => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  chooseSelectableRequirementOption(
    Object.assign(
      {},
      ...Object.entries(store.state.selectableRequirementChoices)
        .filter(([k]) => !courseUniqueIdStrings.has(k))
        .map(([k, v]) => ({ [k]: v }))
    )
  );
};
