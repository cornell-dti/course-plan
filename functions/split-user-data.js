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

if (process.argv[2] === '--dry-run') {
  userDataCollection.get().then(userData => {
    const oldData = [];
    const newUsernameCollection = {};
    const newSemestersCollection = {};
    const newToggleableRequirementChoicesCollection = {};
    const newSubjectColorsCollection = {};
    const newUniqueIncrementerCollection = {};
    const newOnboardingDataCollection = {};
    userData.docs.forEach(userDataDocument => {
      const data = userDataDocument.data();
      oldData.push(data);

      newUsernameCollection[userDataDocument.id] = data.name;
      newSemestersCollection[userDataDocument.id] = { semesters: data.semesters };
      newToggleableRequirementChoicesCollection[userDataDocument.id] =
        data.toggleableRequirementChoices || {};
      newSubjectColorsCollection[userDataDocument.id] = data.subjectColors || {};
      newUniqueIncrementerCollection[userDataDocument.id] = {
        uniqueIncrementer: data.uniqueIncrementer || 0,
      };
      newOnboardingDataCollection[userDataDocument.id] = data.userData;
    });

    fs.writeFileSync('old.json', JSON.stringify(oldData, undefined, 2));
    fs.writeFileSync('new-usernames.json', JSON.stringify(newUsernameCollection, undefined, 2));
    fs.writeFileSync('new-semesters.json', JSON.stringify(newSemestersCollection, undefined, 2));
    fs.writeFileSync(
      'new-toggleable.json',
      JSON.stringify(newToggleableRequirementChoicesCollection, undefined, 2)
    );
    fs.writeFileSync(
      'new-subject-color.json',
      JSON.stringify(newSubjectColorsCollection, undefined, 2)
    );
    fs.writeFileSync(
      'new-unique-incrementer.json',
      JSON.stringify(newUniqueIncrementerCollection, undefined, 2)
    );
    fs.writeFileSync(
      'new-onboarding.json',
      JSON.stringify(newOnboardingDataCollection, undefined, 2)
    );
  });
} else {
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
}
