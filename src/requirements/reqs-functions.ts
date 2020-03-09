import requirementJson from '@/requirements/typed-requirement-json';
import {
  CourseTaken,
  BaseRequirement,
  CollegeOrMajorRequirement
} from '@/requirements/types';

type RequirementMap = { readonly [code: string]: readonly string[] };
type MutableRequirementMap = { [code: string]: readonly string[] };
type MutableRequirementMapWithMutableChildren = { [code: string]: string[] };

type MutableRequirementFulfillment = {
  name: string;
  type: string;
  courses: readonly string[];
  required?: number;
  description: string;
  source: string;
  fulfilled: number | null | undefined;
  progressBar: boolean;
  displayDescription: boolean;
};
type RequirementFulfillment = Readonly<MutableRequirementFulfillment>;

/**
 * @param requirement : the requirement information as object
 * @param totalRequirementCredits : total credits of courses that satisfied requirement
 * @param totalRequirementCount : total number of courses that satisfied requirement
 * @param coursesThatFulilledRequirement : courses that satisfied requirement
 * @returns {RequirementFulfillment}
 */
function createRequirementJSON(
  requirement: BaseRequirement,
  totalRequirementCredits: number,
  totalRequirementCount: number,
  coursesThatFulilledRequirement: readonly string[]
): RequirementFulfillment {
  const requirementFulfillmentData: MutableRequirementFulfillment = {
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
  let fulfilled: number | null;
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

function mergeRequirementsMap(
  requirementsMap: MutableRequirementMap,
  satisfiedMap: RequirementMap
) {
  Object.keys(satisfiedMap).forEach(course => {
    if (course in requirementsMap) {
      requirementsMap[course] = requirementsMap[course].concat(satisfiedMap[course]);
    } else {
      requirementsMap[course] = satisfiedMap[course];
    }
  });
}

/**
 * @param courseName : name of the course (as a code)
 * @param code : code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
function ifCodeMatch(courseName: string, code: string): boolean {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
}

/**
 * @param {string} subject : subject of course to check
 * @param {string} number : number of course to check
 * @returns if the course satisfies all-eligible query (not PE or 10XX course)
 */
function ifAllEligible(subject: string, number: string): boolean {
  return !ifCodeMatch(subject, 'PE') && !ifCodeMatch(number, '10**');
}

/**
 * Loops through requirement data and compare all courses on (to identify whether they satisfy the requirement)
 * @param coursesTaken : object of courses taken with API information (CS 2110: {info})
 * @param allRequirements : requirements in requirements format from reqs.json (college, major, or university requirements)
 * @param requirementsMap : object of courses taken with requirements they fulfill
 * @returns a promise of requirement fulfillment
 */
function iterateThroughUniversityRequirements(
  coursesTaken: readonly CourseTaken[],
  requirementsMap: MutableRequirementMap
): readonly RequirementFulfillment[] {
  // array of requirement status information to be returned
  const requirementJSONs: RequirementFulfillment[] = [];
  const academicCreditsRequirements = {
    name: 'Academic Credits',
    description: 'To graduate, a student must earn a minimum of 120 academic credits. Physical education credits and “10XX” courses do not count toward the 120 required credits.',
    source: 'http://courses.cornell.edu/content.php?catoid=31&navoid=7901',
    search: ['all-eligible'],
    includes: [],
    fulfilledBy: 'credits',
    minCount: 120,
    applies: 'all',
    progressBar: true
  } as const;
  const PERequirement = {
    name: 'Physical Education',
    description: 'All incoming freshmen are required to take two credits (two courses) of Physical Education, one credit each semester of the first year on campus.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9249',
    search: ['subject'],
    includes: [
      [
        'PE'
      ]
    ],
    fulfilledBy: 'courses',
    minCount: 2,
    maxCount: 2,
    applies: 'all'
  } as const;
  const swimmingTestRequirement = {
    name: 'Swimming Test',
    description: 'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming and water safety competency requirement for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9249',
    fulfilledBy: 'self-check',
    includes: [],
    minCount: 0,
    applies: 'all'
  } as const;
  // Dictionary for generating information on course alerts
  const satisfiedRequirementMap: MutableRequirementMapWithMutableChildren = {};

  // Academic Credits Check
  const coursesThatCountTowardsAcademicCredits = coursesTaken.filter(course => ifAllEligible(course.subject, course.number));
  requirementJSONs.push(
    createRequirementJSON(
      academicCreditsRequirements,
      coursesThatCountTowardsAcademicCredits.reduce((accumulator, course) => accumulator + course.credits, 0),
      0,
      coursesThatCountTowardsAcademicCredits.map(course => course.code)
    )
  );

  // PE Credits Check
  const coursesThatCountTowardsPE = coursesTaken.filter(course => course.subject === 'PE');
  requirementJSONs.push(
    createRequirementJSON(
      PERequirement,
      0,
      coursesThatCountTowardsPE.length,
      coursesThatCountTowardsPE.map(course => course.code)
    )
  );

  // Swim Test Check
  requirementJSONs.push(createRequirementJSON(swimmingTestRequirement, 0, 0, []));

  // Merge satisfied credits into satisfiedCourseCredits (for alerts)
  mergeRequirementsMap(requirementsMap, satisfiedRequirementMap);

  return requirementJSONs;
}

/**
 * Loops through requirement data and compare all courses on (to identify whether they satisfy the requirement)
 * @param allCoursesTakenWithInfo : object of courses taken with API information (CS 2110: {info})
 * @param allRequirements : requirements in requirements format from reqs.json (college, major, or university requirements)
 * @param requirementsMap : object of courses taken with requirements they fulfill
 * @returns a promise of requirement fulfillment
 */
function iterateThroughCollegeOrMajorRequirements(
  coursesTaken: readonly CourseTaken[],
  allRequirements: readonly CollegeOrMajorRequirement[],
  requirementsMap: MutableRequirementMap
): readonly RequirementFulfillment[] {
  // array of requirement status information to be returned
  const requirementJSONs: RequirementFulfillment[] = [];
  // Dictionary for generating information on course alerts
  const satisfiedRequirementMap: MutableRequirementMapWithMutableChildren = {};

  for (const requirement of allRequirements) {
    // TODO: For different groups of students (e.g. transfers, FYSAs, etc...)
    // if(!isTransfer && requirement.applies === "transfers") continue;
    // temporarily skip these until we can implement them later

    const { name: requirementName, courses } = requirement;

    let totalRequirementCredits = 0;
    let totalRequirementCount = 0;
    const coursesThatFulilledRequirement: string[] = [];

    // eslint-disable-next-line no-loop-func
    coursesTaken.forEach(courseTaken => {
      const {
        code, roster, subject, number, credits
      } = courseTaken;
      if (courses === 'all-eligible'
        || (courses[roster] && courses[roster][subject] && courses[roster][subject].includes(number))) {
        // depending on what it is fulfilled by, either increase the count or credits you took
        switch (requirement.fulfilledBy) {
          case 'courses':
            totalRequirementCount += 1;
            break;
          case 'credits':
            totalRequirementCredits += credits;
            break;
          case 'self-check':
            return;
          default:
            throw new Error('Fulfillment type unknown.');
        }

        // add the course to the list of courses used to fulfill that one requirement
        coursesThatFulilledRequirement.push(code);

        // Add course to dictionary with name
        if (code in satisfiedRequirementMap) satisfiedRequirementMap[code].push(requirementName);
        else satisfiedRequirementMap[code] = [requirementName];
      }
    });

    const generatedResults = createRequirementJSON(
      requirement,
      totalRequirementCredits,
      totalRequirementCount,
      coursesThatFulilledRequirement
    );
    requirementJSONs.push(generatedResults);
  }

  // Merge satisfied credits into satisfiedCourseCredits (for alerts)
  mergeRequirementsMap(requirementsMap, satisfiedRequirementMap);

  return requirementJSONs;
}

export default function getReqs(
  coursesTaken: readonly CourseTaken[],
  college: string,
  major: string,
  requirementsMap: RequirementMap
) {
  // prepare final output JSONs
  const finalRequirementJSONs = [];

  // PART 1: check university requirements
  finalRequirementJSONs.push({
    groupName: 'University',
    specific: null,
    reqs: iterateThroughUniversityRequirements(
      coursesTaken,
      requirementsMap
    )
  });

  // PART 2: check college requirements
  if (!(college in requirementJson.college)) throw new Error('College not found.');
  const collegeReqs = requirementJson.college[college];

  finalRequirementJSONs.push({
    groupName: 'College',
    specific: college,
    reqs: iterateThroughCollegeOrMajorRequirements(
      coursesTaken,
      collegeReqs.requirements,
      requirementsMap
    )
  });

  // PART 3: check major reqs
  // Major is optional
  if (major in requirementJson.major) {
    const majorReqs = requirementJson.major[major];
    finalRequirementJSONs.push({
      groupName: 'Major',
      specific: major,
      reqs: iterateThroughCollegeOrMajorRequirements(
        coursesTaken,
        majorReqs.requirements,
        requirementsMap
      )
    });
  }

  return finalRequirementJSONs;
}
