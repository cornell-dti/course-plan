import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import * as fb from './firebaseConfig';
import getCurrentSeason, { checkNotNull, getCurrentYear } from './utilities';

Vue.use(Vuex);

type SimplifiedFirebaseUser = { readonly displayName: string; readonly email: string };

export type VuexStoreState = {
  currentFirebaseUser: SimplifiedFirebaseUser;
  userName: FirestoreUserName;
  onboardingData: AppOnboardingData;
  semesters: readonly FirestoreSemester[];
  toggleableRequirementChoices: AppToggleableRequirementChoices;
  subjectColors: Readonly<Record<string, string>>;
  uniqueIncrementer: number;
};

export class TypedVuexStore extends Store<VuexStoreState> {}

const store: TypedVuexStore = new TypedVuexStore({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // We allow the initial value to be null, so that the value can be read non-null elsewhere.
    // It is only null when the application has not authenticated the user yet, which is a scanario
    // only need to be considered in Login component.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentFirebaseUser: null!,
    userName: { firstName: '', middleName: '', lastName: '' },
    onboardingData: {
      college: '',
      major: [],
      minor: [],
      exam: [],
      transferCourse: [],
      tookSwim: 'no',
    },
    semesters: [],
    toggleableRequirementChoices: {},
    subjectColors: {},
    uniqueIncrementer: 0,
  },
  actions: {},
  mutations: {
    setCurrentFirebaseUser(state: VuexStoreState, user: SimplifiedFirebaseUser) {
      state.currentFirebaseUser = user;
    },
    setUserName(state: VuexStoreState, userName: FirestoreUserName) {
      state.userName = userName;
    },
    setOnboardingData(state: VuexStoreState, onboardingData: FirestoreOnboardingUserData) {
      state.onboardingData = createAppOnboardingData(onboardingData);
    },
    setSemesters(state: VuexStoreState, semesters: readonly FirestoreSemester[]) {
      state.semesters = semesters;
    },
    setToggleableRequirementChoices(
      state: VuexStoreState,
      toggleableRequirementChoices: AppToggleableRequirementChoices
    ) {
      state.toggleableRequirementChoices = toggleableRequirementChoices;
    },
    setSubjectColors(state: VuexStoreState, colors: Readonly<Record<string, string>>) {
      state.subjectColors = colors;
    },
    setUniqueIncrementer(state: VuexStoreState, newIncrementerValue: number) {
      state.uniqueIncrementer = newIncrementerValue;
    },
  },
});

export const subscribeRequirementDependencyChange = (
  handler: (state: VuexStoreState) => void
): (() => void) =>
  store.subscribe((payload, state) => {
    if (
      payload.type === 'setOnboardingData' ||
      payload.type === 'setSemesters' ||
      payload.type === 'setToggleableRequirementChoices'
    ) {
      handler(state);
    }
  });

const createAppOnboardingData = (data: FirestoreOnboardingUserData): AppOnboardingData => ({
  // TODO: take into account multiple colleges
  college: data.colleges[0].acronym,
  major: data.majors.map(({ acronym }) => acronym),
  minor: data.minors.map(({ acronym }) => acronym),
  exam: 'exam' in data ? [...data.exam] : [],
  transferCourse: 'class' in data ? [...data.class] : [],
  tookSwim: 'tookSwim' in data ? data.tookSwim : 'no',
});

export const initializeFirestoreListeners = (onLoad: () => void): (() => void) => {
  const simplifiedUser = store.state.currentFirebaseUser;

  let userNameInitialLoadFinished = false;
  let onboardingDataInitialLoadFinished = false;
  let semestersInitialLoadFinished = false;
  let toggleableRequirementChoiceInitialLoadFinished = false;
  let subjectColorInitialLoadFinished = false;
  let uniqueIncrementerInitialLoadFinished = false;

  let emitted = false;

  const emitOnLoadWhenLoaded = (): void => {
    if (
      userNameInitialLoadFinished &&
      onboardingDataInitialLoadFinished &&
      semestersInitialLoadFinished &&
      toggleableRequirementChoiceInitialLoadFinished &&
      subjectColorInitialLoadFinished &&
      uniqueIncrementerInitialLoadFinished &&
      !emitted
    ) {
      emitted = true;
      onLoad();
    }
  };

  const userNameUnsubscriber = fb.usernameCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data != null) {
        store.commit('setUserName', data);
      } else {
        const [firstName, lastName] = simplifiedUser.displayName.split(' ');
        store.commit('setUserName', { firstName, middleName: '', lastName });
      }
      userNameInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const onboardingDataUnsubscriber = fb.onboardingDataCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data != null) {
        store.commit('setOnboardingData', data);
      }
      onboardingDataInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  fb.semestersCollection
    .doc(simplifiedUser.email)
    .get()
    .then(snapshot => {
      const data = snapshot.data();
      if (data != null) {
        store.commit('setSemesters', data.semesters);
      } else {
        const newSemeter: FirestoreSemester = {
          type: getCurrentSeason(),
          year: getCurrentYear(),
          courses: [],
        };
        store.commit('setSemesters', [newSemeter]);
        fb.semestersCollection.doc(simplifiedUser.email).set({ semesters: [newSemeter] });
      }
      semestersInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const toggleableRequirementChoiceUnsubscriber = fb.toggleableRequirementChoicesCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const toggleableRequirementChoices = snapshot.data() || {};
      store.commit('setToggleableRequirementChoices', toggleableRequirementChoices);
      toggleableRequirementChoiceInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const subjectColorUnsubscriber = fb.subjectColorsCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const subjectColors = snapshot.data() || {};
      store.commit('setSubjectColors', subjectColors);
      subjectColorInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const uniqueIncrementerUnsubscriber = fb.uniqueIncrementerCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      store.commit('setUniqueIncrementer', data == null ? 0 : data.uniqueIncrementer);
      uniqueIncrementerInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });

  const unsubscriber = () => {
    userNameUnsubscriber();
    onboardingDataUnsubscriber();
    toggleableRequirementChoiceUnsubscriber();
    subjectColorUnsubscriber();
    uniqueIncrementerUnsubscriber();
  };
  return unsubscriber;
};

fb.auth.onAuthStateChanged(user => {
  if (user) {
    const simplifiedUser = {
      displayName: checkNotNull(user.displayName),
      email: checkNotNull(user.email),
    };
    store.commit('setCurrentFirebaseUser', simplifiedUser);
  }
});

export default store;
