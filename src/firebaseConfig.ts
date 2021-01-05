import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import {
  FirestoreUserName,
  FirestoreSemester,
  AppToggleableRequirementChoices,
  FirestoreOnboardingUserData,
} from './user-data';

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
export const { currentUser } = auth;

export const usernameCollection = db.collection('user-name').withConverter<FirestoreUserName>({
  fromFirestore(snapshot): FirestoreUserName {
    return snapshot.data() as FirestoreUserName;
  },
  toFirestore(userData: FirestoreUserName) {
    return userData;
  },
});

type SemesterDocumentData = { readonly semesters: readonly FirestoreSemester[] };
export const semestersCollection = db
  .collection('user-semesters')
  .withConverter<SemesterDocumentData>({
    fromFirestore(snapshot): SemesterDocumentData {
      return snapshot.data() as SemesterDocumentData;
    },
    toFirestore(userData: SemesterDocumentData) {
      return userData;
    },
  });

export const toggleableRequirementChoicesCollection = db
  .collection('user-toggleable-requirement-choices')
  .withConverter<AppToggleableRequirementChoices>({
    fromFirestore(snapshot): AppToggleableRequirementChoices {
      return snapshot.data() as AppToggleableRequirementChoices;
    },
    toFirestore(userData: AppToggleableRequirementChoices) {
      return userData;
    },
  });

export const subjectColorsCollection = db
  .collection('user-subject-colors')
  .withConverter<Readonly<Record<string, string>>>({
    fromFirestore(snapshot): Readonly<Record<string, string>> {
      return snapshot.data() as Readonly<Record<string, string>>;
    },
    toFirestore(userData: Readonly<Record<string, string>>) {
      return userData;
    },
  });

type UniqueIncrementerDocumentData = { readonly uniqueIncrementer: number };
export const uniqueIncrementerCollection = db
  .collection('user-unique-incrementer')
  .withConverter<UniqueIncrementerDocumentData>({
    fromFirestore(snapshot): UniqueIncrementerDocumentData {
      return snapshot.data() as UniqueIncrementerDocumentData;
    },
    toFirestore(userData: UniqueIncrementerDocumentData) {
      return userData;
    },
  });

export const onboardingDataCollection = db
  .collection('user-onboarding-data')
  .withConverter<FirestoreOnboardingUserData>({
    fromFirestore(snapshot): FirestoreOnboardingUserData {
      return snapshot.data() as FirestoreOnboardingUserData;
    },
    toFirestore(userData: FirestoreOnboardingUserData) {
      return userData;
    },
  });

export const whitelistCollection = db.collection('betaWhitelist');
export const landingEmailsCollection = db.collection('landingEmails');
