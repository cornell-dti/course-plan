import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const animalSciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Categories',
    description:
      'The minor is satisfied by completing at least 15 credit hours of Animal Science courses.',
    source:
      'https://cals.cornell.edu/animal-science/degrees-programs/undergraduate-studies/minor-requirements',
    checker: includesWithSingleRequirement(
      'BIOAP 1100',
      'ANSC 1105',
      'ANSC 1200',
      'ANSC 1130',
      'ANSC 2120',
      'ANSC 2170',
      'ANSC 2300',
      'ANSC 2500',
      'ANSC 2550',
      'ANSC 2650',
      'ANSC 3100',
      'ANSC 3500',
      'ANSC 3540',
      'ANSC 3560',
      'ANSC 3850',
      'ANSC 4110',
      'ANSC 4200',
      'ANSC 4270',
      'ANSC 4310',
      'ANSC 4400',
      'ANSC 4500',
      'ANSC 4510',
      'ANSC 4880',
      'ANSC 4940',
      'ANSC 1101',
      'ANSC 2000',
      'ANSC 2100',
      'ANSC 2210',
      'ANSC 2400',
      'ANSC 2410',
      'ANSC 2551',
      'ANSC 3300',
      'ANSC 3310',
      'ANSC 3400',
      'ANSC 3410',
      'ANSC 3450',
      'ANSC 3510',
      'ANSC 3511',
      'ANSC 3550',
      'ANSC 3561',
      'ANSC 3600',
      'ANSC 3700',
      'ANSC 3800',
      'ANSC 3900',
      'ANSC 3920',
      'ANSC 3980',
      'ANSC 4020',
      'ANSC 4120',
      'ANSC 4140',
      'ANSC 4280',
      'ANSC 4290',
      'ANSC 4410',
      'ANSC 4560',
      'ANSC 4960',
      'ANSC 4970',
      'ANSC 4980',
      'ANSC 4990'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
];
export default animalSciRequirements;

export const animalSciAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Lindsay Glasner', email: 'lig27@cornell.edu' }],
};
