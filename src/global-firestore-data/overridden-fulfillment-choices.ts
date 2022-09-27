import { doc, setDoc } from 'firebase/firestore';

import { overriddenFulfillmentChoicesCollection } from '../firebase-frontend-config';
import store from '../store';

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

export const updateRequirementChoice = (
  courseUniqueID: string | number,
  updater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): void =>
  updateRequirementChoices(choices => ({
    ...choices,
    [courseUniqueID]: updater(
      store.state.overriddenFulfillmentChoices[courseUniqueID] || {
        arbitraryOptIn: {},
        acknowledgedCheckerWarningOptIn: [],
        optOut: [],
      }
    ),
  }));

const removeRequirementChoice = (choices: readonly string[], requirementId: string) =>
  choices.filter(choice => choice !== requirementId);

const removeRequirementChoices = (choices: readonly string[], requirementIds: string[]) =>
  choices.filter(choice => !requirementIds.includes(choice));

const removeArbitraryOptIn = (
  choices: { readonly [requirement: string]: readonly string[] },
  requirementID: string
) => {
  const newChoices = { ...choices };
  delete newChoices[requirementID];
  return newChoices;
};

const removeArbitraryOptIns = (
  choices: { readonly [requirement: string]: readonly string[] },
  requirementIds: string[]
) => {
  const newChoices = { ...choices };
  requirementIds.forEach(id => delete newChoices[id]);
  return newChoices;
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

export const deleteCoursesFromRequirementChoices = (
  courseUniqueIds: readonly (string | number)[]
): void => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  updateRequirementChoices(choices =>
    Object.fromEntries(
      Object.entries(choices).filter(([uniqueId]) => !courseUniqueIdStrings.has(uniqueId))
    )
  );
};

export const deleteCourseFromRequirementChoices = (courseUniqueID: string | number): void =>
  deleteCoursesFromRequirementChoices([courseUniqueID]);

export const addOptOut = (courseUniqueID: string | number, requirementID: string) =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      // add to opt-out
      optOut: [...new Set([...optOut, requirementID])],
      // remove from checker warning opt-in, since it contradicts any previous opt-in choices
      acknowledgedCheckerWarningOptIn: removeRequirementChoice(
        acknowledgedCheckerWarningOptIn,
        requirementID
      ),
      // remove from arbitrary opt-in, since it contradicts any previous opt-in choices
      arbitraryOptIn: removeArbitraryOptIn(arbitraryOptIn, requirementID),
    })
  );

export const addAcknowledgedCheckerWarningOptIn = (
  courseUniqueID: string | number,
  requirementID: string
): void =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      // remove from opt-out, since it contradicts any previous opt-out choices
      optOut: removeRequirementChoice(optOut, requirementID),
      // add to checker warning opt-in
      acknowledgedCheckerWarningOptIn: [
        ...new Set([...acknowledgedCheckerWarningOptIn, requirementID]),
      ],
      // don't remove from arbitrary opt-in, since arbitrary opt-in is stronger
      arbitraryOptIn,
    })
  );

export const addArbitraryOptIn = (
  courseUniqueID: string | number,
  requirementID: string,
  slot: string
): void =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      // don't remove from opt-out, since the user may want to apply
      // the course to a specific requirement slot
      optOut,
      // remove from checker warning opt-in, since arbitrary opt-in is stronger
      acknowledgedCheckerWarningOptIn: removeRequirementChoice(
        acknowledgedCheckerWarningOptIn,
        requirementID
      ),
      // add to arbitrary opt-in
      arbitraryOptIn: {
        ...arbitraryOptIn,
        [requirementID]: [...new Set([...arbitraryOptIn[requirementID], slot])],
      },
    })
  );

/**
 * Precondition: the requirement id lists are disjoint
 */
export const resolveConflicts = (
  courseUniqueID: string | number,
  naturallyFulfilledRequirementIds: string[],
  arbitraryOptInRequirementIds: string[],
  optOutRequirementIds: string[]
): void =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      // remove naturallyFulfilledRequirementIds and arbitraryOptInRequirementIds from opt-out
      // add optOutRequirementIds to opt-out
      optOut: [
        ...new Set([
          ...removeRequirementChoices(optOut, [
            ...naturallyFulfilledRequirementIds,
            ...arbitraryOptInRequirementIds,
          ]),
          ...optOutRequirementIds,
        ]),
      ],
      // remove optOutRequirementIds from checker warning opt-in
      // add arbitraryOptInRequirementIds to checker warning opt-in
      acknowledgedCheckerWarningOptIn: [
        ...new Set([
          ...removeRequirementChoices(acknowledgedCheckerWarningOptIn, optOutRequirementIds),
          ...arbitraryOptInRequirementIds,
        ]),
      ],
      // remove optOutRequirementIds from arbitrary opt-in, since it contradicts any previous opt-in choices
      arbitraryOptIn: removeArbitraryOptIns(arbitraryOptIn, optOutRequirementIds),
    })
  );
