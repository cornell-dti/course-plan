import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const biomedicalEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distriubtions',
    description:
      'ENGRD 2202. ENGRD 2020 is recommended and satisfies the Common ' +
      'Curriculum distribution requirement and also fulfills a required Major course. It is best taken during semester 3 and must be completed before semester 5',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19808',
    checker: includesWithSingleRequirement('ENGRD 2202'),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Core Courses Part 1',
    description:
      'BIOMG 1350, BME 2010, BME 2110, BME 2210, BME 2310, ENGRD 2020, and BTRY 3010. CEE 3040 or ENGRD 2700 can be taken instead of BTRY 3010.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19808',
    checker: includesWithSubRequirements(
      ['BIOMG 1350'],
      ['BME 2010'],
      ['BME 2110'],
      ['BME 2310'],
      ['ENGRD 2020'],
      ['BTRY 3010', 'CEE 3040', 'ENGRD 2700']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 6,
  },
  {
    name: 'Core Courses Part 2',
    description: 'BME 3010, BME 3020, BME 3030, BME 4010, BME 4020, BME 4080, BME 4090',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19808',
    checker: includesWithSubRequirements(
      ['BME 3010'],
      ['BME 3020'],
      ['BME 3030'],
      ['BME 4010'],
      ['BME 4020'],
      ['BME 4080'],
      ['BME 4090']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 7,
  },
  {
    name: 'Biomedical Engineering Concentrations',
    description: 'Choose one concentration. Must take 13 credits minimum',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Molecular, Cellular, and Systems Engineering (MCSE)': {
        description:
          'Must take CHEM 1570, BME 3110, BME 4190, and take 6 elective courses from the following courses.',
        checker: includesWithSubRequirements(
          ['CHEM 1570'],
          ['BME 3020'],
          ['BME 4190'],
          ['BME 5830', 'BME 5850', 'BTRY 4381', 'BTRY 4840', 'CHEM 4810', 'CHEME 5430', 'CS 4780']
        ),
        counting: 'credits',
        operator: 'or',
        minCount: 13,
      },
      'Biomedical Materials and Drug Delivery (BMDD)': {
        description:
          'Must take BME 3210, BME 4190 or BME 4490, CHEM 1570, and take 6 elective courses from the following courses.',
        checker: includesWithSubRequirements(
          ['BME 3210'],
          ['BME 4190', 'BME 4490'],
          ['CHEM 1570'],
          [
            'BEE 3400',
            'BME 5830',
            'BME 5850',
            'BME 6210',
            'CHEME 5430',
            'MSD 5550',
            'MSE 5620',
            'BME 5810',
            'MAE 4640',
            'MSE 4020',
            'MSE 4610',
          ]
        ),
        counting: 'courses',
        operator: 'or',
        minCount: 13,
      },
      'Biomedical Imaging and Instrumentation (BMII)': {
        description:
          'Must take BME 3310, BME 4390, PHYS 2214, and take 6 elective courses from the following courses.',
        checker: includesWithSubRequirements(
          ['BME 3310'],
          ['BME 4390'],
          ['PHYS 2214'],
          [
            'AEP 3300',
            'CS 4780',
            'ECE 4300',
            'ECE 4370',
            'ECE 4760',
            'ECE 4910',
            'ECE 5470',
            'ECE 5780',
          ]
        ),
        counting: 'courses',
        operator: 'or',
        minCount: 13,
      },
      'Biomedical Mechanics and Mechanobiology (BMMB)': {
        description:
          'Must take BME 3410, BME 4490, PHYS 2214, and take 6 elective courses from the following courses.',
        checker: includesWithSubRequirements(
          ['BME 3410'],
          ['BME 4490'],
          ['PHYS 2214'],
          [
            'BEE 3310',
            'BEE 3500',
            'MAE 3240',
            'BEE 4530',
            'BME 5810',
            'MAE 4640',
            'MAE 4651',
            'MSE 4020',
          ]
        ),
        counting: 'courses',
        operator: 'or',
        minCount: 13,
      },
    },
  },
];

export default biomedicalEngineeringRequirements;
