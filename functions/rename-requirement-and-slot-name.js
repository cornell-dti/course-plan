// General script to rename the requirement or slot name in Firestore if it
// has been changed in the requirements data.
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const db = admin.firestore();
const userOverriddenReqsCollection = db.collection('user-overridden-requirements');
const userOnboardingData = db.collection('user-onboarding-data');

/** The current name of the requirement or slot name that we want to change. */
const oldName;
/** The name that we want to change the requirement or slot name to. */
const newName;
/** True if the name we are changing is the name of a slot.
 * False if the name we are changing is the name of a requirement. */
const isChangingSlotName;

/** updates the old name of the requirement or slot name with the new name in
 * userOverriddenReqsCollection
 */
const updateNames = doc => {
  const newDoc = {};
  for (const [key, value] of Object.entries(doc)) {
    const nameInDB = isChangingSlotName ? key[1] : key[0];
    if (nameInDB === oldName) {
      const newKey = isChangingSlotName ? [key[0], newName] : [newName, key[1]];
      newDoc[newKey] = value;
    } else {
      newDoc[key] = value;
    }
  }
  return newDoc;
};

const updateNamesInArray = arr => {
  return arr.map(([reqName, slotName]) => {
    const nameInDB = isChangingSlotName ? slotName : reqName;
    if (nameInDB === oldName) {
      return isChangingSlotName ? [reqName, newName] : [newName, slotName];
    }
    return [reqName, slotName];
  });
};

const transformOverriddenReqsCollection = doc => updateNames(doc);

const transformOnboardingData = doc => ({
  ...doc,
  optIn: updateNamesInArray(doc.optIn),
  optOut: updateNamesInArray(doc.optOut),
});

if (process.argv[2] === '--dry-run') {
  userOverriddenReqsCollection.get().then(userOverriddenReqsData => {
    const oldUserOverriddenReqsData = userOverriddenReqsData.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Using JSON parse and stringify trick so we get a deep copy of the nested oldUserOverriddenReqsData
    const newUserOverriddenReqs = JSON.parse(JSON.stringify(oldUserOverriddenReqsData)).map(
      transformOverriddenReqsCollection
    );
    fs.writeFileSync(
      'old-userOverriddenReqsData.json',
      JSON.stringify(oldUserOverriddenReqsData, undefined, 2)
    );
    fs.writeFileSync(
      'new-userOverriddenReqs.json',
      JSON.stringify(newUserOverriddenReqs, undefined, 2)
    );
  });
  userOnboardingData.get().then(userOnboarding => {
    const oldUserOnboardingData = userOnboarding.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Using JSON parse and stringify trick so we get a deep copy of the nested oldUserOnboarding
    const newUserOnboardingData = JSON.parse(JSON.stringify(oldUserOnboarding)).map(
      transformOnboardingData
    );
    fs.writeFileSync(
      'old-userOnboardingData.json',
      JSON.stringify(oldUserOnboardingData, undefined, 2)
    );
    fs.writeFileSync(
      'new-userOnboardingData.json',
      JSON.stringify(newUserOnboardingData, undefined, 2)
    );
  });
  return;
} else {
  userOverriddenReqsCollection.get().then(userData => {
    Promise.all(
      userData.docs.map(userDataDocument =>
        userDataDocument.ref.set(transformOverriddenReqsCollection(userDataDocument.data()))
      )
    );
  });
  userOnboardingData.get().then(userData => {
    Promise.all(
      userData.docs.map(userDataDocument =>
        userDataDocument.ref.set(transformOnboardingData(userDataDocument.data()))
      )
    );
  });
}
