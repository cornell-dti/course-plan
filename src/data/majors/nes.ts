import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const nesRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Course',
    description:
      'All NES majors are required to take NES 4560 Theory and Method in Near Eastern Studies, offered every spring semester. ' +
      'Students are encouraged to take this course as early in their academic career as possible. ' +
      'This course cannot count toward the temporal breadth requirement.',
    source: 'https://catalog.cornell.edu/programs/near-eastern-studies-ba/',
    checker: includesWithSubRequirements(['NES 4560']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['NES 4560'],
  },
  {
    name: 'Credit Requirement',
    description:
      'A minimum of 30 credits is required to complete the NES major. ' +
      'Middle Eastern language courses not being used to fulfill the NES language requirement may count toward the major. ' +
      'A maximum of two independent studies can be applied to the major, and students may petition for a maximum of two ' +
      'non-cross-listed Cornell courses on Middle East-related topics. Up to 12 credits of departmentally approved coursework ' +
      'taken overseas or at another university may be applied to the major.',
    source: 'https://catalog.cornell.edu/programs/near-eastern-studies-ba/',
    checker: includesWithSingleRequirement('NES ****'),
    checkerWarning:
      'We do not check additional Near Eastern language courses, petitioned non-cross-listed courses, or transfer credit.',
    fulfilledBy: 'credits',
    perSlotMinCount: [30],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Language Requirement',
    description:
      'All NES majors must graduate with at least a functional knowledge of one Middle Eastern language (equivalent to two years of study). ' +
      'Students who begin a modern Middle Eastern language at Cornell, or test into a beginning- or intermediate-level class, ' +
      'must complete the fourth semester of the language sequence: ARAB 2202, HEBRW 2100, PERSN 2322, or TURK 2332. ' +
      'Ancient languages, such as Akkadian, Ancient Egyptian, and Biblical Hebrew, may also fulfill the requirement. ' +
      'In exceptional cases, students may complete one year each of two Middle Eastern languages, ancient or modern.',
    source: 'https://catalog.cornell.edu/programs/near-eastern-studies-ba/',
    checker: includesWithSingleRequirement('ARAB 2202', 'HEBRW 2100', 'PERSN 2322', 'TURK 2332'),
    checkerWarning:
      'We only check the fourth-semester modern language courses. Ancient languages and the two-language option are not checked.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Fourth-Semester Language Course'],
  },
  {
    name: 'Temporal Breadth Requirement',
    description:
      'Students must complete at least one course that fulfills each of the following three chronological periods: ' +
      'Before 600 CE; 600 CE to 1800 CE; 1800 CE to the present. NES 4560 cannot count toward this requirement. ' +
      'Students are encouraged to consult with their advisor if they have questions about courses that span multiple periods.',
    source: 'https://catalog.cornell.edu/programs/near-eastern-studies-ba/',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Letter Grade Requirement',
    description:
      'All courses for the major must be taken for a letter grade and students must receive a grade of B- or better ' +
      'in order for a course to count toward the major. No course may be used to satisfy two requirements.',
    source: 'https://catalog.cornell.edu/programs/near-eastern-studies-ba/',
    fulfilledBy: 'self-check',
  },
];

export default nesRequirements;

export const nesAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Jonny Robert Lawrence', email: 'jrl395@cornell.edu' }],
};
