
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

function getCurrentYear(){
    var d = new Date(); 
    d.getFullYear(); 
}
function getCurrentSeason(){
    var d = new Date(); 
    d.getMonth(); 
    if(d>0 && d<6){
        return 'Spring'
    }
    else if(d>5 && d<8){
        return 'Summer'
    }
    else if(d>7 && d<13){
        return 'Fall'
    }
    else{
        return 'Winter' 
    }


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
    res.send(303,size.toString());
});
//Returns all the semesters each user has
exports.trackSemesters = functions.https.onRequest(async (req, res) => {
    admin.firestore().collection("userData").get()
    .then(snapshot => {
        const data = snapshot.data()
        res.send(data);
    })
    .catch(error => {
        // Handle the error
        console.log(error)
        res.status(500).send(error.toString())
    })
});