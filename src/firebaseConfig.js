const firebase = require('firebase/app');

require('firebase/auth');
require('firebase/firestore');

let config;

if (process.env.VUE_APP_FIREBASE_MODE === 'prod') {
  // Production config
  config = {
    apiKey: 'AIzaSyDkKOpImjbjS2O0RhIQNJLQXx2SuYbxsfU',
    authDomain: 'cornell-courseplan.firebaseapp.com',
    databaseURL: 'https://cornell-courseplan.firebaseio.com',
    projectId: 'cornell-courseplan',
    storageBucket: '',
    messagingSenderId: '1031551180906',
    appId: '1:1031551180906:web:bdcea6ec074e673ea72a13',
    measurementId: 'G-8B1JVCBX0Z'
  };
} else {
  config = {
    apiKey: 'AIzaSyAfePy1Tbrqm55bYR7BHHl50r-9NTVj0Rs',
    authDomain: 'cornelldti-courseplan-dev.firebaseapp.com',
    databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
    projectId: 'cornelldti-courseplan-dev',
    storageBucket: '',
    messagingSenderId: '321304703190',
    appId: '1:321304703190:web:2f2fefb4a0284465b99977'
  };
}

firebase.initializeApp(config);

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
const whitelistCollection = db.collection('betaWhitelist');
const landingEmailsCollection = db.collection('landingEmails');

module.exports = {
  // Temp: removed coursesCollection
  db, auth, currentUser, usersCollection, userDataCollection, landingEmailsCollection, whitelistCollection
};
