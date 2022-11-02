import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSubRequirements,
  courseMatchesCodeOptions,
  ifCodeMatch,
} from '../checkers-common';
import { AdvisorGroup } from '../../tools/types';

const infoRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'Students are required to complete five core courses: INFO 1200, INFO 1300, INFO 2040, INFO 2450, and INFO 2950.',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements/core',
    checker: includesWithSubRequirements(
      ['INFO 1200', 'INFO 1260'],
      ['INFO 1300'],
      ['INFO 2040'],
      ['INFO 2450'],
      ['INFO 2950']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: ['INFO 1200 or INFO 1260', 'INFO 1300', 'INFO 2040', 'INFO 2450', 'INFO 2950'],
  },
  {
    name: 'Programming and Math Requirements',
    description:
      'All Information Science majors are required to take CS 1110, Calculus I, and a Statistics course. ' +
      'The list of approved Calculus I and Statistics is provided below. ' +
      'Advanced Placement credits may not be used to fulfill the Statistics requirement for students matriculating as of or after Fall 2015, ' +
      'however, they may be used to fulfill the Calculus requirement. ' +
      'Students that have taken CS 1112 should take CS 1133, Transition to Python, to be prepared for INFO 2950, Introduction to Data Science.',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/programming-and-math',
    checker: includesWithSubRequirements(
      ['CS 1110'],
      ['MATH 1106', 'MATH 1110', 'MATH 1910'],
      [
        'AEM 2100',
        'BTRY 3010',
        'CEE 3040',
        'ECON 3110',
        'ECON 3130',
        'ENGRD 2700',
        'ILRST 2100',
        'MATH 1710',
        'PAM 2100',
        'PSYCH 2500',
        'SOC 3010',
        'STSCI 2100',
        'STSCI 2150',
        'STSCI 2200',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Programming', 'Calculus', 'Statistics'],
  },
  {
    name: 'Concentration',
    description:
      'Students are required to complete AT LEAST one concentration from the seven concentrations available',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-0',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Behavioral Science': {
        description:
          'A. Understanding Social Behavior (choose two), ' +
          'B. Social Data Analytics (choose one), ' +
          'C. Behavior in Sociological, Network, and Design Contexts (choose one)',
        counting: 'courses',
        checker: includesWithSubRequirements(
          [
            'INFO 3400',
            'INFO 3460',
            'INFO 4430',
            'INFO 4450',
            'INFO 4500',
            'INFO 4800',
            'INFO 4940',
            'COMM 4380',
            'PSYCH 3800',
          ],
          ['INFO 3300', 'INFO 4100', 'INFO 4300', 'COMM 4242', 'CS 4740', 'CS 4780'],
          [
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
          ]
        ),
        perSlotMinCount: [2, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
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
      'Digital Culture and Production': {
        description:
          'A. Digital Culture and History, B. Digital Production, C. Media, Art, Design. ' +
          'One course each from A and B; 2 additional courses from A or C.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 2921', 'INFO 3200', 'INFO 3561', 'STS 3440', 'STS 4040'],
          ['INFO 2300', 'INFO 3152', 'INFO 3300', 'INFO 4320', 'CS 3758', 'CS 4620'],
          [
            // A
            'INFO 2921',
            'INFO 3200',
            'INFO 3561',
            'STS 3440',
            'STS 4040',
            // C
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
        perSlotMinCount: [1, 1, 2],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
      'Information Ethics, Law, and Policy': {
        description:
          'A. Frameworks and Institutions (choose one), ' +
          'B. Methods and Analysis (choose one), ' +
          'C. Cases/Topics (choose one), ' +
          'D. Tools and Technical Domains (choose one)',
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
          ],
          ['INFO 3300', 'INFO 3350', 'INFO 4120', 'INFO 4130', 'INFO 4300']
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
      'UX (User Experience)': {
        description:
          'A. Core Principles of Design (choose one), ' +
          'B. Design in Context (choose one), ' +
          'C. Knowing the User (choose one), ' +
          'D. Knowing the Technology (choose one) ',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['INFO 3450', 'INFO 4400', 'INFO 4410'],
          ['INFO 2921', 'INFO 4240', 'INFO 4420', 'INFO 4940', 'ENGL 3741'],
          ['INFO 3400', 'INFO 3460', 'INFO 4430', 'INFO 4450', 'COMM 4380', 'PSYCH 3420'],
          [
            'INFO 3152',
            'INFO 4130',
            'INFO 4152',
            'INFO 4154',
            'INFO 4275',
            'INFO 4310',
            'INFO 4320',
            'INFO 4340',
            'CS 5150',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['Group A', 'Group B', 'Group C', 'Group D'],
      },
    },
  },
  {
    name: 'Electives',
    description:
      'All students are required to complete three electives that are chosen from the following options: ' +
      'INFO 2300, CS 2110, CS 3110, CS 3410 or any INFO 3000+ or higher course including INFO 4900 (except INFO 4998). ' +
      'These courses must be taken for a letter grade, each must earn three or more credit hours, and all must be completed with a grade of C- or higher.' +
      'Students may only fulfill one of their electives with INFO 4900 (3 credits or more).',
    source:
      'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: [
      (course: Course): boolean => {
        if (courseMatchesCodeOptions(course, ['INFO 2300', 'CS 2110', 'CS 3110', 'CS 3410'])) {
          return true;
        }
        if (courseMatchesCodeOptions(course, ['INFO 4998'])) {
          return false;
        }
        return (
          ifCodeMatch(course.subject, 'INFO') &&
          !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default infoRequirements;

export const infoAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Ani Mercincavage', email: 'am2643@cornell.edu' },
    { name: 'Jess Wilkie', email: 'jlw433@cornell.edu' },
  ],
};
