import { Course, CollegeOrMajorRequirement } from '../../requirements/types';

import {
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseIsForeignLang,
  courseMeetsCreditMinimum,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const hdRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Courses',
    description: 'HD 1150 and HD 1170.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSubRequirements(['HD 1150'], ['HD 1170']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['HD 1150', 'HD 1170'],
  },
  {
    name: 'Breadth Requirement',
    description:
      'One course from Mind, Health & Emotion, and one course from Cognition, Brain & Behavior.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSubRequirements(
      [
        'HD 2180',
        'HD 2520',
        'HD 2510',
        'HD 2580',
        'HD 2600',
        'HD 2610',
        'HD 2650',
        'HD 2710',
        'HD 2800',
        'HD 2820',
        'HD 3270',
        'HD 3280',
        'HD 3290',
        'HD 3300',
        'HD 3310',
        'HD 3320',
        'HD 3450',
        'HD 3460',
        'HD 3490',
        'HD 3510',
        'HD 3570',
        'HD 3620',
        'HD 3650',
        'HD 3660',
        'HD 3700',
        'HD 4070',
        'HD 4120',
        'HD 4230',
        'HD 4240',
        'HD 4280',
        'HD 4310',
        'HD 4390',
        'HD 4410',
        'HD 4420',
        'HD 4430',
        'HD 4490',
        'HD 4500',
        'HD 4520',
        'HD 4570',
        'HD 4580',
        'HD 4590',
        'HD 4690',
        'HD 4770',
        'HD 4790',
        'HD 4850',
        'HD 4860',
      ],
      [
        'HD 2180',
        'HD 2200',
        'HD 2300',
        'HD 2580',
        'HD 2610',
        'HD 2650',
        'HD 2710',
        'HD 2800',
        'HD 3110',
        'HD 3190',
        'HD 3210',
        'HD 3250',
        'HD 3290',
        'HD 3330',
        'HD 3460',
        'HD 3660',
        'HD 4230',
        'HD 4250',
        'HD 4260',
        'HD 4290',
        'HD 4300',
        'HD 4310',
        'HD 4340',
        'HD 4380',
        'HD 4410',
        'HD 4440',
        'HD 4450',
        'HD 4470',
        'HD 4490',
        'HD 4500',
        'HD 4540',
        'HD 4620',
        'HD 4630',
        'HD 4720',
        'HD 4765',
        'HD 4790',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Mind, Health & Emotion', 'Cognition, Brain & Behavior'],
  },
  {
    name: 'HD 4000 electives',
    description: 'At least 6 credits must be taken at the 4000 level.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'HD') &&
        !courseMatchesCodeOptions(course, ['HD 4030', 'HD 4980']) &&
        ifCodeMatch(course.catalogNbr, '4***'),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'HD 3000/4000 electives',
    description: 'At least 12 credits must be taken at the 3000/4000 level.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'HD') &&
        !courseMatchesCodeOptions(course, ['HD 4030', 'HD 4980']) &&
        (ifCodeMatch(course.catalogNbr, '3***') || ifCodeMatch(course.catalogNbr, '4***')),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
  },
  {
    name: 'Additional HD Electives',
    description: 'Minimum of 6 additional HD credits of any level.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'HD') && !courseMatchesCodeOptions(course, ['HD 2830']),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Scientific Research Methods',
    description:
      'HD 2830, BIOG 1500, or a 5 on AP Biology. Students who plan to complete the HD Honors Program requirements must take HD 2830.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('HD 2830', 'BIOG 1500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Social Science',
    description:
      'Any two courses with the course distribution SBA or KCM that are not cross-listed with Human Development.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        !ifCodeMatch(course.subject, 'HD') &&
        ((course.catalogDistr?.includes('KCM-') ?? false) ||
          (course.catalogDistr?.includes('SBA-') ?? false)),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Humanities',
    description: 'Any course with the course distribution HA, LA, or CA.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        (course.catalogDistr?.includes('CA-') ?? false) ||
        (course.catalogDistr?.includes('HA-') ?? false) ||
        (course.catalogDistr?.includes('LA-') ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description:
      'A statistics course taken at Cornell (AP Statistics is not accepted). PSYCH 2500 is strongly recommended for HD majors, and must be taken by students planning to complete the Honors Program.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement(
      'AEM 2100',
      'BTRY 3010',
      'ILRST 2100',
      'STSCI 2100',
      'MATH 1710',
      'PAM 2100',
      'PSYCH 2500'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Natural Science I',
    description:
      'One of the following natural science courses taken at Cornell, or a score of 5 on AP Biology. No lab is required.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: includesWithSingleRequirement('BIOG 1140', 'BIOMG 1350', 'BIOG 1440', 'BIOG 1445'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Natural Science II',
    description:
      'Any 3-4 credit course with a Course Distribution PBS, BIOLS-AG, or BIONLS-AG. Course must be taken at Cornell (no AP credit allowed).',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
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
    name: 'Additional Requirements',
    description:
      'Any course with the Course Distribution PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, or HA. Language courses may count here.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    checker: [
      (course: Course): boolean =>
        ['PBS', 'BIOLS-AG', 'BIONLS-AG', 'SBA', 'KCM', 'MQR', 'LA', 'CA', 'HA', 'FL'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ) || courseIsForeignLang(course),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
  },
  {
    name: 'Electives',
    description: 'Any courses that are not applied to the requirements above count as Electives.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    fulfilledBy: 'self-check',
  },
];

export default hdRequirements;

export const hdAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Vivian Zayas', email: 'psych-dus@cornell.edu' }],
};
