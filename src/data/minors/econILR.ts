import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSubRequirements,
  ifCodeMatch,
  courseMatchesCodeOptions,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const econILRMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Prerequisites',
    description:
      'MATH 1110 with grade C or better, ECON 1110 and ECON 1120 with grades B- or better.',
    source: 'https://economics.cornell.edu/minor',
    checker: includesWithSubRequirements(['MATH 1110'], ['ECON 1110'], ['ECON 1120']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['MATH 1110', 'ECON 1110', 'ECON 1120'],
    checkerWarning:
      'ECON 1110 or ECON 1120 will count toward the Economics Minor only if credit for the course appears on your Cornell transcript.',
  },
  {
    name: 'Intermediate Courses',
    description: 'ECON 3030 and ECON 3040. Must be taken at Cornell.',
    source: 'https://economics.cornell.edu/minor',
    checker: includesWithSubRequirements(['ECON 3030'], ['ECON 3040']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ECON 3030', 'ECON 3040'],
  },
  {
    name: 'Statistics and Econometrics',
    description:
      'Option 1: ECON 3110 and ECON 3120. Option 2: ECON 3130 and ECON 3140. Must be taken at Cornell.',
    source: 'https://economics.cornell.edu/minor',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'ECON 3110 and ECON 3120',
        counting: 'courses',
        checker: includesWithSubRequirements(['ECON 3110'], ['ECON 3120']),
        perSlotMinCount: [1, 1],
        slotNames: ['ECON 3110', 'ECON 3120'],
      },
      'Option 2': {
        description: 'ECON 3130 and ECON 3140',
        counting: 'courses',
        checker: includesWithSubRequirements(['ECON 3130'], ['ECON 3140']),
        perSlotMinCount: [1, 1],
        slotNames: ['ECON 3130', 'ECON 3140'],
      },
    },
  },
  {
    name: 'Additional ECON Courses',
    description:
      'Additional 3000 or 4000 level ECON courses to reach a total of 9 courses. ' +
      'ECON 4990, 4991, and 4999 cannot be counted. ' +
      'At least 5 of your 3000/4000-level courses must be taken at Cornell. ' +
      'The exception for this is for Study Abroad, in which you must take at least 4 of these courses at Cornell.',
    source: 'https://economics.cornell.edu/minor',
    checker: [
      (course: Course): boolean => {
        if (
          courseMatchesCodeOptions(course, [
            'ECON 4990',
            'ECON 4991',
            'ECON 4999',
            'ECON 3030',
            'ECON 3040',
            'ECON 3110',
            'ECON 3120',
            'ECON 3130',
            'ECON 3140',
          ])
        ) {
          return false;
        }
        return (
          ifCodeMatch(course.subject, 'ECON') &&
          (ifCodeMatch(course.catalogNbr, '3***') || ifCodeMatch(course.catalogNbr, '4***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default econILRMinorRequirements;

export const econILRMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Sarah Louise Schupp', email: 'sls499@cornell.edu' }],
};
