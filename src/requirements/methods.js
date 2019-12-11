const fs = require('fs');
const request = require('request');
const fb = require('../firebaseConfig.js');

/** Main function to implement
 * Given courses already taken, the major, school, and year you want to search
 *
 * @return a list of dictionaries, with each dictionary being a requirement and information as to
 *  whether they were fulfilled or not
 */

async function getRequirements(coursesTaken, college, major, isTransfer = false) {
  const fb = require('../firebaseConfig.js');
  // TODO: make it so that it takes in classes corresponding with years/semesters for most accurate information
  let totalCreditsTaken = 0;
  const coursesTakenWithInfo = {};
  for (const courseTaken of coursesTaken) {
    const courseInfo = await getCourseInfo(courseTaken);
    totalCreditsTaken += courseInfo.enrollGroups.unitsMaximum;
    coursesTakenWithInfo[courseTaken] = courseInfo;
  }

  // Terminate firebase connection
  fb.app.delete();

  // prepare final output JSONs
  let finalRequirementJSONs = [];

  const reqsData = JSON.parse(fs.readFileSync('reqs.json'));

  // PART 1: check university requirements
  if (!reqsData.university) throw new Error('University requirements not found.');
  const universityReqs = reqsData.university;
  finalRequirementJSONs = finalRequirementJSONs.concat(
    await iterateThroughRequirements(coursesTakenWithInfo, universityReqs.requirements)
  );

  // PART 2: check college requirements
  if (!(college in reqsData.college)) throw new Error('College not found.');
  const collegeReqs = reqsData.college[college];
  finalRequirementJSONs = finalRequirementJSONs.concat(
    await iterateThroughRequirements(coursesTakenWithInfo, collegeReqs.requirements)
  );

  // PART 3: check major reqs
  if (!(major in reqsData.major)) throw new Error('Major not found.');
  const majorReqs = reqsData.major[major];
  finalRequirementJSONs = finalRequirementJSONs.concat(
    await iterateThroughRequirements(coursesTakenWithInfo, majorReqs.requirements)
  );

  // console.log(finalRequirementJSONs);
  return finalRequirementJSONs;
}

/**
 * Loops through requirement data and compare all courses on (to identify whether they satisfy the requirement)
 * @param {*} coursesTakenWithInfo : object of courses taken with API information (CS 2110: {info})
 * @param {*} requirements : requirements in requirements format from reqs.json (college, major, or university requirements)
 */
async function iterateThroughRequirements(coursesTakenWithInfo, requirements) {
  // array of requirement status information to be returned
  const requirementJSONs = [];
  const count = 0;

  // helper to recursively call when an object has subpaths
  function helper(coursesTakenWithInfo, requirements, parentName = null) {
    for (const requirement of requirements) {
      // if(!isTransfer && requirement.applies === "transfers") continue;
      // temporarily skip these until we can implement them later

      // Recursively call function if there are subpaths
      if (requirement.multiplePaths) {
        const requirementName = requirement.name;
        requirementJSONs.push({ name: requirementName, paths: [], isComplete: false });
        helper(coursesTakenWithInfo, requirement.paths, requirementName);
        continue;
      }

      let totalRequirementCredits = 0;
      let totalRequirementCount = 0;
      const coursesThatFulilledRequirement = [];
      // check each course to see if it fulfilled that requirement

      const codes = Object.keys(coursesTakenWithInfo);

      // If not in path, push new object to requirementsJSONs
      for (const code of codes) {
        // console.log('I am looking at the data of:', requirement.includes);

        const courseInfo = coursesTakenWithInfo[code];

        const indexIsFulfilled = checkIfCourseFulfilled(courseInfo, requirement.search, requirement.includes);

        if (indexIsFulfilled) {
          // depending on what it is fulfilled by, either increase the count or credits you took
          switch (requirement.fulfilledBy) {
            case 'count':
              totalRequirementCount++;
              break;
            case 'credits':
              totalRequirementCredits += courseInfo.enrollGroups[0].unitsMaximum;
              break;
            case 'self-check':
              continue;
            default:
              throw new Error('Fulfillment type unknown.');
          }

          // add the course to the list of courses used to fulfill that one requirement
          coursesThatFulilledRequirement.push(code);
        }
      }

      const generatedResults = createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement);

      // If at end path (no parent path)
      if (!parentName) {
        requirementJSONs.push(generatedResults);
      }
      // If in path, append to path of parent
      else {
        const parent = requirementJSONs.find(key => key.name === parentName);
        parent.paths.push(generatedResults);
        parent.isComplete = parent.isComplete || generatedResults.isComplete;
      }
    }
  }

  helper(coursesTakenWithInfo, requirements);

  return requirementJSONs;
}

