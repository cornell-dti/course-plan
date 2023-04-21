import { doc, setDoc } from 'firebase/firestore';

import { overriddenFulfillmentChoicesCollection } from '../firebase-config';
import store from '../store';

export const updateRequirementChoice = async (
  courseUniqueID: string | number,
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): Promise<void> => {
  await setDoc(doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email), {
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
): Promise<void> =>
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

export const updateRequirementChoices = async (
  updater: (
    oldChoices: FirestoreOverriddenFulfillmentChoices
  ) => FirestoreOverriddenFulfillmentChoices
): Promise<void> => {
  await setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    updater(store.state.overriddenFulfillmentChoices)
  );
};

export const deleteCourseFromRequirementChoices = (
  courseUniqueID: string | number
): Promise<void> => deleteCoursesFromRequirementChoices([courseUniqueID]);

export const deleteCoursesFromRequirementChoices = async (
  courseUniqueIds: readonly (string | number)[]
): Promise<void> => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  await setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    Object.fromEntries(
      Object.entries(store.state.overriddenFulfillmentChoices).filter(
        ([uniqueId]) => !courseUniqueIdStrings.has(uniqueId)
      )
    )
  );
};
