import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  UniversityRequirements,
  DecoratedCollegeOrMajorRequirement,
  EligibleCourses,
  RequirementChecker
} from './types';
import sourceRequirements from './data';
import filteredAllCourses from './filtered-all-courses';

const getEligibleCoursesFromRequirementCheckers = (checkers: readonly RequirementChecker[]): readonly EligibleCourses[] => (
  checkers.map(oneRequirementChecker => {
    const eligibleCoursesMap: { [semester: string]: number[] } = {};
    Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
      const courseIdSet = new Set(
        courses
          .filter(course => oneRequirementChecker(course))
          .map(course => course.crseId)
      );
      if (courseIdSet.size > 0) {
        // Do not include empty semesters.
        eligibleCoursesMap[semester] = Array.from(courseIdSet);
      }
    });
    return eligibleCoursesMap;
  })
);

const decorateRequirementWithCourses = (
  requirement: CollegeOrMajorRequirement,
): DecoratedCollegeOrMajorRequirement => {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { checker, ...rest } = requirement;
      return {
        ...rest,
        courses: getEligibleCoursesFromRequirementCheckers(typeof checker === 'function' ? [checker] : checker)
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
        )
      };
    }
    default:
      throw new Error();
  }
};

const produceSatisfiableCoursesAttachedRequirementJson = (): DecoratedRequirementsJson => {
  const {
    university, college, major, minor
  } = sourceRequirements;
  type MutableDecoratedJson = {
    university: UniversityRequirements;
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
    university, college: {}, major: {}, minor: {}
  };
  const decorateRequirements = (requirements: readonly CollegeOrMajorRequirement[]) => (
    requirements.map(decorateRequirementWithCourses)
  );
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    decoratedJson.college[collegeName] = { ...rest, requirements: decorateRequirements(requirements) };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, ...rest } = majorRequirement;
    decoratedJson.major[majorName] = { ...rest, requirements: decorateRequirements(requirements) };
  });
  Object.entries(minor).forEach(([minorName, minorRequirement]) => {
    const { requirements, ...rest } = minorRequirement;
    decoratedJson.minor[minorName] = { ...rest, requirements: decorateRequirements(requirements) };
  });
  return decoratedJson;
};

const decoratedRequirementString = JSON.stringify(
  produceSatisfiableCoursesAttachedRequirementJson()
);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
