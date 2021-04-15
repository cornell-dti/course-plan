import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements, includesWithSingleRequirement } from '../checkers-common';

const isstRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: '7 required courses',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements',
    checker: includesWithSubRequirements(
      ['INFO 1200', 'INFO 1260'],
      ['ORIE 3500'],
      ['INFO 2300'],
      ['ORIE 3120'],
      ['INFO 2040'],
      ['INFO 2450'],
      ['ORIE 4740', 'CS 4780', 'CS 4786', 'STSCI 4740']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'INFO 1200 or INFO 1260',
      'ORIE 3500',
      'INFO 2300',
      'ORIE 3120',
      'INFO 2040',
      'INFO 2450',
      'ORIE 4740 or CS 4780 or CS 4786 or STSCI 4740',
    ],
  },
  {
    name: 'Engineering Mathematics',
    description: 'MATH 1910, MATH 1920, MATH 2940, and MATH 2930 or MATH 3040 or CS 2800.',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements',
    checker: includesWithSubRequirements(
      ['MATH 1910'],
      ['MATH 1920'],
      ['MATH 2940'],
      ['MATH 2930', 'MATH 3040', 'CS 2800']
    ),
    allowCourseDoubleCounting: true,
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['MATH 1910', 'MATH 1920', 'MATH 2940', 'MATH 2930 or MATH 3040 or CS 2800'],
  },
  {
    name: 'Engineering Distributions',
    description:
      'The major requires ENGRD 2700 as an Engineering Distribution course. ' +
      'ENGRD 2110 is also required by the major and it is recommended that this course be taken as an Engineering Distribution course.',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements',
    checker: includesWithSubRequirements(['ENGRD 2110'], ['ENGRD 2700']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ENGRD 2110', 'ENGRD 2700'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Primary Concentration',
    description:
      'Select one concentration from Data Science, Interactive Technologies, or Networks, Crowds, and Markets',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements-1',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Data Science': {
        description:
          'A. Data Analysis (choose one), ' +
          'B. Domain Expertise (choose one), ' +
          'C. Big Data Ethics, Policy and Society (choose one), ' +
          'D. Data Communication (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 3300', 'INFO 3950', 'CS 4780', 'CS 4786', 'ORIE 3120', 'ORIE 4740', 'STSCI 4740'],
          ['INFO 2770', 'INFO 3350', 'INFO 4100', 'INFO 4120', 'INFO 4130', 'INFO 4300', 'CS 4740'],
          [
            'INFO 3200',
            'INFO 3561',
            'INFO 4200',
            'INFO 4240',
            'INFO 4250',
            'INFO 4270',
            'INFO 4561',
            'INFO 4940',
            'COMM 4242',
            'ENGL 3778',
            'STS 3440',
          ],
          ['INFO 4310', 'COMM 3150', 'COMM 3189', 'COMM 4200', 'COMM 4860', 'GOVT 2169', 'SOC 3580']
        ),
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C', 'Group D'],
      },
      'Interactive Technologies': {
        description:
          // TODO: make each item in toggleable requirement annotate allowDoubleCounting
          'Required Course: CS 2110. ' +
          'A. Building with Hardware (choose one), ' +
          'B. Working with Data/Software (choose one), ' +
          'C. Context/Application Domains (choose one) ' +
          'D. One additional course from any of the three categories',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 4120', 'INFO 4320', 'CS 3758'],
          [
            'INFO 3300',
            'INFO 4340',
            'INFO 4555',
            'CS 4780',
            'CS 4786',
            'CS 5150',
            'ORIE 3120',
            'ORIE 4740',
            'STSCI 4740',
          ],
          [
            'INFO 4130',
            'INFO 4152',
            'INFO 4154',
            'INFO 4275',
            'INFO 4310',
            'INFO 4410',
            'INFO 4430',
            'INFO 4940',
            'CS 4752',
          ],
          [
            'INFO 4120',
            'INFO 4320',
            'CS 3758',
            'INFO 3300',
            'INFO 4340',
            'INFO 4555',
            'CS 4780',
            'CS 4786',
            'CS 5150',
            'ORIE 3120',
            'ORIE 4740',
            'STSCI 4740',
            'INFO 4130',
            'INFO 4152',
            'INFO 4154',
            'INFO 4275',
            'INFO 4310',
            'INFO 4410',
            'INFO 4430',
            'INFO 4940',
            'CS 4752',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C', 'Group D'],
      },
      'Networks, Crowds, and Markets': {
        description: 'A. Models (choose two), B. Data (choose one), C. Policy/Values (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          [
            'INFO 4220',
            'INFO 4360',
            'COMM 3150',
            'ECON 3810',
            'ECON 4020',
            'ECON 4022',
            'ECON 4610',
            'ECON 4660',
            'ORIE 4350',
            'SOC 3080',
          ],
          ['INFO 3300', 'INFO 4300', 'CS 4740', 'CS 4780', 'CS 4786', 'ECON 3120', 'ECON 3140'],
          ['INFO 3561', 'INFO 4200', 'INFO 4240', 'INFO 4250', 'INFO 4940', 'STS 3440']
        ),
        perSlotMinCount: [2, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
    },
  },
  {
    name: 'Secondary Concentration',
    description:
      'Select one secondary concentration (different than your primary concentration) from the seven options',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements-1',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Behavioral Science': {
        description: 'Choose three courses',
        counting: 'courses',
        checker: includesWithSubRequirements([
          'INFO 3400',
          'INFO 3460',
          'INFO 4430',
          'INFO 4450',
          'INFO 4500',
          'INFO 4800',
          'INFO 4940',
          'COMM 4380',
          'PSYCH 3800',
          'INFO 3300',
          'INFO 4100',
          'INFO 4300',
          'COMM 4242',
          'CS 4740',
          'CS 4780',
          'INFO 3200',
          'INFO 3561',
          'INFO 4650',
          'COMM 4410',
          'STS 3440',
          'INFO 4360',
          'SOC 3350',
          'INFO 3450',
          'INFO 4240',
          'INFO 4400',
        ]),
        perSlotMinCount: [3],
        slotNames: ['Course'],
      },
      'Data Science': {
        description:
          'A. Domain Expertise (choose one) ' +
          'B. Big Data Ethics, Policy and Society (choose one), ' +
          'C. Data Communication (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 2770', 'INFO 3350', 'INFO 4100', 'INFO 4120', 'INFO 4130', 'INFO 4300', 'CS 4740'],
          [
            'INFO 3200',
            'INFO 3561',
            'INFO 4200',
            'INFO 4240',
            'INFO 4250',
            'INFO 4270',
            'INFO 4561',
            'INFO 4940',
            'COMM 4242',
            'ENGL 3778',
            'STS 3440',
          ],
          ['INFO 4310', 'COMM 3150', 'COMM 3189', 'COMM 4200', 'COMM 4860', 'GOVT 2169', 'SOC 3580']
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'Digital Culture and Production': {
        description:
          'A. Digital Culture and History (choose one) B. Digital Production (choose one). ' +
          'C. Choose one more course from A or B',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 2921', 'INFO 3200', 'INFO 3561', 'STS 3440', 'STS 4040'],
          [
            'INFO 2750',
            'INFO 3450',
            'INFO 3660',
            'INFO 4152',
            'INFO 4240',
            'INFO 4400',
            'INFO 4420',
            'INFO 4940',
            'ART 3705',
            'ARTH 4151',
            'ARTH 4154',
            'COML 3115',
            'ENGL 3741',
            'HIST 2293',
          ],
          [
            // A
            'INFO 2921',
            'INFO 3200',
            'INFO 3561',
            'STS 3440',
            'STS 4040',
            // B
            'INFO 2750',
            'INFO 3450',
            'INFO 3660',
            'INFO 4152',
            'INFO 4240',
            'INFO 4400',
            'INFO 4420',
            'INFO 4940',
            'ART 3705',
            'ARTH 4151',
            'ARTH 4154',
            'COML 3115',
            'ENGL 3741',
            'HIST 2293',
          ]
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'Information Ethics, Law, and Policy': {
        description:
          'A. Frameworks and Institutions (choose one) ' +
          'B. Methods and Analysis (choose one) ' +
          'C. Cases/Topics (choose one) ',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 4113', 'INFO 4200', 'INFO 4250', 'INFO 4301', 'HADM 4890', 'STS 2761'],
          ['INFO 4240', 'INFO 4800', 'INFO 4940', 'COMM 4242', 'CRP 3210', 'PAM 2300'],
          [
            'INFO 3200',
            'INFO 3460',
            'INFO 3561',
            'INFO 4270',
            'INFO 4561',
            'INFO 4940',
            'STS 3440',
            'STS 4040',
          ]
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'Interactive Technologies': {
        description:
          // TODO: make each item in toggleable requirement annotate allowDoubleCounting
          'A. Building with Hardware (choose one), ' +
          'B. Working with Data/Software (choose one), ' +
          'C. Context/Application Domains (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 4120', 'INFO 4320', 'CS 3758'],
          [
            'INFO 3300',
            'INFO 4340',
            'INFO 4555',
            'CS 4780',
            'CS 4786',
            'CS 5150',
            'ORIE 3120',
            'ORIE 4740',
            'STSCI 4740',
          ],
          [
            'INFO 4130',
            'INFO 4152',
            'INFO 4154',
            'INFO 4275',
            'INFO 4310',
            'INFO 4410',
            'INFO 4430',
            'INFO 4940',
            'CS 4752',
          ]
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'Networks, Crowds, and Markets': {
        description: 'A. Models (choose one), B. Data (choose one), C. Policy/Values (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          [
            'INFO 4220',
            'INFO 4360',
            'COMM 3150',
            'ECON 3810',
            'ECON 4020',
            'ECON 4022',
            'ECON 4610',
            'ECON 4660',
            'ORIE 4350',
            'SOC 3080',
          ],
          ['INFO 3300', 'INFO 4300', 'CS 4740', 'CS 4780', 'CS 4786', 'ECON 3120', 'ECON 3140'],
          ['INFO 3561', 'INFO 4200', 'INFO 4240', 'INFO 4250', 'INFO 4940', 'STS 3440']
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'UX (User Experience)': {
        description:
          'A. Core Principles of Design (choose one) ' +
          'B. Design in Context (choose one) ' +
          'C. Knowing the User (choose one) ',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 3450', 'INFO 4400', 'INFO 4410'],
          ['INFO 2921', 'INFO 4240', 'INFO 4420', 'INFO 4940', 'ENGL 3741'],
          ['INFO 3400', 'INFO 3460', 'INFO 4430', 'INFO 4450', 'COMM 4380', 'PSYCH 3420']
        ),
        perSlotMinCount: [1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
    },
  },
  {
    name: 'Two Major Approved Electives',
    description:
      'Select two major-approved elective courses from any concentration. INFO 4900 may be used to fulfill one major-approved elective.',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements',
    checker: includesWithSingleRequirement(
      // Area 1
      'ORIE 3150',
      'ORIE 3510',
      'ORIE 4580',
      'ORIE 4800',
      // Area 2
      'INFO 3152',
      'INFO 3300',
      'INFO 3350',
      'INFO 3950',
      'INFO 4100',
      'INFO 4120',
      'INFO 4130',
      'INFO 4152',
      'INFO 4154',
      'INFO 4275',
      'INFO 4300',
      'INFO 4310',
      'INFO 4320',
      'INFO 4555',
      'INFO 5300',
      'CS 3110',
      'CS 3410',
      'CS 4320',
      'CS 4620',
      'CS 4700',
      'CS 4740',
      'CS 4786',
      'CS 5150',
      'CS 5430',
      'CS 5780',
      // Area 3
      'CS 4780',
      'CS 4786',
      'CS 4850',
      'ORIE 4300',
      'ORIE 4740',
      // Area 4
      'ORIE 4810',
      'ORIE 5126',
      // Area 5
      'INFO 3152',
      'INFO 3400',
      'INFO 3450',
      'INFO 3460',
      'INFO 3650',
      'INFO 4152',
      'INFO 4154',
      'INFO 4240',
      'INFO 4275',
      'INFO 4320',
      'INFO 4340',
      'INFO 4400',
      'INFO 4410',
      'INFO 4420',
      'INFO 4430',
      'INFO 4450',
      'INFO 4500',
      'INFO 4550',
      'INFO 4940',
      'ART 3705',
      'ART 3706',
      'COMM 4380',
      'DEA 4700',
      'PSYCH 3420',
      'PSYCH 3470',
      'PSYCH 3800',
      // Area 6
      'INFO 3200',
      'INFO 3561',
      'INFO 3660',
      'INFO 4144',
      'INFO 4200',
      'INFO 4220',
      'INFO 4240',
      'INFO 4250',
      'INFO 4270',
      'INFO 4301',
      'INFO 4360',
      'INFO 4561',
      'INFO 4650',
      'INFO 4940',
      'AEM 3220',
      'ECON 3120',
      'ECON 3140',
      'ECON 3810',
      'ECON 3820',
      'ECON 4020',
      'HADM 4890',
      'ORIE 4350',
      'STS 3440',
      // Other
      'INFO 4900'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default isstRequirements;
