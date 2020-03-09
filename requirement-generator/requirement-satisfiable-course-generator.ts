import { writeFileSync } from 'fs';
import { Course, CollegeOrMajorRequirement, DecoratedRequirementsJson } from './types';
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
): readonly string[] => {
  const set = new Set<string>();
  Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
    courses
      .filter(course => courseCanSatisfyCollegeOrMajorRequirement(course, collegeRequirement))
      .forEach(it => set.add(`${semester}: ${it.subject} ${it.catalogNbr}`));
  });
  return Array.from(set.values());
};

// TODO: give a better type.
const produceSatisfiableCoursesAttachedRequirementJson = (): DecoratedRequirementsJson => {
  const { university, college, major } = requirementJson;
  const decoratedJson: any = { university, college: {}, major: {} };
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    const decoratedRequirements = collegeRequirement.requirements.map(requirement => ({
      ...requirement,
      courses: getSatisfiableCourses(requirement)
    }));
    decoratedJson.college[collegeName] = { ...rest, requirements: decoratedRequirements };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, ...rest } = majorRequirement;
    const decoratedRequirements = majorRequirement.requirements.map(requirement => ({
      ...requirement,
      courses: getSatisfiableCourses(requirement)
    }));
    decoratedJson.major[majorName] = { ...rest, requirements: decoratedRequirements };
  });
  return decoratedJson;
};

const decoratedRequirementString = JSON.stringify(
  produceSatisfiableCoursesAttachedRequirementJson()
);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
