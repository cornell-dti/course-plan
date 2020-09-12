const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const userDataCollection = db.collection('userData');

const filteredAllCourses = require('./filtered-all-courses.json');

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

exports.FetchCourses = functions.https.onCall(data => {
  let courseCodes = data.courseCodes.map(a => a.toUpperCase());
  let courses = [];

  // Assume rosters is sorted from least recent to most recent semester
  let rosters = Object.keys(filteredAllCourses);
  // Iterate over rosters starting from most recent semester
  for (let i = rosters.length - 1; i >= 0 && courseCodes.length > 0; i -= 1) {
    let rosterCourses = filteredAllCourses[rosters[i]];
    // Fetch course objects whose code is in courseCodes
    let fetchedCourses = rosterCourses.filter(rosterCourse =>
      courseCodes.indexOf(rosterCourse.subject.concat(' ', rosterCourse.catalogNbr))!= -1);
    
    // Delete course codes of fetchedCourses from courseCodes
    // Update courses with fetchedCourses
    fetchedCourses.forEach((fetchedCourse) => {
      let fetchedCourseCode = fetchedCourse.subject.concat(' ', fetchedCourse.catalogNbr);
      courseCodes = courseCodes.filter(courseCode => courseCode != fetchedCourseCode);

      courses.push(fetchedCourse);
    });

  }
  // Log courses that could not be fetched
  courseCodes.map(a => logUnfetchedCourseCode(a));
  
  return {
    courses: courses
  };
});

