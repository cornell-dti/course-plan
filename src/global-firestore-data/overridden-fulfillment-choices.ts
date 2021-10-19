/**
 * AP/IB override code temporarily uses the onboarding data collection
 */
import { onboardingDataCollection } from '../firebase-frontend-config';
import store from '../store';

const editAPIBExams = (
  updater: (oldAPIBExams: readonly FirestoreAPIBExam[]) => readonly FirestoreAPIBExam[]
): void => {
  const oldAPIBExams = store.state.onboardingData.exam;
  const newAPIBExams = updater(oldAPIBExams);
  onboardingDataCollection
    .doc(store.state.currentFirebaseUser.email)
    .update({ exam: newAPIBExams });
};

// split and exposed for testing
export const addOverriddenFulfillmentAPIBUpdater = (
  oldAPIBExams: readonly FirestoreAPIBExam[],
  examName: string,
  optIn: boolean,
  requirementName: string,
  slotName: string
): readonly FirestoreAPIBExam[] =>
  oldAPIBExams.map(exam => {
    if (`${exam.type} ${exam.subject}` === examName) {
      const overriddenFulfillments = optIn ? { ...exam.optIn } : { ...exam.optOut };
      if (requirementName in overriddenFulfillments) {
        if (overriddenFulfillments[requirementName].indexOf(slotName) === -1) {
          overriddenFulfillments[requirementName] = [
            ...overriddenFulfillments[requirementName],
            slotName,
          ];
        }
      } else {
        overriddenFulfillments[requirementName] = [slotName];
      }
      const otherOverriddenFulfillments = optIn ? { ...exam.optOut } : { ...exam.optIn };
      if (requirementName in otherOverriddenFulfillments) {
        otherOverriddenFulfillments[requirementName] = otherOverriddenFulfillments[
          requirementName
        ].filter(slot => slot !== slotName);
        if (otherOverriddenFulfillments[requirementName].length === 0) {
          delete otherOverriddenFulfillments[requirementName];
        }
      }
      return optIn
        ? { ...exam, optIn: overriddenFulfillments, optOut: otherOverriddenFulfillments }
        : { ...exam, optIn: otherOverriddenFulfillments, optOut: overriddenFulfillments };
    }
    return exam;
  });

export const addOverriddenFulfillmentAPIB = (
  examName: string,
  optIn: boolean,
  requirementName: string,
  slotName: string
): void =>
  editAPIBExams(oldAPIBExams =>
    addOverriddenFulfillmentAPIBUpdater(oldAPIBExams, examName, optIn, requirementName, slotName)
  );

// split and exposed for testing
export const clearOverriddenFulfillmentsAPIBUpdater = (
  oldAPIBExams: readonly FirestoreAPIBExam[]
): readonly FirestoreAPIBExam[] =>
  oldAPIBExams.map(exam => {
    const { optIn, optOut, ...rest } = exam;
    return { optIn: {}, optOut: {}, ...rest };
  });

export const clearOverriddenFulfillmentsAPIB = (): void =>
  editAPIBExams(oldAPIBExams => clearOverriddenFulfillmentsAPIBUpdater(oldAPIBExams));
