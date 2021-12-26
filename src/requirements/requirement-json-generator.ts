import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  RequirementChecker,
  Course,
  MutableMajorRequirements,
} from './types';
import sourceRequirements, { colleges } from './data';
import { NO_EQUIVALENT_COURSES_COURSE_ID, SPECIAL_COURSES } from './data/constants';
import {
  examRequirementsMapping,
  examToCourseMapping,
  courseToExamMapping,
} from './requirement-exam-mapping';
import { fullCoursesArray } from '../assets/courses/typed-full-courses';

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

const equivalentCourseIds = new Set(Object.keys(courseToExamMapping));
const generateExamCourseIdsFromEquivalentCourses = (
  courses: readonly number[]
): { examCourseIds: Set<number>; examEquivalentCourses: Set<string> } => {
  const examCourseIds = new Set<number>();
  const examEquivalentCourses = new Set<string>();
  courses
    .map(course => course.toString())
    .filter(course => equivalentCourseIds.has(course))
    .forEach(course => {
      courseToExamMapping[course].forEach(exam => examCourseIds.add(exam));
      examEquivalentCourses.add(course);
    });
  return {
    examCourseIds,
    examEquivalentCourses,
  };
};

/**
 * Map this function across every list of course ids and figure out which
 * exams' course ids should be added (if any).
 */
const addCourseIdsForAssociatedExams = (courses: readonly number[]): number[] => {
  const { examCourseIds } = generateExamCourseIdsFromEquivalentCourses(courses);
  return [...[...examCourseIds].sort(), ...courses];
};

/**
 * Compute requirements conditions for AP/IB exams
 */
const computeConditionsForExams = (courses: readonly (readonly number[])[]) => {
  const conditions: Record<
    number,
    {
      colleges: string[];
      majorsExcluded?: string[];
    }
  > = {};
  const { examCourseIds, examEquivalentCourses } = generateExamCourseIdsFromEquivalentCourses(
    courses.flat()
  );
  examCourseIds.forEach(exam => {
    const { collegeConditions, majorsExcluded } = examRequirementsMapping[exam];
    const validColleges = new Set<string>();
    examToCourseMapping[exam].forEach(course => {
      if (examEquivalentCourses.has(course.toString()))
        collegeConditions[course].forEach(college => validColleges.add(college));
    });
    if (validColleges.size === colleges.length) return;
    conditions[exam] = majorsExcluded
      ? {
          colleges: [...validColleges].sort(),
          majorsExcluded,
        }
      : {
          colleges: [...validColleges].sort(),
        };
  });
  return conditions;
};

const decorateRequirementWithExams = (
  requirement: DecoratedCollegeOrMajorRequirement
): DecoratedCollegeOrMajorRequirement => {
  if (requirement.disallowTransferCredit) {
    return requirement;
  }
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { courses, conditions, ...rest } = requirement;
      const examConditions = computeConditionsForExams(courses);
      const newConditions = {
        ...conditions,
        ...examConditions,
      };
      return Object.keys(newConditions).length !== 0
        ? {
            ...rest,
            courses: courses.map(addCourseIdsForAssociatedExams),
            conditions: newConditions,
          }
        : {
            ...rest,
            courses: courses.map(addCourseIdsForAssociatedExams),
          };
    }
    case 'toggleable': {
      const { fulfillmentOptions } = requirement;
      return {
        ...requirement,
        fulfillmentOptions: Object.fromEntries(
          Object.entries(fulfillmentOptions).map(([optionName, option]) => {
            const { courses, conditions, ...rest } = option;
            const examConditions = computeConditionsForExams(courses);
            const newConditions = {
              ...conditions,
              ...examConditions,
            };
            return [
              optionName,
              Object.keys(newConditions).length !== 0
                ? {
                    ...rest,
                    courses: courses.map(addCourseIdsForAssociatedExams),
                    conditions: newConditions,
                  }
                : { ...rest, courses: courses.map(addCourseIdsForAssociatedExams) },
            ];
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
