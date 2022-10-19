import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const prodCredential = cert('serviceAccountProd.json');
const prodDatabaseURL = 'https://cornell-courseplan.firebaseio.com';

const prodApp = initializeApp(
  {
    credential: prodCredential,
    databaseURL: prodDatabaseURL,
  },
  'prod'
);

export const prodDatabase = getFirestore(prodApp);

const credential = cert('serviceAccount.json');
const databaseURL = 'https://cornelldti-courseplan-dev.firebaseio.com';

const app = initializeApp(
  {
    credential,
    databaseURL,
  },
  'dev'
);

const userCollectionNames = {
  name: 'user-name',
  semesters: 'user-semesters',
  toggleable: 'user-toggleable-requirement-choices',
  overridden: 'user-overridden-fulfillment-choices',
  colors: 'user-subject-colors',
  unique: 'user-unique-incrementer',
  onboarding: 'user-onboarding-data',
};
export const collectionNames = Object.values(userCollectionNames);

export const database = getFirestore(app);
export const usernameCollection = database.collection(userCollectionNames.name);
export const semestersCollection = database.collection(userCollectionNames.semesters);
export const toggleableRequirementChoicesCollection = database.collection(
  userCollectionNames.toggleable
);
export const overriddenFulfillmentChoicesCollection = database.collection(
  userCollectionNames.overridden
);
export const subjectColorsCollection = database.collection(userCollectionNames.colors);
export const uniqueIncrementerCollection = database.collection(userCollectionNames.unique);
export const onboardingDataCollection = database.collection(userCollectionNames.onboarding);
export const trackUsersCollection = database.collection('track-users');
