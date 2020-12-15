import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const civilRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distribution',
    description:
      'ENGRD 2020 is required. For the second  engineering distribution course, one of the following is recommended: ' +
      'ENGRD 2610, ENGRD 2210, ENGRD 2110, ENGRD 2510',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19826',
    checker: includesWithSubRequirements(
      ['ENGRD 2020'],
      ['ENGRD 2610', 'ENGRD 2210', 'ENGRD 2110', 'ENGRD 2510']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Core Courses',
    description:
      'MAE 2030 or CEE 4780, ENGRD 3200, CEE 3040, CEE 3230, CEE 3310, CEE 3410, BEE 2510, CEE 3610, and CEE 3710.' +
      'ENGRD 2610, ENGRD 2210, ENGRD 2110, ENGRD 2510',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19826',
    checker: includesWithSubRequirements(
      ['MAE 2030', 'CEE 4780'],
      ['ENGRD 3200'],
      ['CEE 3040'],
      ['CEE 3230'],
      ['CEE 3310'],
      ['CEE 3410'],
      ['BEE 2510'],
      ['CEE 3610'],
      ['CEE 3710']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 9,
  },
  {
    name: 'Capstone Design Elective',
    description:
      'Take CEE 4400, CEE 4640, CEE 4730, CEE 4350, CEE 4410, CEE 4590, CEE 4650, CEE 4660, or CEE 4740.',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-programs/civil-engineering-major/design-courses-and-major-approved',
    checker: includesWithSubRequirements([
      'CEE 4400',
      'CEE 4640',
      'CEE 4730',
      'CEE 4350',
      'CEE 4410',
      'CEE 4590',
      'CEE 4650',
      'CEE 4660',
      'CEE 4740',
    ]),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Two Design Electives',
    description:
      'Take 2 of the following electives: CEE 4210, CEE 4565, BEE 4730, CEE 4110, CEE 4520, BEE 4760, CEE 4750, CEE 6370, MSE 5150',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-programs/civil-engineering-major/design-courses-and-major-approved',
    checker: includesWithSubRequirements([
      'CEE 4210',
      'CEE 4565',
      'BEE 4730',
      'CEE 4110',
      'CEE 4520',
      'BEE 4760',
      'CEE 4750',
      'CEE 6370',
      'MSE 5150',
    ]),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Two Major-Approved Electives',
    description: 'Take 2 of the following electives',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-programs/civil-engineering-major/design-courses-and-major-approved',
    checker: includesWithSubRequirements([
      'BEE 4110',
      'BEE 4750',
      'CEE 3720',
      'CEE 4320',
      'CEE 4510',
      'CEE 4770',
      'CEE 5240',
      'CEE 5720',
      'CEE 5930',
      'CEE 5950',
      'CEE 5980',
      'CEE 6100',
      'CEE 6560',
      'CEE 6640',
      'EAS 4570',
      'EAS 6480',
      'MAE 4700',
      'ORIE 4330',
      'BEE 4310',
      'CEE 4330',
      'CEE 4370',
      'CEE 4450',
      'CEE 4530',
      'CEE 4620',
      'CEE 4780',
      'CEE 5970',
      'CEE 6550',
      'CEE 6570',
      'CHEME 6610',
      'MSE 5550',
      'CEE 3720',
    ]),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
  },
];

export default civilRequirements;
