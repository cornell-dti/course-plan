import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';

const totalAcademicCreditsRequirement: CollegeOrMajorRequirement = {
  name: 'Total Academic Credits',
  description:
    '120 academic credits are required for graduation. ' +
    'A minimum of 100 credits must be in courses for which a letter grade was recieved. ' +
    'PE courses do not count.',
  source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11561',
  checker: (course: Course): boolean => !['PE'].includes(course.subject),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 120,
  allowCourseDoubleCounting: true,
};

const calsCreditsRequirement: CollegeOrMajorRequirement = {
  name: 'CALS Credits',
  description:
    '55 CALS credits are required for graduation. ' +
    'CALS credits include all courses from departments within CALS and courses offered in Applied Economics and Management, ' +
    'Biological Sciences, Biology & Society, Earth and Atmospheric Sciences, Environment and Sustainability, Information Science, Nutritional Science, ' +
    'and The Department of Statistics and Data Science.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements',
  checker: (course: Course): boolean =>
    ['AG'].includes(course.acadGroup) ||
    [
      'AEM',
      'BIOEE',
      'BIOMG',
      'BIOMI',
      'BIONB',
      'BSOC',
      'EAS',
      'ESS',
      'INFO',
      'NS',
      'STSCI',
    ].includes(course.subject),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 55,
  allowCourseDoubleCounting: true,
};

const calsIntroductoryLifeSciencesOrBiologyRequirement: CollegeOrMajorRequirement = {
  name: 'Introductory Life Sciences/Biology',
  description:
    'At least six academic credits from the list of courses that fulfill distribution requirements.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: includesWithSingleRequirement(
    'ANSC 1100',
    'BIOAP 1100',
    'BIOEE 1180',
    'BIOEE 1560',
    'BIOEE 1610',
    'BIOEE 1780',
    'BIOEE 2070',
    'BIOEE 2526',
    'BIOG 1106',
    'BIOG 1140',
    'BIOG 1191',
    'BIOG 1440',
    'BIOG 1445',
    'BIOG 1500',
    'BIOMG 1150',
    'BIOMG 1290',
    'BIOMG 1350',
    'BIOMI 1100',
    'BIOPL 1120',
    'BIOPL 1130',
    'BIOPL 2400',
    'BIOPL 2410',
    'BIOPL 2490',
    'BIOSM 1500',
    'BIOSM 1551',
    'BIOSM 1610',
    'BIOSM 1650',
    'BIOSM 1780',
    'CSS 1120',
    'EAS 1560',
    'ENTOM 2011',
    'ENTOM 2020',
    'ENTOM 2030',
    'FDSC 2204',
    'HORT 1115',
    'HORT 2204',
    'PLBIO 1130',
    'PLBIO 2100',
    'PLBIO 2400',
    'PLBIO 2410',
    'PLBIO 2450',
    'PLBIO 2470',
    'PLBIO 2490',
    'PLBRG 2010',
    'PLHRT 1115',
    'PLHRT 2204',
    'PLPA 2013',
    'PLPA 2015',
    'PLPA 2900',
    'PLPPM 2013',
    'PLPPM 2015',
    'PLPPM 2900',
    'PLSCI 1115',
    'PLSCI 1150',
    'PLSCI 1300',
    'PLSCI 1420',
    'PLSCI 4190',
    'PLSCS 1120',
    'STS 2871',
    'VIEN 2204'
  ),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 6,
};

const calsChemistryOrPhysicsRequiement: CollegeOrMajorRequirement = {
  name: 'Chemistry/Physics',
  description:
    'Complete a minimum of three academic credits of chemistry or physics. ' +
    'Includes all Cornell courses with the CHEM or PHYS prefix at Cornell (excluding courses that are supplemental, independent study, research, TA, internship, and First-Year Writing Seminar).',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: (course: Course): boolean => ['CHEM', 'CHEME', 'PHYS'].includes(course.subject),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 3,
};

