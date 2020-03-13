import requirementJson from './typed-requirement-json';
import {
  CourseTaken,
  BaseRequirement,
  DecoratedCollegeOrMajorRequirement,
  RequirementFulfillment,
  RequirementFulfillmentStatistics,
  GroupedRequirementFulfillmentReport
} from './types';

type RequirementMap = { readonly [code: string]: readonly string[] };
type MutableRequirementMap = { [code: string]: readonly string[] };
type MutableRequirementMapWithMutableChildren = { [code: string]: string[] };

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
): readonly RequirementFulfillment<RequirementFulfillmentStatistics>[] {
  // array of requirement status information to be returned
  const requirementJSONs: RequirementFulfillment<RequirementFulfillmentStatistics>[] = [];
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
  requirementJSONs.push({
    requirement: academicCreditsRequirements,
    courses: [coursesThatCountTowardsAcademicCredits],
    fulfilled: coursesThatCountTowardsAcademicCredits.reduce((accumulator, course) => accumulator + course.credits, 0)
  });

  // PE Credits Check
  const coursesThatCountTowardsPE = coursesTaken.filter(course => course.subject === 'PE');
  requirementJSONs.push({
    requirement: PERequirement,
    courses: [coursesThatCountTowardsPE],
    fulfilled: coursesThatCountTowardsPE.length
  });

  // Swim Test Check
  requirementJSONs.push({ requirement: swimmingTestRequirement, courses: [] });

  // Merge satisfied credits into satisfiedCourseCredits (for alerts)
  mergeRequirementsMap(requirementsMap, satisfiedRequirementMap);

  return requirementJSONs;
}

/**
 * @param coursesTaken a list of all taken courses.
 * @param requirement the requirement to compute course fulfillment.
 * @returns a naively computed list of courses that fulfill the requirement, partitioned into sub-requirement filfillment.
 */
function filterAndPartitionCoursesThatFulfillRequirement(
  coursesTaken: readonly CourseTaken[],
  requirement: DecoratedCollegeOrMajorRequirement
): CourseTaken[][] {
  const { courses: requirementCourses } = requirement;
  const coursesThatFulfilledRequirement: CourseTaken[][] = requirementCourses.map(() => []);
  coursesTaken.forEach(courseTaken => {
    const { roster, subject, number } = courseTaken;
    requirementCourses.forEach((subRequirementCourses, subRequirementIndex) => {
      if (subRequirementCourses[roster] && subRequirementCourses[roster][subject] && subRequirementCourses[roster][subject].includes(number)) {
        // add the course to the list of courses used to fulfill that one sub-requirement
        coursesThatFulfilledRequirement[subRequirementIndex].push(courseTaken);
      }
    });
  });
  return coursesThatFulfilledRequirement;
}

/**
 * @param coursesTaken a list of all taken courses.
 * @param allRequirements a list of all requirements to check.
 * @returns a naively computed list of requirement fulfillment, without any filtering and post-processing.
 */
function computeRawRequirementFulfillment(
  coursesTaken: readonly CourseTaken[],
  allRequirements: readonly DecoratedCollegeOrMajorRequirement[]
): readonly RequirementFulfillment<{}>[] {
  return allRequirements.map(requirement => ({
    requirement,
    courses: filterAndPartitionCoursesThatFulfillRequirement(coursesTaken, requirement)
  }));
}

/**
 * A monad that provides a post-processing framework for requirement fulfillment.
 *
 * Usage:
 * ```typescript
 * const filfillments = [
 *   { requirement: req1, courses: [c1, c2, c3], foo: 1 },
 *   { requirement: req2, courses: [c1, c3], foo: 2 },
 * ];
 * const processedFilfillments = postProcessRequirementsFulfillments(
 *   filfillments,
 *   ({ courses, foo }) => ({ bar: courses.length + foo })
 * );
 * // Will produce:
 * [
 *   { requirement: req1, courses: [c1, c2, c3], bar: 4 }, // bar = 3 + 1 = 4
 *   { requirement: req2, courses: [c1, c3], bar: 4 }, // bar = 2 + 2 = 4
 * ]
 * ```
 *
 * @param fulfillments a list of requirement fulfillment to post-process.
 * @param transformer the transformer that computes the new metadata.
 * @returns the post-processed requirement filfillments.
 */
