import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  DecoratedCollegeOrMajorRequirement,
  EligibleCourses,
  RequirementChecker,
  Course,
} from './types';
import sourceRequirements from './data';
import { FWS_COURSE_ID, CREDITS_COURSE_ID } from './data/constants';
import filteredAllCourses from './filtered-all-courses';

/**
 * Special (synthetic) courses, as used in AP/IB equivalent courses generation.
 */
const specialCourses: Course[] = [
  {
    subject: 'CREDITS', // fulfills total academic credit requirement
    crseId: CREDITS_COURSE_ID,
    catalogNbr: '',
    titleLong: '',
    description: '',
    enrollGroups: [],
    catalogAttribute: '',
    acadCareer: '',
    acadGroup: '',
  },
  {
    subject: 'FWS', // fulfills FWS requirement
    crseId: FWS_COURSE_ID,
    catalogNbr: '',
    titleLong: '',
    description: '',
    enrollGroups: [],
    catalogAttribute: '',
    acadCareer: '',
    acadGroup: '',
  },
];

const getEligibleCoursesFromRequirementCheckers = (
  checkers: readonly RequirementChecker[]
): readonly EligibleCourses[] =>
  checkers.map(oneRequirementChecker => {
    const eligibleCoursesMap: { [semester: string]: number[] } = {};
    Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
      const courseIdSet = new Set(
        [...courses, ...specialCourses]
          .filter(course => oneRequirementChecker(course))
          .map(course => course.crseId)
      );
      if (courseIdSet.size > 0) {
        // Do not include empty semesters.
        eligibleCoursesMap[semester] = Array.from(courseIdSet);
      }
    });
    return eligibleCoursesMap;
  });

const decorateRequirementWithCourses = (
  requirement: CollegeOrMajorRequirement
): DecoratedCollegeOrMajorRequirement => {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { checker, ...rest } = requirement;
      return {
        ...rest,
        courses: getEligibleCoursesFromRequirementCheckers(
          typeof checker === 'function' ? [checker] : checker
        ),
      };
    }
    case 'toggleable': {
      const { fulfillmentOptions } = requirement;
      return {
        ...requirement,
        fulfillmentOptions: Object.fromEntries(
          Object.entries(fulfillmentOptions).map(([optionName, option]) => {
            const { checker, ...rest } = option;
            const courses = getEligibleCoursesFromRequirementCheckers(
              typeof checker === 'function' ? [checker] : checker
            );
            return [optionName, { ...rest, courses }];
          })
        ),
      };
    }
    default:
      throw new Error();
  }
};

const produceSatisfiableCoursesAttachedRequirementJson = (): DecoratedRequirementsJson => {
  const { university, college, major, minor } = sourceRequirements;
  type MutableDecoratedJson = {
    university: {
      [key: string]: {
        readonly name: string;
        readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
      };
    };
    college: {
      [key: string]: {
        readonly name: string;
        readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
      };
    };
    major: {
      [key: string]: {
        readonly name: string;
        readonly schools: readonly string[];
        readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
      };
    };
    minor: {
      [key: string]: {
        readonly name: string;
        readonly schools: readonly string[];
        readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
      };
    };
  };
  const decoratedJson: MutableDecoratedJson = {
    university: {},
    college: {},
    major: {},
    minor: {},
  };
  const decorateRequirements = (requirements: readonly CollegeOrMajorRequirement[]) =>
    requirements.map(decorateRequirementWithCourses);
  Object.entries(university).forEach(([universityName, universityRequirement]) => {
    const { requirements, ...rest } = universityRequirement;
    decoratedJson.university[universityName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
    };
  });
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    decoratedJson.college[collegeName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
    };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, ...rest } = majorRequirement;
    decoratedJson.major[majorName] = { ...rest, requirements: decorateRequirements(requirements) };
  });
  Object.entries(minor).forEach(([minorName, minorRequirement]) => {
    const { requirements, ...rest } = minorRequirement;
    decoratedJson.minor[minorName] = { ...rest, requirements: decorateRequirements(requirements) };
  });

  // Check no duplicate requirement identifier
  const allRequirementIDs = [
    ...Object.entries(decoratedJson.college).map(
      ([code, requirements]) => ['COLLEGE', code, requirements] as const
    ),
    ...Object.entries(decoratedJson.major).map(
      ([code, requirements]) => ['MAJOR', code, requirements] as const
    ),
    ...Object.entries(decoratedJson.minor).map(
      ([code, requirements]) => ['MINOR', code, requirements] as const
    ),
  ].flatMap(([category, code, { requirements }]) =>
    requirements.map(it => `${category}-${code}-${it.name}`)
  );
  const idSet = new Set(allRequirementIDs);
  if (idSet.size !== allRequirementIDs.length) {
    throw new Error('There are some duplicate requirement IDs!');
  }

  return decoratedJson;
};

const decoratedRequirementString = JSON.stringify(
  produceSatisfiableCoursesAttachedRequirementJson()
);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
