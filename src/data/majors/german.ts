import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { AdvisorGroup } from '../../tools/advisors/types';

const germanRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'German Language Courses',
    description:
      'Two courses in the German language at the GERST 3000-3209 level with intensive language work. ' +
      'The major requires 8 courses totaling a minimum of 25 credits.',
    source: 'https://catalog.cornell.edu/programs/german-studies-ba/',
    checker: [
      (course: Course): boolean =>
        course.subject === 'GERST' &&
        Number(course.catalogNbr) >= 3000 &&
        Number(course.catalogNbr) <= 3209,
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'German Studies Courses',
    description:
      'Six courses in German Studies (GERST) at the 3210 level or higher. ' +
      'In consultation with the director of undergraduate studies, courses with a substantial German component from other departments may also be included. ' +
      'One course per semester taken as part of a study abroad program may count toward the major.',
    source: 'https://catalog.cornell.edu/programs/german-studies-ba/',
    checker: [
      (course: Course): boolean => course.subject === 'GERST' && Number(course.catalogNbr) >= 3210,
    ],
    checkerWarning:
      'We do not check courses from other departments or study abroad courses approved by the DUS.',
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
    slotNames: ['Course'],
  },
  {
    name: 'Research Project',
    description:
      'A 1-credit research project completed in conjunction with a course taught at the GERST 3210 level or higher in the junior or senior year. ' +
      'The 8-10 page paper must be written in German.',
    source: 'https://catalog.cornell.edu/programs/german-studies-ba/',
    fulfilledBy: 'self-check',
  },
];

export default germanRequirements;

export const germanAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Gunhild Lischke', email: 'gl15@cornell.edu' },
    { name: 'Anne Chen', email: 'aac262@cornell.edu' },
  ],
};
