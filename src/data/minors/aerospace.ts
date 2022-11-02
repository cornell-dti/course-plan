import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const aerospaceMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Group A',
    description:
      'Select at least four core aerospace engineering courses of which one must choose MAE 3050 or MAE 4060 (or both).',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=11649#aerospace-minor',
    checker: includesWithSubRequirements(
      ['MAE 3050', 'MAE 4060'],
      [
        'MAE 3050',
        'MAE 4060',
        'MAE 4150',
        'ECE 4150',
        'MAE 4160',
        'MAE 5160',
        'MAE 4291',
        'MAE 4900',
        'MAE 4230',
        'MAE 5230',
        'MAE 4510',
        'MAE 5070',
        'MAE 5510',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 3],
    slotNames: ['MAE 3050 or MAE 4060', 'Other Group A Course'],
  },
  {
    name: 'Group B or C',
    description:
      'Select a total of at most two courses from group B and group C: ' +
      'B. Courses Applicable to Aerospace Engineering, ' +
      'C. Fundamentals. ' +
      'NOTE: For ME majors, no courses from group C may be used.',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=11649#aerospace-minor',
    checker: includesWithSubRequirements(
      [
        'MAE 4020',
        'MAE 5020',
        'MAE 4130',
        'MAE 4180',
        'MAE 5180',
        'MAE 4700',
        'MAE 4770',
        'MAE 5700',
        'MAE 4730',
        'MAE 5730',
        'MAE 4780',
        'MAE 5780',
        'MAE 5130',
        'MAE 5430',
        'MAE 6510',
      ],
      [
        'MAE 4020',
        'MAE 5020',
        'MAE 4130',
        'MAE 4180',
        'MAE 5180',
        'MAE 4700',
        'MAE 4770',
        'MAE 5700',
        'MAE 4730',
        'MAE 5730',
        'MAE 4780',
        'MAE 5780',
        'MAE 5130',
        'MAE 5430',
        'MAE 6510',
      ],
      [
        'ENGRD 2020',
        'MAE 2030',
        'ENGRD 2210',
        'MAE 3230',
        'MAE 3240',
        'MAE 3260',
        'MAE 3270',
        'MAE 3780',
        'MAE 3783',
        'ECE 2100',
        'ENGRD 2100',
        'PHYS 3360',
      ],
      [
        'ENGRD 2020',
        'MAE 2030',
        'ENGRD 2210',
        'MAE 3230',
        'MAE 3240',
        'MAE 3260',
        'MAE 3270',
        'MAE 3780',
        'MAE 3783',
        'ECE 2100',
        'ENGRD 2100',
        'PHYS 3360',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    minNumberOfSlots: 2,
    slotNames: ['Group B', 'Group B', 'Group C', 'Group C'],
  },
];

export default aerospaceMinorRequirements;

export const aerospaceMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Kae-Lynn Buchanan Wilson', email: 'kbw28@cornell.edu' }],
};
