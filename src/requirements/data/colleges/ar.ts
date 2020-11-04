import { CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const aapRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Studio Practice',
    description: '6 classes of studio practice: Introductory 2000-level studios. To be completed by the end of the third semester.',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSubRequirements(
      ['ART 2201'],
      ['ART 2301'],
      ['ART 2401'],
      ['ART 2501'],
      ['ART 2601'],
      ['ART 2701']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 6
  },
  {
    name: 'Elective Studio Practice',
    description: '4 classes of studio practice: Elective 3000-level studios. '
      + 'B.F.A. students are required to successfully complete four 3000-level studios from any of the six different studio practice areas as well as Rome and/or New York City. '
      + 'Students may enroll in a 3000-level studio once they have successfully completed the 2000-level studio in that same studio practice area. Sample classes include:',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSingleRequirement(
      'ART 3201',
      'ART 3301',
      'ART 3401',
      'ART 3501',
      'ART 3601',
      'ART 3705',
      'ART 3001',
      'ART 3003'
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 4
  },
  {
    name: 'Pre-thesis Studio Practice',
    description: '1 class of studio practice: Pre-thesis',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSingleRequirement('ART 3006'),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Thesis Studio Practice',
    description: '2 classes of studio practice: Thesis year. '
      + 'All required 3000-level studios and ART 3006 must be completed before ART 4003 Thesis I, and all elective 3000-level studios must be completed before ART 4004 Thesis II.',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSubRequirements(['ART 4003'], ['ART 4004']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2
  },
  {
    name: 'Shop Instruction',
    description: '1 class of shop instruction',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSingleRequirement('ART 2900'),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Theory and Criticism',
    description: '3 classes of theory and criticism',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: includesWithSubRequirements(['ART 2103'], ['ART 4100']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2
  },
  {
    name: 'Theory and Criticism Elective',
    description: 'One additional theory and criticism elective.',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    fulfilledBy: 'self-check'
  },
  {
    name: 'Art History',
    description: '3 classes of art history. One modern/contemporary art history class, one global art history class, and one additional art history elective.',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    fulfilledBy: 'self-check'
  },
  {
    name: 'First-Year Writing Seminars',
    description: '2 writing classes. Any two writing classes from the following: First-Year Writing Seminars (FWS), ENGL 2880, ENGL 2890',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    checker: courseIsFWS,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6
  },
  {
    name: 'Elective Plan',
    description: 'Any academic class at Cornell chosen in consultation with faculty advisor.',
    source: 'https://aap.cornell.edu/academics/art/undergraduate/curriculum',
    fulfilledBy: 'self-check',
    minCount: 37
  }
];

export default aapRequirements;
