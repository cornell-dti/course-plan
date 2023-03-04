import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  ifCodeMatch,
  courseMeetsCreditMinimum,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const animalSciRequirements: readonly CollegeOrMajorRequirement[] = [
    {
        name: 'Categories',
        description: 'The minor is satisfied by completing at least 15 credit hours of Animal Science courses.',
        source: 'https://cals.cornell.edu/animal-science/degrees-programs/undergraduate-studies/minor-requirements',
        checker: [
            (course:Course):boolean => {
                const {subject, catalogNbr } = course;
                return !(ifCodeMatch(subject,'ANSC') || (ifCodeMatch(catalogNbr, '1100')&&ifCodeMatch(subject,'BIOAP')));
            }
        ],
        checkerWarning: 'We do not check that the courses are minor approved.',
        fulfilledBy: 'credits',
        perSlotMinCount: [15]
    }
]
export default animalSciRequirements;

export const animalSciAdvisors: AdvisorGroup = {
    advisors: [{ name: 'Lindsay Glasner', email: 'lig27@cornell.edu' }],
};
