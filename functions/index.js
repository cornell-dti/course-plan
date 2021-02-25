const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const userDataCollection = db.collection('userData');

const fs = require('fs');

let average = array => array.reduce((a, b) => a + b) / array.length;
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
  }
}
function isOld(semester) {
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var year = currentTime.getFullYear();
  if (semester.year > year) {
    return false;
  } else if (semester.year < year) {
    return true;
  } else {
    if (typeToMonth(semester.type) <= month) {
      return true;
    } else {
      return false;
    }
  }
}

exports.TrackUsers = functions.https.onRequest(async (req, res) => {
  const arr = [];
  let count = 0;
  const semester = [];
  const oldSemester = [];
  const newSemester = [];
  const semesterCount = 0;
  userDataCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push(doc.data().name.firstName);

        let oldCount = 0;
        let newCount = 0;
        doc.data().semesters.forEach(function (semester) {
          if (isOld(semester)) {
            oldCount++;
          } else {
            newCount++;
          }
          semesterCount++;
        });
        semester.push(doc.data().semesters.length);
        oldSemester.push(oldCount);
        newSemester.push(newCount);
        count++;
      });

      const response = {
        people: arr,
        'total-users': count,
        'total-semesters': semesterCount,
        'avg-semester': average(semester),
        'avg-old-semester': average(oldSemester),
        'avg-new-semster': average(newSemester),
      };
      return response;
    })
    .then(function (response) {
      console.log(response);
      res.send(response);
      return response;
    })
    .catch(error => {
      console.log('Error getting document:', error);
      throw new Error("Profile doesn't exist");
    });
});
