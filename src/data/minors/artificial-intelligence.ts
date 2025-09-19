import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import { includesWithSubRequirements, courseMatchesCodeOptions } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const aiMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Foundations of AI Core Courses',
    description:
      'Four required core courses covering computational AI methods, human-AI systems, and AI ethics',
    source: 'https://www.cs.cornell.edu/undergrad/aiminor',
    checker: includesWithSubRequirements(
      ['CS 4780', 'CS 4786', 'CS 4740'],
      ['CS 4700', 'CS 4701', 'CS 4720'],
      ['INFO 3450', 'INFO 4450', 'CS 4450'],
      ['GOVT 2049', 'INFO 2040', 'STS 2040']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: [
      'Machine Learning Course',
      'AI/Reasoning Course',
      'Human-AI Systems Course',
      'AI Ethics Course',
    ],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'AI Elective Courses',
    description: 'Two AI elective courses from approved list',
    source: 'https://www.cs.cornell.edu/undergrad/aiminor',
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, [
          'CS 4750',
          'CS 4670',
          'CS 4780',
          'CS 4786',
          'CS 4700',
          'CS 4701',
          'CS 4720',
          'CS 4740',
          'CS 4758',
          'CS 4820',
          'CS 4850',
          'INFO 3450',
          'INFO 4450',
          'INFO 2040',
          'GOVT 2049',
          'STS 2040',
          'ORIE 4740',
          'MATH 4710',
          'MATH 4740',
        ]),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['AI Elective Course'],
    allowCourseDoubleCounting: true,
  },
];

export default aiMinorRequirements;

export const aiMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Computer Science Department', email: 'cs-undergrad@cornell.edu' }],
};
