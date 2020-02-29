/*
const functions = require('firebase-functions');
const admin = require('firebase-admin'); 
const firebase = require('firebase/app');

require('firebase/auth');
require('firebase/firestore');

// Development config
const developmentConfig = {
  apiKey: 'AIzaSyAfePy1Tbrqm55bYR7BHHl50r-9NTVj0Rs',
  authDomain: 'cornelldti-courseplan-dev.firebaseapp.com',
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
  projectId: 'cornelldti-courseplan-dev',
  storageBucket: '',
  messagingSenderId: '321304703190',
  appId: '1:321304703190:web:2f2fefb4a0284465b99977',
};
 firebase.initializeApp(developmentConfig);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
*/
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const userDataCollection = db.collection('userData');

let average = (array) => array.reduce((a, b) => a + b) / array.length;

function isOld (semester){
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var year = currentTime.getFullYear();
  if(semester.year > year){
    return false;
  }
  else if (semester.year < year){
    return true;
  }
  else{
    if(semester.month <= month){
      return true;
    }else{
      return false;
    }
  }   
}

exports.TrackUsers = functions.https.onRequest(async (req, res) => {
  var arr = []; 
  var count = 0; 
  var semester = [];
  var oldSemester = [];
  var newSemester = [];
    userDataCollection.get().then(function(querySnapshot) {
     
        querySnapshot.forEach(function(doc) {

            arr.push( doc.data().name.firstName);
            console.log(doc.id, " => ", doc.data().name.firstName);

            var oldCount = 0;
            var newCount = 0; 
            doc.data().semesters.forEach(
              function(semester) {
                if(isOld(semester)){
                  oldCount++;
                }else{
                  newCount;
                }
              }
            )
            semester.push(doc.data().semesters.length);
            oldSemester.push(oldCount);
            newSemester.push(newCount);
            count++;
        })
        
        const response = {
          "people": arr,
          "total-users": count,
          "avg-semester" : average(semester),
          "avg-old-semester" : average(oldSemester),
          "avg-new-semster" : average(newSemester)
      }
        console.log(arr + "arr");
        return response
    }).then(function(response) {  
      console.log(response);
      res.send(response);
      return response
     })
    .catch(error => {
        console.log('Error getting document:', error);
        throw new Error("Profile doesn't exist")
      });
      
});

