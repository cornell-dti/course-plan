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
/** True if the name we are changing is the name of a requirement.
 * False if the name we are changing is the name of a slot. */
const isChangingReqName;
/**
 * Requirement name of the slot name you want to update.
 * Only define if you are changing the slot name.
 */
const reqNameOfSlot;
/**
 * Goes through object and updates key.
 */
const updateObjectProperty = doc => {
  const newDoc = {};
  for (const [reqName, value] of Object.entries(doc)) {
    if (reqName === oldName) {
      newDoc[newName] = value;
    } else {
      newDoc[reqName] = value;
    }
  }
  return newDoc;
};
/**
 *
 * Goes through each property and checks if its value (an object) has the
 * name and updates it.
 * (Used for slot name updates in user-overridden-requirements)
 */
const updateObjectValue = doc => {
  const newDoc = {};
  for (const [reqName, value] of Object.entries(doc)) {
    if (reqNameOfSlot === reqName && value[oldName] !== undefined) {
      // check for slot name
      newDoc[reqName] = updateObjectProperty(value);
    } else {
      newDoc[reqName] = value;
    }
  }
  return newDoc;
};

/**
 * Updates the exam property in the user-onboarding-data collection.
 */
const updateExamProperty = doc => {
  return doc.map(exam => {
    return {
      ...exam,
      optIn: isChangingReqName
        ? updateObjectProperty(exam.optIn)
        : updateOnboardingSlotName(exam.optIn),
      optOut: isChangingReqName
        ? updateObjectProperty(exam.optOut)
        : updateOnboardingSlotName(exam.optOut),
    };
  });
};

const updateOnboardingSlotName = doc => {
  const newDoc = {};
  for (const [reqName, value] of Object.entries(doc)) {
    if (reqName === reqNameOfSlot && value.includes(oldName)) {
      value.map(slot => (slot !== oldName ? slot : newName));
      newDoc[reqName] = value;
    } else {
      newDoc[reqName] = value;
    }
  }
};

const transformOverriddenReqsCollection = doc =>
  isChangingReqName ? updateObjectProperty(doc) : updateObjectValue(doc);

const transformOnboardingData = doc => ({
  ...doc,
  exam: updateExamProperty(doc.exam),
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
