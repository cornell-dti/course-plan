import { readFileSync, writeFileSync } from 'fs';
import { Course } from './types';
import {
  StrictFulfilledByType,
  MajorRequirement,
  CollegeRequirement,
  RequirementsJson
} from '../src/requirements/types';

type FilteredCourse = Pick<Course, 'subject' | 'catalogNbr'>;

const filteredAllCourses: readonly FilteredCourse[] = JSON.parse(
  readFileSync('requirement-generator/filtered-all-courses.json').toString()
);
const requirementJson: RequirementsJson<StrictFulfilledByType> = JSON.parse(
  readFileSync('src/requirements/reqs.json').toString()
);

const courseCanSatisfyCollegeRequirement = (
  course: FilteredCourse,
  majorRequirement: CollegeRequirement<StrictFulfilledByType>
): boolean => Math.random() < 0.01;

const courseCanSatisfyMajorRequirement = (
  course: FilteredCourse,
  majorRequirement: MajorRequirement<StrictFulfilledByType>
): boolean => Math.random() < 0.01;

const produceSatisfiableCourseIdForCollegeRequirement = (
  collegeRequirement: CollegeRequirement<StrictFulfilledByType>
): readonly string[] => {
  const set = new Set<string>();
  filteredAllCourses
    .filter(course => courseCanSatisfyCollegeRequirement(course, collegeRequirement))
    .forEach(it => set.add(`${it.subject} ${it.catalogNbr}`));
  return Array.from(set.values());
};

const produceSatisfiableCourseIdForMajorRequirement = (
  majorRequirement: MajorRequirement<StrictFulfilledByType>
): readonly string[] => {
  const set = new Set<string>();
  filteredAllCourses
    .filter(course => courseCanSatisfyMajorRequirement(course, majorRequirement))
    .forEach(it => set.add(`${it.subject} ${it.catalogNbr}`));
  return Array.from(set.values());
};

// TODO: give a better type.
const produceSatisfiableCoursesAttachedRequirementJson = (): any => {
  const { university, college, major } = requirementJson;
  const decoratedJson: any = { university, college: {}, major: {} };
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    const decoratedRequirements = collegeRequirement.requirements.map(requirement => ({
      ...requirement,
      courses: produceSatisfiableCourseIdForCollegeRequirement(requirement)
    }));
    decoratedJson.college[collegeName] = { ...rest, requirements: decoratedRequirements };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, ...rest } = majorRequirement;
    const decoratedRequirements = majorRequirement.requirements.map(requirement => ({
      ...requirement,
      courses: produceSatisfiableCourseIdForMajorRequirement(requirement)
    }));
    decoratedJson.major[majorName] = { ...rest, requirements: decoratedRequirements };
  });
  return decoratedJson;
};

writeFileSync(
  'requirement-generator/decorated-requirements.json',
  JSON.stringify(produceSatisfiableCoursesAttachedRequirementJson())
);
