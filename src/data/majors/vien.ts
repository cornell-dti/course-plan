import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

// from here
const vienRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physical Science Core',
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
    checker: includesWithSubRequirements(
      ['BIOMG 1350', 'BIOG 1140', 'BIOG 1440', 'BIOEE 1610', 'BIOEE 1780'],
      ['PLSCI 1420', 'BIOMI 2900']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 2],
    slotNames: ['Introductory biology courses', 'Required Biological Science Courses'],
  },
];

export default vienRequirements;

export const vienAdvisors: AdvisorGroup = {
  advisors: [{ name: 'John Doe', email: 'johndoe@cornell.edu' }],
};
