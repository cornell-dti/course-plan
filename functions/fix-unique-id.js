const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const db = admin.firestore();
const semestersCollection = db.collection('user-semesters');
const uniqueIncrementerCollection = db.collection('user-unique-incrementer');

const transformData = oldSemesters => {
  const semesters = JSON.parse(JSON.stringify(oldSemesters));

  let uniqueIncrementer = 0;
  semesters.forEach(semester =>
    semester.courses.forEach(course => {
      course.uniqueID = uniqueIncrementer;
      uniqueIncrementer += 1;
    })
  );

  return { semesters, uniqueIncrementer };
};

if (process.argv[2] === '--dry-run') {
  semestersCollection.get().then(userSemesters => {
    const oldSemesters = {};
    const newSemesters = {};
    const newUniqueIncrementers = {};
    userSemesters.forEach(doc => {
      const old = doc.data().semesters;
      oldSemesters[doc.id] = old;
      const { semesters, uniqueIncrementer } = transformData(old);
      newSemesters[doc.id] = semesters;
      newUniqueIncrementers[doc.id] = uniqueIncrementer;
    });
    fs.writeFileSync('old-semesters.json', JSON.stringify(oldSemesters, undefined, 2));
    fs.writeFileSync('new-semesters.json', JSON.stringify(newSemesters, undefined, 2));
    fs.writeFileSync('new-unique-incrementers.json', JSON.stringify(newSemesters, undefined, 2));
  });
} else {
  semestersCollection.get().then(userSemesters => {
    userSemesters.forEach(doc => {
      const old = doc.data().semesters;
      const { semesters, uniqueIncrementer } = transformData(old);
      doc.ref.set({ semesters });
      uniqueIncrementerCollection.doc(doc.id).set({ uniqueIncrementer });
    });
  });
}
