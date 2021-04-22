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
const userOverriddenReqsCollection = db.collection('user-overridden-reqs');
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
      const newKey = isChangingSlotName ? [key[0], newName] : [newName, key[1]]; // TODO - factor out
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
  userDataCollection.get().then(userData => {
    const oldUserData = userData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Using JSON parse and stringify trick so we get a deep copy of the nested oldUserData
    const newUserData = JSON.parse(JSON.stringify(oldUserData)).map(transformData);
    fs.writeFileSync('old-userData-semesters.json', JSON.stringify(oldUserData, undefined, 2));
    fs.writeFileSync('new-userData-semesters.json', JSON.stringify(newUserData, undefined, 2));
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
