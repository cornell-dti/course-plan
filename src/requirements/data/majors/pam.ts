import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  ifCodeMatch,
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  courseIsForeignLang,
  includesWithSubRequirements,
  courseMeetsCreditMinimum,
} from '../checkers-common';

const pamRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: 'PAM 2000, PAM 2030, PAM 2040, PAM 2101, PAM 2300, PAM 3100, and PAM 3300.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSubRequirements(
      ['PAM 2000'],
      ['PAM 2030'],
      ['PAM 2040'],
      ['PAM 2101'],
      ['PAM 2300'],
      ['PAM 3100'],
      ['PAM 3300']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
    slotNames: ['PAM 2000', 'PAM 2030', 'PAM 2040', 'PAM 2101', 'PAM 2300', 'PAM 3100', 'PAM 3300'],
  },
  // TODO - limit this checker to only allow 1 course of PAM 4900 at a max of 3 credits
  {
    name: 'PAM 3000/4000 Electives',
    description:
      '18 credits of 3000 or 4000 level PAM courses. PAM 4000, 4010, 4020, 4030, 4060, 4980, and 4990 may not be used to fulfill this requirement, ' +
      'and a max of 3 credits from PAM 4900 can be used.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'PAM') &&
        !courseMatchesCodeOptions(course, [
          'PAM 4000',
          'PAM 4010',
          'PAM 4020',
          'PAM 4030',
          'PAM 4060',
          'PAM 4980',
          'PAM 4990',
        ]) &&
        (ifCodeMatch(course.catalogNbr, '3***') || ifCodeMatch(course.catalogNbr, '4***')),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [18],
  },
  {
    name: 'Additional PAM Electives',
    description: 'Any 3 additional PAM credits (except PAM 1200 & PAM 4030) or ECON 1120.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        (ifCodeMatch(course.subject, 'PAM') &&
          !courseMatchesCodeOptions(course, ['PAM 1200', 'PAM 4030'])) ||
        courseMatchesCodeOptions(course, ['ECON 1120']),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Introductory Microeconomics',
    description: 'ECON 1110.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('ECON 1110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Sociology',
    description: 'SOC 1101, DSOC 1101, or PAM 2250.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('SOC 1101', 'DSOC 1101', 'PAM 2250'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Human Development or Psychology',
    description: 'HD 1150 or PSYCH 1101.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('HD 1150', 'PSYCH 1101'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  // TODO: specifically include AP Calc BC
  {
    name: 'Mathematics',
    description:
      'Any 3+ credit math course taken at Cornell except MATH 1101 and MATH 1710, or a score of 4 or 5 on AP Calculus BC exam.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'MATH') &&
        !courseMatchesCodeOptions(course, ['MATH 1101', 'PAM 1710']) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Government',
    description: 'GOVT 1111.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('GOVT 1111'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  // TODO specifically allow AP Bio, AP Chem, and AP Phys scores of 5
  {
    name: 'Natural Science I',
    description:
      'One of the following biology, chemisty, or physics courses taken at Cornell, or a score of 5 on AP Biology, AP Chemisty, or AP Physics. No lab is required.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement(
      'BIOG 1140',
      'BIOMG 1350',
      'BIOG 1440',
      'BIOG 1445',
      'BIOEE 1610',
      'CHEM 1560',
      'CHEM 2070',
      'CHEM 2080',
      'PHYS 1101',
      'PHYS 2207',
      'PHYS 1102',
      'PHYS 2208'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Natural Science II',
    description:
      'Any 3-4 credit course with a Course Distribution PBS, BIOLS-AG, or BIONLS-AG. Course must be taken at Cornell (no AP credit allowed).',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ['PBS', 'BIOLS-AG', 'BIONLS-AG'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ) && courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Ethics',
    description:
      'Any 3 credit ethics class. You can check with the PAM Director of Undergraduate Studies to apply courses not listed.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement(
      'BSOC 2051',
      'BSOC 2061',
      'BSOC 4071',
      'COMM 4300',
      'CRP 3011',
      'ECE 3600',
      'ILRLR 3830',
      'ILRLR 4820',
      'ILRLR 4880',
      'ILRLR 4075',
      'INFO 1200',
      'INFO 2750',
      'NTRES 3320',
      'PHIL 1440',
      'PHIL 1450',
      'PHIL 2410',
      'PHIL 2420',
      'PHIL 2455',
      'PHIL 2441',
      'PHIL 3410',
      'PHIL 3460',
      'PHIL 3480'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Requirements',
    description:
      'Any courses with the Course Distribution PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, or HA. Language courses may count here.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ['PBS', 'BIOLS-AG', 'BIONLS-AG', 'SBA', 'KCM', 'MQR', 'LA', 'CA', 'HA', 'FL'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ) || courseIsForeignLang(course),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Electives',
    description: 'Any courses that are not applied to the requirements above count as Electives.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/PAM%20Curriculum%20Sheet%202020-2021.pdf',
    fulfilledBy: 'self-check',
  },
];

export default pamRequirements;
