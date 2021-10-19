import { onboardingDataCollection } from '../firebase-frontend-config';
import store from '../store';
import setUsernameData from './username-data';
import { clearOverriddenFulfillmentsAPIB } from './overridden-fulfillment-choices';

const setOnboardingData = (name: FirestoreUserName, onboarding: AppOnboardingData): void => {
  setUsernameData(name);
  const oldCollege = store.state.onboardingData.college;
  onboardingDataCollection
    .doc(store.state.currentFirebaseUser.email)
    .set({
      gradYear: onboarding.gradYear,
      entranceYear: onboarding.entranceYear,
      colleges: onboarding.college ? [{ acronym: onboarding.college }] : [],
      majors: onboarding.major.map(acronym => ({ acronym })),
      minors: onboarding.minor.map(acronym => ({ acronym })),
      gradPrograms: onboarding.grad ? [{ acronym: onboarding.grad }] : [],
      exam: onboarding.exam,
      class: onboarding.transferCourse,
      tookSwim: onboarding.tookSwim,
    })
    .then(() => {
      const newCollege = store.state.onboardingData.college;
      if (oldCollege !== newCollege) {
        clearOverriddenFulfillmentsAPIB();
      }
    });
};

export default setOnboardingData;
