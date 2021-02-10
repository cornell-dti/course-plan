import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import * as fb from './firebaseConfig';
import { AppToggleableRequirementChoices } from './user-data';
import { checkNotNull } from './utilities';

Vue.use(Vuex);

type SimplifiedFirebaseUser = { readonly displayName: string; readonly email: string };

export type VuexStoreState = {
  currentFirebaseUser: SimplifiedFirebaseUser;
  toggleableRequirementChoices: AppToggleableRequirementChoices;
  subjectColors: Readonly<Record<string, string>>;
  uniqueIncrementer: number;
};

export class TypedVuexStore extends Store<VuexStoreState> {}

const store: TypedVuexStore = new TypedVuexStore({
  state: {
    // We allow the initial value to be null, so that the value can be read non-null elsewhere.
    // It is only null when the application has not authenticated the user yet, which is a scanario
    // only need to be considered in Login component.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentFirebaseUser: null!,
    toggleableRequirementChoices: {},
    subjectColors: {},
    uniqueIncrementer: 0,
  },
  actions: {},
  mutations: {
    setCurrentFirebaseUser(state: VuexStoreState, user: SimplifiedFirebaseUser) {
      state.currentFirebaseUser = user;
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

export const subscribeToggleableRequirementChoicesChange = (
  handler: (state: VuexStoreState) => void
): (() => void) =>
  store.subscribe((payload, state) => {
    if (payload.type === 'setToggleableRequirementChoices') {
      handler(state);
    }
  });

// eslint-disable-next-line @typescript-eslint/no-empty-function
let firestoreListenerUnsubscriber = (): void => {};

fb.auth.onAuthStateChanged(user => {
  if (user) {
    const simplifiedUser = {
      displayName: checkNotNull(user.displayName),
      email: checkNotNull(user.email),
    };
    store.commit('setCurrentFirebaseUser', simplifiedUser);
    const toggleableRequirementChoiceUnsubscriber = fb.toggleableRequirementChoicesCollection
      .doc(simplifiedUser.email)
      .onSnapshot(snapshot => {
        const toggleableRequirementChoices = snapshot.data() || {};
        store.commit('setToggleableRequirementChoices', toggleableRequirementChoices);
      });
    const subjectColorUnsubscriber = fb.subjectColorsCollection
      .doc(simplifiedUser.email)
      .onSnapshot(snapshot => {
        const subjectColors = snapshot.data() || {};
        store.commit('setSubjectColors', subjectColors);
      });
    const uniqueIncrementerUnsubscriber = fb.uniqueIncrementerCollection
      .doc(simplifiedUser.email)
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        store.commit('setUniqueIncrementer', data == null ? 0 : data.uniqueIncrementer);
      });
    firestoreListenerUnsubscriber = () => {
      toggleableRequirementChoiceUnsubscriber();
      subjectColorUnsubscriber();
      uniqueIncrementerUnsubscriber();
    };
  } else {
    // When the user logs out, we need to unsubscribe all the listeners to avoid permission error.
    firestoreListenerUnsubscriber();
  }
});

export default store;
