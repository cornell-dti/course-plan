import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import { ifCodeMatch } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const animalSciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Categories',
    description:
      'The minor is satisfied by completing at least 15 credit hours of Animal Science courses.',
    source:
      'https://cals.cornell.edu/animal-science/degrees-programs/undergraduate-studies/minor-requirements',
    checker: [
      (course: Course): boolean => {
        if (ifCodeMatch(course.subject, 'BIOAP') && ifCodeMatch(course.catalogNbr, '1100')) {
          return true;
        }
        if (ifCodeMatch(course.subject, 'ANSC')) {
          const isSpecial = ifCodeMatch(course.catalogNbr, '49**');
          return (
            (ifCodeMatch(course.catalogNbr, '1***') ||
              ifCodeMatch(course.catalogNbr, '2***') ||
              ifCodeMatch(course.catalogNbr, '3***') ||
              ifCodeMatch(course.catalogNbr, '4***')) &&
            !isSpecial
          );
        }
        return false;
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
];
export default animalSciRequirements;

export const animalSciAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Lindsay Glasner', email: 'lig27@cornell.edu' }],
};
