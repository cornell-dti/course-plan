import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommonDocumentData = { [field: string]: any };
/** An interface for `FirestoreDataConverter` common to both frontend firebase and admin firebase. */
export interface CommonFirestoreDataConverter<T> {
  toFirestore(modelObject: T): CommonDocumentData;
  fromFirestore(snapshot: { data(): CommonDocumentData }): T;
}

export const getTypedFirestoreDataConverter = <T>(): CommonFirestoreDataConverter<T> => ({
  fromFirestore(snapshot) {
    return snapshot.data() as T;
  },
  toFirestore(userData) {
    return userData;
  },
});

let config;
if (import.meta.env.VITE_FIREBASE_MODE === 'prod') {
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

export const app = initializeApp(config);

// firebase utils
export const auth = getAuth(app);
export const db = getFirestore(app);

export const usernameCollection = collection(db, 'user-name').withConverter(
  getTypedFirestoreDataConverter<FirestoreUserName>()
);

export const semestersCollection = collection(db, 'user-semesters').withConverter(
  getTypedFirestoreDataConverter<FirestoreSemestersData>()
);

export const coursesCollection = collection(db, 'courses');

export const availableRostersForCoursesCollection = collection(db, 'available-rosters-for-course');

export const crseIdToCatalogNbrCollection = collection(db, 'crseid-to-catalognbr');

export const toggleableRequirementChoicesCollection = collection(
  db,
  'user-toggleable-requirement-choices'
).withConverter(getTypedFirestoreDataConverter<AppToggleableRequirementChoices>());

export const overriddenFulfillmentChoicesCollection = collection(
  db,
  'user-overridden-fulfillment-choices'
).withConverter(getTypedFirestoreDataConverter<FirestoreOverriddenFulfillmentChoices>());

export const subjectColorsCollection = collection(db, 'user-subject-colors').withConverter(
  getTypedFirestoreDataConverter<Readonly<Record<string, string>>>()
);

export const uniqueIncrementerCollection = collection(db, 'user-unique-incrementer').withConverter(
  getTypedFirestoreDataConverter<FirestoreUniqueIncrementer>()
);

export const onboardingDataCollection = collection(db, 'user-onboarding-data').withConverter(
  getTypedFirestoreDataConverter<FirestoreOnboardingUserData>()
);

export const trackUsersCollection = collection(db, 'track-users').withConverter(
  getTypedFirestoreDataConverter<FirestoreTrackUsersData>()
);

export const giveawayCollection = collection(db, 'giveaway-entries');
