import reqsData from '@/requirements/reqs.json';

/**
 * Check if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 * @param {string} courseName : name of the course (as a code)
 * @param {string} code : code to check courseName (can contain * to denote any value)
 * @returns {boolean}
 */
function ifCodeMatch(courseName, code) {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }

  return true;
}

/**
 * Check if the course satisfies all-eligible query (not PE or 10XX course)
 * @param {string} subject : subject of course to check
 * @param {string} number : number of course to check
 * @returns {boolean}
 */
function ifAllEligible(subject, number) {
  return !ifCodeMatch(subject, 'PE') && !ifCodeMatch(number, '10**');
}

/**
 * Check if the course fullfills the given requirement. Returns true if fulfills requirement. False otherswise
 * @param {*} courseInfo : information of the course from API data
 * @param {*} search : the scope of search for the requirement (e.g all-eligible, code, catalogDistr)
 * @param {*} includes : the query for the search to satisfy requirement (e.g (MQR-AS), CS 2***)
 * @param {*} excludes : the query for the search that does not satisfy requirement (e.g (MQR-AS), CS 2***)
 * @returns {boolean}
 */
function checkIfCourseFulfilled(courseInfo, search, includes, excludes) {
  // Check if search exists. False if not
  if (search !== undefined) {
    // Special search: if search code is all or self-check. Anything would work
    if (search.includes('all') || search.includes('self-check')) return true;
    // Special search: if search code is not PE or 10XX course
    if (search.includes('all-eligible')) return ifAllEligible(courseInfo.subject, courseInfo.catalogNbr.toString());

    // Excludes is optional. If it exists, a match with search command returns false
    if (excludes) {
      for (const exclude of excludes) {
        for (const excludeOption of exclude) {
          // Special search: if course code matches code
          if (search.includes('code')) {
            if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, excludeOption)) return false;
          // Make sure courseInfo[search] is not null
          } else {
            // Loop through search (for search commands with multiple options)
            for (const singleSearch of search) {
              if (courseInfo[singleSearch] && courseInfo[singleSearch].includes(excludeOption)) return false;
            }
          }
        }
      }
    }

    // Includes is mandatory. Function will check for include match with search command
    for (const include of includes) {
      for (const includeOption of include) {
        // Special search: if course code matches code
        if (search.includes('code')) {
          if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, includeOption)) return true;
        // Make sure courseInfo[search] is not null
        } else {
          // Loop through search (for search commands with multiple options)
          for (const singleSearch of search) {
            if (courseInfo[singleSearch] && courseInfo[singleSearch].includes(includeOption)) return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Creates results in object format from information
 * @param {Requirement} requirement : the requirement information as object
 * @param {number} totalRequirementCredits : total credits of courses that satisfied requirement
 * @param {number} totalRequirementCount : total number of courses that satisfied requirement
 * @param {string[]} coursesThatFulilledRequirement : courses that satisfied requirement
 * @returns {RequirementFulfillment}
 */
function createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement) {
  const requirementFulfillmentData = {
    name: requirement.name,
    type: requirement.fulfilledBy,
    courses: coursesThatFulilledRequirement,
    required: requirement.minCount,
    description: requirement.description,
    source: requirement.source,
    fulfilled: null,
    progressBar: false,
    displayDescription: false
  };
  let fulfilled;
  switch (requirement.fulfilledBy) {
    case 'courses':
      fulfilled = totalRequirementCount;
      break;
    case 'credits':
      fulfilled = totalRequirementCredits;
      break;
    case 'self-check':
      fulfilled = null;
      break;
    default:
      throw new Error('Fulfillment type unknown.');
  }

  requirementFulfillmentData.fulfilled = fulfilled;

  // Make requirement use for progressbar if progressbar attr is true
  if (requirement.progressBar) requirementFulfillmentData.progressBar = true;
  return requirementFulfillmentData;
}

/** @param {Object.<string, string[]>} requirementsMap */
/** @param {Object.<string, string[]>} satisfiedMap */
function mergeRequirementsMap(requirementsMap, satisfiedMap) {
  Object.keys(satisfiedMap).forEach(course => {
    if (course in requirementsMap) requirementsMap[course] = requirementsMap[course].concat(satisfiedMap[course]);
    else requirementsMap[course] = satisfiedMap[course];
  });
}

/**
 * @typedef {Object} RequirementFulfillment
 * @property {string} name
 * @property {string} type
 * @property {string[]} courses
 * @property {number} required
 * @property {string} description
 * @property {string} source
 * @property {number | null | undefined} fulfilled
 * @property {boolean} progressBar
 * @property {boolean} displayDescription
 */

/**
 * Loops through requirement data and compare all courses on (to identify whether they satisfy the requirement)
 * @param {Object.<string, Object>} allCoursesTakenWithInfo : object of courses taken with API information (CS 2110: {info})
 * @param {Requirement[]} allRequirements : requirements in requirements format from reqs.json (college, major, or university requirements)
 * @param {Object.<string, string[]>} requirementsMap : object of courses taken with requirements they fulfill
 * @returns {Promise<RequirementFulfillment[]>}
 */
async function iterateThroughRequirements(allCoursesTakenWithInfo, allRequirements, requirementsMap) {
  // array of requirement status information to be returned
  /** @type {RequirementFulfillment[]} */
  const requirementJSONs = [];
  // Dictionary for generating information on course alerts
  /** @type {Object.<string, string[]>} */
  const satisfiedRequirementMap = {};

  for (const requirement of allRequirements) {
    // TODO: For different groups of students (e.g. transfers, FYSAs, etc...)
    // if(!isTransfer && requirement.applies === "transfers") continue;
    // temporarily skip these until we can implement them later

    const requirementName = requirement.name;

    let totalRequirementCredits = 0;
    let totalRequirementCount = 0;
    /** @type {string[]} */
    const coursesThatFulilledRequirement = [];

    // check each course to see if it fulfilled that requirement
    const codes = Object.keys(allCoursesTakenWithInfo);

    for (const code of codes) {
      const courseInfo = allCoursesTakenWithInfo[code];

      const indexIsFulfilled = checkIfCourseFulfilled(courseInfo, requirement.search, requirement.includes, requirement.excludes);

      if (indexIsFulfilled) {
        // depending on what it is fulfilled by, either increase the count or credits you took
        switch (requirement.fulfilledBy) {
          case 'courses':
            totalRequirementCount += 1;
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

        // Add course to dictionary with name
        if (code in satisfiedRequirementMap) satisfiedRequirementMap[code].push(requirementName);
        else satisfiedRequirementMap[code] = [requirementName];
      }
    }

    const generatedResults = createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement);
    requirementJSONs.push(generatedResults);
  }

  // Merge satisfied credits into satisfiedCourseCredits (for alerts)
  mergeRequirementsMap(requirementsMap, satisfiedRequirementMap);

  return requirementJSONs;
}


/**
 * Given a course code (i.e. INFO 1300), it will split it up into the subject and number, returned as a dictionary
 * (i.e. INFO 1300 => {"subject" : INFO, "courseNumber" : 1300})
 *
 * @param {string} courseCode
 * @return {{subject: string, courseNumber: string}} the number of credits the course is worth
 */
function parseCourseCode(courseCode) {
  const regex = /([a-zA-Z]+) ([0-9][0-9][0-9][0-9]$)?/g;
  const matches = regex.exec(courseCode);
  if (matches === null) throw new Error('Invalid course code');
  return { subject: matches[1].toUpperCase(), courseNumber: matches[2] };
}

/**
 * Given a course code and a roster, get all course info from Cornell API
 * @param {string} code : code name of the course to search (CS 2110)
 * @param {string} roster : roster name of the course to search (FA19)
 * @returns {Promise<any>}
 */
function getCourseInfo(code, roster) {
  const courseCodeObj = parseCourseCode(code);
  const subject = courseCodeObj.subject.toUpperCase();
  const catalogNbr = courseCodeObj.courseNumber;

  return new Promise(resolve => {
    fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}&q=${code}`)
      .then(res => res.json())
      .then(resultJSON => {
        const { classes } = resultJSON.data;
        // Check that course code matches with api result. Example: MATH 1110 returns MATH 1011 because both matches
        for (const singleClass of classes) {
          if (singleClass.subject === subject && singleClass.catalogNbr === catalogNbr) resolve(singleClass);
        }
      });
  });
}

/**
 * @param {Array<{code: string, roster: string}>} coursesTaken
 * @param {string} college
 * @param {string} major
 * @param {Object.<string, string[]>} requirementsMap
 */
async function getReqs(coursesTaken, college, major, requirementsMap) {
  // TODO: make it so that it takes in classes corresponding with years/semesters for most accurate information
  const coursesTakenWithInfo = {};
  const courseData = await Promise.all(
    coursesTaken.map(courseTaken => getCourseInfo(courseTaken.code, courseTaken.roster))
  );

  for (let i = 0; i < coursesTaken.length; i += 1) { coursesTakenWithInfo[coursesTaken[i].code] = courseData[i]; }

  // prepare final output JSONs
  const finalRequirementJSONs = [];

  // PART 1: check university requirements
  if (!reqsData.university) throw new Error('University requirements not found.');
  const universityReqs = reqsData.university;

  finalRequirementJSONs.push({
    groupName: 'University',
    specific: null,
    reqs: await iterateThroughRequirements(coursesTakenWithInfo, universityReqs.requirements, requirementsMap)
  });

  // PART 2: check college requirements
  if (!(college in reqsData.college)) throw new Error('College not found.');
  const collegeReqs = reqsData.college[college];

  finalRequirementJSONs.push({
    groupName: 'College',
    specific: college,
    reqs: await iterateThroughRequirements(coursesTakenWithInfo, collegeReqs.requirements, requirementsMap)
  });

  // PART 3: check major reqs
  // Major is optional
  if (major in reqsData.major) {
    const majorReqs = reqsData.major[major];
    finalRequirementJSONs.push({
      groupName: 'Major',
      specific: major,
      reqs: await iterateThroughRequirements(coursesTakenWithInfo, majorReqs.requirements, requirementsMap)
    });
  }

  return finalRequirementJSONs;
}

export default { getReqs };
