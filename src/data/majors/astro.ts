import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/types';

const astroRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Physics Sequence',
    description: `Three semesters of physics including: PHYS 1112 or PHYS 1116, PHYS 2213 or PHYS 2217, and PHYS 2214 or PHYS 2218.`,
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19789',
    checker: includesWithSubRequirements(
      ['PHYS 1112', 'PHYS 1116'],
      ['PHYS 2213', 'PHYS 2217'],
      ['PHYS 2214', 'PHYS 2218']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['PHYS 1112 or PHYS 1116', 'PHYS 2213 or PHYS 2217', 'PHYS 2214 or PHYS 2218'],
  },
  {
    name: 'Introductory Mathematics Sequence',
    description: `Three semesters of math including: MATH 1910, MATH 1120, or MATH 1220, MATH 1920, MATH 2220, or MATH 2240, and MATH 2930, MATH 4710, or ASTRO 3340.`,
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19789',
    checker: includesWithSubRequirements(
      ['MATH 1910', 'MATH 1120', 'MATH 1220'],
      ['MATH 1920', 'MATH 2220', 'MATH 2240'],
      ['MATH 2930', 'MATH 4710', 'ASTRO 3340']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: [
      'MATH 1910, MATH 1120, or MATH 1220',
      'MATH 1920, MATH 2220, or MATH 2240',
      'MATH 2930, MATH 4710, or ASTRO 3340',
    ],
  },
  {
    name: 'Experimental or Data Analysis Course in Astronomy',
    description: `One experimental or data analysis course in astronomy chosen from: ASTRO 4410, ASTRO 3310, or ASTRO 3334.`,
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19789',
    checker: includesWithSubRequirements(['ASTRO 4410', 'ASTRO 3310', 'ASTRO 3334']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ASTRO 4410, ASTRO 3310, or ASTRO 3334'],
  },
  {
    name: 'Concentration',
    description:
      'In addition to these core requirements, each Astronomy Major must complete a Concentration in either Astrophysics or General Astronomy.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19789',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Astrophysics: {
        description:
          '5 additional courses in Physics, 3 additional courses in Mathematics, and 2 additional courses in Advanced Astrophysics.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ASTRO 4431', 'ASTRO 4432', 'ASTRO 4433'],
          ['PHYS 4230', 'AEP 4230'],
          ['PHYS 3316', 'PHYS 3318', 'PHYS 3327', 'PHYS 4443'],
          ['MATH 2940', 'MATH 2210', 'MATH 2230'],
          ['MATH ****']
        ),
        perSlotMinCount: [2, 1, 4, 1, 2],
        slotNames: [
          'Advanced Astrophysics',
          'Thermodynamics',
          'Physics Course',
          'Linear Algebra',
          'Mathematics Course',
        ],
      },
      'General Astronomy': {
        description:
          '5 additional courses in Astronomy, plus an additional 15 credits in a complementary area of study.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ASTRO 2211', 'ASTRO 2212'],
          ['ASTRO 3301', 'ASTRO 3302', 'ASTRO 3303'],
          // TODO: it's these classes or any other classes approved by DUS
          ['ASTRO 2290', 'ASTRO 2299', 'ASTRO 4445']
          // TODO: missing ability to combine class and credit requirements in concentrations.
          // Missing additional fifteen credit hours in a complementary area.
        ),
        perSlotMinCount: [2, 2, 1],
        slotNames: ['Group A', 'Group B', 'Group C'],
      },
    },
  },
];

export default astroRequirements;

export const astroAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Gordon J Stacey', email: 'stacey@cornell.edu' }],
};
