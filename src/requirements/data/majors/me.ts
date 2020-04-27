import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const mechnicalEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distriubtions',
    description: 'ENGRD 2020',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSingleRequirement('ENGRD 2020'),
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Required Major Courses',
    description: 'MAE 2210, MAE 2030, MAE 2250, MAE 3230, MAE 3240, MAE 3260, MAE 3270, (MAE 3780, ENGRD 2100, or PHYS 3360), MAE 4272, and MAE 4300',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSubRequirements(
      ['MAE 2210'],
      ['MAE 2030'],
      ['MAE 2250'],
      ['MAE 3230'],
      ['MAE 3240'],
      ['MAE 3260'],
      ['MAE 3270'],
      ['MAE 3780', 'ENGRD 2100', 'PHYS 3360'],
      ['MAE 4272'],
      ['MAE 4300']
    ),
    fulfilledBy: 'courses',
    minCount: 10
  },
  {
    name: 'M.E. Major Electives',
    description: 'A list of approved Major-approved Electives is available online at www.mae.cornell.edu',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: null,
    fulfilledBy: 'self-check'
  },
  {
    name: 'MAE 4xx1: Supervised Senior Design Experience',
    description: 'Can be satisfied by independent research, project team, or by designated senior design formal course, MAE 4xx1.',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: null,
    fulfilledBy: 'self-check'
  },
  {
    name: 'Mathematics Elective:',
    description: 'Must be an upper-level mathematics course, which includes statistics, taken after Math 2940. A list of approved math electives is available online at www.mae.cornell.edu',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSingleRequirement(
      'MAE 3100',
      'ENGRD 2700',
      'CEE 3040',
      'ENGRD 3200',
      'ENGRD 3100',
      'BTRY 3010',
      'CS 2800'
    ),
    fulfilledBy: 'credits',
    minCount: 3
  },
  {
    name: 'Technical Elective',
    description: 'A Technical Elective includes technical courses at an appropriate level, '
      + 'chosen from engineering (2000+), mathematics (beyond 2940), science (beyond Physics 2214), chemistry (2080, or beyond 2090), or biological sciences. '
      + 'Most 2000+ technical level courses in engineering will be accepted. '
      + '(Note: Engineering economic, business, management, financial, or organization courses will not be accepted, with the exception of MAE 4610.). '
      + 'The following 1000-level courses in biology are accepted: BIOG 1440; BIOG 1445; BIOMG 1350; BIOEE 1610; and BIOSM 1610. '
      + 'In addition, credit for advanced placement biology and technical courses at the 2000+ level in biological sciences are accepted.',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: null,
    fulfilledBy: 'self-check'
  },
  {
    name: 'Major-approved Elective',
    description: 'A list of approved Major-approved Electives is available online at www.mae.cornell.edu',
    source: 'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: null,
    fulfilledBy: 'self-check'
  }
];

export default mechnicalEngineeringRequirements;
