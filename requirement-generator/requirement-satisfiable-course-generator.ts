import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  UniversityRequirements,
  DecoratedCollegeOrMajorRequirement,
  EligibleCourses
} from './types';
import { filteredAllCourses, requirementJson } from './requirement-sources-jsons';
import requirementCheckers from './checkers';

const getEligibleCourses = (requirement: CollegeOrMajorRequirement): EligibleCourses => {
  // eligibleCoursesMap[semester][subject]
  // gives you all courses number of the courses eligible for the given requirements.
  const eligibleCoursesMap: { [semester: string]: { [subject: string]: string[] } } = {};
  const { checkerName } = requirement;
  if (checkerName === null) {
    // Self check courses have zero satisfiable course.
    Object.keys(filteredAllCourses).forEach(semester => {
      eligibleCoursesMap[semester] = {};
    });
    return eligibleCoursesMap;
  }
  const requirementChecker = requirementCheckers[checkerName];
  if (requirementChecker === 'all-eligible') {
    return 'all-eligible';
  }
  Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
    const semesterMap: { [subject: string]: string[] } = {};
    courses
      .filter(course => requirementChecker(course))
      .forEach(course => {
        let subjectSet = semesterMap[course.subject];
        if (subjectSet == null) {
          subjectSet = [];
        }
        subjectSet.push(course.catalogNbr);
        semesterMap[course.subject] = subjectSet;
      });
    eligibleCoursesMap[semester] = semesterMap;
  });
  return eligibleCoursesMap;
};

// TODO: give a better type.
const produceSatisfiableCoursesAttachedRequirementJson = (): DecoratedRequirementsJson => {
  const { university, college, major } = requirementJson;
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
  };
  const decoratedJson: MutableDecoratedJson = { university, college: {}, major: {} };
  const decorateRequirements = (requirements: readonly CollegeOrMajorRequirement[]) => (
    requirements.map(requirement => {
      const { checkerName, ...rest } = requirement;
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
  return decoratedJson;
};

const decoratedRequirementString = JSON.stringify(
  produceSatisfiableCoursesAttachedRequirementJson()
);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
