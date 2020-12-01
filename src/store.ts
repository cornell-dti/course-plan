import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';

import * as fb from './firebaseConfig';

Vue.use(Vuex);

type State = {
  currentUser: firebase.User | null;
  userProfile: {};
};

const store = new Vuex.Store<State>({
  state: {
    currentUser: null,
    userProfile: {},
  },
  actions: {
    fetchUserProfile({ commit, state }) {},
  },
  mutations: {
    setCurrentUser(state: State, val: firebase.User) {
      state.currentUser = val;
    },
  },
});

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');
  }
});

export default store;
