import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/global-public-health-sciences-bs/';

const gphsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Global & Public Health Core Courses',
    description: 'NS 1600, NS 2060, NS 2600, NS 3600, and NS 4600 (14 credits).',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['NS 1600'],
      ['NS 2060'],
      ['NS 2600'],
      ['NS 3600'],
      ['NS 4600']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: ['NS 1600', 'NS 2060', 'NS 2600', 'NS 3600', 'NS 4600'],
  },
  {
    name: 'Supervised Experiential Learning Opportunity',
    description:
      'Students apply their classroom-based learning to a global or public health issue through a department-approved experience of at least 6 weeks ' +
      'and 150 hours, completed after NS 2060 and before the fall semester of senior year. ' +
      'A reflection course is required to earn credit: NS 4060 (1 credit) or NS 4997 (Washington, DC; 4 credits).',
    source: SOURCE,
    checker: includesWithSingleRequirement('NS 4060', 'NS 4997'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Reflection Course'],
  },
  {
    name: 'Social & Behavioral Health Selective',
    description:
      'One course (minimum 3 credits, 2000 level or above) covering public health from a social and/or behavioral science perspective. ' +
      'See the department Requirements for GPHS majors for updates to the course options.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'NS 2450',
      'NS 4480',
      'NS 4510',
      'NS 4570',
      'ECON 3910',
      'ANTHR 2468',
      'COMM 2850',
      'COMM 4760',
      'HD 4600',
      'GDEV 3020',
      'PUBPOL 3180',
      'PUBPOL 3280',
      'GDEV 3280',
      'PUBPOL 4280',
      'ECON 3710',
      'SOC 4120'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Biological Aspects of Public Health Selective',
    description:
      'One course (minimum 3 credits, 2000 level or above) covering public health from a biological perspective. ' +
      'See the department Requirements for GPHS majors for updates to the course options.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'NS 3060',
      'NS 3150',
      'NS 4200',
      'NS 4210',
      'NS 4300',
      'NS 4410',
      'NS 5510',
      'BIOMG 4390',
      'BIOMG 4870',
      'BIOMI 2600',
      'BIOMI 2950',
      'BIOMI 3210',
      'BIOMI 4040',
      'BIONB 3920',
      'ENTOM 4000',
      'PLSCI 2100'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Environmental Health Selective',
    description:
      'One course (minimum 3 credits, 2000 level or above) covering public health from an environmental perspective. ' +
      'See the department Requirements for GPHS majors for updates to the course options.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'DEA 2700',
      'GDEV 3020',
      'GDEV 3400',
      'BIOMI 2500',
      'BIOMI 2950',
      'BIOMI 4310',
      'BIOMS 4310',
      'COMM 2850',
      'STS 2851',
      'ENTOM 2100',
      'BSOC 2101',
      'ENTOM 4520',
      'FDSC 3960',
      'PLSCI 2100',
      'PLSCI 2400',
      'PLSCI 4140',
      'PLSCI 4450'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Health Policy & Practice Selective',
    description:
      'One course (minimum 3 credits, 2000 level or above) covering public health from a health policy and/or practice perspective. ' +
      'See the department Requirements for GPHS majors for updates to the course options.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'NS 4450',
      'NS 4500',
      'NS 4510',
      'NS 4570',
      'AMST 2225',
      'ANTHR 4458',
      'CRP 3430',
      'GDEV 3020',
      'GDEV 3700',
      'GOVT 3032',
      'HD 4600',
      'PUBPOL 2030',
      'PUBPOL 2050',
      'PUBPOL 2208',
      'PUBPOL 2350',
      'PUBPOL 3110',
      'PUBPOL 3230',
      'PUBPOL 3320',
      'PUBPOL 3650',
      'PUBPOL 3780',
      'PUBPOL 4370'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introductory Chemistry',
    description:
      'Introductory chemistry with laboratory (4-8 credits). Pre-health students should take the two-semester sequence CHEM 2070/2071 and CHEM 2080/2081. ' +
      'Students with an AP Chemistry score of 5 may place out of CHEM 2070/2071 but must still take at least one semester of general chemistry at Cornell ' +
      '(CHEM 2080/2081 or CHEM 2150, not CHEM 1560/1561).',
    source: SOURCE,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Two-Semester General Chemistry': {
        description:
          'CHEM 2070 and CHEM 2071, and CHEM 2080 and CHEM 2081 (two-semester sequence required for pre-health).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['CHEM 2070'],
          ['CHEM 2071'],
          ['CHEM 2080'],
          ['CHEM 2081']
        ),
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2071', 'CHEM 2080', 'CHEM 2081'],
      },
      'General Chemistry I': {
        description:
          'CHEM 2070 and CHEM 2071 (single semester; not adequate for pre-health). Students who take CHEM 2070 forfeit AP credit.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 2070'], ['CHEM 2071']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2071'],
      },
      'Introduction to General Chemistry': {
        description: 'CHEM 1560 and CHEM 1561 (not for pre-health).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 1560'], ['CHEM 1561']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 1560', 'CHEM 1561'],
      },
      'AP Chemistry and General Chemistry II': {
        description: 'AP Chemistry score of 5 and CHEM 2080 and CHEM 2081 (not for pre-health).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 2080'], ['CHEM 2081']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2080', 'CHEM 2081'],
      },
      'AP Chemistry and Honors Chemistry': {
        description:
          'AP Chemistry score of 5 and CHEM 2150 (not for pre-health; only for students who are very strong in chemistry). Students who take CHEM 2150 may keep AP credit.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 2150']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 2150'],
      },
    },
  },
  {
    name: 'Introductory Biology',
    description:
      'One introductory biology laboratory (BIOG 1500 or BIOSM 1500) and two of the three lecture options: ' +
      'BIOMG 1350; BIOG 1440 or BIOG 1445; BIOEE 1610 or BIOEE 1780 (8 credits). Both courses within one option cannot be used. ' +
      'An AP Biology score of 5 may place out of one lecture (not recommended for pre-health students).',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['BIOG 1500', 'BIOSM 1500'],
      ['BIOMG 1350', 'BIOG 1440', 'BIOG 1445', 'BIOEE 1610', 'BIOEE 1780']
    ),
    checkerWarning: 'We do not check that the two lectures come from different options.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 2],
    slotNames: ['Laboratory', 'Lectures'],
  },
  {
    name: 'Organic Chemistry Lecture',
    description:
      'Organic chemistry lecture (3+ credits). Students interested in pre-health tracks should take a two-course sequence (CHEM 3570 and CHEM 3580, or CHEM 3590 and CHEM 3600).',
    source: SOURCE,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'CHEM 1570': {
        description:
          'CHEM 1570: Introduction to Organic and Biological Chemistry (not for pre-health).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 1570']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 1570'],
      },
      'CHEM 3530': {
        description: 'CHEM 3530: Principles of Organic Chemistry.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 3530']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 3530'],
      },
      'CHEM 3570 and CHEM 3580': {
        description:
          'CHEM 3570 and CHEM 3580: Organic Chemistry for the Life Sciences (two-course sequence).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 3570'], ['CHEM 3580']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 3570', 'CHEM 3580'],
      },
      'CHEM 3570': {
        description: 'CHEM 3570 alone (single course not adequate for pre-health).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 3570']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 3570'],
      },
      'CHEM 3590 and CHEM 3600': {
        description:
          'CHEM 3590 and CHEM 3600: Honors Organic Chemistry I and II. Both courses must be taken in sequence; one alone does not fulfill the requirement.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 3590'], ['CHEM 3600']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 3590', 'CHEM 3600'],
      },
    },
  },
  {
    name: 'Physiology',
    description:
      'One of NS 1150, NS 1220, NS 3410, BIOG 1440, or BIOG 1445 (3-4 credits). ' +
      'BIOG 1440/1445 can only be used here if not used to fulfill the introductory biology requirement.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'NS 1150',
      'NS 1220',
      'NS 3410',
      'BIOG 1440',
      'BIOG 1445'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Biochemistry',
    description:
      'Biochemistry (4-6 credits): NS 3200, BIOMG 3300, BIOMG 3350, BIOMG 3310 and BIOMG 3320, or BIOMG 3310 and BIOMI 2900. ' +
      'Students who take only one semester of introductory chemistry should consult their advisors about which biochemistry course is best for them.',
    source: SOURCE,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Single Course': {
        description: 'NS 3200, BIOMG 3300, or BIOMG 3350.',
        counting: 'courses',
        checker: includesWithSubRequirements(['NS 3200', 'BIOMG 3300', 'BIOMG 3350']),
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'BIOMG 3310 Sequence': {
        description: 'BIOMG 3310 and either BIOMG 3320 or BIOMI 2900.',
        counting: 'courses',
        checker: includesWithSubRequirements(['BIOMG 3310'], ['BIOMG 3320', 'BIOMI 2900']),
        perSlotMinCount: [1, 1],
        slotNames: ['BIOMG 3310', 'BIOMG 3320 or BIOMI 2900'],
      },
    },
  },
  {
    name: 'Statistics',
    description:
      'STSCI 2150 or STSCI 2200 (4 credits). AP Statistics credit is not accepted; statistics must be completed at Cornell or another higher education institution. ' +
      'Other statistics courses with a forbidden overlap may not be used.',
    source: SOURCE,
    checker: includesWithSingleRequirement('STSCI 2150', 'STSCI 2200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
];

export default gphsRequirements;

export const gphsAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Ana Adinolfi', email: 'dnsstudentservices@cornell.edu' }],
};
