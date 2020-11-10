const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const userDataCollection = db.collection('userData');

const fs = require('fs');
const { parse } = require('path');

const filteredCoursesPaths = fs.readdirSync('./filtered_courses/');

const filteredAllCourses = filteredCoursesPaths
  .map(path => require('./filtered_courses/' + path))
  .reduce((accum, currentValue) => Object.assign(accum, currentValue));

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
  var arr = [];
  var count = 0;
  var semester = [];
  var oldSemester = [];
  var newSemester = [];
  var semesterCount = 0;
  userDataCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push(doc.data().name.firstName);

        var oldCount = 0;
        var newCount = 0;
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

function typeToOrderedNumber(type) {
  switch (type) {
    case 'WI':
      return 0;
    case 'SP':
      return 1;
    case 'SU':
      return 2;
    case 'FA':
      return 3;
    default:
  }
}

function compareDataObjectsByRosters(dataObject1, dataObject2) {
  const roster1 = dataObject1.roster;
  const roster2 = dataObject2.roster;
  const type1 = roster1.slice(0, 2);
  const year1 = roster1.slice(2);
  const type2 = roster2.slice(0, 2);
  const year2 = roster2.slice(2);

  if (year2 > year1) {
    // roster2 has more recent year than roster1
    return 1;
  } else if (year1 > year2) {
    // roster1 has more recent year than roster2
    return -1;
  } else if (typeToOrderedNumber(type2) > typeToOrderedNumber(type1)) {
    // roster2 has more recent semester type than roster1
    return 1;
  } else if (typeToOrderedNumber(type1) > typeToOrderedNumber(type2)) {
    // roster1 has more recent semester type than roster2
    return -1;
  } else {
    return 0;
  }
}

function sortDataCrseInfoByMostRecentRosters(dataCrseInfo) {
  // Sorts from most recent roster
  return dataCrseInfo.sort(compareDataObjectsByRosters);
}

function logUnfetchedCrseCode(crseCode, roster) {
  console.log(`Unable to fetch course data for crseCode: ${crseCode} in roster: ${roster}`);
}

function logUnfetchedCrseId(crseId, roster) {
  console.log(`Unable to fetch course data for crseId: ${crseId} in roster: ${roster}`);
}

function logInvalidRoster(roster) {
  console.log(`Inputted roster: ${roster} is invalid`);
}

function cleanDataCrseInfoByRoster(dataCrseInfo) {
  let cleanedDataCrseInfo = [];
  dataCrseInfo.forEach(dataObject => {
    let roster = dataObject.roster;
    if (typeof roster === 'string' && roster.length === 4) {
      roster = roster.toUpperCase();

      let type = roster.slice(0, 2);
      const validTypes = ['WI', 'SP', 'SU', 'FA'];

      let year = roster.slice(2);
      if (!(validTypes.includes(type) && parseInt(year, 10))) {
        logInvalidRoster(roster);
      } else {
        // Update dataObject.roster with uppercased roster
        dataObject.roster = roster;
        cleanedDataCrseInfo.push(dataObject);
      }
    } else {
      logInvalidRoster(roster);
    }
  });
  return cleanedDataCrseInfo;
}

function cleanCrseCodes(crseCodes, roster) {
  let cleanedCrseCodes = [];
  crseCodes.forEach(crseCode => {
    if (typeof crseCode === 'string') {
      cleanedCrseCodes.push(crseCode.toUpperCase());
    } else {
      console.log('crseCodes must be an array of strings');
      logUnfetchedCrseCode(crseCode, roster);
    }
  });
  return cleanedCrseCodes;
}

function cleanCrseIds(crseIds, roster) {
  let cleanedCrseIds = [];
  crseIds.forEach(crseId => {
    let crseIdNumber = parseInt(crseId, 10);
    if (crseIdNumber) {
      cleanedCrseIds.push(crseIdNumber);
    } else {
      console.log('crseIds must be an array of numbers');
      logUnfetchedCrseId(crseId, roster);
    }
  });
  return cleanedCrseIds;
}

function fetchCoursesWithCrseCodes(roster, crseCodes, fetchedCoursesSoFar) {
  let fetchedCourses = [];

  // Filter for course objects whose crseCode is in crseCodes
  // and for course objects that are not in fetchedCoursesSoFar
  const filteredCourses = filteredAllCourses[roster].filter(
    rosterCourse =>
      crseCodes.includes(`${rosterCourse.subject} ${rosterCourse.catalogNbr}`) &&
      !fetchedCoursesSoFar.some(
        course =>
          course.subject === rosterCourse.subject && course.catalogNbr === rosterCourse.catalogNbr
      )
  );

  // Update fetchedCourses with filteredCourses
  filteredCourses.forEach(filteredCourse => {
    filteredCourse.roster = roster; // Manually add roster field

    let filteredCrseCode = `${filteredCourse.subject} ${filteredCourse.catalogNbr}`;
    // Remove already fetched course codes
    crseCodes = crseCodes.filter(crseCode => crseCode !== filteredCrseCode);

    fetchedCourses.push(filteredCourse);
  });

  // Log courses that could not be fetched
  crseCodes.map(crseCode => logUnfetchedCrseCode(crseCode, roster));
  return fetchedCourses;
}

