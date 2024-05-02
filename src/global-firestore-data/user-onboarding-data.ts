import { doc, setDoc, updateDoc } from 'firebase/firestore';

import { SWIM_TEST_CODE } from '@/data/constants';
import { onboardingDataCollection } from '../firebase-config';
import store from '../store';
import setUsernameData from './user-name';

export const setAppOnboardingData = (
  name: FirestoreUserName,
  onboarding: AppOnboardingData
): void => {
  setUsernameData(name);
  setDoc(doc(onboardingDataCollection, store.state.currentFirebaseUser.email), {
    gradYear: onboarding.gradYear,
    gradSem: onboarding.gradSem,
    entranceYear: onboarding.entranceYear,
    entranceSem: onboarding.entranceSem,
    colleges: onboarding.college ? [{ acronym: onboarding.college }] : [],
    majors: onboarding.major.map(acronym => ({ acronym })),
    minors: onboarding.minor.map(acronym => ({ acronym })),
    gradPrograms: onboarding.grad ? [{ acronym: onboarding.grad }] : [],
    // TODO @bshen migration script from type to examType
    exam: onboarding.exam.map(e => ({
      ...e,
      type: e.examType || e.type,
      examType: e.type || e.examType,
    })),
    tookSwim: onboarding.tookSwim,
    sawNewFeature: onboarding.sawNewFeature,
    sawScheduleGenerator: onboarding.sawScheduleGenerator,
  });
};

const updateTransferCredit = (exam: readonly FirestoreTransferExam[], tookSwim: 'yes' | 'no') => {
  updateDoc(doc(onboardingDataCollection, store.state.currentFirebaseUser.email), {
    exam,
    tookSwim,
  });
};

export const deleteTransferCredit = (code: string): void => {
  if (code === SWIM_TEST_CODE) {
    updateTransferCredit(store.state.onboardingData.exam, 'no');
    return;
  }
  // Note: this assumes that the course code is `${examType} ${subject}`.
  // This needs to be updated if that changes.
  const [examType, subject] = code.split(/ (.*)/);
  updateTransferCredit(
    store.state.onboardingData.exam.filter(
      e => !(e.examType === examType && e.subject === subject)
    ),
    store.state.onboardingData.tookSwim
  );
};

export const updateSawNewFeature = (sawNewFeature: boolean): void => {
  store.commit('setSawNewFeature', sawNewFeature);
  updateDoc(doc(onboardingDataCollection, store.state.currentFirebaseUser.email), {
    sawNewFeature,
  });
};

export const updateSawScheduleGenerator = (sawScheduleGenerator: boolean): void => {
  store.commit('setSawScheduleGenerator', sawScheduleGenerator);
  updateDoc(doc(onboardingDataCollection, store.state.currentFirebaseUser.email), {
    sawScheduleGenerator,
  });
};
