import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { AdvisorGroup } from '../../tools/types';

const historyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'History Major Classes',
    description:
      'For the graduating classes of 2019, 2020, and 2021, 4 History courses categorized as outside of U.S. History are required. ' +
      'For the graduating class of 2022 and beyond: 4 History courses must be taken from one each of the following five categories: Asian, North America, European, Global South (Africa/Caribbean/Latin American and Middle East), and Transregional (Transregional, Comparative, and Methodological).',
    source: 'https://history.cornell.edu/undergraduate',
    checker: [(course: Course): boolean => course.subject === 'HIST'],
    checkerWarning: 'We do not check which courses you add depending on your graduation year.',
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
  {
    name: 'Pre 1800 Classes',
    description:
      '3 of the nine courses must be in history before 1800 ' +
      '(Courses that fulfill the Arts & Sciences historical breadth requirement do not necessarily fulfill the History pre-1800 requirement.)',
    source: 'https://history.cornell.edu/undergraduate',
    checker: [
      (course: Course): boolean =>
        course.catalogCourseSubfield != null && course.catalogCourseSubfield.includes('HPE'),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Seminars',
    description:
      '2 of the nine courses must be seminars, and one of these seminars must be a 4000-level seminar. ' +
      'Service-learning 4000-level courses, HIST 4001, HIST 4002, may not be used to fulfill the 4000-level seminar requirement.',
    source: 'https://history.cornell.edu/undergraduate',
    checker: [
      (course: Course): boolean =>
        course.subject === 'HIST' && course.catalogNbr !== '4001' && course.catalogNbr !== '4002',
    ],
    checkerWarning: 'We do not check that the courses are seminars.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default historyRequirements;

export const historyAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Robert Travers', email: 'history_DUS@cornell.edu' }],
};
