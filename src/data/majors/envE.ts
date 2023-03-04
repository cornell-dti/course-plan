import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const majorApproved: readonly string[] = [
  'BEE',
  'CEE',
  'CHEME',
  'EAS',
  'MAE',
  'PLSCS',
  'ENMGT',
  'ECON',
  'AEM',
  'ENGRG',
  'STS',
];

const envEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Organic Chemistry',
    description: 'CHEM 1570 (recommended) or 3530, 3570',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSubRequirements(['CHEM 1570', 'CHEM 3530', 'CHEM 3570']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Biological Sciences',
    description:
      'Choose one of the following Introductory Biology courses: BIOEE/BIOSM 1610, BIOMG 1350, BIOEE/BIOSM 1780, BIOG 1440 or 1445',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSingleRequirement(
      'BIOEE 1610',
      'BIOMG 1350',
      'BIOEE 1780',
      'BIOG 1440',
      'BIOG 1445'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Engineering Distribution',
    description:
      'ENGRD 2510. ENGRD 2020 is recommended for the second Engineering Distribution course',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSubRequirements(['ENGRD 2510']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Engineering Statistics',
    description: 'BEE 2220 or ENGRD 2210 or ENGRD 3200',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSubRequirements(['BEE 2220', 'ENGRD 2210', 'ENGRD 3200']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Core Courses',
    description: 'CEE 3040, CEE 3310, CEE 3510, CEE 4510, BEE 4750, CEE 3230',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSubRequirements(
      ['CEE 3040'],
      ['CEE 3310'],
      ['CEE 3510'],
      ['CEE 4510'],
      ['BEE 4750'],
      ['CEE 3230']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['CEE 3040', 'CEE 3310', 'CEE 3510', 'CEE 4510', 'BEE 4750', 'CEE 3230'],
  },
  {
    name: 'Earth Science',
    description: 'Choose one course from the following list. ',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSingleRequirement(
      'EAS 2250',
      'EAS 2680',
      'EAS 3010',
      'EAS 3030',
      'EAS 3050',
      'EAS 4800',
      'NTRES 3240',
      'PLSCS 2600',
      'PLSCS 3650'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Laboratory Course',
    description: 'Choose one course from the following list. ',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSingleRequirement('BEE 4270', 'CEE 4370', 'CEE 4530 3010'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Design Electives',
    description:
      'Need a total of three (3) courses, at least one from list of capstone design courses and remainder from list of design courses.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: includesWithSingleRequirement(
      'CEE 4210',
      'BEE 4350',
      'CEE 4565',
      'BEE 4730',
      'BEE 4760',
      'BEE 4870',
      'CEE 4350',
      'CEE 4640',
      'CEE 6370',
      'MAE 4020',
      'MAE 4021'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    // TODO: update this with official list
    name: 'Major Approved Electives',
    description:
      'Two courses from a list of major-approved engineering electives or from design course list to complete total credit requirement',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19794#environmentalengineering',
    checker: [
      (course: Course): boolean =>
        majorApproved.some(subject => course.subject?.includes(subject) ?? false),
    ],
    checkerWarning: 'We do not check that the courses are major approved electives.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default envEngineeringRequirements;

export const envEngineeringAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Laura Ricciuti', email: 'lr482@cornell.edu' }],
};
