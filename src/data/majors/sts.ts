import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { ifCodeMatch, includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

// from here https://courses.cornell.edu/preview_program.php?catoid=31&poid=15425
const stsScienceRequirement: readonly string[] = ['PBS', 'PBSS', 'OPHLS', 'BIOLS', 'BIO'];

const stsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'One S&TS course',
    description: 'Any level, excluding STS 2011.',
    source: 'https://sts.cornell.edu/sts-major',
    checker: [(course: Course): boolean => course.subject === 'STS' && course.crseId !== 2011],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Core Course',
    description: 'STS 2011',
    source: 'https://sts.cornell.edu/sts-major',
    checker: includesWithSubRequirements(['STS 2011']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: '2000 Level STS Courses',
    description: 'Three additional 2000 level STS courses.',
    source: 'https://sts.cornell.edu/sts-major',
    checker: includesWithSubRequirements(['STS 2***']),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['2000 Level Course'],
  },

  // TODO: Add a check for 37 credit split between the next two categories
  // Additional S&TS courses to total 37 credit hours in the major.
  {
    name: '3000+ STS Courses',
    description: 'Additional 3000 level or above STS courses.',
    source: 'https://sts.cornell.edu/sts-major',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return (
          ifCodeMatch(course.subject, 'STS') &&
          !(ifCodeMatch(catalogNbr, '1***') || ifCodeMatch(catalogNbr, '2***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['3000+ STS Course'],
  },
  {
    name: '4000+ STS Courses',
    description: 'Additional 4000 level or above STS courses.',
    source: 'https://sts.cornell.edu/sts-major',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return (
          ifCodeMatch(course.subject, 'STS') &&
          !(
            ifCodeMatch(catalogNbr, '1***') ||
            ifCodeMatch(catalogNbr, '2***') ||
            ifCodeMatch(catalogNbr, '3***')
          )
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['4000+ STS Course'],
  },
  {
    name: 'Science Requirement',
    description:
      'Two courses of at least 3 credits each in natural science or engineering (including computer science).',
    source: 'https://sts.cornell.edu/sts-major',
    checker: [
      (course: Course): boolean =>
        stsScienceRequirement.some(
          distribution =>
            ((course.catalogDistr?.includes(distribution) ?? false) || course.acadGroup === 'EN') &&
            course.enrollGroups.some(group => group.unitsMinimum >= 3)
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Science Requirement'],
  },
];

export default stsRequirements;

export const stsAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Jessica Ratcliff', email: 'jrr47@cornell.edu' }],
};
