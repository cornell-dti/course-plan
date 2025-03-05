import * as fs from 'fs';
import * as path from 'path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const SERVICE_ACCOUNT_PROD = 'serviceAccountProd.json';
export const SERVICE_ACCOUNT_DEV = 'serviceAccount.json';
export const DATABASE_URL_PROD = 'https://cornell-courseplan.firebaseio.com';
export const DATABASE_URL_DEV = 'https://cornelldti-courseplan-dev.firebaseio.com';

export const getDatabase = (serviceAccount: string, databaseURL: string, appName?: string) => {
  const credential = cert(serviceAccount);
  const app = initializeApp(
    {
      credential,
      databaseURL,
    },
    appName
  );
  return getFirestore(app);
};

const isProd = process.env.PROD === 'true';

const serviceAccountFilename = isProd ? SERVICE_ACCOUNT_PROD : SERVICE_ACCOUNT_DEV;
const serviceAccountUnparsed =
  process.env.SERVICE_ACCOUNT ??
  fs.readFileSync(path.join(__dirname, '..', serviceAccountFilename)).toString();
const serviceAccount = JSON.parse(serviceAccountUnparsed);

const databaseURL = isProd ? DATABASE_URL_PROD : DATABASE_URL_DEV;

const db = getDatabase(serviceAccount, databaseURL);
db.settings({ ignoreUndefinedProperties: true });

const userCollections = {
  name: 'user-name',
  semesters: 'user-semesters',
  toggleable: 'user-toggleable-requirement-choices',
  overridden: 'user-overridden-fulfillment-choices',
  colors: 'user-subject-colors',
  unique: 'user-unique-incrementer',
  onboarding: 'user-onboarding-data',
  allNotes: 'user-all-notes',
};

export const userCollectionNames = Object.values(userCollections);

export const usernameCollection = db.collection(userCollections.name);
export const semestersCollection = db.collection(userCollections.semesters);
export const toggleableRequirementChoicesCollection = db.collection(userCollections.toggleable);
export const overriddenFulfillmentChoicesCollection = db.collection(userCollections.overridden);
export const subjectColorsCollection = db.collection(userCollections.colors);
export const uniqueIncrementerCollection = db.collection(userCollections.unique);
export const onboardingDataCollection = db.collection(userCollections.onboarding);
export const trackUsersCollection = db.collection('track-users');
export const coursesCollection = db.collection('courses');
export const availableRostersForCourseCollection = db.collection('available-rosters-for-course');
export const crseIdToCatalogNbrCollection = db.collection('crseid-to-catalognbr');
export const giveawayCollection = db.collection('giveaway-entries');
export const userAllNotes = db.collection('user-all-notes');
