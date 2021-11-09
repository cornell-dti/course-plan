/* eslint-disable no-console */

import * as admin from 'firebase-admin';
import { serviceAccount, SemesterDocumentData } from '../../firebase-admin-config';
import { getTypedFirestoreDataConverter } from '../../firebase-config-common';

const TEST_EMAIL = 'courseplan.cornelldti.test@gmail.com';
admin.credential.cert = process.env.SERVICE_ACCOUNT ?? serviceAccount;
const db = admin.firestore();

const semestersCollection = db
  .collection('user-semesters')
  .withConverter(getTypedFirestoreDataConverter<SemesterDocumentData>());

const onboardingDataCollection = db
  .collection('user-onboarding-data')
  .withConverter(getTypedFirestoreDataConverter<FirestoreOnboardingUserData>());

async function deleteOnboardingAndSemesterDocument() {
  const onboardingDoc = onboardingDataCollection.doc(TEST_EMAIL);
  const semesterDoc = semestersCollection.doc(TEST_EMAIL);

  if (process.argv[2] === '--dry-run') {
    console.log(
      `On a non-dry run, the following document data for user ${TEST_EMAIL} would be deleted.`
    );
    onboardingDoc.get().then(doc => {
      console.log(doc.data());
    });
    semesterDoc.get().then(doc => {
      console.log(doc.data());
    });
  } else {
    onboardingDoc.delete().then(() => {
      console.log("Test user's onboarding data deleted");
    });

    semesterDoc.delete().then(() => {
      console.log("Test user's semester data deleted");
    });
  }
}

deleteOnboardingAndSemesterDocument();
