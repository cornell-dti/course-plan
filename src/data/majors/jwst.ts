import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const jwstRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introduction to Judaism',
    description: 'JWST 2644: Introduction to Judaism.',
    source: 'https://catalog.cornell.edu/programs/jewish-studies-ba/',
    checker: includesWithSingleRequirement('JWST 2644'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['JWST 2644'],
  },
  {
    name: 'Research in Jewish Studies',
    description:
      'JWST 4769: Research in Jewish Studies, or the honors sequence JWST 4998 and JWST 4999 (Honors Research I and II).',
    source: 'https://catalog.cornell.edu/programs/jewish-studies-ba/',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Research Seminar': {
        description: 'JWST 4769: Research in Jewish Studies.',
        checker: includesWithSingleRequirement('JWST 4769'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['JWST 4769'],
      },
      'Honors Research': {
        description: 'JWST 4998 and JWST 4999: Honors Research I and Honors Research II.',
        checker: includesWithSubRequirements(['JWST 4998'], ['JWST 4999']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['JWST 4998', 'JWST 4999'],
      },
    },
  },
  {
    name: 'Major Electives',
    description:
      'Seven Jewish Studies elective courses, at least four of which must be at the 3000-level or above. ' +
      'Up to two courses at any level in a Jewish language (Hebrew, Yiddish, Judeo-Arabic) may count, ' +
      'provided they are not used to fulfill the Arts and Sciences language requirement.',
    source: 'https://catalog.cornell.edu/programs/jewish-studies-ba/',
    checker: includesWithSubRequirements(
      ['JWST 3***', 'JWST 4***', 'JWST 5***', 'JWST 6***'],
      ['JWST ****']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [4, 3],
    slotNames: ['3000-level or above', 'Any level'],
  },
  {
    name: 'Historical Breadth',
    description:
      'Among the major electives, at least one course must cover antiquity to 1492 and one must cover 1492 to the present. ' +
      'Courses that span this division may count in either category.',
    source: 'https://catalog.cornell.edu/programs/jewish-studies-ba/',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Related Course',
    description:
      'One course in a related field, not cross-listed with Jewish Studies, selected with advisor or Director approval. ' +
      'Jewish Studies recognizes three categories of related courses: Cultural Studies, Ethnic Studies, and Religious Studies. ' +
      'Example courses include ANTHR 2400, HIST 2251, ANTHR 3703, ANTHR 3420, and ASIAN 2250. Only one related course may count toward the major.',
    source: 'https://catalog.cornell.edu/programs/jewish-studies-ba/',
    checker: includesWithSingleRequirement(
      'ANTHR 2400',
      'HIST 2251',
      'ANTHR 3703',
      'ANTHR 3420',
      'ASIAN 2250'
    ),
    checkerWarning:
      'We only check the example courses listed in the catalog. Other related courses may be approved by the Director of Jewish Studies.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default jwstRequirements;

export const jwstAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Deborah Starr', email: 'das86@cornell.edu' }],
};
