import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const engineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Mathematics',
    description: 'MATH 1910, 1920, 2930 or 2940, and a mathematics course chosen by the Major.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(
      ['MATH 1910'],
      ['MATH 1920'],
      ['MATH 2930', 'MATH 2940']
    ),
    fulfilledBy: 'credits',
    minCount: 14
  },
  {
    name: 'Physics',
    description: 'PHYS 1112 and 2213, and, depending on the Major, either PHYS 2214 or a designated mathematics or science course.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(
      ['PHYS 1112'],
      ['PHYS 2213']
    ),
    fulfilledBy: 'credits',
    minCount: 8
  },
  {
    name: 'Chemistry',
    description: 'CHEM 2090.  Majors in Chemical Engineering or those planning on a health-related career should take CHEM 2090 and then 2080.  '
      + 'Students in Environmental Engineering should take CHEM 2090 and CHEM 1570/3570.  '
      + 'Earth and Atmospheric Sciences majors should take CHEM 2090 and then 2080/1570.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CHEM 2090'),
    fulfilledBy: 'credits',
    minCount: 4
  },
  {
    name: 'First-Year Writing Seminars',
    description: 'All students are required to take two first-year writing seminars.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: courseIsFWS,
    fulfilledBy: 'credits',
    minCount: 6
  },
  {
    name: 'Computing',
    description: '(CS 1110, 1112, 1114, or 1115)',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'),
    fulfilledBy: 'credits',
    minCount: 4
  },
  {
    name: 'Introduction to Engineering',
    description: 'One introduction to engineering (ENGRI) course.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: (course: Course): boolean => course.subject === 'ENGRI',
    fulfilledBy: 'credits',
    minCount: 4
  },
  {
    name: 'Engineering Distribution',
    description: 'Two different category distribution courses (ENGRD), one of which may be required by the Major.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: (course: Course): boolean => course.subject === 'ENGRD',
    fulfilledBy: 'credits',
    minCount: 6
  },
  {
    name: 'Liberal Studies Distribution',
    description: 'Liberal Studies Distribution (six courses)',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: (course: Course): boolean => (
      ['CA', 'HA', 'LA/LAD', 'KCM', 'SBA', 'FL', 'CE'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      )
    ),
    fulfilledBy: 'courses',
    minCount: 3,
    totalCount: 6
  },
  {
    name: 'Advisor-Approved Electives',
    description: '\'Advisor-Approved\' means that you have justified your selection to your advisor and that your advisor has approved the selection. '
      + 'It makes good sense to use these electives for lower-level introductory courses '
      + 'that may be required prerequisites for the 3000+ technical elective courses and the courses used to satisfy the Specialization. '
      + 'Phys Ed, courses numbered 10xx, and ROTC courses below the 3000-level, do not qualify for academic credit and can not be used toward the degree requirements in CS. '
      + 'Up to 6 credits of advisor approved electives may be allowed for ROTC courses at the 3000-level or above.',
    source: 'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives#adv_elective',
    checker: null,
    fulfilledBy: 'self-check',
    minCount: 6
  },
  {
    name: 'Major Program',
    description: 'Major-required courses, major-approved electives, and courses outside the major.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: null,
    fulfilledBy: 'self-check',
    minCount: 3
  },
  {
    name: 'Technical Communication',
    description: 'In addition to the first-year writing seminars, a technical writing course must be taken as '
      + 'an engineering distribution, liberal studies, Advisor-approved electives, or Major course.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: null,
    fulfilledBy: 'self-check',
    minCount: 3
  }
];

export default engineeringRequirements;
