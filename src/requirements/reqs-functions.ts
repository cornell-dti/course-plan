import requirementJson from './typed-requirement-json';
import {
  CourseTaken,
  DecoratedCollegeOrMajorRequirement,
  RequirementFulfillment,
  RequirementFulfillmentStatistics,
  GroupedRequirementFulfillmentReport
} from './types';

type RequirementMap = { readonly [code: string]: readonly string[] };
type MutableRequirementMapWithMutableChildren = { [code: string]: string[] };

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
 * @param coursesTaken : object of courses taken with API information (CS 2110: {info}).
 * @returns a list of university requirement filfillment status.
 */
function computeUniversityRequirementFulfillments(
  coursesTaken: readonly CourseTaken[]
): readonly RequirementFulfillment<RequirementFulfillmentStatistics>[] {
  const academicCreditsRequirements = {
    name: 'Academic Credits',
    description: 'To graduate, a student must earn a minimum of 120 academic credits. Physical education credits and “10XX” courses do not count toward the 120 required credits.',
    source: 'http://courses.cornell.edu/content.php?catoid=31&navoid=7901',
    search: ['all-eligible'],
    includes: [],
    operator: 'or',
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
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
    maxCount: 2,
    applies: 'all'
  } as const;
  const swimmingTestRequirement = {
    name: 'Swimming Test',
    description: 'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming and water safety competency requirement '
      + 'for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9249',
    operator: null,
    fulfilledBy: 'self-check',
    includes: [],
    minCount: 0,
    applies: 'all'
  } as const;


  const coursesThatCountTowardsAcademicCredits = coursesTaken.filter(course => ifAllEligible(course.subject, course.number));
  const coursesThatCountTowardsPE = coursesTaken.filter(course => course.subject === 'PE');

  return [
    // Academic Credits
    {
      requirement: academicCreditsRequirements,
      courses: [coursesThatCountTowardsAcademicCredits],
      minCountFulfilled: coursesThatCountTowardsAcademicCredits.reduce((accumulator, course) => accumulator + course.credits, 0)
    },
    // PE Credits
    {
      requirement: PERequirement,
      courses: [coursesThatCountTowardsPE],
      minCountFulfilled: coursesThatCountTowardsPE.length
    },
    // Swim Test
    { requirement: swimmingTestRequirement, courses: [] }
  ];
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
    // console.log(newMetadata);
    return { requirement, courses, ...newMetadata };
  });
}

function computeFulfillmentStatistics<T extends {}>({ requirement, courses: coursesThatFulfilledRequirement }: RequirementFulfillment<T>): RequirementFulfillmentStatistics {
  let minCountFulfilled = 0;
  coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
    if (coursesThatFulfilledSubRequirement.length === 0) {
      return;
    }

    if (requirement.operator === 'or') {
      // Accumulating requirements with double counting with 'or/ operator
      switch (requirement.fulfilledBy) {
        case 'courses':
          minCountFulfilled += coursesThatFulfilledSubRequirement.length;
          break;
        case 'credits':
          minCountFulfilled += coursesThatFulfilledSubRequirement
            .map(course => course.credits)
            .reduce((a, b) => a + b);
          break;
        case 'self-check':
          return;
        default:
          throw new Error('Fulfillment type unknown.');
      }
    } else if (requirement.operator === 'and') {
      // Accumulating requirements without double counting with 'and' operator
      switch (requirement.fulfilledBy) {
        case 'courses':
          minCountFulfilled += 1;
          break;
        case 'credits':
          minCountFulfilled += coursesThatFulfilledSubRequirement
            .map(course => course.credits)
            .reduce((a, b) => Math.max(a, b), 0);
          break;
        case 'self-check':
          return;
        default:
          throw new Error('Fulfillment type unknown.');
      }
    }
  });

  if (requirement.totalCount === undefined) {
    return { minCountFulfilled };
  }

  let totalCountFulfilled = 0;
  Array.from(new Set(coursesThatFulfilledRequirement.flat()).values()).forEach(courseThatFulfilledRequirement => {
    // depending on what it is fulfilled by, either increase the count or credits you took
    switch (requirement.fulfilledBy) {
      case 'courses':
        totalCountFulfilled += 1;
        return;
      case 'credits':
        totalCountFulfilled += courseThatFulfilledRequirement.credits;
        return;
      case 'self-check':
        return;
      default:
        throw new Error('Fulfillment type unknown.');
    }
  });

  return { minCountFulfilled, totalCountFulfilled };
}

