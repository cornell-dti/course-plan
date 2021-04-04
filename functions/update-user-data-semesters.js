// Updates the order of the semesters in the userData collection to be in order
// from most recent to least recent

const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const db = admin.firestore();
const userDataCollection = db.collection('userData');

/**
 * @param {*} type of the season. 'Spring' | 'Summer' | 'Fall' | 'Winter'
 * @returns the ordered number that represents the type of season. 1 is returned
 * for 'Spring', 6 is returned for 'Summer', 8 is returned for 'Fall', and 12 is
 * returned for 'Winter'
 */
function typeToOrderedNumber(type) {
  switch (type) {
    case 'Spring':
      return 1;
    case 'Summer':
      return 6;
    case 'Fall':
      return 8;
    case 'Winter':
      return 12;
    default:
  }
}

/**
 * Compares semesterObject1 and semesterObject2 based on type and year properties
 * @param {*} semesterObject1 is an object that is in the userData.semesters array
 * @param {*} semesterObject2 is an object that is in the userData.semesters array
 * @returns 1 if semesterObject2 occurs more recently than semesterObject1,
 * -1 if semesterObject1 occurs more recently than semesterObject2, 0 otherwise.
 */
function compareSemesterObjectsByTypeAndYear(semesterObject1, semesterObject2) {
  const type1 = semesterObject1.type;
  const type2 = semesterObject2.type;
  const year1 = semesterObject1.year;
  const year2 = semesterObject2.year;

  if (year2 > year1) {
    // semesterObject2 has more recent year than semesterObject1
    return 1;
  } else if (year1 > year2) {
    // semesterObject1 has more recent year than semesterObject2
    return -1;
  } else if (typeToOrderedNumber(type2) > typeToOrderedNumber(type1)) {
    // semesterObject2 has more recent semester type than semesterObject1
    return 1;
  } else if (typeToOrderedNumber(type1) > typeToOrderedNumber(type2)) {
    // semesterObject1 has more recent semester type than semesterObject2
    return -1;
  } else {
    return 0;
  }
}

/**
 *
 * @param {*} semesters is the userData.semesters array on Firestore
 * @returns semesters sorted from most recent to least recent type and year
 */
function semesterObjectsByMostRecentTypeAndYear(semesters) {
  // Sorts from most recent type and year
  return semesters.sort(compareSemesterObjectsByTypeAndYear);
}

const transformData = data => ({
  ...data,
  semesters: semesterObjectsByMostRecentTypeAndYear(data.semesters),
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
  userDataCollection.get().then(userData => {
    Promise.all(
      userData.docs.map(userDataDocument =>
        userDataDocument.ref.set(transformData(userDataDocument.data()))
      )
    );
  });
}
