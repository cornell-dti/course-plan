import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseMatchesCodeOptions,
  ifCodeMatch,
} from '../checkers-common';

const deaRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'Take all of the following: DEA 1050, DEA 1101, DEA 1110, DEA 1150, DEA 1500, DEA 2030, DEA 2510, DEA 2730, DEA 3590, DEA 4040, DEA 5304',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements(
      ['DEA 1050'],
      ['DEA 1101'],
      ['DEA 1110'],
      ['DEA 1150'],
      ['DEA 1500'],
      ['DEA 2030'],
      ['DEA 2510'],
      ['DEA 2730'],
      ['DEA 3590'],
      ['DEA 4040'],
      ['DEA 5304']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 11,
  },
  {
    name: 'DEA Thematic Courses',
    description:
      'Three out of the 9 must be studio thematic courses. Students must take at least one 2000-level studio. Students may not take more than 2 studios in one semester, ' +
      'this includes both DEA and non-DEA studios. Enrollment in 2 studios simultaneously requires  approval from both studio instructors. ' +
      'DEA 4990 can fall under any of the three DEA Thematics.',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements([
      'DEA 2200',
      'DEA 2201',
      'DEA 2203',
      'DEA 2550,',
      'DEA 2750',
      'DEA 3050',
      'DEA 3301',
      'DEA 3306',
      'DEA 3530',
      'DEA 4402',
      'DEA 4500',
      'DEA 4990',
      'DEA 5210',
      'DEA 5520',
      'DEA 5540',
      'DEA 2020',
      'DEA 2040',
      'DEA 2422',
      'DEA 3030',
      'DEA 3500',
      'DEA 4220',
      'DEA 4401',
      'DEA 2700',
      'DEA 3308',
      'DEA 3510',
      'DEA 4700',
      'DEA 5305',
      'DEA 5560',
    ]),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 9,
  },
  {
    name: 'Research Methods Course',
    description: 'Choose one of the following courses: DEA 3550, ILROB 4710, PAM 3120',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements(['DEA 3550', 'ILROB 4710', 'PAM 3120']),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Human Development or Psychology',
    description: 'Choose one of the following courses: HD 1150, HC 1170, PSYCH 1101',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements(['HD 1150', 'HC 1170', 'PSYCH 1101']),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Introductory Microeconomics',
    description: 'ECON 1110',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements(['ECON 1110']),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Humanities',
    description: 'Choose any course with the Course Distribution HA, LA or CA.',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: (course: Course): boolean =>
      ['CA', 'HA', 'LA/LAD'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Statistics',
    description:
      'Must be taken at Cornell, AP Statistics is not accepted. Choose one of the following: ' +
      'PAM 2100, AEM 2100, ILRST/STSCI 2100, or PSYCH 2500',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: includesWithSubRequirements(['PAM 2100', 'AEM 2100', 'ILRST 2100', 'PSYCH 2500']),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Natural Science I',
    description:
      'Choose one of the following options. If AP isn’t used to satisfy the requirement, then the course must be taken at Cornell. No lab is required.',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Biology: {
        description:
          'Take 1: BIOG 1140, BIOG 1440, BIOMG 1350, BIOEE 1610, BIOG 1445, or 5 on AP Biology',
        checker: includesWithSubRequirements([
          'BIOG 1140',
          'BIOG 1440',
          'BIOMG 1350',
          'BIOEE 1610',
          'BIOG 1445',
        ]),
        counting: 'courses',
        operator: 'and',
        minCount: 1,
      },
      Chemistry: {
        description: 'Take 1: CHEM 1560, CHEM 2070, CHEM 2080, or 5 on AP Chemistry',
        checker: includesWithSubRequirements(['CHEM 1560', 'CHEM 2070', 'CHEM 2080']),
        counting: 'courses',
        operator: 'and',
        minCount: 1,
      },
      Physics: {
        description: 'Take 1: PHYS 1101, PHYS 2207, PHYS 1102, PHYS 2208, or 5 on AP Physics',
        checker: includesWithSubRequirements(['PHYS 1101', 'PHYS 2207', 'PHYS 1102', 'PHYS 2208']),
        counting: 'courses',
        operator: 'and',
        minCount: 1,
      },
    },
  },
  {
    name: 'Natural Science II',
    description:
      'Choose any 3 credit course with a PBS, BIOLS-AG, or BIONLS-AG Course Distribution.',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: (course: Course): boolean =>
      ['PBS', 'BIOLS-AG', 'BIONLS-AG '].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 3,
  },
  {
    name: 'DEA Additional Requirements',
    description:
      'Any course with the Course Distribution PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, or HA. Language courses may count here.',
    source:
      'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements',
    checker: (course: Course): boolean =>
      ['PBS', 'BIOLS-AG', 'BIONLS-AG', 'SBA', 'KCM', 'MQR', 'LA', 'CA', 'HA', 'FL'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6,
  },
];

export default deaRequirements;