/**
 * @param allCoursesTakenWithInfo : object of courses taken with API information (CS 2110: {info})
 * @param allRequirements : requirements in requirements format from reqs.json (college, major, or university requirements)
 * @returns a list of university requirement filfillment status.
 */
function computeCollegeOrMajorRequirementFulfillments(
  coursesTaken: readonly CourseTaken[],
  allRequirements: readonly DecoratedCollegeOrMajorRequirement[]
): readonly RequirementFulfillment<RequirementFulfillmentStatistics>[] {
  // Phase 1: Compute raw requirement fulfillment locally for each requirement.
  // console.log('Courses');
  // console.log(coursesTaken);
  // console.log('Requirements');
  // console.log(allRequirements);
  const rawRequirementFulfillment = computeRawRequirementFulfillment(coursesTaken, allRequirements);
  // console.log('Fullfilled');
  // console.log(rawRequirementFulfillment);

  // Phase 2: Compute fulfillment statistics for each requirement.
  const requirementFulfillmentWithStatistics = postProcessRequirementsFulfillments(
    rawRequirementFulfillment,
    computeFulfillmentStatistics
  );
  // console.log('Statistics');
  // console.log(requirementFulfillmentWithStatistics);

  return requirementFulfillmentWithStatistics;
}

/**
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 * @param college user's college.
 * @param major user's major.
 * @param minor user's minor.
 * @returns all requirements fulfillments, grouped by University, College, Major.
 */
export function computeRequirements(
  coursesTaken: readonly CourseTaken[],
  college: string,
  major: string,
  minor: string
): readonly GroupedRequirementFulfillmentReport[] {
  // prepare grouped fulfillment summary
  const groups: GroupedRequirementFulfillmentReport[] = [];

  // PART 1: check university requirements
  groups.push({
    groupName: 'University',
    specific: null,
    reqs: computeUniversityRequirementFulfillments(coursesTaken)
  });

  // PART 2: check college requirements
  if (!(college in requirementJson.college)) throw new Error('College not found.');
  const collegeReqs = requirementJson.college[college];

  groups.push({
    groupName: 'College',
    specific: college,
    reqs: computeCollegeOrMajorRequirementFulfillments(coursesTaken, collegeReqs.requirements)
  });

  // PART 3: check major reqs
  // Major is optional
  if (major != null) {
    for (const maj of major) {
      if (maj in requirementJson.major) {
        const majorReqs = requirementJson.major[maj];
        groups.push({
          groupName: 'Major',
          specific: maj,
          reqs: computeCollegeOrMajorRequirementFulfillments(coursesTaken, majorReqs.requirements)
        });
      }
    }
  }
  /*
  // PART 4: check minor reqs
  // Major is optional
  if (minor != null) {
    for (const min of minor) {
      if (min in requirementJson.minor) {
        const majorReqs = requirementJson.major[min];
        groups.push({
          groupName: 'Minor',
          specific: min,
          reqs: computeCollegeOrMajorRequirementFulfillments(coursesTaken, majorReqs.requirements)
        });
      }
    }
  }
   */

  return groups;
}

/**
 * @param groups all requirements fulfillments, grouped by University, College, Major.
 * @returns a object where keys are course code and values are a list of requirement a class fulfills.
 */
export function computeRequirementMap(groups: readonly GroupedRequirementFulfillmentReport[]): RequirementMap {
  const requirementsMap: MutableRequirementMapWithMutableChildren = {};
  groups.forEach(group => {
    group.reqs.forEach(({ requirement: { name: requirementName }, courses: coursesThatFulfilledRequirement }) => {
      coursesThatFulfilledRequirement.forEach(coursesThatFulfilledSubRequirement => {
        coursesThatFulfilledSubRequirement.forEach(({ code }) => {
          // Add course to dictionary with name
          if (code in requirementsMap) requirementsMap[code].push(requirementName);
          else requirementsMap[code] = [requirementName];
        });
      });
    });
  });
  return requirementsMap;
}
