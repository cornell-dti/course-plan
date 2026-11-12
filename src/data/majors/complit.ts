import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

/**
 * Literature and language departments whose 2000+ courses can satisfy the
 * Comparative Literary Studies track's five foreign-literature courses. The
 * catalog gives no list, so this is the set of foreign-language rubrics in the
 * roster; the advisor must confirm texts are read in the original language.
 */
const FOREIGN_LITERATURE_CODES = [
  'ARAB',
  'ASIAN',
  'CHIN',
  'CLASS',
  'FREN',
  'GERST',
  'GREEK',
  'HEBRW',
  'HINDI',
  'ITAL',
  'JAPAN',
  'KOREA',
  'LATIN',
  'NES',
  'PERSN',
  'PORT',
  'ROMS',
  'RUSSA',
  'SPAN',
  'TURK',
].flatMap(subject => [`${subject} 2***`, `${subject} 3***`, `${subject} 4***`]);

const complitRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Course',
    description:
      'COML 3001 Methods of Comparison, offered in the fall, usually taken in the junior or senior year.',
    source: 'https://catalog.cornell.edu/programs/comparative-literature-ba/',
    checker: includesWithSingleRequirement('COML 3001'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['COML 3001'],
  },
  {
    name: 'Seminar in Theory',
    description:
      'Students must take one department-designated theory course. Students will choose among a number of theory courses designated as ' +
      'fulfilling the requirement every year. The designated theory courses for 2026-2027 are COML 4370 and COML 4902 (fall) and ' +
      'COML 2591, COML 3021, COML 3300, COML 4251, COML 4810, and COML 4842 (spring).',
    source: 'https://complit.cornell.edu/undergraduate',
    checker: includesWithSingleRequirement(
      'COML 4370',
      'COML 4902',
      'COML 2591',
      'COML 3021',
      'COML 3300',
      'COML 4251',
      'COML 4810',
      'COML 4842'
    ),
    checkerWarning:
      'We only check the theory courses designated for 2026-2027; the designated list changes every year.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Theory Course'],
  },
  {
    name: 'Track Requirements',
    description:
      'Students choose one of two tracks for their remaining requirements: Comparative Literary Studies or Literary, Visual, and Media Studies.',
    source: 'https://catalog.cornell.edu/programs/comparative-literature-ba/',
    checkerWarning:
      'For the Comparative Literary Studies track we only check the three Comparative Literature courses; ' +
      'for the Literary, Visual, and Media Studies track we only check Comparative Literature courses. ' +
      'Courses from other humanities departments and the foreign-language reading requirement must be confirmed with your advisor.',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Comparative Literary Studies': {
        description:
          'Three courses in Comparative Literature at the 2000-level and above, and five courses in literature or other areas of the humanities ' +
          'at the 2000-level and above, to be taken in one or more foreign literature departments. Texts must be read in the original language. ' +
          'A student may offer one advanced-level foreign language course (conversation, composition, etc.) toward fulfilling this requirement.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['COML 2***', 'COML 3***', 'COML 4***'],
          FOREIGN_LITERATURE_CODES
        ),
        perSlotMinCount: [3, 5],
        slotNames: ['COML Course (2000+)', 'Foreign Literature Course (2000+)'],
      },
      'Literary, Visual, and Media Studies': {
        description:
          'Two courses in literary study at the 2000-level or above, offered by the Department of Comparative Literature or other humanities ' +
          'departments or programs, and six courses in visual arts or media studies at the 2000 or higher level offered by the Department of ' +
          'Comparative Literature or other humanities departments or programs. Where the media involve a large component of speech or writing, ' +
          'the student must work with this material in the original foreign language. Students who select this track should work closely with ' +
          'their faculty advisor and the Director of Undergraduate Studies to determine which courses satisfy the language requirement of the major.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['COML 2***', 'COML 3***', 'COML 4***'],
          ['COML 2***', 'COML 3***', 'COML 4***']
        ),
        perSlotMinCount: [2, 6],
        slotNames: ['Literary Study Course (2000+)', 'Visual Arts or Media Studies Course (2000+)'],
      },
    },
  },
  {
    name: 'Comparative Literature Department Courses',
    description:
      'Five of the ten major courses must be taken in the Department of Comparative Literature, including the theory course and COML 3001. ' +
      'If elected, honors majors may count COML 4930 or COML 4940 as one of the required Comparative Literature courses.',
    source: 'https://catalog.cornell.edu/programs/comparative-literature-ba/',
    checker: includesWithSingleRequirement('COML 2***', 'COML 3***', 'COML 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
    slotNames: ['COML Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Credits and Foreign-Language Reading',
    description:
      'All majors are expected to complete ten three-to-four credit courses with a minimum of 30 credits, half of which must be devoted to the ' +
      'study of works in languages other than English that the student reads in the original language. A minimum grade of C is required for a ' +
      'course to count toward the major. Students who double major with another literature department may count up to three courses from that ' +
      'major toward Comparative Literature. The number of study-abroad courses counted toward the major is determined with the faculty advisor ' +
      'and the Director of Undergraduate Studies. Honors majors complete thirty-six credits.',
    source: 'https://catalog.cornell.edu/programs/comparative-literature-ba/',
    fulfilledBy: 'self-check',
  },
];

export default complitRequirements;

export const complitAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Natalie Melas', email: 'nam5@cornell.edu' }],
};
