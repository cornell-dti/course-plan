import firebase from 'firebase';
import 'firebase/firestore';

// firebase init goes here
const config = {
  apiKey: 'AIzaSyDkKOpImjbjS2O0RhIQNJLQXx2SuYbxsfU',
  authDomain: 'cornell-courseplan.firebaseapp.com',
  databaseURL: 'https://cornell-courseplan.firebaseio.com',
  projectId: 'cornell-courseplan',
  storageBucket: '',
  messagingSenderId: '1031551180906',
  appId: '1:1031551180906:web:bdcea6ec074e673ea72a13'
};
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
const coursesCollection = db.collection('courses');
const userDataCollection = db.collection('userData');
const emailsCollection = db.collection('emails');

export {
  db, auth, currentUser, usersCollection, coursesCollection, userDataCollection, emailsCollection
};
