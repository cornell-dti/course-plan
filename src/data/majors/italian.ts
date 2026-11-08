import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const italianRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'Students must take ITAL 2202 Italian IV (or equivalent), ITAL 2203 Languages-Literatures-Identities (or equivalent, offered in Italian in Fall), ' +
      'and either ITAL 2900 (offered in English in Spring) or ITAL 2204 The Cinematic Eye of Italy (or equivalent). ' +
      'Students who take both ITAL 2900 and ITAL 2204 may count both toward the eight courses required for the major. ' +
      'The minimum grade for a course to be applied toward the major is B-, and no course may be taken S/U.',
    source: 'https://catalog.cornell.edu/programs/italian-ba/',
    checker: includesWithSubRequirements(['ITAL 2202'], ['ITAL 2203'], ['ITAL 2900', 'ITAL 2204']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['ITAL 2202', 'ITAL 2203', 'ITAL 2900 or ITAL 2204'],
  },
  {
    name: 'Electives',
    description:
      'At least five electives (minimum 3 credits each) at the 2000 level or above offered in Romance Studies or other departments such as History, Architecture, History of Art, Government, or Sociology. ' +
      'An ITAL course of 1.5 or 2 credits counts as half a course and must be combined with another 1.5 or 2 credit course. ' +
      'Majors are strongly urged to take as many of these electives as possible in Italian. ' +
      'No more than three of the five electives may be taken in English, and no more than three of the eight major courses may be taken abroad or at another institution.',
    source: 'https://catalog.cornell.edu/programs/italian-ba/',
    checker: [
      (course: Course): boolean =>
        course.subject === 'ITAL' &&
        Number(course.catalogNbr) >= 2202 &&
        !['2202', '2203'].includes(course.catalogNbr),
    ],
    checkerWarning:
      'We do not check electives from other departments, the 3-credit minimum, or the limit on courses taken in English.',
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
    slotNames: ['Course'],
  },
  {
    name: 'Pre-1800 Elective',
    description: 'At least one of the five electives must focus on a period prior to the 1800s.',
    source: 'https://catalog.cornell.edu/programs/italian-ba/',
    fulfilledBy: 'self-check',
  },
];

export default italianRequirements;

export const italianAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Julia Chang', email: 'roms_dus@cornell.edu' },
    { name: 'Mary Beth Martini-Lyons', email: 'mm524@cornell.edu' },
  ],
};
