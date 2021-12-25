import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  RequirementChecker,
  Course,
  MutableMajorRequirements,
} from './types';
import sourceRequirements from './data';
import { NO_EQUIVALENT_COURSES_COURSE_ID, SPECIAL_COURSES } from './data/constants';
import { fullCoursesArray } from '../assets/courses/typed-full-courses';
import universityRequirements from './data/university';

/**
 * Special (synthetic) courses used for AP/IB fulfillment.
 */
const specialCourses: Course[] = Object.entries(SPECIAL_COURSES)
  .map(([name, crseId]) => ({
    subject: name,
    crseId,
    catalogNbr: '',
    titleLong: '',
    enrollGroups: [],
    acadCareer: '',
    acadGroup: '',
  }))
  .filter(({ crseId }) => crseId !== NO_EQUIVALENT_COURSES_COURSE_ID);

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
  major: MutableMajorRequirements<DecoratedCollegeOrMajorRequirement>;
  minor: {
    [key: string]: {
      readonly name: string;
      readonly schools: readonly string[];
      readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
    };
  };
  grad: {
    [key: string]: {
      readonly name: string;
      // Unsure if grad programs can be offered by multiple schools, but allows flexibility.
      readonly schools: readonly string[];
      readonly requirements: readonly DecoratedCollegeOrMajorRequirement[];
    };
  };
};

const getEligibleCoursesFromRequirementCheckers = (
  checkers: readonly RequirementChecker[]
): readonly (readonly number[])[] =>
  checkers.map(oneRequirementChecker => {
    const courseIdSet = new Set(
      [...fullCoursesArray, ...specialCourses]
        .filter(course => oneRequirementChecker(course))
        .map(course => course.crseId)
    );
    // Sort by course ID to get a more stable ordered json
    return Array.from(courseIdSet).sort((a, b) => a - b);
  });

const decorateRequirementWithCourses = (
  requirement: CollegeOrMajorRequirement
): DecoratedCollegeOrMajorRequirement => {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { checker, additionalRequirements, ...rest } = requirement;
      return {
        ...rest,
        courses: getEligibleCoursesFromRequirementCheckers(checker),
        additionalRequirements:
          additionalRequirements &&
          Object.fromEntries(
            Object.entries(additionalRequirements).map(
              ([name, { checker: additionalChecker, ...additionalRequirementRest }]) => [
                name,
                {
                  ...additionalRequirementRest,
                  courses: getEligibleCoursesFromRequirementCheckers(additionalChecker),
                },
              ]
            )
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
            const courses = getEligibleCoursesFromRequirementCheckers(checker);
            return [optionName, { ...rest, courses }];
          })
        ),
      };
    }
    default:
      throw new Error();
  }
};

const requirementsJsonWithSatisfiableCourses = (): MutableDecoratedJson => {
  const { university, college, major, minor, grad } = sourceRequirements;
  const decoratedJson: MutableDecoratedJson = {
    university: {},
    college: {},
    major: {},
    minor: {},
    grad: {},
  };
  const decorateRequirementsWithCourses = (requirements: readonly CollegeOrMajorRequirement[]) =>
    requirements.map(decorateRequirementWithCourses);
  Object.entries(university).forEach(([universityName, universityRequirement]) => {
    const { requirements, ...rest } = universityRequirement;
    decoratedJson.university[universityName] = {
      ...rest,
      requirements: decorateRequirementsWithCourses(requirements),
    };
  });
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    decoratedJson.college[collegeName] = {
      ...rest,
      requirements: decorateRequirementsWithCourses(requirements),
    };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, specializations, ...rest } = majorRequirement;
    decoratedJson.major[majorName] = {
      ...rest,
      requirements: decorateRequirementsWithCourses(requirements),
      specializations: decorateRequirementsWithCourses(specializations ?? []),
    };
  });
  Object.entries(minor).forEach(([minorName, minorRequirement]) => {
    const { requirements, ...rest } = minorRequirement;
    decoratedJson.minor[minorName] = {
      ...rest,
      requirements: decorateRequirementsWithCourses(requirements),
    };
  });
  Object.entries(grad).forEach(([gradName, gradRequirement]) => {
    const { requirements, ...rest } = gradRequirement;
    decoratedJson.grad[gradName] = {
      ...rest,
      requirements: decorateRequirementsWithCourses(requirements),
    };
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
    ...Object.entries(decoratedJson.grad).map(
      ([code, requirements]) => ['GRAD', code, requirements] as const
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

const decorateRequirementWithExams = (
  requirement: DecoratedCollegeOrMajorRequirement
): DecoratedCollegeOrMajorRequirement => {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { courses, ...rest } = requirement;
      return {
        ...rest,
        courses: courses.concat([[10000000]]),
      };
    }
    case 'toggleable': {
      const { fulfillmentOptions } = requirement;
      return {
        ...requirement,
        fulfillmentOptions: Object.fromEntries(
          Object.entries(fulfillmentOptions).map(([optionName, option]) => {
            const { courses, ...rest } = option;
            return [optionName, { ...rest, courses: courses.concat([[20000000]]) }];
          })
        ),
      };
    }
    default:
      throw new Error();
  }
};

const requirementsJsonWithSatisfiableExams = (
  decoratedJson: MutableDecoratedJson
): DecoratedRequirementsJson => {
  const decorateRequirementsWithExams = (
    requirements: readonly DecoratedCollegeOrMajorRequirement[]
  ) => requirements.map(decorateRequirementWithExams);
  const { university, college, major, minor, grad } = decoratedJson;
  Object.entries(university).forEach(([universityName, universityRequirement]) => {
    const { requirements, ...rest } = universityRequirement;
    decoratedJson.university[universityName] = {
      ...rest,
      requirements: decorateRequirementsWithExams(requirements),
    };
  });
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, ...rest } = collegeRequirement;
    decoratedJson.college[collegeName] = {
      ...rest,
      requirements: decorateRequirementsWithExams(requirements),
    };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const { requirements, specializations, ...rest } = majorRequirement;
    decoratedJson.major[majorName] = {
      ...rest,
      requirements: decorateRequirementsWithExams(requirements),
      specializations: decorateRequirementsWithExams(specializations ?? []),
    };
  });
  Object.entries(minor).forEach(([minorName, minorRequirement]) => {
    const { requirements, ...rest } = minorRequirement;
    decoratedJson.minor[minorName] = {
      ...rest,
      requirements: decorateRequirementsWithExams(requirements),
    };
  });
  Object.entries(grad).forEach(([gradName, gradRequirement]) => {
    const { requirements, ...rest } = gradRequirement;
    decoratedJson.grad[gradName] = {
      ...rest,
      requirements: decorateRequirementsWithExams(requirements),
    };
  });

  return decoratedJson;
};

const decoratedRequirements = requirementsJsonWithSatisfiableExams(
  requirementsJsonWithSatisfiableCourses()
);

const decoratedRequirementsString = JSON.stringify(decoratedRequirements, undefined, 2);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementsString);
