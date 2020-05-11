import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const infoRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: 'Students are required to complete five core courses: INFO 1200, INFO 1300, INFO 2040, INFO 2450, and INFO 2950.',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements/core',
    checker: includesWithSubRequirements(
      ['INFO 1200'],
      ['INFO 1300'],
      ['INFO 2040'],
      ['INFO 2450'],
      ['INFO 2950']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 5
  },
  {
    name: 'Programming and Math Requirements',
    description: 'All Information Science majors are required to take CS 1110, Introduction to Computing Using Python, Calculus I, and a Statistics course. '
      + 'The list of approved Calculus I and Statistics is provided below. '
      + 'All classes used to complete major requirements must be taken for a letter grade. '
      + 'Advanced Placement credits may not be used to fulfill the Statistics requirement for students matriculating as of or after Fall 2015, '
      + 'however, they may be used to fulfill the Calculus requirement. '
      + 'Students that have taken CS 1112 should take CS 1133, Transition to Python, to be prepared for INFO 2950, Introduction to Data Science.',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/programming-and-math',
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
        'STSCI 2200'
      ]
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 3
  },
  // {
  //   name: 'Concentration',
  //   description: 'Students are required to complete AT LEAST one concentration from the seven concentrations available',
  //   source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-0',
  //   checker: null,
  //   operator: null,
  //   fulfilledBy: 'self-check',
  //   minCount: 1
  // },
  {
    name: 'Electives',
    description: 'All students are required to complete three electives that are chosen from the following options: '
      + 'INFO 2300, CS 2110, CS 3110, CS 3410 or any INFO 3000+ or higher course including INFO 4900 (except INFO 4998). '
      + 'These courses must be taken for a letter grade, each must earn three or more credit hours, and all must be completed with a grade of C- or higher.'
      + 'Students may only fulfill one of their electives with INFO 4900 (3 credits or more).',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: includesWithSingleRequirement(
      'INFO 2300',
      'CS 2110',
      'CS 3110',
      'CS 3410',
      'INFO 3***',
      'INFO 4***',
      'INFO 5***',
      'INFO 6***'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 3
  },
  {
    name: 'Choose a Concentration',
    description: 'Students are required to complete AT LEAST one concentration from the seven concentrations available.'
    + ' You can currently only choose one concentration on CoursePlan',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-0',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    isDefaultOption: true,
    pairedReqName: ['Behavioral Sciences', 'Data Science', 'Digital Culture and Production']
  },
  {
    name: 'Behavioral Sciences',
    description: 'This concentration provides students with an in-depth understanding of the behavioral and social aspects of interacting with and through information technology.'
    + 'Requirements for this concentration are found below.',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations-0',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    isDefaultOption: false,
    pairedReqName: ['Data Science', 'Digital Culture and Production'],
    subRequirements: ['Understanding Social Behavior', 'Social Data Analytics', 'Behavior in Sociological, Network, and Design Contexts']
  },
  {
    name: 'Understanding Social Behavior',
    description: 'Choose two of: INFO 3400, INFO 3460, INFO 4430, INFO 4450, INFO 4500, INFO 4800, INFO 4940, COMM 4380, PSYCH 3800',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations-0',
    checker: includesWithSingleRequirement(
      'INFO 3400',
      'INFO 3460',
      'INFO 4430',
      'INFO 4450',
      'INFO 4500',
      'INFO 4800',
      'INFO 4940',
      'COMM 4380',
      'PSYCH 3800'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
    isDefaultOption: false
  },
  {
    name: 'Social Data Analytics',
    description: 'Choose one: INFO 3300, INFO 4100, INFO 4300, INFO 5200, COMM 4940, CS 4740, CS 4780',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations-0',
    checker: includesWithSingleRequirement(
      'INFO 3300',
      'INFO 4100',
      'INFO 4300',
      'INFO 5200',
      'COMM 4940',
      'CS 4740',
      'CS 4780'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Behavior in Sociological, Network, and Design Contexts',
    description: 'Choose one: INFO 3200, INFO 3561, INFO 4650, COMM 4410, STS 3400, INFO 4360, SOC 3350, SOC 4390, INFO 3450, INFO 4240, INFO 4400',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations-0',
    checker: includesWithSingleRequirement(
      'INFO 3200',
      'INFO 3561',
      'INFO 4650',
      'COMM 4410',
      'STS 3400',
      'INFO 4360',
      'SOC 3350',
      'SOC 4390',
      'INFO 3450',
      'INFO 4240',
      'INFO 4400'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Data Science',
    description: 'This concentration will equip students to learn about the world through data analytics.',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations/data',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    isDefaultOption: false,
    pairedReqName: ['Behavioral Sciences', 'Digital Culture and Production'],
    subRequirements: ['Data Analysis', 'Domain Expertise', 'Big Data Ethics, Policy and Society', 'Data Communication']
  },
  {
    name: 'Data Analysis',
    description: 'Choose one: INFO 3300, INFO 3950, CS 4780, CS 4786, ORIE 3120, ORIE 4740, STSCI 4740',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations/data',
    checker: includesWithSingleRequirement(
      'INFO 3300',
      'INFO 3950',
      'CS 4780',
      'CS 4786',
      'ORIE 3120',
      'ORIE 4740',
      'STSCI 4740'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Domain Expertise',
    description: 'Choose one: INFO 2770, INFO 3350, INFO 4100, INFO 4120, INFO 4130, INFO 4300, CS 4740',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations/data',
    checker: includesWithSingleRequirement(
      'INFO 2770',
      'INFO 3350',
      'INFO 4100',
      'INFO 4120',
      'INFO 4130',
      'INFO 4300',
      'CS 4740'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Big Data Ethics, Policy and Society',
    description: 'Choose one: INFO 3200, INFO 3561, INFO 4200, INFO 4240, INFO 4250, INFO 4270, INFO 4561, INFO 4940, COMM 4940, STS 3440',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations/data',
    checker: includesWithSingleRequirement(
      'INFO 3200',
      'INFO 3561',
      'INFO 4200',
      'INFO 4240',
      'INFO 4250',
      'INFO 4270',
      'INFO 4561',
      'INFO 4940',
      'COMM 4940',
      'STS 3440'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Data Communication',
    description: 'Choose one: INFO 4310, COMM 3189, COMM 4200, COMM 4860',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-cals/degree-requirements/concentrations/data',
    checker: includesWithSingleRequirement(
      'INFO 4310',
      'COMM 3189',
      'COMM 4200',
      'COMM 4860'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Digital Culture and Production',
    description: 'concentration #3 lol change all this',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: includesWithSingleRequirement(
      'INFO 2300',
      'CS 2110',
      'CS 3110',
      'CS 3410',
      'INFO 3***',
      'INFO 4***',
      'INFO 5***',
      'INFO 6***'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 3,
    isDefaultOption: false,
    pairedReqName: ['Data Science', 'Behavioral Sciences']
  }
];

export default infoRequirements;
