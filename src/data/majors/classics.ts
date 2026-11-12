import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { courseMatchesCodeOptions, includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const classicsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Track Requirements',
    description:
      'The major in Classics offers four tracks: Classics, Greek, Latin, and Classical Civilization. ' +
      'Only classes passed with a C- or better may be applied to the major. A minimum of 27 credits is required to complete the major.',
    source: 'https://catalog.cornell.edu/programs/classics-ba/',
    checkerWarning:
      'We do not check the 3000-level language course distribution, the subject area (ancient history, material culture, literature in translation) or ' +
      'period coverage of Classical Civilization courses (any CLASS course at the 2000-level or above fills those slots), or the minimum C- grade.',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Classics: {
        description:
          'Six courses in Greek and Latin numbered 2101 or above, including a minimum of two 3000-level courses (of 3 or more credits each) ' +
          'in one language (Ancient Greek or Latin) and one 3000-level course (of 3 or more credits) in the other language. ' +
          'Three additional courses designated CLASS at the 2000-level or above.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['GREEK 2***', 'GREEK 3***', 'GREEK 4***', 'LATIN 2***', 'LATIN 3***', 'LATIN 4***'],
          ['CLASS 2***', 'CLASS 3***', 'CLASS 4***']
        ),
        perSlotMinCount: [6, 3],
        slotNames: ['Greek or Latin Course (2101+)', 'CLASS Course (2000+)'],
      },
      Greek: {
        description:
          'GREEK 2101, five courses in Greek numbered 2102 or above (including at least three courses, of 3 or more credits each, at the 3000-level), ' +
          'and three additional courses designated CLASS at the 2000-level or above. Students taking the Beginning Homeric Greek sequence ' +
          '(GREEK 1104-GREEK 1105) should consult the DUS about alternatives to GREEK 2101.',
        counting: 'courses',
        checker: [
          (course: Course): boolean => courseMatchesCodeOptions(course, ['GREEK 2101']),
          (course: Course): boolean =>
            course.subject === 'GREEK' &&
            Number(course.catalogNbr) >= 2102 &&
            Number(course.catalogNbr) < 5000,
          (course: Course): boolean =>
            courseMatchesCodeOptions(course, ['CLASS 2***', 'CLASS 3***', 'CLASS 4***']),
        ],
        perSlotMinCount: [1, 5, 3],
        slotNames: ['GREEK 2101', 'Greek Course (2102+)', 'CLASS Course (2000+)'],
      },
      Latin: {
        description:
          'LATIN 1205 or LATIN 2201, five courses in Latin numbered 2202 or above (including at least three courses, of 3 or more credits each, at the 3000-level), ' +
          'and three additional courses designated CLASS at the 2000-level or above.',
        counting: 'courses',
        checker: [
          (course: Course): boolean =>
            courseMatchesCodeOptions(course, ['LATIN 1205', 'LATIN 2201']),
          (course: Course): boolean =>
            course.subject === 'LATIN' &&
            Number(course.catalogNbr) >= 2202 &&
            Number(course.catalogNbr) < 5000,
          (course: Course): boolean =>
            courseMatchesCodeOptions(course, ['CLASS 2***', 'CLASS 3***', 'CLASS 4***']),
        ],
        perSlotMinCount: [1, 5, 3],
        slotNames: ['LATIN 1205 or LATIN 2201', 'Latin Course (2202+)', 'CLASS Course (2000+)'],
      },
      'Classical Civilization': {
        description:
          'Two courses in ancient history at the 2000-level or above, two courses in ancient Greek and Roman material culture at the 2000-level or above, ' +
          'two courses in ancient literature in English translation at the 2000-level or above, and four courses in classical civilization, classical archaeology, ' +
          'ancient history, ancient philosophy, ancient Greek or Latin, or related subjects at or above the 2000-level (consult your major advisor). ' +
          'At least three courses must be at or above the 3000-level. At least one course must cover the period before 323 BCE and at least one the period after 323 BCE.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['CLASS 2***', 'CLASS 3***', 'CLASS 4***'],
          ['CLASS 2***', 'CLASS 3***', 'CLASS 4***'],
          ['CLASS 2***', 'CLASS 3***', 'CLASS 4***'],
          [
            'CLASS 2***',
            'CLASS 3***',
            'CLASS 4***',
            'GREEK 2***',
            'GREEK 3***',
            'GREEK 4***',
            'LATIN 2***',
            'LATIN 3***',
            'LATIN 4***',
          ]
        ),
        perSlotMinCount: [2, 2, 2, 4],
        slotNames: [
          'Ancient History',
          'Material Culture',
          'Literature in Translation',
          'Additional Course',
        ],
      },
    },
  },
  {
    name: 'Seminar Paper',
    description:
      'One course must yield a seminar paper whose minimum length is 3000 words (approx. 10 double-spaced pages in 12-point font), ' +
      'to be completed by the end of the first semester of your senior year and approved by the Director of Undergraduate Studies. ' +
      "This must be a research paper which presents the student's own sustained, evidence-based argument and demonstrates an ability " +
      'to synthesize and evaluate arguments from secondary scholarship.',
    source: 'https://catalog.cornell.edu/programs/classics-ba/',
    fulfilledBy: 'self-check',
  },
];

export default classicsRequirements;

export const classicsAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Mike Fontaine', email: 'mf268@cornell.edu' },
    { name: 'Ryan Belle', email: 'rtb95@cornell.edu' },
  ],
};
