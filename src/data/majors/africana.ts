import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const africanaRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Course',
    description: 'ASRC 1500: Introduction to Africana Studies.',
    source: 'https://catalog.cornell.edu/programs/africana-studies-ba/',
    checker: includesWithSingleRequirement('ASRC 1500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ASRC 1500'],
  },
  {
    name: '2000-Level Courses',
    description:
      'Three (3) ASRC courses, 2000-level or above, each falling under one of the following categories: ' +
      'African, African-American, Caribbean, or other diaspora studies.',
    source: 'https://catalog.cornell.edu/programs/africana-studies-ba/',
    checker: includesWithSingleRequirement('ASRC 2***'),
    checkerWarning: 'We do not check the category of the courses you add.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: '3000-Level Focus Courses',
    description:
      'Four (4) 3000-level focus courses. Choose two topics (that fall within the African Diaspora) from the following: ' +
      'History, Literature, Politics, Popular Culture, Race and Inequality, or Gender and Sexuality ' +
      '(take two courses in each of the two chosen topics).',
    source: 'https://catalog.cornell.edu/programs/africana-studies-ba/',
    checker: includesWithSingleRequirement('ASRC 3***'),
    checkerWarning: 'We do not check that the courses fall into two focus topics.',
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
  {
    name: 'Seminar Courses',
    description: 'Two (2) seminar courses, 4000-level or above.',
    source: 'https://catalog.cornell.edu/programs/africana-studies-ba/',
    checker: includesWithSingleRequirement('ASRC 4***', 'ASRC 6***'),
    checkerWarning: 'We do not check that the courses are seminars.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Africana Studies Credits',
    description:
      'A major in Africana Studies requires a minimum of 36 credits with at least ten (10) Africana Studies (ASRC) courses ' +
      '(with a grade of C or better).',
    source: 'https://catalog.cornell.edu/programs/africana-studies-ba/',
    checker: includesWithSingleRequirement('ASRC ****'),
    fulfilledBy: 'credits',
    perSlotMinCount: [36],
    allowCourseDoubleCounting: true,
  },
];

export default africanaRequirements;

export const africanaAdvisors: AdvisorGroup = {
  advisors: [],
};
