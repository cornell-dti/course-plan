const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const userDataCollection = db.collection('userData');

const fs = require('fs'); 

const filteredCoursesPaths = fs.readdirSync('./').filter(
  path => path.includes('filtered') && path.includes('courses.json')
);

const filteredAllCourses = filteredCoursesPaths.map(path => require('./' + path))
                                               .reduce((accum, currentValue) => Object.assign(accum, currentValue));

let average = (array) => array.reduce((a, b) => a + b) / array.length;
function typeToMonth(type){
  switch(type) {
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
    if(typeToMonth(semester.type) <= month){
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
  var semesterCount = 0; 
    userDataCollection.get().then(function(querySnapshot) {
     
        querySnapshot.forEach(function(doc) {

            arr.push(doc.data().name.firstName);

            var oldCount = 0;
            var newCount = 0; 
            doc.data().semesters.forEach(
              function(semester) {
                if(isOld(semester)){
                  oldCount++;
                }else{
                  newCount++;
                }
                semesterCount++;
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
          "total-semesters": semesterCount,
          "avg-semester" : average(semester),
          "avg-old-semester" : average(oldSemester),
          "avg-new-semster" : average(newSemester)
      }
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

function logUnfetchedCourseCode(courseCode) {
  console.log("Unable to fetch course data for course code: ", courseCode);
}

function typeToOrderedNumber(type){
  switch(type) {
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

function compareRosters(roster1, roster2) {
  let type1 = roster1.slice(0,2);
  let year1 = roster1.slice(2);
  let type2 = roster2.slice(0, 2);
  let year2 = roster2.slice(2);

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

function sortByMostRecentRosters(rosters) {
  // Sorts from most recent roster
  return rosters.sort(compareRosters);
}

/** FetchCourses fetches the most recent course objects for the list of 
 * courseCodes in its input data object. 
 * 
 * In order to be a valid request, there must be a courseCodes property that is 
 * a list of course code strings (e.g. 'CS 1110').
 */
exports.FetchCourses = functions.https.onCall(data => {
  let courseCodes = data.courseCodes.map(a => a.toUpperCase());
  let fetchedCourses = [];

  // Sort rosters from most recent to least recent
  let rosters = sortByMostRecentRosters(Object.keys(filteredAllCourses));
  for (let i = 0; i < rosters.length && courseCodes.length > 0; i += 1) {
    const roster = rosters[i];
    let allRosterCourses = filteredAllCourses[roster];
    // Filter for course objects whose code is in courseCodes
    let filteredCourses = allRosterCourses.filter(rosterCourse =>
      courseCodes.indexOf(rosterCourse.subject.concat(' ', rosterCourse.catalogNbr))!= -1);
    
    // Delete course codes of filteredCourses from courseCodes
    // Update fetchedCourses with filteredCourses
    filteredCourses.forEach((filteredCourse) => {
      filteredCourse.roster = roster; // Manually add roster field
      let filteredCourseCode = filteredCourse.subject.concat(' ', filteredCourse.catalogNbr);
      courseCodes = courseCodes.filter(courseCode => courseCode != filteredCourseCode);

      fetchedCourses.push(filteredCourse);
    });

  }
  // Log courses that could not be fetched
  courseCodes.map(a => logUnfetchedCourseCode(a));
  
  return {
    courses: fetchedCourses
  };
});

