import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSubRequirements,
  ifCodeMatch,
  courseIsForeignLang,
  courseMatchesCodeOptions,
} from '../checkers-common';

const fashionDesignAdditionalRequirements: readonly string[] = [
  'PBS',
  'BIOLS-AG',
  'BIONLS-AG',
  'SBA',
  'KCM',
  'MQR',
  'LA',
  'CA',
  'HA',
];

const fashionDesignNaturalScienceRequirements: readonly string[] = ['PBS', 'BIOLS-AG', 'BIONLS-AG'];

const fashionDesignRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Social Science',
    description:
      'This fulfills the college distribution social sciences requirement. Choose one 3 credit course from Anthropology, Sociology or Development Sociology.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: [
      (course: Course): boolean => {
        const { subject } = course;
        return (
          ifCodeMatch(subject, 'ANTHR') ||
          ifCodeMatch(subject, 'DSOC') ||
          ifCodeMatch(subject, 'SOC')
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Art History',
    description:
      'This fulfills the college distribution humanities requirement. Choose one Art History course. Note: May be taken while abroad.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: [
      (course: Course): boolean => {
        const { subject } = course;
        return ifCodeMatch(subject, 'ARTH');
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description:
      'This fulfills the college distribution quantitative and analytical courses requirement. Must be taken at Cornell, AP Statistics is not accepted.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements(['PAM 2100', 'AEM 2100', 'STSCI 2100', 'PSYCH 2500']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Natural Science I',
    description: 'This fulfills the college distribution natural sciences requirement.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements([
      'BIOG 1140',
      'BIOG 1440',
      'BIOG 1445',
      'BIOMG 1350',
      'BIOEE 1610',
      'CHEM 1560',
      'CHEM 2070',
      'CHEM 2080',
      'PHYS 1101',
      'PHYS 2207',
      'PHYS 1102',
      'PHYS 2208',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Natural Science II',
    description:
      'Choose any 3 credit course with a PBS, BIOLS-AG, or BIONLS-AG Course Distribution.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: [
      (course: Course): boolean =>
        fashionDesignNaturalScienceRequirements.some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Psychology',
    description: 'This fulfills the college distribution social sciences requirement.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements(['HD 1150', 'HD 1170', 'PSYCH 1101']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Ethics-Sustainability',
    description: 'Choose from one of the following.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements([
      'AEM 3205',
      'BEE 3299',
      'BSOC 2061',
      'COMM 4300',
      'CRP 3011',
      'DEA 4220*',
      'DSOC 3240',
      'FSAD 3200',
      'FSAD 4021',
      'INFO 1200',
      'INFO 4270',
      'NTRES 3320',
      'PHIL 2960',
      'STS 2061',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introductory Economics',
    description: 'This fulfills the college distribution social sciences requirement.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements(['ECON 1110']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Fashion Design Core',
    description:
      'Students in the Fashion Design (Option I) major must complete the requirements below in addition to the Fashion Design and Management Common Requirements.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: includesWithSubRequirements(
      ['FSAD 1111'],
      ['FSAD 1140'],
      ['FSAD 1170'],
      ['FSAD 1250'],
      ['FSAD 1350'],
      ['FSAD 1360'],
      ['FSAD 1450'],
      ['FSAD 2310'],
      ['FSAD 2370'],
      ['FSAD 2640'],
      ['FSAD 2650'],
      ['FSAD 2660'],
      ['FSAD 3770'],
      ['FSAD 4700'],
      ['FSAD 4770']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'FSAD 1111',
      'FSAD 1140',
      'FSAD 1170',
      'FSAD 1250',
      'FSAD 1350',
      'FSAD 1360',
      'FSAD 1450',
      'FSAD 2310',
      'FSAD 2370',
      'FSAD 2640',
      'FSAD 2650',
      'FSAD 2660',
      'FSAD 3770',
      'FSAD 4700',
      'FSAD 4770',
    ],
  },
  {
    name: 'Fashion Design Additional Courses',
    description:
      'Take any two FSAD courses at the 3000, 4000, or 6000 level. Course work from Fashion Design Core Courses cannot count here. FSAD 4000, 4010, 4020, 4030, 4990 cannot count here.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        if (
          courseMatchesCodeOptions(course, [
            'FSAD 4000',
            'FSAD 4010',
            'FSAD 4020',
            'FSAD 4030',
            'FSAD 4990',
          ])
        ) {
          return false;
        }
        return (
          ifCodeMatch(subject, 'FSAD') &&
          (ifCodeMatch(catalogNbr, '3***') ||
            ifCodeMatch(catalogNbr, '4***') ||
            ifCodeMatch(catalogNbr, '6***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Fashion Design Additional Requirements',
    description:
      'Any course with the Course Distribution PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, or HA. Language courses may count here.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626',
    checker: [
      (course: Course): boolean =>
        fashionDesignAdditionalRequirements.some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ) || courseIsForeignLang(course),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
];

export default fashionDesignRequirements;
