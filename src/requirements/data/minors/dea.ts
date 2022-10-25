import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const deaMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'DEA Core Courses',
    description: 'DEA 1101, DEA 1110/DEA 1200, and DEA 1500',
    source: 'https://www.human.cornell.edu/dea/academics/undergraduate/minors/dea',
    checker: includesWithSubRequirements(['DEA 1050'], ['DEA 1101', 'DEA 1200'], ['DEA 1500']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['DEA 1050', 'DEA 1110/1200', 'DEA 1500'],
  },
  {
    name: 'Upper level DEA thematic courses',
    description: 'Take 2 upper level DEA thematic courses',
    source: 'https://www.human.cornell.edu/dea/academics/undergraduate/minors/dea',
    checker: includesWithSingleRequirement(
      'DEA 2030',
      'DEA 2201',
      'DEA 2203',
      'DEA 2510',
      'DEA 2550',
      'DEA 2730',
      'DEA 2750',
      'DEA 3050',
      'DEA 3301',
      'DEA 3306',
      'DEA 3530',
      'DEA 3550',
      'DEA 3590',
      'DEA 3600',
      'DEA 4230',
      'DEA 4402',
      'DEA 4500',
      'DEA 5210',
      'DEA 5304',
      'DEA 5520',
      'DEA 5700',
      'DEA 5540',
      'DEA 2020',
      'DEA 2040',
      'DEA 2422',
      'DEA 3030',
      'DEA 3500',
      'DEA 4220',
      'DEA 4401',
      'DEA 2700',
      'DEA 3308',
      'DEA 3510',
      'DEA 3770',
      'DEA 4700',
      'DEA 5305',
      'DEA 5560'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default deaMinorRequirements;

export const deaAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Rhonda Gilmore', email: 'rg35@cornell.edu' }],
};
