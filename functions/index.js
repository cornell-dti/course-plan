const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const usernameCollection = db.collection('user-name');
const semestersCollection = db.collection('user-semesters');

const average = array => array.reduce((a, b) => a + b) / array.length;
function typeToMonth(type) {
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
      throw new Error();
  }
}
function isOld(semester) {
  const currentTime = new Date();
  const month = currentTime.getMonth() + 1;
  const year = currentTime.getFullYear();
  if (semester.year > year) {
    return false;
  }
  if (semester.year < year) {
    return true;
  }
  if (typeToMonth(semester.type) <= month) {
    return true;
  }
  return false;
}
/**
 * TrackUsers returns user metrics based on
 * data from the user-name and user-semesters Firestore collections.
 *
 * It returns the total number of users (total-users),
 * the total number of semesters across all users (total-semesters),
 * the average number of semesters per user (avg-semester),
 * the average number of older semesters that are/before the current semester
 * per user (avg-old-semester),
 * and the average number of newer semesters that are
 * after the current semester (avg-new-semester).
 */

exports.TrackUsers = functions.https.onRequest(async (req, res) => {
  let totalUsersCount = 0;
  const semesters = [];
  const oldSemesters = [];
  const newSemesters = [];
  let semesterCount = 0;

  const usernamePromise = usernameCollection.get().then(usernameQuerySnapshot => {
    usernameQuerySnapshot.forEach(doc => {
      totalUsersCount += 1;
    });
    const usernameResponse = {
      'total-users': totalUsersCount,
    };
    return usernameResponse;
  });

  const semesterPromise = semestersCollection.get().then(semesterQuerySnapshot => {
    semesterQuerySnapshot.forEach(doc => {
      let oldSemesterCount = 0;
      let newSemesterCount = 0;
      doc.data().semesters.forEach(semester => {
        if (isOld(semester)) {
          oldSemesterCount += 1;
        } else {
          newSemesterCount += 1;
        }
        semesterCount += 1;
      });
      semesters.push(doc.data().semesters.length);
      oldSemesters.push(oldSemesterCount);
      newSemesters.push(newSemesterCount);
    });
    const semesterResponse = {
      'total-semesters': semesterCount,
      'avg-semester': average(semesters),
      'avg-old-semester': average(oldSemesters),
      'avg-new-semster': average(newSemesters),
    };
    return semesterResponse;
  });

  Promise.all([usernamePromise, semesterPromise]).then(promiseResponses => {
    const response = Object.assign({}, ...promiseResponses);
    // eslint-disable-next-line no-console
    console.log(response);
    res.send(response);
    return response;
  });
});
