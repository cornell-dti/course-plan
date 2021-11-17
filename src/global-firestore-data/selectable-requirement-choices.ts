import { getCourseCodesArray } from '../requirements/requirement-frontend-computation';
import { getFirestoreCourseOptInOptOutChoicesBuilder } from '../requirements/requirement-graph-builder-from-user-data';
import {
  db,
  selectableRequirementChoicesCollection,
  overriddenFulfillmentChoicesCollection,
} from '../firebase-frontend-config';
import store from '../store';

const chooseSelectableRequirementOption = (
  selectableRequirementChoices: AppSelectableRequirementChoices
): void => {
  const courses = getCourseCodesArray(store.state.semesters, store.state.onboardingData);
  const newFormatChoicesBuilder = getFirestoreCourseOptInOptOutChoicesBuilder(
    courses,
    store.state.onboardingData,
    store.state.toggleableRequirementChoices,
    selectableRequirementChoices,
    /* deprecated AppOverriddenFulfillmentChoices */ {}
  );
  const overriddenFulfillmentChoices = Object.fromEntries(
    courses.map(course => [course.uniqueId, newFormatChoicesBuilder(course)])
  );

  const batch = db.batch();
  batch.set(
    selectableRequirementChoicesCollection.doc(store.state.currentFirebaseUser.email),
    selectableRequirementChoices
  );
  batch.set(
    overriddenFulfillmentChoicesCollection.doc(store.state.currentFirebaseUser.email),
    overriddenFulfillmentChoices
  );
  batch.commit();
};

export const addCourseToSelectableRequirements = (
  courseUniqueID: string | number,
  requirementID: string | undefined
): void => {
  // Even when there is no change, we set the old data anyways,
  // so it can trigger a save of user choice in new format.
  chooseSelectableRequirementOption(
    requirementID
      ? {
          ...store.state.selectableRequirementChoices,
          [courseUniqueID]: requirementID,
        }
      : store.state.selectableRequirementChoices
  );
};

export const addCoursesToSelectableRequirements = (
  newChoices: Readonly<Record<string, string>>
): void => {
  // Even when there is no change, we set the old data anyways,
  // so it can trigger a save of user choice in new format.
  chooseSelectableRequirementOption({
    ...store.state.selectableRequirementChoices,
    ...newChoices,
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