const calsQuantitativeLiteracyRequirement: CollegeOrMajorRequirement = {
  name: 'Quantitative Literacy',
  description:
    'This requirement can be satisfied by earning a score of 4 or 5 on the AP Calculus exam or a score of 5 on the AP Statistics exam, ' +
    'or transfer an approved calculus or statistics course with a minimum letter grade of “C” or better; or take an approved calculus or statistics course at Cornell.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: includesWithSingleRequirement(
    'AEM 2100',
    'BTRY 3010',
    'BTRY 3020',
    'CEE 3040',
    'CRP 3210',
    'ENTOM 3030',
    'HADM 2010',
    'ILRST 2100',
    'MATH 1105',
    'MATH 1106',
    'MATH 1110',
    'MATH 1220',
    'MATH 1340',
    'MATH 1350',
    'MATH 1710',
    'MATH 1910',
    'MATH 1920',
    'MATH 2130',
    'MATH 2210',
    'MATH 2220',
    'MATH 2230',
    'MATH 2240',
    'MATH 2310',
    'MATH 2930',
    'MATH 2940',
    'MATH 3040',
    'MATH 3110',
    'MATH 3210',
    'MATH 3320',
    'MATH 3360',
    'MATH 4130',
    'MATH 4140',
    'MATH 4180',
    'MATH 4200',
    'MATH 4250',
    'MATH 4280',
    'MATH 4310',
    'MATH 4320',
    'MATH 4330',
    'MATH 4340',
    'MATH 4370',
    'MATH 4530',
    'MATH 4540',
    'MATH 4710',
    'MATH 4720',
    'NTRES 3130',
    'PAM 2100',
    'PSYCH 2500',
    'PSYCH 3500',
    'SOC 3010',
    'SOC 6010',
    'STSCI 2100',
    'STSCI 2150',
    'STSCI 2200'
  ),
  operator: 'or',
  fulfilledBy: 'courses',
  minCount: 1,
};

const calsSocialSciencesAndHumanitiesRequiement: CollegeOrMajorRequirement = {
  name: 'Social Sciences and Humanities',
  description:
    'Students must complete four courses of 3 or more credits each from the following seven categories of courses in the humanities and social sciences. ' +
    'At least one course category MUST be completed in three different categories. ' +
    'No more than two courses in the same department will be counted toward the distribution requirement.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: (course: Course): boolean =>
    ['CA', 'D', 'FL', 'HA', 'KCM', 'LA', 'SBA'].some(
      distribution => course.catalogDistr?.includes(distribution) ?? false
    ),
  operator: 'and',
  fulfilledBy: 'courses',
  minCount: 3,
};

const calsHumanDiversityRequirement: CollegeOrMajorRequirement = {
  name: 'Social Sciences and Humanities: Human Diversity (D)',
  description: 'One course must be in the Human Diversity (D) category.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: (course: Course): boolean => course.catalogDistr?.includes('D-') ?? false,
  operator: 'or',
  fulfilledBy: 'courses',
  minCount: 1,
};

const calsWrittenAndOralExpressionRequirement: CollegeOrMajorRequirement = {
  name: 'Written and Oral Expression',
  description:
    '9 credits total, of which at least six must be in written expression. ' +
    'Oral expression is not required by the college, but may be required for some majors. ' +
    'If not required, all nine credits may be in written expression. Writing in the Majors courses do not count towards the writing requirement.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: (course: Course): boolean =>
    ['written expression', 'oral expression', 'First-Year Writing Seminar'].some(
      keyword => course.catalogSatisfiesReq?.includes(keyword) ?? false
    ),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 9,
};

const calsWrittenExpressionRequirement: CollegeOrMajorRequirement = {
  name: 'Written Expression',
  description: 'At least six credits must be in written expression.',
  source:
    'https://cals.cornell.edu/undergraduate-students/student-services/degree-requirements/graduation-requirements/distribution-requirements',
  checker: (course: Course): boolean =>
    ['written expression', 'First-Year Writing Seminar'].some(
      keyword => course.catalogSatisfiesReq?.includes(keyword) ?? false
    ),
  operator: 'or',
  fulfilledBy: 'credits',
  minCount: 6,
};

const calsRequirements: readonly CollegeOrMajorRequirement[] = [
  totalAcademicCreditsRequirement,
  calsCreditsRequirement,
  calsIntroductoryLifeSciencesOrBiologyRequirement,
  calsChemistryOrPhysicsRequiement,
  calsQuantitativeLiteracyRequirement,
  calsSocialSciencesAndHumanitiesRequiement,
  calsHumanDiversityRequirement,
  calsWrittenAndOralExpressionRequirement,
  calsWrittenExpressionRequirement,
];

export default calsRequirements;
