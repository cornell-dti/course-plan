import { CollegeOrMajorRequirement } from '../../types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../checkers-common';

const ilrRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Requirements',
    description:
      'Students are required to fulfill the following core requirements for a letter grade:',
    source:
      'https://www.ilr.cornell.edu/student-experience/curriculum-requirements/undergraduate-requirements',
    checker: includesWithSubRequirements(
      ['ILROB 1220'],
      ['ILRLR 1100'],
      ['ECON 1110'],
      ['ECON 1120'],
      ['ILRST 2100'],
      ['ILRLR 2010'],
      ['ILRHR 2600'],
      ['ILRLR 2050'],
      ['ILRLE 2400']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 9,
  },
  {
    name: 'First-Year Writing Seminars',
    description:
      'Students are required to fulfill the following writing requirements for a letter grade:',
    source:
      'https://www.ilr.cornell.edu/student-experience/curriculum-requirements/undergraduate-requirements',
    checker: courseIsFWS,
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'credits',
    minCount: 3,
  },
  {
    name: 'ILR Advance Writing',
    description:
      'Courses must be taken for a letter grade in order to count toward the ILR Requirements',
    source:
      'https://www.ilr.cornell.edu/student-experience/curriculum-requirements/undergraduate-requirements/ilr-advanced-writing-courses',
    checker: includesWithSingleRequirement(
      'ILRHR 2360',
      'ILRIC 2390',
      'ILRLE 2400',
      'ILRLR 2060',
      'ILRLR 2070',
      'ILROB 2230',
      'ILROB 2290',
      'ENGL 2880',
      'ENGL 2890'
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Distribution Requirements',
    description:
      'Students are required to complete one course from each of the following lists to fulfill the distribution requirements. All courses must be taken for a letter grade.',
    source:
      'https://www.ilr.cornell.edu/student-experience/curriculum-requirements/undergraduate-requirements',
    fulfilledBy: 'self-check',
    minCount: 3,
  },
];

export default ilrRequirements;
