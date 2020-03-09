import { writeFileSync } from 'fs';
import {
  Course,
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  UniversityRequirements,
  DecoratedCollegeOrMajorRequirement,
  EligibleCourses
} from './types';
import { filteredAllCourses, requirementJson } from './requirement-sources-jsons';
import checkIfCourseFulfilled from './requirement-checker';

function courseCanSatisfyCollegeOrMajorRequirement(
  course: Course,
  requirement: CollegeOrMajorRequirement
): boolean {
  return checkIfCourseFulfilled(
    course,
    requirement.search,
    requirement.includes,
    requirement.excludes || []
  );
}

const getSatisfiableCourses = (
  collegeRequirement: CollegeOrMajorRequirement
): EligibleCourses => {
  const allMap: { [semester: string]: { [subject: string]: string[] } } = {};
  Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
    const semesterMap: { [subject: string]: string[] } = {};
    courses
      .filter(course => courseCanSatisfyCollegeOrMajorRequirement(course, collegeRequirement))
      .forEach(course => {
        let subjectSet = semesterMap[course.subject];
        if (subjectSet == null) {
          subjectSet = [];
        }
        subjectSet.push(course.catalogNbr);
        semesterMap[course.subject] = subjectSet;
      });
    allMap[semester] = semesterMap;
  });
  return allMap;
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
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    const decoratedRequirements = collegeRequirement.requirements.map(requirement => {
      const { search } = requirement;
      const courses: EligibleCourses = search != null && search.includes('all-eligible')
        ? 'all-eligible'
        : getSatisfiableCourses(requirement);
      return { ...requirement, courses };
    });
    decoratedJson.college[collegeName] = { ...rest, requirements: decoratedRequirements };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, ...rest } = majorRequirement;
    const decoratedRequirements = majorRequirement.requirements.map(requirement => {
      const { search } = requirement;
      const courses: EligibleCourses = search != null && search.includes('all-eligible')
        ? 'all-eligible'
        : getSatisfiableCourses(requirement);
      return { ...requirement, courses };
    });
    decoratedJson.major[majorName] = { ...rest, requirements: decoratedRequirements };
  });
  return decoratedJson;
};

const decoratedRequirementString = JSON.stringify(
  produceSatisfiableCoursesAttachedRequirementJson()
);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
