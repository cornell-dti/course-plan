const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const db = admin.firestore();
const userDataCollection = db.collection('userData');

const usernameCollection = db.collection('user-name');
const semestersCollection = db.collection('user-semesters');
const toggleableRequirementChoicesCollection = db.collection('user-toggleable-requirement-choices');
const subjectColorsCollection = db.collection('user-subject-colors');
const uniqueIncrementerCollection = db.collection('user-unique-incrementer');
const onboardingDataCollection = db.collection('user-onboarding-data');

userDataCollection.get().then(userData => {
  Promise.all(
    userData.docs.map(userDataDocument => {
      const batch = db.batch();
      const data = userDataDocument.data();
      batch.set(usernameCollection.doc(userDataDocument.id), data.name);
      batch.set(semestersCollection.doc(userDataDocument.id), { semesters: data.semesters });
      batch.set(
        toggleableRequirementChoicesCollection.doc(userDataDocument.id),
        data.toggleableRequirementChoices || {}
      );
      batch.set(subjectColorsCollection.doc(userDataDocument.id), data.subjectColors || {});
      batch.set(uniqueIncrementerCollection.doc(userDataDocument.id), {
        uniqueIncrementer: data.uniqueIncrementer || 0,
      });
      batch.set(onboardingDataCollection.doc(userDataDocument.id), data.userData);
      batch.delete(userDataDocument.ref);
      return batch.commit();
    })
  );
});
