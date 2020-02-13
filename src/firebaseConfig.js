const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

// firebase init goes here
const config = {
  apiKey: 'AIzaSyDkKOpImjbjS2O0RhIQNJLQXx2SuYbxsfU',
  authDomain: 'cornell-courseplan.firebaseapp.com',
  databaseURL: 'https://cornell-courseplan.firebaseio.com',
  projectId: 'cornell-courseplan',
  storageBucket: '',
  messagingSenderId: '1031551180906',
  appId: '1:1031551180906:web:bdcea6ec074e673ea72a13',
  measurementId: 'G-8B1JVCBX0Z'
};
firebase.initializeApp(config);
const analytics = firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;

// // date issue fix according to firebase
// const settings = {
//   timestampsInSnapshots: true
// }
// db.settings(settings)

// firebase collections
const usersCollection = db.collection('users');
// const coursesCollection = db.collection('courses');
const userDataCollection = db.collection('userData');
const alphaWhitelistCollection = db.collection('alphaWhitelistV2');
const landingEmailsCollection = db.collection('landingEmails');

module.exports = {
  // Temp: removed coursesCollection
  db, auth, analytics, currentUser, usersCollection, userDataCollection, landingEmailsCollection, alphaWhitelistCollection
};
