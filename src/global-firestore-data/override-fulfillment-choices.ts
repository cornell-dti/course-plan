import { overriddenFulfillmentChoicesCollection } from '../firebase-frontend-config';
import store from '../store';

export const updateRequirementChoices = (
  updater: (
    oldChoices: FirestoreOverriddenFulfillmentChoices
  ) => FirestoreOverriddenFulfillmentChoices
): void => {
  overriddenFulfillmentChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(updater(store.state.overriddenFulfillmentChoices));
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

const removeRequirementChoice = (choices: readonly string[], id: string) =>
  choices.filter(choice => choice !== id);

const removeArbitraryOptIn = (
  choices: { readonly [requirement: string]: readonly string[] },
  requirementID: string
) => {
  const newChoices = { ...choices };
  delete newChoices[requirementID];
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
