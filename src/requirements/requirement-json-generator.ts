import { writeFileSync } from 'fs';
import {
  CollegeOrMajorRequirement,
  DecoratedRequirementsJson,
  RequirementChecker,
  Course,
  MutableMajorRequirements,
  RequirementMigration,
} from './types';
import sourceRequirements, { colleges } from '../data';
import { NO_FULFILLMENTS_COURSE_ID, SPECIAL_COURSES } from '../data/constants';
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
  .filter(({ crseId }) => crseId !== NO_FULFILLMENTS_COURSE_ID);

type InitialRequirementDecorator = (
  requirement: CollegeOrMajorRequirement
) => DecoratedCollegeOrMajorRequirement;
type RequirementDecorator = (
  requirement: DecoratedCollegeOrMajorRequirement
) => DecoratedCollegeOrMajorRequirement;
type MigrationRequirementDecorator = (
  migration: RequirementMigration
) => MigrationWithDecoratedRequirement;

const getEligibleCoursesFromRequirementCheckers = (
  checkers: readonly RequirementChecker[]
): readonly (readonly number[])[] =>
  checkers.map(oneRequirementChecker => {
    const courseIdSet = new Set(
      [...fullCoursesArray, ...specialCourses]
        .filter(course => oneRequirementChecker(course))
        .map(course => course.crseId)
    );
    return Array.from(courseIdSet);
  });

const applyDecoratorsToRequirements = (
  requirements: readonly CollegeOrMajorRequirement[],
  initialDecorator: InitialRequirementDecorator,
  ...decorators: RequirementDecorator[]
): readonly DecoratedCollegeOrMajorRequirement[] =>
  requirements.map(requirement => {
    const decoratedRequirement = initialDecorator(requirement);
    return decorators.reduce((res, decorator) => decorator(res), decoratedRequirement);
  });

const decorateRequirementWithCourses: InitialRequirementDecorator = requirement => {
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
  return courses.concat(...examCourseIds);
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
    conditions[exam] = {
      colleges: [...validColleges].sort(),
      ...(majorsExcluded && { majorsExcluded }),
    };
  });
  return conditions;
};

const decorateRequirementWithExams: RequirementDecorator = requirement => {
  if (requirement.disallowTransferCredit) {
    return requirement;
  }
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { courses, conditions, additionalRequirements, ...rest } = requirement;
      const examConditions = computeConditionsForExams(courses);
      const newConditions = {
        ...conditions,
        ...examConditions,
      };
      return {
        ...rest,
        courses: courses.map(addCourseIdsForAssociatedExams),
        ...(Object.keys(newConditions).length !== 0 && { conditions: newConditions }),
        additionalRequirements:
          additionalRequirements &&
          Object.fromEntries(
            Object.entries(additionalRequirements).map(
              ([
                name,
                {
                  courses: additionalRequirementCourses,
                  conditions: additionalRequirementConditions,
                  ...additionalRequirementRest
                },
              ]) => {
                const additionalRequirementExamConditions = computeConditionsForExams(
                  additionalRequirementCourses
                );
                const additionalRequirementNewConditions = {
                  ...additionalRequirementConditions,
                  ...additionalRequirementExamConditions,
                };
                return [
                  name,
                  {
                    ...additionalRequirementRest,
                    courses: additionalRequirementCourses.map(addCourseIdsForAssociatedExams),
                    ...(Object.keys(additionalRequirementNewConditions).length !== 0 && {
                      conditions: additionalRequirementNewConditions,
                    }),
                  },
                ];
              }
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
            const { courses, conditions, ...rest } = option;
            const examConditions = computeConditionsForExams(courses);
            const newConditions = {
              ...conditions,
              ...examConditions,
            };
            return [
              optionName,
              {
                ...rest,
                courses: courses.map(addCourseIdsForAssociatedExams),
                ...(Object.keys(newConditions).length !== 0 && { conditions: newConditions }),
              },
            ];
          })
        ),
      };
    }
    default:
      throw new Error();
  }
};

