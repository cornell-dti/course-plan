import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const aemRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'CALS Credits',
    description:
      '55 CALS credits are required for graduation. ' +
      'CALS credits include all courses from departments within CALS and courses offered in Applied Economics and Management, ' +
      'Biological Sciences, Biology & Society, Earth and Atmospheric Sciences, Information Science, Nutritional Science, ' +
      'and The Department of Statistics and Data Science.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/distribution/',
    checker: [
      (course: Course): boolean =>
        ['AG'].includes(course.acadGroup) ||
        ['AEM', 'BIOEE', 'BIOMG', 'BIOMI', 'BIONB', 'BSOC', 'EAS', 'INFO', 'NS', 'STSCI'].includes(
          course.subject
        ),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [55],
  },
  {
    name: 'AEM Concentration Requirement',
    description:
      'AEM majors must choose at least one of the following eleven concentrations by the beginning of their junior year, ' +
      'and may choose no more than two. No more than one course may fulfill the elective credits of two concentrations. ' +
      'Courses used to fulfill a core Applied Economics or Quantitative Methods requirement cannot also count towards a concentration requirement except in EERE. ' +
      'One class from the core requirements may be taken for a S/U grade. NO S/U grades will be accepted in a declared concentration, unless a class is offered S/U only. ' +
      'All course petitions or substitutions are managed through the Dyson Office of Student Services in consultation with a committee of faculty from each concentration',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Management Requirements',
    description:
      'AEM 3200 and AEM 3230 are optional for the following three concentrations: ' +
      'applied economics; environmental, energy, and resource economics; and international trade and development.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(
      ['AEM 2200'],
      ['AEM 2225'],
      ['AEM 2240'],
      ['AEM 2420'],
      ['AEM 2601'],
      ['AEM 3200'],
      ['AEM 3230']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: 'Economics Requirements',
    description:
      'ECON 1110, ECON 1120, AND AEM 2600. For students concentrating in environmental, energy, and resource economics, ECON 3030 is required instead of AEM 2600.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(['ECON 1110'], ['ECON 1120'], ['AEM 2600', 'ECON 3030']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
  },
  {
    name: 'Quantitative Methods Requirements',
    description: 'AEM 2100, MATH 1110 OR MATH 1120, AND AEM 2010',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(['AEM 2100'], ['MATH 1110', 'MATH 1120'], ['AEM 2010']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
  },
  {
    name: 'Quantitative Methods Elective Requirements',
    description: 'At least 3 elective credits from the following.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement(
      'AEM 2770',
      'AEM 2830',
      'AEM 2840',
      'AEM 3100',
      'AEM 3390',
      'AEM 4060',
      'AEM 4110',
      'AEM 4120',
      'AEM 4190',
      'BTRY 3080',
      'ILRST 3080',
      'STSCI 3080',
      'ECON 3130',
      'ECON 3140',
      'ECON 4020',
      'ILRST 2110',
      'ILRST 3110'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Applied Economics Requirements',
    description:
      'At least 6 credits; must come from two of the four categories below. ' +
      'Courses used to fulfill a quantitative methods requirement or a concentration requirement or elective ' +
      'cannot also be counted toward a core applied economics requirement, unless that concentration is environmental, energy, and resource economics.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Grand Challenges Reqiurement Part 1: Written expression course',
    description:
      'Sophomore year: 3 credits. Focus: Critical thinking. ' +
      'These course options are centered around contemporary global issues and will help you learn communication, business analysis, and critical thinking skills as you develop cultural awareness. ' +
      'Available courses may vary per semester. You’ll choose one of the following:',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement(
      'AEM 2000',
      'AEM 2555',
      'AEM 2800',
      'AEM 2805',
      'AEM 4940'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Grand Challenges Reqiurement Part 2: Pre-Project Weekend Immersion',
    description: 'Junior year: 1.5 credits. Focus: Working as part of a team',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement('AEM 3000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Grand Challenges Reqiurement Part 3: Project Course',
    description: 'Senior year, 3 credits. Focus: Local and global community involvement',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement('AEM 4000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
];

export default aemRequirements;
