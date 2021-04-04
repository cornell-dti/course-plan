const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const db = admin.firestore();
const onboardingCollection = db.collection('user-onboarding-data');

// const oldFullName = 'Arts and Sciences';
const oldAcronym = 'AS';
const newAcronym = 'AS1'; // Before Fall 2020

const transformData = oldColleges => {
  const colleges = JSON.parse(JSON.stringify(oldColleges));

  colleges.forEach(college => {
    if (college.acronym == oldAcronym) {
      college.acronym = newAcronym;
    }
  });

  return colleges;
};

if (process.argv[2] === '--dry-run') {
  onboardingCollection.get().then(userColleges => {
    const oldColleges = {};
    const newColleges = {};
    userColleges.forEach(doc => {
      const old = doc.data().colleges;
      oldColleges[doc.id] = old;
      const colleges = transformData(old);
      newColleges[doc.id] = colleges;
    });
    fs.writeFileSync('old-colleges.json', JSON.stringify(oldColleges, undefined, 2));
    fs.writeFileSync('new-colleges.json', JSON.stringify(newColleges, undefined, 2));
  });
} else {
  onboardingCollection.get().then(userColleges => {
    userColleges.forEach(doc => {
      const old = doc.data().colleges;
      const colleges = transformData(old);
      doc.ref.update({ colleges });
    });
  });
}
