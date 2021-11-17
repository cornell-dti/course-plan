import { overriddenFulfillmentChoicesCollection } from '../firebase-frontend-config';
import store from '../store';

export const updateRequirementChoice = (
  courseUniqueID: string | number,
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): void => {
  overriddenFulfillmentChoicesCollection.doc(store.state.currentFirebaseUser.email).set({
    ...store.state.overriddenFulfillmentChoices,
    [courseUniqueID]: choiceUpdater(
      store.state.overriddenFulfillmentChoices[courseUniqueID] || {
        arbitraryOptIn: {},
        acknowledgedCheckerWarningOptIn: [],
        optOut: [],
      }
    ),
  });
};

export const updateRequirementChoices = (
  updater: (
    oldChoices: FirestoreOverriddenFulfillmentChoices
  ) => FirestoreOverriddenFulfillmentChoices
): void => {
  overriddenFulfillmentChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(updater(store.state.overriddenFulfillmentChoices));
};

export const deleteCourseFromRequirementChoices = (courseUniqueID: string | number): void =>
  deleteCoursesFromRequirementChoices([courseUniqueID]);

export const deleteCoursesFromRequirementChoices = (
  courseUniqueIds: readonly (string | number)[]
): void => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  overriddenFulfillmentChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(
      Object.fromEntries(
        Object.entries(store.state.overriddenFulfillmentChoices).filter(
          ([k]) => !courseUniqueIdStrings.has(k)
        )
      )
    );
};
