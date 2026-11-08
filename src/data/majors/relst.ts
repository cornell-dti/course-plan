import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const relstRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Area 1: Approaches, Methods and Theory',
    description:
      'At least one course that addresses questions of approach, methodology, and theory in the academic study of religion. ' +
      'In conjunction with the advisor, the student will select appropriate courses to fulfill this area.',
    source: 'https://catalog.cornell.edu/programs/religious-studies-ba/',
    checker: includesWithSingleRequirement('RELST ****'),
    checkerWarning: 'We do not check that the course addresses approaches, methods, and theory.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Area 2: Breadth of Religious Traditions',
    description:
      'At least three courses dealing with a diversity of religious traditions. ' +
      'In conjunction with the advisor, the student will select appropriate courses to fulfill this area.',
    source: 'https://catalog.cornell.edu/programs/religious-studies-ba/',
    checker: includesWithSingleRequirement('RELST ****'),
    checkerWarning: 'We do not check that the courses cover a diversity of religious traditions.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Area 3: Depth of Focus',
    description:
      'At least four courses with a focus on a given religious tradition, geographical area, or thematic or methodological topic. ' +
      'At least one course must be at the 4000-level or above.',
    source: 'https://catalog.cornell.edu/programs/religious-studies-ba/',
    checker: includesWithSubRequirements(
      ['RELST 4***', 'RELST 5***', 'RELST 6***'],
      ['RELST ****']
    ),
    checkerWarning: 'We do not check that the courses share a focus.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 3],
    slotNames: ['4000-Level or Above Course', 'Course'],
  },
  {
    name: '4000-Level Courses',
    description:
      'Students are required to have at least two of their courses be at the 4000-level or above. ' +
      'One course must be in Area 3 while the other may be in either Area 2 or 3. ' +
      'Students pursuing honors may count their two semesters of honors work to satisfy this requirement.',
    source: 'https://catalog.cornell.edu/programs/religious-studies-ba/',
    checker: includesWithSingleRequirement('RELST 4***', 'RELST 5***', 'RELST 6***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Credit Requirement',
    description:
      'Students must complete 10 courses for a minimum of 30 credit hours in Religious Studies. ' +
      'One course in advanced language study can be counted toward the major by petition only, ' +
      'indicating that the material covered was directly related to the academic study of religion.',
    source: 'https://catalog.cornell.edu/programs/religious-studies-ba/',
    checker: includesWithSingleRequirement('RELST ****'),
    checkerWarning: 'We do not check petitioned advanced language courses.',
    fulfilledBy: 'credits',
    perSlotMinCount: [30],
    allowCourseDoubleCounting: true,
  },
];

export default relstRequirements;

export const relstAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Seema Golestaneh', email: 'religiousst@cornell.edu' }],
};
