import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  ifCodeMatch,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';
import { lastNameRange } from '../../tools/advisors/checkers';

const gamedesignMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Requirement 1',
    description: 'CS/INFO 3152',
    source: 'https://www.cs.cornell.edu/undergrad/minors/game-design-minor',
    checker: includesWithSingleRequirement('CS 3152', 'INFO 3152'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 2',
    description: 'CS/INFO 4152 or CS/INFO 4154',
    source: 'https://www.cs.cornell.edu/undergrad/minors/game-design-minor',
    checker: includesWithSingleRequirement('CS 4152', 'INFO 4152', 'CS 4154', 'INFO 4154'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: '4 Additional Courses',
    description:
      '4 courses outside of your major department. A list of eligible courses is available online.',
    source: 'https://www.cs.cornell.edu/undergrad/minors/game-design-minor',
    checkerWarning:
      'We do not check for all eligible courses and if a course is outside of your major department.',
    checker: [
      (course: Course): boolean =>
        // ART
        (ifCodeMatch(course.subject, 'ART') &&
          (ifCodeMatch(course.catalogNbr, '1***') ||
            ifCodeMatch(course.catalogNbr, '2***') ||
            ifCodeMatch(course.catalogNbr, '3***'))) ||
        // CS
        courseMatchesCodeOptions(course, [
          'CS 2110',
          'CS 2112',
          'CS 4450',
          'CS 4620',
          'CS 4700',
          'CS 4740',
          'CS 4780',
          'CS 5414',
          'CS 5625',
        ]) ||
        // INFO
        courseMatchesCodeOptions(course, [
          'INFO 2450',
          'INFO 3140',
          'INFO 3200',
          'INFO 3450',
          'INFO 3561',
          'INFO 3660',
          'INFO 4240',
          'INFO 4275',
          'INFO 4301',
          'INFO 4320',
          'INFO 4400',
        ]) ||
        // PMA
        courseMatchesCodeOptions(course, [
          'PMA 3531',
          'PMA 3533',
          'PMA 3614',
          'PMA 3631',
          'PMA 3680',
          'PMA 3880',
        ]) ||
        // PSYCH
        courseMatchesCodeOptions(course, [
          'PSYCH 2050',
          'PSYCH 2090',
          'PSYCH 2150',
          'PSYCH 3140',
          'PSYCH 3160',
          'PSYCH 3350',
          'PSYCH 3420',
          'PSYCH 4120',
          'PSYCH 4180',
          'PSYCH 4270',
          'PSYCH 4280',
          'PSYCH 4331',
          'PSYCH 4320',
          'PSYCH 4360',
          'PSYCH 4370',
          'PSYCH 4650',
          'PSYCH 4770',
          'PSYCH 4780',
        ]) ||
        // OTHER
        courseMatchesCodeOptions(course, ['ARTH 3650', 'ASIAN 3315', 'DEA 3510']) ||
        // MUSIC - cannot check if counts as a non-performance class
        ifCodeMatch(course.subject, 'MUSIC'),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
];

export default gamedesignMinorRequirements;

export const gamedesignMinorAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Ryan Marchenese ', email: 'ryan.m@cornell.edu', checker: lastNameRange('A', 'H') },
    { name: 'Carl Cornell', email: 'cec232@cornell.edu', checker: lastNameRange('I', 'Q') },
    { name: 'Nicole Roy', email: 'nicole.roy@cornell.edu', checker: lastNameRange('R', 'Z') },
  ],
};
