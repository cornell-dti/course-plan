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
export const addOverridenRequirementAPIBUpdater = (
  oldAPIBExams: readonly FirestoreAPIBExam[],
  examName: string,
  optIn: boolean,
  requirementName: string,
  slotName: string
): readonly FirestoreAPIBExam[] =>
  oldAPIBExams.map(exam => {
    if (`${exam.type} ${exam.subject}` === examName) {
      const overridenRequirements = optIn ? { ...exam.optIn } : { ...exam.optOut };
      if (requirementName in overridenRequirements) {
        if (overridenRequirements[requirementName].indexOf(slotName) === -1) {
          overridenRequirements[requirementName] = [
            ...overridenRequirements[requirementName],
            slotName,
          ];
        }
      } else {
        overridenRequirements[requirementName] = [slotName];
      }
      const otherOverridenRequirements = optIn ? { ...exam.optOut } : { ...exam.optIn };
      if (requirementName in otherOverridenRequirements) {
        otherOverridenRequirements[requirementName] = otherOverridenRequirements[
          requirementName
        ].filter(slot => slot !== slotName);
        if (otherOverridenRequirements[requirementName].length === 0) {
          delete otherOverridenRequirements[requirementName];
        }
      }
      return optIn
        ? { ...exam, optIn: overridenRequirements, optOut: otherOverridenRequirements }
        : { ...exam, optIn: otherOverridenRequirements, optOut: overridenRequirements };
    }
    return exam;
  });

export const addOverridenRequirementAPIB = (
  examName: string,
  optIn: boolean,
  requirementName: string,
  slotName: string
): void =>
  editAPIBExams(oldAPIBExams =>
    addOverridenRequirementAPIBUpdater(oldAPIBExams, examName, optIn, requirementName, slotName)
  );

// split and exposed for testing
export const clearOverridenRequirementsAPIBUpdater = (
  oldAPIBExams: readonly FirestoreAPIBExam[]
): readonly FirestoreAPIBExam[] =>
  oldAPIBExams.map(exam => {
    const { optIn, optOut, ...rest } = exam;
    return { optIn: {}, optOut: {}, ...rest };
  });

export const clearOverridenRequirementsAPIB = (): void =>
  editAPIBExams(oldAPIBExams => clearOverridenRequirementsAPIBUpdater(oldAPIBExams));