/**
 * Creates results in object format from information
 * @param {*} requirement : the requirement information as object
 * @param {*} totalRequirementCredits : total credits of courses that satisfied requirement
 * @param {*} totalRequirementCount : total number of courses that satisfied requirement
 * @param {*} coursesThatFulilledRequirement : courses that satisfied requirement
 */
function createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement) {
  const requirementFulfillmentData = {
    name: requirement.name,
    type: requirement.fulfilledBy,
    courses: coursesThatFulilledRequirement
  };
  let isComplete;
  let required;
  let fulfilled;
  switch (requirement.fulfilledBy) {
    case 'count':
      isComplete = requirement.minCount <= totalRequirementCount;
      required = requirement.minCount;
      fulfilled = totalRequirementCount;
      break;
    case 'credits':
      isComplete = requirement.minCreds <= totalRequirementCredits;
      required = requirement.minCreds;
      fulfilled = totalRequirementCredits;
      break;
    case 'self-check':
      isComplete = 'unknown';
      required = 'unknown';
      fulfilled = 'unknown';
      break;
    default:
      throw new Error('Fulfillment type unknown.');
  }
  requirementFulfillmentData.isComplete = isComplete;
  requirementFulfillmentData.required = required;
  requirementFulfillmentData.fulfilled = fulfilled;
  return requirementFulfillmentData;
}

/**
 * Given a course abbreviation (i.e. INFO 1300), it will split it up into the subject and number, returned as a dictionary
 * (i.e. INFO 1300 => {"subject" : INFO, "courseNumber" : 1300})
 *
 * @return the number of credits the course is worth
 */
function parseCourseAbbreviation(courseAbbreviation) {
  const regex = /([a-zA-Z]+) ([0-9][0-9][0-9][0-9]$)?/g;
  const matches = regex.exec(courseAbbreviation);
  if (matches === null) throw new Error('Invalid course abbreviation');
  return { subject: matches[1].toUpperCase(), courseNumber: matches[2] };
}

/**
 * Given a course code and a roster, get all course info from Cornell API
 * @param {*} courseCode : code name of the course to search (CS 2110)
 * @param {*} semester : the roster name to search from (FA19)
 */
function getCourseInfo(courseCode) {
  const courseAbbrev = parseCourseAbbreviation(courseCode);
  const subject = courseAbbrev.subject.toUpperCase();
  const number = courseAbbrev.courseNumber;

  return new Promise((resolve, reject) => {
    // Using Firebase
    const coursesCollection = fb.db.collection('courses');
    const courseRef = coursesCollection.doc(subject + number);

    courseRef.get()
      .then(doc => {
        if (!doc.exists) reject('No document exists');
        else resolve(doc.data());
      })
      .catch(err => {
        reject('Error getting doc', err);
      });
  });
}

/**
 * Check if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 * @param {*} courseName : name of the course (as a code)
 * @param {*} code : code to check courseName (can contain * to denote any value)
 */
function ifCodeMatch(courseName, code) {
  for (let i = 0; i < courseName.length; i++) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
}

/**
 * Check if the course fullfills the given requirement. Returns true if fulfills requirement. False otherswise
 * @param {*} courseInfo : information of the course from API data
 * @param {*} search : the scope of search for the requirement (e.g all-eligible, code, catalogDistr)
 * @param {*} includes : the query for the search (e.g (MQR-AS), CS 2***)
 */
function checkIfCourseFulfilled(courseInfo, search, includes) {
  // console.log(courseInfo.subject + courseInfo.catalogNbr);

  if (search === 'all' || search === 'all-eligible' || search === 'self-check') return true;
  for (const [i, include] of includes.entries()) {
    for (const option of include) {
      if (search === 'code') {
        if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, option)) {
          // Important: removes array option list from requirements
          if (includes.length > 1) includes.splice(i, 1);

          return true;
        }
      } else if (courseInfo[search].includes(option)) return true;
    }
  }

  return false;
}


// ***** TEST STUFF ****** //
// let t = [
//     [
//         "PE",
//         "INFO",
//         "CS 1112",
//         "(CA-AS)"
//     ],
//     [
//         "CS 2110",
//         "CS 2112"
//     ],
//     [
//         "CS 2802"
//     ],
//     "CS 3110",
//     [
//         "CS 3420"
//     ],

//     "CS 4820",
//     "CS 4410"
// ];

// async function tester(){
//     // let y = await checkIfCourseFulfilled('AAS 1100', t);
//     let y = await checkIfCourseFulfilled('PE 1260', t);
//     // let y = await getCoursesInGroup('(MQR-AS)', 'catalogDistr');
//     // let y = await getValidCourses('(MQR-AS)', 'FA19');

//     console.log(y);

// }
// tester();

getRequirements(['CS 1110', 'CHIN 2202', 'CS 1112', 'CS 2110', 'CS 3410', 'CS 3110', 'INFO 2300', 'PE 1110'], 'AS', 'CS').then(res => {
  console.log(res);
});


export { getRequirements };
