import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const easRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Mathematics',
    description:
      'At least two courses in calculus. Option 1: MATH 1110 and MATH 1120. Option 2: MATH 1910 and MATH 1920',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'MATH 1110 and MATH 1120',
        checker: includesWithSubRequirements(['MATH 1110'], ['MATH 1120']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['MATH 1110', 'MATH 1120'],
      },
      'Option 2': {
        description: 'MATH 1910 and MATH 1920',
        checker: includesWithSubRequirements(['MATH 1910'], ['MATH 1920']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['MATH 1910', 'MATH 1920'],
      },
    },
  },
  {
    name: 'Physics',
    description:
      'At least two courses in calculus-based physics. Option 1: PHYS 2207 and PHYS 2208. Option 2: PHYS 1112 and PHYS 2213',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'PHYS 2207 and PHYS 2208',
        checker: includesWithSubRequirements(['PHYS 2207'], ['PHYS 2208']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['PHYS 2207', 'PHYS 2208'],
      },
      'Option 2': {
        description: 'PHYS 1112 and PHYS 2213',
        checker: includesWithSubRequirements(['PHYS 1112'], ['PHYS 2213']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['PHYS 1112', 'PHYS 2213'],
      },
    },
  },
  {
    name: 'Chemistry',
    description:
      'Option 1: CHEM 2070 or CHEM 2090 and CHEM 2080. Option 2: CHEM 1570. Option 3: PHYS 2214',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070 or CHEM 2090 and CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2070', 'CHEM 2090'], ['CHEM 2080']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2070 or CHEM 2090', 'CHEM 2080'],
      },
      'Option 2': {
        description: 'CHEM 1570',
        checker: includesWithSingleRequirement('CHEM 1570'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'Option 3': {
        description: 'PHYS 2214',
        checker: includesWithSingleRequirement('PHYS 2214'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
    },
  },
  {
    name: 'Biology',
    description:
      'At least one course in biology, chosen from the following: BIOG 1140, BIOG 1440, BIOEE 1610, BIOEE 1780, BIOMG 1350, BIOSM 1610, or BIOSM 1780',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'courses',
    checker: includesWithSingleRequirement(
      'BIOG 1140',
      'BIOG 1140',
      'BIOEE 1610',
      'BIOEE 1780',
      'BIOMG 1350',
      'BIOSM 1610',
      'BIOSM 1780'
    ),
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Advisor-Approved Course in Math, Statistics, Computer Science, or Natural Science',
    description:
      'In addition to the math, physics, chemistry, and biology requirements listed above, students are required to take an advisor-approved course in statistics, computer science, mathematics, or natural science (including, but not limited to, a course in astronomy, a second course in biology, or an additional course in physics or chemistry). Students in the College of Agriculture and Life Sciences must select a second course in biology.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Introductory Course',
    description:
      'Students in the College of Engineering may count EAS 2250 The Earth System as an ENGRD course in fulfilling their college core curriculum requirements. Students who choose to do so must take an additional major-approved elective (see "Additional Required Courses" section below).',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'courses',
    checker: includesWithSingleRequirement('EAS 2250'),
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Field Work',
    description:
      'A minimum of 3 credits of appropriate coursework is required, although more experience with fieldwork is encouraged.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    checker: [_ => true],
    checkerWarning: 'We do not check that provided courses fulfill the Field Work requirement',
  },
  {
    name: 'Concentration',
    description: 'Choose one concentration from the four available',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Climate Science': {
        description:
          'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['EAS 3050'],
          ['EAS 3410'],
          ['EAS 3420'],
          [
            'EAS 3340',
            'EAS 3530',
            'EAS 4350',
            'EAS 4470',
            'EAS 4800',
            'EAS 3010',
            'EAS 3030',
            'EAS 3421',
            'EAS 4443',
            'EAS 4444',
            'EAS 5555',
            'BEE 2000',
            'BEE 4110',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 5],
        slotNames: ['EAS 3050', 'EAS 3410', 'EAS 3420', 'Concentration Course'],
      },
      'Environmental Science': {
        description:
          'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['EAS 3090'],
          ['EAS 3030'],
          ['EAS 3450'],
          [
            'EAS 3010',
            'EAS 3530',
            'EAS 3540',
            'EAS 4710',
            'EAS 4740',
            'EAS 4870',
            'PLSCS 4110',
            'PLSCS 3650',
            'BEE 4270',
            'BEE 4730',
            'BEE 4750',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 5],
        slotNames: ['EAS 3090', 'EAS 3030', 'EAS 3450', 'Concentration Course'],
      },
      'Geological Sciences': {
        description:
          'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['EAS 3090'],
          ['EAS 3880'],
          ['EAS 3010'],
          [
            'EAS 4010',
            'EAS 4040',
            'EAS 4050',
            'EAS 4540',
            'EAS 4550',
            'EAS 4561',
            'EAS 4760',
            'EAS 4780',
            'EAS 4790',
            'EAS 4820',
            'BEE 4840',
            'EAS 4580',
            'EAS 4740',
            'EAS 5770',
            'EAS 5780',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 5],
        slotNames: ['EAS 3090', 'EAS 3880', 'EAS 3010', 'Concentration Course'],
      },
      'Ocean Sciences': {
        description:
          'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['EAS 3050'],
          ['EAS 3530'],
          ['EAS 3010'],
          [
            'BIOEE 4570',
            'BIOEE 4780',
            'BIOEE 4920',
            'BIOEE 4930',
            'BIOEE 6680',
            'BIOSM 3650',
            'EAS 3420',
            'EAS 3530',
            'EAS 3540',
            'EAS 3555',
            'EAS 4620',
            'BIOSM 3210',
            'BIOSM 3830',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 5],
        slotNames: ['EAS 3050', 'EAS 3530', 'EAS 3010', 'Concentration Course'],
      },
    },
  },
];

export default easRequirements;
