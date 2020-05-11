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
  {
    name: 'Concentration',
    description: 'Students are required to complete AT LEAST one concentration from the seven concentrations available',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-0',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    minCount: 1
  },
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
    name: 'Info Concentration Placeholder',
    description: 'Please select one of the 7 concentration',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    minCount: 1,
    isDefaultOption: true,
    pairedReqName: ['Behavioral Sciences', 'Data Science', 'Digital Culture and Production']
  },
  {
    name: 'Behavioral Sciences',
    description: 'concentration #1 lol change all this',
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
    pairedReqName: ['Data Science', 'Digital Culture and Production'],
    subRequirements: ['Behavioral Sciences Req 1', 'Behavioral Sciences Req 2']
  },
  {
    name: 'Behavioral Sciences Req 1',
    description: 'lol change all this',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Behavioral Sciences Req 2',
    description: 'lol change all this',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Data Science',
    description: 'concentration #2 lol change all this',
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
    pairedReqName: ['Behavioral Sciences', 'Digital Culture and Production'],
    subRequirements: ['Data Science Req 1', 'Data Science Req 2']
  },
  {
    name: 'Data Science Req 1',
    description: 'lol change all this',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
    minCount: 1,
    isDefaultOption: false
  },
  {
    name: 'Data Science Req 2',
    description: 'lol change all this',
    source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/ba-information-science-college-arts-sciences/degree-requirements-2',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check',
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
