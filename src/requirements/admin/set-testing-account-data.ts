/* eslint-disable no-console */

import { onboardingDataCollection, semestersCollection } from '../../firebase-admin-config';

const TEST_EMAIL = 'courseplan.cornelldti.test@gmail.com';

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
    onboardingDoc
      .delete()
      .then(() => {
        console.log("Test user's onboarding data deleted");
      })
      .catch(error => {
        console.log('Onboarding error:', error);
      });

    semesterDoc
      .delete()
      .then(() => {
        console.log("Test user's semester data deleted");
      })
      .catch(error => {
        console.log('Semester error:', error);
      });
  }
}

deleteOnboardingAndSemesterDocument();
