import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/global-development-bs/';

const developmentTheory = [
  'AEM 2000',
  'AEM 2350',
  'AEM 2500',
  'GDEV 2010',
  'GDEV 2202',
  'GDEV 3150',
  'GDEV 3240',
  'GDEV 3400',
  'GDEV 3700',
];

const developmentPolicy = [
  'AEM 2300',
  'AEM 4300',
  'AEM 4350',
  'AEM 4420',
  'GDEV 2300',
  'GDEV 2710',
  'EDUC 2710',
  'GDEV 3020',
  'GDEV 3030',
  'GDEV 3260',
  'GDEV 3280',
  'PUBPOL 3280',
  'GDEV 4050',
  'GDEV 4340',
  'GDEV 4450',
  'GDEV 4770',
  'CRP 4770',
];

const developmentPracticeAndMethods = [
  'EDUC 2155',
  'GDEV 2155',
  'EDUC 2200',
  'GDEV 2100',
  'EDUC 2210',
  'GDEV 2210',
  'EDUC 2410',
  'GDEV 2410',
  'EDUC 3142',
  'GDEV 3142',
  'EDUC 4010',
  'GDEV 4011',
  'EDUC 4200',
  'GDEV 4200',
  'EDUC 4223',
  'GDEV 4223',
  'GDEV 3030',
  'GDEV 3140',
  'GDEV 3300',
  'GDEV 3390',
  'GDEV 3500',
  'GDEV 3501',
  'GDEV 3502',
  'GDEV 3680',
  'GDEV 3740',
  'GDEV 3900',
  'GDEV 4045',
  'GDEV 4080',
  'GDEV 4190',
  'GDEV 4295',
];

const foundationalPlantAndAgSciences = [
  'ANSC 2000',
  'BIOEE 4690',
  'PLSCI 2110',
  'PLSCI 2440',
  'PLSCI 3210',
  'PLSCI 4140',
  'GDEV 4140',
];

const specializedPlantAndAgSciences = [
  'ANSC 2120',
  'BIOEE 4780',
  'ENTOM 2030',
  'ENTOM 2031',
  'PLSCI 2600',
  'PLSCI 3010',
  'PLSCI 3025',
  'PLSCI 3150',
  'PLSCI 3350',
  'PLSCI 3550',
  'PLSCI 3800',
  'PLSCI 4020',
  'PLSCI 4230',
  'VIEN 3610',
];

const socialEconomicAndHealth = [
  'AEM 4485',
  'GDEV 2202',
  'GDEV 2300',
  'GDEV 2450',
  'GDEV 3020',
  'GDEV 3030',
  'GDEV 3140',
  'GDEV 3170',
  'GDEV 3260',
  'GDEV 3300',
  'GDEV 3400',
  'GDEV 3500',
  'GDEV 3501',
  'GDEV 3502',
  'GDEV 3680',
  'GDEV 3740',
  'GDEV 3900',
  'GDEV 4045',
  'GDEV 4080',
  'GDEV 4190',
  'GDEV 4295',
  'GDEV 4450',
  'GDEV 4880',
  'NS 3060',
  'NTRES 3330',
];

const environmentSocialScience = ['GDEV 3150', 'GDEV 3170', 'GDEV 3240', 'GDEV 3390', 'GDEV 3680'];

const environmentBiophysicalScience = [
  'EAS 1101',
  'ENVS 1201',
  'EAS 2680',
  'NTRES 3220',
  'NTRES 3240',
  'GDEV 3260',
  'BEE 2000',
];

const environmentAdditionalElectives = [
  'GDEV 2010',
  'GDEV 2202',
  'GDEV 2300',
  'GDEV 2450',
  'GDEV 3020',
  'GDEV 3030',
  'GDEV 3140',
  'GDEV 3150',
  'GDEV 3170',
  'GDEV 3240',
  'GDEV 3260',
  'GDEV 3300',
  'GDEV 3390',
  'GDEV 3400',
  'GDEV 3500',
  'GDEV 3501',
  'GDEV 3502',
  'GDEV 3680',
  'GDEV 3740',
  'GDEV 4045',
  'GDEV 4080',
  'GDEV 4190',
  'GDEV 4295',
  'GDEV 4340',
  'GDEV 4850',
  'NTRES 3330',
  'PUBPOL 3670',
  'SOC 3650',
];

const gdevRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'GDEV 1102, GDEV 1105, GDEV 1300, GDEV 2065, GDEV 2130, and GDEV 4961. ' +
      'All Global Development core and focused elective courses must be taken for a letter grade (unless only offered S/U) ' +
      'and passed with a grade of C or higher. A course may only fulfill one major requirement.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['GDEV 1102'],
      ['GDEV 1105'],
      ['GDEV 1300'],
      ['GDEV 2065'],
      ['GDEV 2130'],
      ['GDEV 4961']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['GDEV 1102', 'GDEV 1105', 'GDEV 1300', 'GDEV 2065', 'GDEV 2130', 'GDEV 4961'],
  },
  {
    name: 'Core Ethics or Development Economics Course',
    description:
      'GDEV 2202 (Ethics of Technology and Development) or GDEV 2450 (Development Economics).',
    source: SOURCE,
    checker: includesWithSingleRequirement('GDEV 2202', 'GDEV 2450'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Methods Course',
    description:
      'One additional methods course (3-4 credits): GDEV 3140, GDEV 3300, GDEV 3680, GDEV 3740, GDEV 4045, GDEV 4080, ' +
      'GDEV 4190, GDEV 4295, or any GDEV course numbered X55X.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'GDEV 3140',
      'GDEV 3300',
      'GDEV 3680',
      'GDEV 3740',
      'GDEV 4045',
      'GDEV 4080',
      'GDEV 4190',
      'GDEV 4295'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Engaged Learning Courses',
    description:
      'GDEV 2105 (Pre-Internship: Community-Engaged Learning Prep, taken the semester before the internship) and ' +
      'GDEV 3105 (Post-Internship: Reflection on Engaged Experiences, taken the fall after the internship).',
    source: SOURCE,
    checker: includesWithSubRequirements(['GDEV 2105'], ['GDEV 3105']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['GDEV 2105', 'GDEV 3105'],
  },
  {
    name: 'Field-Based Engaged Learning Experience',
    description:
      'All students must complete a minimum 8-week field-based engaged learning experience (domestic or international), ' +
      'such as a CALS Global Fellowship or an SIT study abroad program, plus a pre-departure portfolio completed the semester before the experience.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
  {
    name: 'Focused Electives',
    description:
      'All Global Development majors affiliate with one of three thematic focused elective areas: Social & Economic Development, ' +
      'Agriculture & Food Systems, or Environment & Development. Each area requires 2 required courses plus 5 additional courses (minimum 15 credits). ' +
      'At least 3 of the 5 electives must be at the 3000 level or higher, and up to 2 approved study-abroad courses may count as electives.',
    source: SOURCE,
    checkerWarning:
      'We do not check the minimum number of GDEV-prefixed electives, the number of electives at the 3000 level or higher, or the 15-credit minimum.',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Social & Economic Development': {
        description:
          'GDEV 2450 and GDEV 3010, plus 5 additional courses (minimum 15 credits) from the Development Theory, Development Policy, ' +
          'and Development Practice & Methods lists. At least 3 of the 5 must have a GDEV prefix.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['GDEV 2450'],
          ['GDEV 3010'],
          [...developmentTheory, ...developmentPolicy, ...developmentPracticeAndMethods]
        ),
        perSlotMinCount: [1, 1, 5],
        slotNames: ['GDEV 2450', 'GDEV 3010', 'Electives'],
      },
      'Agriculture & Food Systems': {
        description:
          'GDEV 2300 or GDEV 3400, and PLSCI 4730, plus 5 additional courses (minimum 15 credits): 2 from the Foundational Plant & Ag Sciences list, ' +
          '2 from the Social, Economic & Health list, and 1 from any of the three lists (including Specialized Knowledge in Plant & Ag Sciences). ' +
          'At least 2 of the 5 must have a GDEV prefix.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['GDEV 2300', 'GDEV 3400'],
          ['PLSCI 4730'],
          foundationalPlantAndAgSciences,
          socialEconomicAndHealth,
          [
            ...foundationalPlantAndAgSciences,
            ...specializedPlantAndAgSciences,
            ...socialEconomicAndHealth,
          ]
        ),
        perSlotMinCount: [1, 1, 2, 2, 1],
        slotNames: [
          'GDEV 2300 or GDEV 3400',
          'PLSCI 4730',
          'Foundational Plant & Ag Sciences',
          'Social, Economic & Health',
          'Elective from any list',
        ],
      },
      'Environment & Development': {
        description:
          '1 course from the Social Science list and 1 from the Biophysical Science list, plus 5 additional biophysical or social science courses ' +
          '(minimum 15 credits) from those lists or the additional electives list. At least 2 of the 5 must have a GDEV prefix.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          environmentSocialScience,
          environmentBiophysicalScience,
          [
            ...environmentSocialScience,
            ...environmentBiophysicalScience,
            ...environmentAdditionalElectives,
          ]
        ),
        perSlotMinCount: [1, 1, 5],
        slotNames: ['Social Science', 'Biophysical Science', 'Electives'],
      },
    },
  },
];

export default gdevRequirements;

export const gdevAdvisors: AdvisorGroup = {
  advisors: [{ name: 'John Sipple', email: 'jws28@cornell.edu' }],
};
