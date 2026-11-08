import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

/** Introductory Core options without a COGST code; they count toward the 40-credit total but are not electives. */
const cogsciIntroductoryCoreCourses: readonly string[] = [
  'PSYCH 2500',
  'SOC 3010',
  'STSCI 2150',
  'STSCI 2200',
  'CS 1380',
  'CS 1700',
  'INFO 2950',
  'ILRST 2100',
  'HD 2930',
];

const cogsciElectiveCourses: readonly string[] = [
  'COGST ****',
  'CLASS 4646',
  'COMM 4450',
  'COML 3524',
  'CS 1110',
  'CS 1700',
  'CS 1710',
  'CS 2110',
  'CS 3110',
  'CS 3700',
  'CS 3780',
  'CS 4110',
  'CS 4701',
  'CS 4740',
  'CS 4860',
  'AEM 3205',
  'ECON 2801',
  'HD 2200',
  'HD 3210',
  'HD 3290',
  'HD 3530',
  'HD 3620',
  'HD 4240',
  'HD 4765',
  'INFO 2450',
  'INFO 2950',
  'INFO 3450',
  'INFO 4120',
  'LING 1101',
  'LING 1170',
  'LING 2215',
  'LING 3303',
  'LING 3332',
  'LING 3333',
  'LING 4403',
  'LING 4421',
  'LING 4424',
  'LING 4425',
  'LING 4434',
  'LING 4474',
  'MATH 4810',
  'MATH 4860',
  'BIONB 2210',
  'BIONB 2220',
  'BIONB 3280',
  'BIONB 3300',
  'BIONB 3500',
  'BIONB 3920',
  'BIONB 4260',
  'BIONB 4380',
  'PHIL 2300',
  'PHIL 2310',
  'PHIL 2415',
  'PHIL 2621',
  'PHIL 4310',
  'PHIL 4510',
  'PHIL 4620',
  'PHIL 4710',
  'PSYCH 1102',
  'PSYCH 2050',
  'PSYCH 2090',
  'PSYCH 2100',
  'PSYCH 2150',
  'PSYCH 2230',
  'PSYCH 3020',
  'PSYCH 3140',
  'PSYCH 3300',
  'PSYCH 3320',
  'PSYCH 3420',
  'PSYCH 4270',
  'PSYCH 4320',
  'PSYCH 4360',
  'PSYCH 4500',
  'PSYCH 4790',
  'PSYCH 4910',
  'PSYCH 4940',
];

const cogsciUpperLevelCourses: readonly string[] = [
  'COGST 3***',
  'COGST 4***',
  ...cogsciElectiveCourses.filter(code => /^[A-Z]+ [34]/.test(code)),
];

const cogsciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Core',
    description:
      'Three courses: one of COGST 1101 or COGST 2350; one Statistical Reasoning course (PSYCH 2500, SOC 3010, STSCI 2150, or STSCI 2200); ' +
      'and one Structured Thinking/Data Science course (CS 1380 or CS 1700, COGST 2310, INFO 2950, ILRST 2100, or HD 2930).',
    source: 'https://catalog.cornell.edu/programs/cognitive-science-ba/',
    checker: includesWithSubRequirements(
      ['COGST 1101', 'COGST 2350'],
      ['PSYCH 2500', 'SOC 3010', 'STSCI 2150', 'STSCI 2200'],
      ['CS 1380', 'CS 1700', 'COGST 2310', 'INFO 2950', 'ILRST 2100', 'HD 2930']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Introduction', 'Statistical Reasoning', 'Structured Thinking/Data Science'],
  },
  {
    name: 'Interdisciplinary Distribution Concentrations',
    description:
      'Students must take at least one course from three of the five concentrations (Language Science, Evolution and Development, ' +
      'Computational Cognitive Science, Cognitive Neuroscience, Mind and Culture) to ensure interdisciplinary breadth. ' +
      'A course can only be counted once for the interdisciplinary distribution requirement. The catalog lists sample courses for each concentration; ' +
      "select specialized courses may be counted toward a concentration based on the academic advisor's approval.",
    source: 'https://catalog.cornell.edu/programs/cognitive-science-ba/',
    checker: includesWithSubRequirements(
      ['COGST 2150', 'COGST 3330', 'COGST 4240', 'COGST 4270', 'COGST 4425', 'COGST 4740'],
      ['COGST 2090', 'COGST 2300', 'COGST 4270'],
      ['COGST 2801', 'COGST 3140', 'COGST 3300', 'COGST 4240', 'COGST 4740'],
      ['COGST 1212', 'COGST 2230', 'COGST 2350', 'COGST 3300', 'COGST 4230'],
      ['COGST 1112', 'COGST 2621', 'COGST 3420', 'COGST 4150', 'COGST 4310', 'COGST 4625']
    ),
    checkerWarning:
      'We only check the sample courses listed in the catalog for each concentration.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    minNumberOfSlots: 3,
    slotNames: [
      'Language Science',
      'Evolution and Development',
      'Computational Cognitive Science',
      'Cognitive Neuroscience',
      'Mind and Culture',
    ],
  },
  {
    name: 'Area Distribution',
    description: 'Three courses: one course from at least three different departments.',
    source: 'https://catalog.cornell.edu/programs/cognitive-science-ba/',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Depth Distribution',
    description:
      'At least nine credits (three or more courses) must be taken at the 3000/4000 level.',
    source: 'https://catalog.cornell.edu/programs/cognitive-science-ba/',
    checker: includesWithSingleRequirement(...cogsciUpperLevelCourses),
    checkerWarning:
      'We only check for 3000/4000-level courses from the Cognitive Science course list.',
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Total Credits',
    description:
      'The major requires 40 credits (at least 12 courses). All courses must be taken for a letter grade, and a course counts toward the major ' +
      'only with a grade of C- or better. Students may take courses from the Cognitive Science elective list for credit toward the major even if ' +
      'the course does not have the COGST course code. Up to 12 credits of independent study or fieldwork (COGST 4700, COGST 4710) may be counted ' +
      'toward the major (3 credits = 1 course). Graduate courses and seminars require advisor approval.',
    source: 'https://cogsci.cornell.edu/undergraduate-major',
    checker: includesWithSingleRequirement(
      ...cogsciIntroductoryCoreCourses,
      ...cogsciElectiveCourses
    ),
    checkerWarning:
      'We do not check the 12-credit limit on independent study, letter-grade requirement, or minimum grade.',
    fulfilledBy: 'credits',
    perSlotMinCount: [40],
    allowCourseDoubleCounting: true,
  },
];

export default cogsciRequirements;

export const cogsciAdvisors: AdvisorGroup = {
  advisors: [],
};
