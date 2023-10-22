/* eslint-disable no-console */
import {
  onboardingDataCollection,
  semestersCollection,
  usernameCollection,
  trackUsersCollection,
} from './firebase-config';

import { getFirstPlan } from '../src/utilities';

const average = (array: readonly number[]) => array.reduce((a, b) => a + b) / array.length;
function seasonToMonth(season: string) {
  switch (season) {
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

// true if a semester is an "old semester," i.e. if a semester on CoursePlan has already passed in real life
// the idea is that old semesters and new semesters represent whether users are planning in the future or just uploading courses
function isOld(semester: { year: number; season: string }) {
  const currentTime = new Date();
  const month = currentTime.getMonth() + 1;
  const year = currentTime.getFullYear();
  if (semester.year > year) {
    return false;
  }
  if (semester.year < year) {
    return true;
  }
  if (seasonToMonth(semester.season) <= month) {
    return true;
  }
  return false;
}

// add all colleges/programs/majors etc. in arr to frequency dict
// TODO this will not show any colleges/grad programs with 0 people.
// Need to look at requirements data and add each to the map with 0 frequency to do so.
function addToFrequencyDictionary(
  categories: readonly { readonly acronym: string }[],
  freqDict: Record<string, number>
) {
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

// adds year to freqDict if not set, otherwise increments frequency by 1
// simplified version of addToFrequencyDictionary for entrance/grad year, as they
// are single elements, not lists, and do not have an acronym prop
function addYearToFrequencyDictionary(year: string, freqDict: Record<string, number>) {
  if (!year) {
    return;
  }

  if (year in freqDict) {
    freqDict[year] += 1;
  } else {
    freqDict[year] = 1;
  }
}

/**
 * TrackUsers outputs user metrics to a Firestore document with timestap based on
 * data from the user-name and user-semesters Firestore collections.
 * Users are only included if they have finished onboarding (and have a document in the username collection)
 *
 * It returns the total number of users (total-users),
 * the total number of active users (total-active-users),
 * the total number of semesters across all users (total-semesters),
 * the average number of semesters per user (avg-semester),
 * the average number of older semesters that are/before the current semester
 * per user (avg-old-semester),
 * the average number of newer semesters that are
 * after the current semester (avg-new-semester),
 * the number of undergrads, grads, and students with both degree types,
 * the frequencies of each college, grad program, major, and minor,
 * the averge number of majors, minors, and exams per undergrad,
 * and the frequencies of each entrance and graduation year.
 */

async function trackUsers() {
  let userData = {};
  let semesterData = {};
  let onboardingData = {};

  // set of all user emails that are in the usernameCollection (and thus finished onboarding)
  const userEmails = new Set();

  await usernameCollection.get().then(usernameQuerySnapshot => {
    let totalUsersCount = 0;

    usernameQuerySnapshot.forEach(doc => {
      userEmails.add(doc.id);
      totalUsersCount += 1;
    });
    const usernameResponse = {
      'total-users': totalUsersCount,
    };

    console.log(usernameResponse);

    userData = {
      totalUsers: usernameResponse['total-users'],
    };
  });

  await semestersCollection.get().then(semesterQuerySnapshot => {
    const numSemestersPerUser: number[] = [];
    const oldSemesters: number[] = [];
    const newSemesters: number[] = [];
    let semesterCount = 0;
    let activeUsersCount = 0;

    semesterQuerySnapshot.forEach(doc => {
      if (!userEmails.has(doc.id)) {
        return;
      }

      const plan = getFirstPlan(doc.data());

      let oldSemesterCount = 0;
      let newSemesterCount = 0;
      plan.semesters.forEach((semester: { year: number; season: string }) => {
        if (isOld(semester)) {
          oldSemesterCount += 1;
        } else {
          newSemesterCount += 1;
        }
        semesterCount += 1;
      });

      if (newSemesterCount > 0) {
        activeUsersCount += 1;
      }

      numSemestersPerUser.push(plan.semesters.length);
      oldSemesters.push(oldSemesterCount);
      newSemesters.push(newSemesterCount);
    });

    const activeUsersResponse = {
      'active-users': activeUsersCount,
    };
    const semesterResponse = {
      'total-semesters': semesterCount,
      'avg-semester': average(numSemestersPerUser),
      'avg-old-semester': average(oldSemesters),
      'avg-new-semster': average(newSemesters),
    };

    console.log(activeUsersResponse);
    console.log(semesterResponse);

    semesterData = {
      totalSemesters: semesterResponse['total-semesters'],
      averageNumberSemesters: semesterResponse['avg-semester'],
      averageNumberNewSemesters: semesterResponse['avg-new-semster'],
      averageNumberOldSemesters: semesterResponse['avg-old-semester'],
    };

    userData = {
      activeUsers: activeUsersResponse['active-users'],
      ...userData,
    };
  });

  await onboardingDataCollection.get().then(onboardingQuerySnapshot => {
    let undergradCount = 0;
    let gradCount = 0;
    let undergradAndGradCount = 0;

    let totalNumMajors = 0;
    let totalNumMinors = 0;
    let totalNumExams = 0;

    const collegeFreq: Record<string, number> = {};
    const programFreq: Record<string, number> = {};
    const majorFreq: Record<string, number> = {};
    const minorFreq: Record<string, number> = {};

    const entranceYearFreq: Record<string, number> = {};
    const gradYearFreq: Record<string, number> = {};

    onboardingQuerySnapshot.forEach(doc => {
      if (!userEmails.has(doc.id)) {
        return;
      }

      const { majors, minors, exam, colleges, gradPrograms, entranceYear, gradYear } = doc.data();

      addToFrequencyDictionary(colleges, collegeFreq);
      addToFrequencyDictionary(gradPrograms, programFreq);
      addToFrequencyDictionary(majors, majorFreq);
      addToFrequencyDictionary(minors, minorFreq);

      addYearToFrequencyDictionary(entranceYear, entranceYearFreq);
      addYearToFrequencyDictionary(gradYear, gradYearFreq);

      const isUndergrad = colleges && colleges.length > 0;
      const isGrad = gradPrograms && gradPrograms.length > 0;

      if (isUndergrad) {
        if (isGrad) {
          undergradAndGradCount += 1;
        } else {
          undergradCount += 1;
        }

        totalNumMajors += majors ? majors.length : 0;
        totalNumMinors += minors ? minors.length : 0;
        totalNumExams += exam ? exam.length : 0;
      } else if (isGrad) {
        gradCount += 1;
      }
    });

    const onboardingResponse = {
      'undergrad-students': undergradCount,
      'grad-students': gradCount,
      'both-undergrad-and-grad-students': undergradAndGradCount,
      'undergrad-college-frequencies': collegeFreq,
      'major-frequencies': majorFreq,
      'minor-frequencies': minorFreq,
      'graduate-program-frequencies': programFreq,
      'average-number-majors-for-undergrads':
        totalNumMajors / (undergradAndGradCount + undergradCount),
      'average-number-minors-for-undergrads':
        totalNumMinors / (undergradAndGradCount + undergradCount),
      'average-number-ap/ib-exams-for-undergrads':
        totalNumExams / (undergradAndGradCount + undergradCount),
      'entrance-year-frequencies': entranceYearFreq,
      'grad-year-frequencies': gradYearFreq,
    };

    console.log(onboardingResponse);

    onboardingData = {
      undergradUsers: onboardingResponse['undergrad-students'],
      gradUsers: onboardingResponse['grad-students'],
      undergradAndGradUsers: onboardingResponse['both-undergrad-and-grad-students'],
      collegeFrequencies: onboardingResponse['undergrad-college-frequencies'],
      majorFrequences: onboardingResponse['major-frequencies'],
      minorFrequencies: onboardingResponse['minor-frequencies'],
      graduateProgramFrequencies: onboardingResponse['graduate-program-frequencies'],
      averageNumberUndergradMajors: onboardingResponse['average-number-majors-for-undergrads'],
      averageNumberUndergradMinors: onboardingResponse['average-number-minors-for-undergrads'],
      averageNumberUndergradAPIBExams:
        onboardingResponse['average-number-ap/ib-exams-for-undergrads'],
      entranceYearFrequencies: onboardingResponse['entrance-year-frequencies'],
      gradYearFrequencies: onboardingResponse['grad-year-frequencies'],
    };
  });

  // Create a document in collection with current timestamp
  const date = new Date(Date.now());
  const docId = date.toISOString();

  const outputData = {
    userData,
    semesterData,
    onboardingData,
    timestamp: date,
  };

  trackUsersCollection.doc(docId).set(outputData);
}

trackUsers();
