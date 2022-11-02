import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/types';

const mathRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Linear Algebra',
    description: 'MATH 2210, 2230, or 2940.',
    source: 'https://math.cornell.edu/major',
    checker: includesWithSingleRequirement('MATH 2210', 'MATH 2230', 'MATH 2940'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Multivariable Calculus',
    description: 'MATH 2220, 2240, or 1920.',
    source: 'https://math.cornell.edu/major',
    checker: includesWithSingleRequirement('MATH 2220', 'MATH 2240', 'MATH 1920'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Programming Course',
    description: 'A 3- or 4-credit computer programming course.',
    source: 'https://math.cornell.edu/major',
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112', 'CS 2110', 'CS 2112'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Algebra',
    description: 'Two Courses in Algebra.',
    source: 'http://pi.math.cornell.edu/files/Undergraduate/Major/worksheets/u-mathmajor-math.pdf',
    //  TODO - We don't account for forbidden overlaps
    checker: includesWithSingleRequirement(
      'MATH 3320',
      'MATH 3340',
      'MATH 4310',
      'MATH 4330',
      'MATH 4340',
      'MATH 4370',
      'MATH 4500',
      'MATH 4560',
      'MATH 3360',
      'MATH 4315'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Analysis',
    description: 'Two Courses in Analysis.',
    source: 'http://pi.math.cornell.edu/files/Undergraduate/Major/worksheets/u-mathmajor-math.pdf',
    //  TODO - We don't account for forbidden overlaps
    checker: includesWithSingleRequirement(
      'MATH 3110',
      'MATH 3210',
      'MATH 3230',
      'MATH 4130',
      'MATH 4140',
      'MATH 4180',
      'MATH 4200',
      'MATH 4210',
      'MATH 4220',
      'MATH 4250',
      'MATH 4260',
      'MATH 4280'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Concentration',
    // TODO - Double Concentrations?
    description:
      'Students are required to complete AT LEAST one concentration from the eight concentrations available.',
    source: 'https://math.cornell.edu/major#major-requirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Mathematics: {
        description:
          '(i) Four additional 3000+ MATH courses (At least one of the four courses must be among the geometry/topology courses) Note: MATH 3210 is eligible only if not used for the analysis requirement; MATH 4500 and MATH 4560 are eligible only if not used toward the algebra requirement, ' +
          '(ii) One course dealing with mathematical models.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'MATH 3210',
            'MATH 4500',
            'MATH 4520',
            'MATH 4530',
            'MATH 4540',
            'MATH 4550',
            'MATH 4560',
          ],
          ['MATH 3610', 'CS 2110', 'PHYS 1116', 'PHYS 2208', 'PHYS 2213', 'PHYS 2217']
        ),
        perSlotMinCount: [3, 1, 1],
        slotNames: ['3000+ Math Course', 'Geometry/Topology Course', 'Mathematical Models Course'],
      },
      'Applied Mathematics': {
        description:
          '5 additional courses from (i) and (ii): ' +
          '(i) At least 3 MATH courses numbered 3000 or above, ' +
          '(ii) One course dealing with mathematical models.',
        // 'Of the 9 courses used to fulfill requirements of the math major, at least one course must be taken from three of the four Groups: ' +
        // 'A. Differential equations, ' +
        // 'B. Discrete mathematics and combinatorics, ' +
        // 'C. Numerical and computational methods, ' +
        // 'D. Probability and statistics',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          ['MATH 3610', 'CS 2110', 'PHYS 1116', 'PHYS 2208', 'PHYS 2213', 'PHYS 2217']
        ),
        perSlotMinCount: [4, 1],
        slotNames: ['3000+ Math Course', 'Mathematical Models Course'],
      },
      'Computer Science': {
        description:
          '5 additional courses from (i) and (ii): ' +
          '(i) At least one MATH course numbered 3000 or above, ' +
          '(ii) 3 CS courses with significant mathematical content.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'CS 3220',
            'CS 4110',
            'CS 4160',
            'CS 4210',
            'CS 4220',
            'CS 4620',
            'CS 4670',
            'CS 4700',
            'CS 4740',
            'CS 4744',
            'CS 4775',
            'CS 4780',
            'CS 4786',
            'CS 4787',
            'CS 4810',
            'CS 4812',
            'CS 4814',
            'CS 4820',
            'CS 4830',
            'CS 4850',
            'CS 4852',
            'CS 4860',
          ],
          [
            'CS 3220',
            'CS 4110',
            'CS 4160',
            'CS 4210',
            'CS 4220',
            'CS 4620',
            'CS 4670',
            'CS 4700',
            'CS 4740',
            'CS 4744',
            'CS 4775',
            'CS 4780',
            'CS 4786',
            'CS 4787',
            'CS 4810',
            'CS 4812',
            'CS 4814',
            'CS 4820',
            'CS 4830',
            'CS 4850',
            'CS 4852',
            'CS 4860',
            'MATH 3***',
            'MATH 4***',
            'MATH 5***',
            'MATH 6***',
            'MATH 7***',
          ]
        ),
        perSlotMinCount: [1, 3, 1],
        slotNames: ['3000+ Math Course', 'Mathematical CS Course', 'MATH or CS Course'],
      },
      Economics: {
        description:
          '5 additional courses from (i), (ii), and (iii): ' +
          '(i) At least one MATH course numbered 3000 or above, ' +
          '(ii) At least three ECON courses with significant mathematical content, ' +
          '(iii) A course in ORIE with significant mathematical content dealing with material of interest in economics.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'ECON 3130',
            'ECON 3140',
            'ECON 3810',
            'ECON 3810',
            'ECON 3825',
            'ECON 4020',
            'ECON 4110',
            'ECON 4907',
            'ECON 6090',
            'ECON 6100',
            'ECON 6130',
            'ECON 6140',
            'ECON 6190',
            'ECON 6200',
            'CS 4852',
            'INFO 4220',
            'INFO 6220',
          ],
          [
            'ORIE 3300',
            'ORIE 3310',
            'ORIE 4350',
            'ORIE 4600',
            'ORIE 4740',
            'ORIE 5600',
            'ORIE 5610',
            'ECON 3130',
            'ECON 3140',
            'ECON 3810',
            'ECON 3810',
            'ECON 3825',
            'ECON 4020',
            'ECON 4110',
            'ECON 4907',
            'ECON 6090',
            'ECON 6100',
            'ECON 6130',
            'ECON 6140',
            'ECON 6190',
            'ECON 6200',
            'CS 4852',
            'INFO 4220',
            'INFO 6220',
            'MATH 3***',
            'MATH 4***',
            'MATH 5***',
            'MATH 6***',
            'MATH 7***',
          ]
        ),
        perSlotMinCount: [1, 3, 1],
        slotNames: ['3000+ MATH Course', 'Mathematical ECON Course', 'ORIE, ECON, or MATH Course'],
      },
      Biology: {
        description:
          '(i) Three biology courses that have mathematical content and provide background necessary for work at the interface between biology and mathematics, ' +
          '(ii) Two additional mathematics courses numbered 3000 or above. MATH 4200 and 4710* are particularly appropriate.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          [
            'BIOEE 3620',
            'BIONB 4220',
            'BME 3110',
            'BTRY 3080',
            'BTRY 4090',
            'BTRY 4820',
            'BTRY 4840',
            'NTRES 4110',
            'NTRES 4120',
            'MATH 3620',
            'ILRST 3080',
            'STSCI 3080',
            'STSCI 4090',
            'BTRY 6820',
            'BTRY 6830',
            'CS 4775',
            'BTRY 6840',
            'NTRES 6110',
            'NTRES 6120',
          ],
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***']
        ),
        perSlotMinCount: [3, 2],
        slotNames: ['Mathematical Biology Course', '3000+ MATH Course'],
      },
      Physics: {
        description:
          '5 additional courses from (i) and (ii): ' +
          '(i) At least one MATH course numbered 3000 or above, ' +
          '(ii) At least three physics courses that make significant use of advanced mathematics.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'PHYS 3316',
            'PHYS 3317',
            'PHYS 3318',
            'PHYS 3327',
            'PHYS 4230',
            'PHYS 4443',
            'PHYS 4444',
            'PHYS 4445',
            'PHYS 4454',
            'PHYS 4481',
            'PHYS 4488',
            'AEP 4340',
            'AEP 4400',
          ],
          [
            'PHYS 3316',
            'PHYS 3317',
            'PHYS 3318',
            'PHYS 3327',
            'PHYS 4230',
            'PHYS 4443',
            'PHYS 4444',
            'PHYS 4445',
            'PHYS 4454',
            'PHYS 4481',
            'PHYS 4488',
            'AEP 4340',
            'AEP 4400',
            'MATH 3***',
            'MATH 4***',
            'MATH 5***',
            'MATH 6***',
            'MATH 7***',
          ]
        ),
        perSlotMinCount: [1, 3, 1],
        slotNames: ['3000+ MATH Course', 'Physics Course', 'MATH or Physics Course'],
      },
      'Operations Research': {
        description:
          '5 additional courses from (i) and (ii): ' +
          '(i) At least one MATH course numbered 3000 or above, ' +
          '(ii) At least three courses in ORIE in which the primary focus involves mathematical techniques.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'ORIE 3300',
            'ORIE 3310',
            'ORIE 3500',
            'ORIE 3510',
            'ORIE 4150',
            'ORIE 4350',
            'ORIE 4520',
            'ORIE 4600',
            'ORIE 4630',
            'ORIE 4740',
            'ORIE 5600',
            'ORIE 5610',
            'ORIE 5640',
          ],
          [
            'ORIE 3300',
            'ORIE 3310',
            'ORIE 3500',
            'ORIE 3510',
            'ORIE 4150',
            'ORIE 4350',
            'ORIE 4520',
            'ORIE 4600',
            'ORIE 4630',
            'ORIE 4740',
            'ORIE 5600',
            'ORIE 5610',
            'ORIE 5640',
            'MATH 3***',
            'MATH 4***',
            'MATH 5***',
            'MATH 6***',
            'MATH 7***',
          ]
        ),
        perSlotMinCount: [1, 3, 1],
        slotNames: ['3000+ MATH Course', 'ORIE Course', 'MATH or ORIE Course'],
      },
      Statistics: {
        description:
          'MATH 4710, MATH 4720, ' +
          'One additional MATH course numbered 3000 or above, ' +
          'Two courses in other departments with significant content in statistics.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['MATH 4710'],
          ['MATH 4720'],
          ['MATH 3***', 'MATH 4***', 'MATH 5***', 'MATH 6***', 'MATH 7***'],
          [
            'BTRY 4820',
            'CS 4700',
            'CS 4780',
            'CS 4786',
            'ECON 3140',
            'ECON 4110',
            'ORIE 4740',
            'ORIE 4741',
            'STSCI 3100',
            'STSCI 3510',
            'STSCI 4030',
            'STSCI 4060',
            'STSCI 4100',
            'STSCI 4110',
            'STSCI 4140',
            'STSCI 4520',
            'STSCI 4550',
            'STSCI 4740',
            'STSCI 4780',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 2],
        slotNames: ['MATH 4710', 'MATH 4720', '3000+ MATH Course', 'Statistics Course'],
      },
    },
  },
];

export default mathRequirements;

export const mathAdvisors: AdvisorGroup = {
  advisors: [
    {
      name: 'Michelle Klinger',
      email: 'mmk8@cornell.edu',
    },
  ],
};
