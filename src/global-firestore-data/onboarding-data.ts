import { onboardingDataCollection } from '../firebase-frontend-config';
import store from '../store';
import setUsernameData from './username-data';

const setOnboardingData = (name: FirestoreUserName, onboarding: AppOnboardingData): void => {
  setUsernameData(name);
  onboardingDataCollection.doc(store.state.currentFirebaseUser.email).set({
    gradYear: onboarding.gradYear,
    entranceYear: onboarding.entranceYear,
    colleges: onboarding.college ? [{ acronym: onboarding.college }] : [],
    majors: onboarding.major.map(acronym => ({ acronym })),
    minors: onboarding.minor.map(acronym => ({ acronym })),
    gradPrograms: onboarding.grad ? [{ acronym: onboarding.grad }] : [],
    exam: onboarding.exam,
    tookSwim: onboarding.tookSwim,
  });
};

export default setOnboardingData;
