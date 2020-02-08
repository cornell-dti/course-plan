const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

function getMarkers() {
    const markers = [];
    await firebase.firestore().collection('events').get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
        markers.push(doc.data());
      });
    });
    return markers;
  }
var size = 0;
function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          size++;
          console.log('user', userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
  }
//Returns all the users that have signed up on firebase
exports.trackUsers = functions.https.onRequest(async (req, res) => {
    size = 0;
    listAllUsers();
    res.redirct(303,size.toString());
});

//Returns all the semesters each user has
exports.trackSemesters = functions.https.onRequest(async (req, res) => {
    const snapshot = await firebase.firestore().collection('userData').get()
    const documents = [];
    snapshot.forEach(doc => {
       documents[doc.id] = doc.data().semesters.length;
    });
    res.redirct(303,documents.toString());
});