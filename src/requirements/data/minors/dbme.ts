import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const dbmeMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Microeconomics',
    description: 'ECON 1100 or ECON 3030 or HADM 1410 or PAM 2000',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement('ECON 1100', 'ECON 3030', 'HADM 1410', 'PAM 2000'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Introduction to basic business concepts',
    description:
      'Choose one: AEM 1200, AEM 2400, HADM 1810, HADM 2410, ENGRI 1270, ILRD 1700, NCC 5530, NCC 5580' +
      'ORIE 4152',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement(
      'AEM 1200',
      'AEM 2400',
      'HADM 1810',
      'HADM 2410',
      'ENGRI 1270',
      'ILRD 1700',
      'NCC 5530',
      'NCC 5580',
      'ORIE 4152'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  // TODO: restrictions + additional class for ORIE majors
  {
    name: 'Accounting principles',
    description: 'AEM 2210 or HADM 2230 or NCC 5500 or ORIE 3150',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement('AEM 2210', 'HADM 2230', 'NCC 5500', 'ORIE 3150'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Finance',
    description: 'AEM 2241/5241 OR HADM 2250 OR NCC 5560',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement('AEM 2241', 'AEM 5241', 'HADM 2250', 'NCC 5560'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Capstone course',
    description: 'AEM 4660',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement('AEM 4660'),
    fulfilledBy: 'credits',
    perSlotMinCount: [1.5],
  },
  {
    name: 'Career goals',
    description:
      'Choose a course that will expand your business management skills in a field of your choice from the following.',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business-engineers/',
    checker: includesWithSingleRequirement(
      'AEM 3230',
      'AEM 3360',
      'AEM 3370',
      'AEM 3390',
      'AEM 4140',
      'AEM 4150',
      'AEM 4210',
      'AEM 4230',
      'AEM 4260',
      'AEM 4280',
      'AEM 4290',
      'AEM 4520',
      'AEM 4570',
      'AEM 4590',
      'AEM 4670',
      'AEM 3220',
      'AEM 3249',
      'AEM 3251',
      'AEM 4380',
      'AEM 4390',
      'AEM 4450',
      'AEM 4615',
      'BEE 4890',
      'AEM 3100',
      'AEM 3120',
      'AEM 3200',
      'AEM 4300',
      'AEM 4400',
      'AEM 4421',
      'AEM 4450',
      'AEM 4560',
      'AEM 4610',
      'AEM 6720',
      'AEM 3440',
      'AEM 4060',
      'AEM 4080',
      'AEM 4120',
      'AEM 4160',
      'AEM 4190',
      'AEM 4300',
      'AEM 4550'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
];

export default dbmeMinorRequirements;

export const dbmeAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Jenny VanAtta', email: 'jmv86@cornell.edu' }],
};