// Sort by course ID to get a more stable ordered json
const sortRequirementCourses: RequirementDecorator = requirement => {
  switch (requirement.fulfilledBy) {
    case 'self-check':
      return requirement;
    case 'courses':
    case 'credits': {
      const { courses, additionalRequirements, ...rest } = requirement;
      return {
        ...rest,
        courses: courses.map(c => [...c].sort((a, b) => a - b)),
        additionalRequirements:
          additionalRequirements &&
          Object.fromEntries(
            Object.entries(additionalRequirements).map(
              ([
                name,
                { courses: additionalRequirementsCourses, ...additionalRequirementRest },
              ]) => [
                name,
                {
                  ...additionalRequirementRest,
                  courses: additionalRequirementsCourses.map(c => [...c].sort((a, b) => a - b)),
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
            const { courses, ...rest } = option;
            return [
              optionName,
              {
                ...rest,
                courses: courses.map(c => [...c].sort((a, b) => a - b)),
              },
            ];
          })
        ),
      };
    }
    default:
      throw new Error();
  }
};

const decorateMigrationValue: MigrationRequirementDecorator = migration => {
  if (migration.newValue) {
    const decoratedValue = decorateRequirementWithCourses(migration.newValue);
    const fullyDecoratedMigration = {
      ...migration,
      newValue: decorateRequirementWithExams(decoratedValue),
    };
    return fullyDecoratedMigration;
  }
  return migration;
};

const decorateMigrations = (
  migrations: readonly RequirementMigration[]
): readonly MigrationWithDecoratedRequirement[] => migrations.map(decorateMigrationValue);

const generateDecoratedRequirementsJson = (): DecoratedRequirementsJson => {
  const { university, college, major, minor, grad } = sourceRequirements;
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
        readonly migrations?: RequirementMigration[];
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
  const decoratedJson: MutableDecoratedJson = {
    university: {},
    college: {},
    major: {},
    minor: {},
    grad: {},
  };
  const decorateRequirements = (requirements: readonly CollegeOrMajorRequirement[]) =>
    applyDecoratorsToRequirements(
      requirements,
      decorateRequirementWithCourses,
      decorateRequirementWithExams,
      sortRequirementCourses
    );
  Object.entries(university).forEach(([universityName, universityRequirement]) => {
    const { requirements, advisors, abbrev: abbr, ...rest } = universityRequirement;
    decoratedJson.university[universityName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
    };
  });
  Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
    const { requirements, migrations, advisors, abbrev: abbr, ...rest } = collegeRequirement;
    decoratedJson.college[collegeName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
      migrations: migrations
        ? (decorateMigrations(migrations) as RequirementMigration[])
        : undefined,
    };
  });
  Object.entries(major).forEach(([majorName, majorRequirement]) => {
    const {
      requirements,
      migrations,
      advisors,
      specializations,
      abbrev: abbr,
      ...rest
    } = majorRequirement;
    decoratedJson.major[majorName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
      migrations: migrations
        ? (decorateMigrations(migrations) as RequirementMigration[])
        : undefined,
      specializations: specializations && decorateRequirements(specializations),
    };
  });
  Object.entries(minor).forEach(([minorName, minorRequirement]) => {
    const { requirements, migrations, advisors, abbrev: abbr, ...rest } = minorRequirement;
    decoratedJson.minor[minorName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
    };
  });
  Object.entries(grad).forEach(([gradName, gradRequirement]) => {
    const { requirements, advisors, abbrev, ...rest } = gradRequirement;
    decoratedJson.grad[gradName] = {
      ...rest,
      requirements: decorateRequirements(requirements),
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

const decoratedRequirements = generateDecoratedRequirementsJson();
const decoratedRequirementsString = JSON.stringify(decoratedRequirements, undefined, 2);

writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementsString);
