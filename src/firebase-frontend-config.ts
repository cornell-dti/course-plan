import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import {
  getTypedFirestoreDataConverter,
  SemesterDocumentData,
  UniqueIncrementerDocumentData,
} from './firebase-config-common';

let config;
if (process.env.VUE_APP_FIREBASE_MODE === 'prod') {
  // Production config
  config = {
    apiKey: 'AIzaSyDkKOpImjbjS2O0RhIQNJLQXx2SuYbxsfU',
    authDomain: 'cornell-courseplan.firebaseapp.com',
    databaseURL: 'https://cornell-courseplan.firebaseio.com',
    projectId: 'cornell-courseplan',
    storageBucket: '',
    messagingSenderId: '1031551180906',
    appId: '1:1031551180906:web:bdcea6ec074e673ea72a13',
    measurementId: 'G-8B1JVCBX0Z',
  };
} else {
  config = {
    apiKey: 'AIzaSyAfePy1Tbrqm55bYR7BHHl50r-9NTVj0Rs',
    authDomain: 'cornelldti-courseplan-dev.firebaseapp.com',
    databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
    projectId: 'cornelldti-courseplan-dev',
    storageBucket: '',
    messagingSenderId: '321304703190',
    appId: '1:321304703190:web:2f2fefb4a0284465b99977',
  };
}

firebase.initializeApp(config);

// firebase utils
export const db = firebase.firestore();
export const auth = firebase.auth();

export const usernameCollection = db
  .collection('user-name')
  .withConverter(getTypedFirestoreDataConverter<FirestoreUserName>());

export const semestersCollection = db
  .collection('user-semesters')
  .withConverter(getTypedFirestoreDataConverter<SemesterDocumentData>());

export const toggleableRequirementChoicesCollection = db
  .collection('user-toggleable-requirement-choices')
  .withConverter(getTypedFirestoreDataConverter<AppToggleableRequirementChoices>());

export const selectableRequirementChoicesCollection = db
  .collection('user-selectable-requirement-choices')
  .withConverter(getTypedFirestoreDataConverter<AppSelectableRequirementChoices>());

export const subjectColorsCollection = db
  .collection('user-subject-colors')
  .withConverter(getTypedFirestoreDataConverter<Readonly<Record<string, string>>>());

export const uniqueIncrementerCollection = db
  .collection('user-unique-incrementer')
  .withConverter(getTypedFirestoreDataConverter<UniqueIncrementerDocumentData>());

export const onboardingDataCollection = db
  .collection('user-onboarding-data')
  .withConverter(getTypedFirestoreDataConverter<FirestoreOnboardingUserData>());
