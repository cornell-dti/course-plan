import { doc, setDoc } from 'firebase/firestore';

import { overriddenFulfillmentChoicesCollection } from '../firebase-frontend-config';
import store from '../store';

export const updateRequirementChoice = (
  courseUniqueID: string | number,
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): void => {
  setDoc(doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email), {
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

export const toggleRequirementChoice = (
  courseUniqueID: string | number,
  requirementID: string,
  relevantRequirementChoiceType: keyof FirestoreCourseOptInOptOutChoices
): void =>
  updateRequirementChoice(courseUniqueID, choice => {
    switch (relevantRequirementChoiceType) {
      case 'optOut':
      case 'acknowledgedCheckerWarningOptIn': {
        const oldList = choice[relevantRequirementChoiceType];
        return {
          ...choice,
          [relevantRequirementChoiceType]: oldList.includes(requirementID)
            ? oldList.filter(it => it !== requirementID)
            : [...oldList, requirementID],
        };
      }
      default:
        return choice;
    }
  });

export const updateRequirementChoices = (
  updater: (
    oldChoices: FirestoreOverriddenFulfillmentChoices
  ) => FirestoreOverriddenFulfillmentChoices
): void => {
  setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    updater(store.state.overriddenFulfillmentChoices)
  );
};

export const deleteCourseFromRequirementChoices = (courseUniqueID: string | number): void =>
  deleteCoursesFromRequirementChoices([courseUniqueID]);

export const deleteCoursesFromRequirementChoices = (
  courseUniqueIds: readonly (string | number)[]
): void => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    Object.fromEntries(
      Object.entries(store.state.overriddenFulfillmentChoices).filter(
        ([uniqueId]) => !courseUniqueIdStrings.has(uniqueId)
      )
    )
  );
};
