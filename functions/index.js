const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const usernameCollection = db.collection('user-name');
const semestersCollection = db.collection('user-semesters');
const onboardingCollection = db.collection('user-onboarding-data');

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

// add all colleges/programs/majors etc. in arr to frequency dict
// TODO this will not show any colleges/grad programs with 0 people.
// Need to look at requirements data and add each to the map with 0 frequency to do so.
function addToFrequencyDictionary(categories, freqDict) {
  // if no colleges/programs/majors/minors for this doc, skip
  if (!categories) {
    return;
  }

  categories.forEach(category => {
    if (category.acronym in freqDict) {
      freqDict[category.acronym] += 1;
    } else {
      freqDict[category.acronym] = 1;
    }
  });
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

  const onboardingPromise = onboardingCollection.get().then(onboardingQuerySnapshot => {
    let undergradCount = 0;
    let gradCount = 0;
    let undergradAndGradCount = 0;

    let collegeFreq = {};
    let programFreq = {};
    let majorFreq = {};
    let minorFreq = {};

    for (let i in onboardingQuerySnapshot.docs) {
      const doc = onboardingQuerySnapshot.docs[i];

      addToFrequencyDictionary(doc.data().colleges, collegeFreq);
      addToFrequencyDictionary(doc.data().gradPrograms, programFreq);
      addToFrequencyDictionary(doc.data().majors, majorFreq);
      addToFrequencyDictionary(doc.data().minors, minorFreq);

      let isUndergrad = false;
      let isGrad = false;

      if (isUndergrad && isGrad) {
        undergradAndGradCount += 1;
      } else if (isUndergrad) {
        undergradCount += 1;
      } else if (isGrad) {
        gradCount += 1;
      }
    }

    const onboardingResponse = {
      'undergrad-students': undergradCount,
      'grad-students': gradCount,
      'both-undergrad-and-grad-students': undergradAndGradCount,
      'undergrad-college-frequencies': collegeFreq,
      'major-frequencies': majorFreq,
      'minor-frequencies': minorFreq,
      'graduate-program-frequencies': programFreq,
    };

    return onboardingResponse;
  });

  Promise.all([usernamePromise, semesterPromise, onboardingPromise]).then(promiseResponses => {
    const response = Object.assign({}, ...promiseResponses);
    // eslint-disable-next-line no-console
    console.log(response);
    res.send(response);
    return response;
  });
});
