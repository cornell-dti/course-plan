import { BaseRequirement } from '../../types';

const universityRequirements: readonly BaseRequirement[] = [
  {
    name: 'Academic Credits',
    description: 'To graduate, a student must earn a minimum of 120 academic credits. '
      + 'Physical education credits and “10XX” courses do not count toward the 120 required credits.',
    source: 'http://courses.cornell.edu/content.php?catoid=31&navoid=7901',
    fulfilledBy: 'credits',
    minCount: 120,
    applies: 'all',
    progressBar: true
  },
  {
    name: 'Physical Education',
    description: 'All incoming freshmen are required to take two credits (two courses) of Physical Education, '
      + 'one credit each semester of the first year on campus.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9249',
    fulfilledBy: 'courses',
    minCount: 2,
    applies: 'all'
  },
  {
    name: 'Swimming Test',
    description: 'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming '
      + 'and water safety competency requirement for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9249',
    fulfilledBy: 'self-check',
    minCount: 0,
    applies: 'all'
  }
];

export default universityRequirements;