function fetchCoursesWithCrseIds(roster, crseIds, fetchedCoursesSoFar) {
  let fetchedCourses = [];

  // Filter for course objects whose crseId is in crseIds
  // and for course objects that are not in fetchedCoursesSoFar
  const filteredCourses = filteredAllCourses[roster].filter(
    rosterCourse =>
      crseIds.includes(rosterCourse.crseId) &&
      !fetchedCoursesSoFar.some(
        course =>
          course.subject === rosterCourse.subject && course.catalogNbr === rosterCourse.catalogNbr
      )
  );

  // Update fetchedCourses with filteredCourses
  filteredCourses.forEach(filteredCourse => {
    filteredCourse.roster = roster; // Manually add roster field

    let filteredCrseId = filteredCourse.crseId;

    // Remove already fetched course ids
    crseIds = crseIds.filter(crseId => crseId !== filteredCrseId);

    fetchedCourses.push(filteredCourse);
  });

  // Log courses that could not be fetched
  crseIds.map(crseId => logUnfetchedCrseId(crseId, roster));

  return fetchedCourses;
}

/** FetchCourses fetches the course objects for the
 * crseInfo in its input data object.
 *
 * An example of a data object:
 * {"data": {"crseInfo": [{"roster": "SP20", "crseCodes": ["CS 1110"],
 * "crseIds": [358578]}], "allowSameCourseForDifferentRosters": true}}
 *
 * In this case we want to get the course objects that correspond to the "CS 1110"
 * crseCode for the "SP20" roster and all the course objects that correspond to the
 * crseId 358578 for the "SP20" roster. Since allowSameCourseForDifferentRosters
 * is set to true, we are allowing for the same courses in different rosters to be fetched.
 *
 * In order to be a valid request, there must be a crseInfo property that is a
 * list of objects with the roster prop. crseCodes and crseIds are optional.
 * Also, there must be an allowSameCourseForDifferentRosters property that is
 * a boolean.
 */
exports.FetchCourses = functions.https.onCall(data => {
  // Total accumulator of fetched courses
  let fetchedCourses = [];

  // Iterate over each dataObject in data.crseInfo
  // {"roster": "SP20", "crseCodes": ["CS 1110"], "crseIds": [358578]} is an example
  // of a dataObject
  const dataCrseInfo = sortDataCrseInfoByMostRecentRosters(
    cleanDataCrseInfoByRoster(data.crseInfo)
  );
  dataCrseInfo.forEach(dataObject => {
    let roster = dataObject.roster;
    // make [] in case dataObject.crseCodes is undefined
    // e.g. if dataObject is {"roster": "SP20", "crseIds": [358578]}
    let crseCodes = dataObject.crseCodes || [];
    // make [] in case dataObject.crseIds is undefined
    // e.g. if dataObject is {"roster": "SP20", "crseCodes": ["CS 1110"]}
    let crseIds = dataObject.crseIds || [];

    // Keeping track of the fetched courses so far
    // If !allowSameCourseForDifferentRosters then we do not want to fetch
    // courses that have already been fetched and added to fetchedCourses.
    // Else, we do not want to fetch courses that exist in []
    let fetchedCoursesSoFar = data.allowSameCourseForDifferentRosters ? [] : fetchedCourses;

    // First fetch any course objects with the provided crseCodes for this roster
    crseCodes = cleanCrseCodes(crseCodes, roster);
    const fetchedCoursesWithCrseCodes = fetchCoursesWithCrseCodes(
      roster,
      crseCodes,
      fetchedCoursesSoFar
    );
    fetchedCourses = fetchedCourses.concat(fetchedCoursesWithCrseCodes);

    // Updating fetchedCoursesSoFar after fetchCoursesWithCrseCodes()
    // If !allowSameCourseForDifferentRosters then we do not want to fetch
    // courses that have already been fetched and added to fetchedCourses.
    // Else, we do not want to fetch courses for this roster that have already
    // been fetched with crseCodes.
    fetchedCoursesSoFar = data.allowSameCourseForDifferentRosters
      ? fetchedCoursesWithCrseCodes
      : fetchedCourses;

    // Fetch any course objects with the provided crseIds for this roster
    crseIds = cleanCrseIds(crseIds, roster);
    const fetchedCoursesWithCrseIds = fetchCoursesWithCrseIds(roster, crseIds, fetchedCoursesSoFar);
    fetchedCourses = fetchedCourses.concat(fetchedCoursesWithCrseIds);
  });

  return {
    courses: fetchedCourses,
  };
});
