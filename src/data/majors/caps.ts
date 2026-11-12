import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const capsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Gateway Course',
    description:
      'CAPS majors must take any one of the following gateway courses (taught in Ithaca), normally during the first two years: ' +
      'CAPS 2132, CAPS 2232, CAPS 2435, or CAPS 3967.',
    source: 'https://catalog.cornell.edu/programs/china-asia-pacific-studies-ba/',
    checker: includesWithSingleRequirement('CAPS 2132', 'CAPS 2232', 'CAPS 2435', 'CAPS 3967'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Gateway Course'],
  },
  {
    name: 'Required Core Courses',
    description:
      'CAPS majors must complete the following three required core courses: ' +
      'CAPS 4001 (or CAPS 4003), CAPS 4002 (taught in Beijing), and CAPS 4030 (the capstone seminar).',
    source: 'https://catalog.cornell.edu/programs/china-asia-pacific-studies-ba/',
    checker: includesWithSubRequirements(['CAPS 4001', 'CAPS 4003'], ['CAPS 4002'], ['CAPS 4030']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['CAPS 4001 or CAPS 4003', 'CAPS 4002', 'CAPS 4030'],
  },
  {
    name: 'Additional Core Courses',
    description:
      'Any two of the following additional core courses: CAPS 4049, CAPS 4127, CAPS 4827, CAPS 4931, CAPS 4963, CAPS 4998, or CAPS 4999. ' +
      'CAPS 4999 may count as one core course only if it is assigned 3 credits and approved by the Director of Undergraduate Studies.',
    source: 'https://catalog.cornell.edu/programs/china-asia-pacific-studies-ba/',
    checker: includesWithSingleRequirement(
      'CAPS 4049',
      'CAPS 4127',
      'CAPS 4827',
      'CAPS 4931',
      'CAPS 4963',
      'CAPS 4998',
      'CAPS 4999'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'CAPS Elective Courses',
    description:
      'Two elective courses. CAPS majors may choose any two CAPS courses to fulfill the elective requirement. ' +
      'Other courses may be approved by the Director of Undergraduate Studies.',
    source: 'https://caps.cornell.edu/major',
    checker: includesWithSingleRequirement('CAPS ****'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Chinese Language Proficiency',
    description:
      'CAPS majors are required to complete three years of college-level Chinese language courses (CHIN 1000-level through 3000-level) ' +
      'and acquire high-intermediate Chinese proficiency or higher upon graduation. Students are expected to be at no lower than the 3000-level ' +
      'when they study abroad in Beijing. Native speakers and students who place out via placement testing may be exempted at the discretion of ' +
      "Cornell's Chinese language faculty and the CAPS administrator.",
    source: 'https://catalog.cornell.edu/programs/china-asia-pacific-studies-ba/',
    checker: includesWithSingleRequirement('CHIN 3***'),
    checkerWarning:
      'We only check for a 3000-level CHIN course; exemptions and placement are not checked.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['3000-level CHIN Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'CAPS Study Abroad in Beijing',
    description:
      'CAPS majors are required to participate in the CAPS study abroad in Beijing, normally in their junior or senior year. ' +
      'The six required CAPS courses and two elective CAPS courses (30-36 credits total) must be completed with a grade average of C or better.',
    source: 'https://catalog.cornell.edu/programs/china-asia-pacific-studies-ba/',
    fulfilledBy: 'self-check',
  },
];

export default capsRequirements;

export const capsAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Xu Xin', email: 'xx12@cornell.edu' }],
};