function postProcessRequirementsFulfillments<T extends {}, R extends {}>(
  fulfillments: readonly RequirementFulfillment<T>[],
  transformer: (currentFulfillmentWithMetadata: RequirementFulfillment<T>) => R
): readonly RequirementFulfillment<R>[] {
  return fulfillments.map(requirementFulfillment => {
    const { requirement, courses } = requirementFulfillment;
    const newMetadata = transformer(requirementFulfillment);
    return { requirement, courses, ...newMetadata };
  });
}

function computeFulfillmentStatistics<T extends {}>({ requirement, courses: coursesThatFulfilledRequirement }: RequirementFulfillment<T>): RequirementFulfillmentStatistics {
  let fulfilled = 0;

  coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
    if (coursesThatFulfilledSubRequirement.length === 0) {
      return;
    }
    // depending on what it is fulfilled by, either increase the count or credits you took
    switch (requirement.fulfilledBy) {
      case 'courses':
        fulfilled += 1;
        break;
      case 'credits':
        fulfilled += coursesThatFulfilledSubRequirement
          .map(course => course.credits)
          .reduce((a, b) => Math.max(a, b), 0);
        break;
      case 'self-check':
        return;
      default:
        throw new Error('Fulfillment type unknown.');
    }
  });
  return { fulfilled };
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
  allRequirements: readonly DecoratedCollegeOrMajorRequirement[],
  requirementsMap: MutableRequirementMap
): readonly RequirementFulfillment<RequirementFulfillmentStatistics>[] {
  // Phase 1: Compute raw requirement fulfillment locally for each requirement.
  const rawRequirementFulfillment = computeRawRequirementFulfillment(coursesTaken, allRequirements);

  // Phase 2: Compute fulfillment statistics for each requirement.
  const requirementFulfillmentWithStatistics = postProcessRequirementsFulfillments(
    rawRequirementFulfillment,
    computeFulfillmentStatistics
  );

  // Phase 3: compute requirement map
  // Dictionary for generating information on course alerts
  const satisfiedRequirementMap: MutableRequirementMapWithMutableChildren = {};
  requirementFulfillmentWithStatistics.forEach(({ requirement: { name: requirementName }, courses: coursesThatFulfilledRequirement }) => {
    coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
      coursesThatFulfilledSubRequirement.forEach(({ code }) => {
        // Add course to dictionary with name
        if (code in satisfiedRequirementMap) satisfiedRequirementMap[code].push(requirementName);
        else satisfiedRequirementMap[code] = [requirementName];
      });
    });
  });
  // Merge satisfied credits into satisfiedCourseCredits (for alerts)
  mergeRequirementsMap(requirementsMap, satisfiedRequirementMap);

  return requirementFulfillmentWithStatistics;
}

/**
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 * @param college user's college.
 * @param major user's major.
 * @returns a tuple with the format:
 * [
 *   a requirement map that maps course code to a list of satisfying courses,
 * ]
 */
export default function computeRequirements(
  coursesTaken: readonly CourseTaken[],
  college: string,
  major: string
): [RequirementMap, readonly GroupedRequirementFulfillmentReport[]] {
  const requirementsMap: MutableRequirementMap = {};
  // prepare grouped fulfillment summary
  const groups: GroupedRequirementFulfillmentReport[] = [];

  // PART 1: check university requirements
  groups.push({
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

  groups.push({
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
    groups.push({
      groupName: 'Major',
      specific: major,
      reqs: iterateThroughCollegeOrMajorRequirements(
        coursesTaken,
        majorReqs.requirements,
        requirementsMap
      )
    });
  }

  return [requirementsMap, groups];
}
