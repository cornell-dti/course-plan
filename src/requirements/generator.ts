import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  UniversityRequirements,
  DecoratedCollegeOrMajorRequirement,
  EligibleCourses
} from './types';
import sourceRequirements from './data';
import filteredAllCourses from './filtered-all-courses';

const getEligibleCourses = (requirement: CollegeOrMajorRequirement): readonly EligibleCourses[] => {
  // eligibleCoursesMap[semester][subject]
  // gives you all courses number of the courses eligible for the given requirements.
  const { checker: requirementChecker } = requirement;
  if (requirementChecker === null) {
    // Self check courses have zero satisfiable course.
    return [];
  }
  const subRequirementCheckers = typeof requirementChecker === 'function'
    ? [requirementChecker]
    : requirementChecker;
  return subRequirementCheckers.map(oneRequirementChecker => {
    const eligibleCoursesMap: { [semester: string]: { [subject: string]: string[] } } = {};
    Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
      const semesterMap: { [subject: string]: string[] } = {};
      courses
        .filter(course => oneRequirementChecker(course))
        .forEach(course => {
          let subjectSet = semesterMap[course.subject];
          if (subjectSet == null) {
            subjectSet = [];
          }
          subjectSet.push(course.catalogNbr);
          semesterMap[course.subject] = subjectSet;
        });
      if (Object.keys(semesterMap).length > 0) {
        // Do not include empty semesters.
        eligibleCoursesMap[semester] = semesterMap;
      }
    });
    return eligibleCoursesMap;
  });
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
        readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
      };
    };
  };
  const decoratedJson: MutableDecoratedJson = {
    university, college: {}, major: {}, minor: {}
  };
  const decorateRequirements = (requirements: readonly CollegeOrMajorRequirement[]) => (
    requirements.map(requirement => {
      const { checker, ...rest } = requirement;
      return {
        ...rest, courses: getEligibleCourses(requirement)
      };
    })
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
