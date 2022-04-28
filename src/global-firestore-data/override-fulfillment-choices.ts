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
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): void =>
  updateRequirementChoices(choices => ({
    ...choices,
    [courseUniqueID]: choiceUpdater(
      store.state.overriddenFulfillmentChoices[courseUniqueID] || {
        arbitraryOptIn: {},
        acknowledgedCheckerWarningOptIn: [],
        optOut: [],
      }
    ),
  }));

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

const removeRequirementChoice = (choices: readonly string[], id: string) =>
  choices.filter(choice => choice !== id);

const removeRequirementChoiceFromArbitraryOptIn = (
  choices: { readonly [requirement: string]: readonly string[] },
  requirementID: string
) => {
  const newChoices = { ...choices };
  delete newChoices[requirementID];
  return newChoices;
};

export const optOutRequirementChoices = (courseUniqueID: string | number, requirementID: string) =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      optOut: [...new Set([...optOut, requirementID])],
      acknowledgedCheckerWarningOptIn: removeRequirementChoice(
        acknowledgedCheckerWarningOptIn,
        requirementID
      ),
      arbitraryOptIn: removeRequirementChoiceFromArbitraryOptIn(arbitraryOptIn, requirementID),
    })
  );

export const optInRequirementChoices = (
  courseUniqueID: string | number,
  requirementID: string,
  slot: string
): void =>
  updateRequirementChoice(
    courseUniqueID,
    ({ optOut, acknowledgedCheckerWarningOptIn, arbitraryOptIn }) => ({
      optOut: removeRequirementChoice(optOut, requirementID),
      acknowledgedCheckerWarningOptIn: removeRequirementChoice(
        acknowledgedCheckerWarningOptIn,
        requirementID
      ),
      arbitraryOptIn: {
        ...arbitraryOptIn,
        [requirementID]: [...new Set([...arbitraryOptIn[requirementID], slot])],
      },
    })
  );
