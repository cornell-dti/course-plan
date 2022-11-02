import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  ifCodeMatch,
  includesWithSingleRequirement,
} from '../checkers-common';

const isAdvancedCSCourse = (course: Course): boolean =>
  ifCodeMatch(course.subject, 'CS') &&
  !(
    ifCodeMatch(course.catalogNbr, '1***') ||
    ifCodeMatch(course.catalogNbr, '2***') ||
    ifCodeMatch(course.catalogNbr, '3***') ||
    ifCodeMatch(course.catalogNbr, '4***')
  );

// not seminars, independent studies (CS 5999/7999), CS 5199, or project (CS 5999)
const isAdvancedAcademicCSCourse = (course: Course): boolean =>
  isAdvancedCSCourse(course) &&
  !(
    ifCodeMatch(course.catalogNbr, '5999') ||
    ifCodeMatch(course.catalogNbr, '5199') ||
    ifCodeMatch(course.catalogNbr, '7***')
  );

// non cs electives that are considered technical and advanced
// source: https://www.cs.cornell.edu/masters/academics/preapprovedcourses
// script: https://gist.github.com/benjamin-shen/557bfa3e61443dfd2caf75414666a1d3
const technicalAdvancedCourses: string[] = [
  'INFO 5240',
  'INFO 5301',
  'INFO 5321',
  'INFO 5355',
  'INFO 6120',
  'INFO 6140',
  'INFO 6400',
  'INFO 6130',
  'INFO 6230',
  'INFO 6648',
  'NBA 5070',
  'NBA 5150',
  'NBA 5380',
  'NBA 5410',
  'NBA 5640',
  'NBA 5690',
  'NBA 5770',
  'NBA 6010',
  'NBA 6120',
  'NBA 6130',
  'NBA 6920',
  'NBA 6921',
  'ORIE 5140',
  'ORIE 5300',
  'ORIE 5310',
  'ORIE 5350',
  'ORIE 5500',
  'ORIE 5510',
  'ORIE 5600',
  'ORIE 5610',
  'ORIE 5640',
  'ORIE 5740',
  'ORIE 5741',
  'ORIE 6500',
  'ORIE 6741',
  'ECE 5412',
  'ECE 5420',
  'ECE 5470',
  'ECE 5660',
  'ECE 5120',
  'ECE 5620',
  'ECE 5630',
  'ECE 5670',
  'ECE 5710',
  'ECE 5720',
  'ECE 5725',
  'ECE 5740',
  'ECE 5750',
  'ECE 5772',
  'ECE 5780',
  'CEE 5980',
  'CEE 5900',
  'CEE 5930',
  'MAE 5180',
  'MAE 5750',
  'MAE 5810',
  'STSCI 5065',
  'STSCI 5740',
  'ENGMT 5900',
  'ENGMT 5930',
  'ENGMT 5980',
  'BME 5780',
  'SYSEN 5400',
  'SYSEN 5860',
  'SYSEN 5880',
  'SYSEN 5888',
];

const mengCSRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Credits',
    description:
      'Any work that contributes to these 30 credits must begin after entering the M.Eng program. ' +
      'None of the 30 credits may be counted toward any other degree program. ' +
      'No more than 21 credits can be taken in one semester. ' +
      'At least 28 credits must be taken for a letter grade. ',
    source: 'https://www.cs.cornell.edu/masters/academics/preapprovedcourses',
    checker: [
      (course: Course): boolean =>
        isAdvancedCSCourse(course) || courseMatchesCodeOptions(course, technicalAdvancedCourses),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [30],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Project',
    description:
      '3 to 6 degree credits must be earned by completing an M.Eng Project. ' +
      'Project courses and practicum courses do not count as your M.Eng Project. ' +
      'Project grade must not be lower than a B to count towards project requirement.',
    source: 'https://www.cs.cornell.edu/masters/academics/projectinformation',
    checker: includesWithSingleRequirement('CS 5999'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Computer Science Courses',
    description:
      'At least 15 credits must come from Computer Science courses that are not ' +
      'Seminars, Independent Studies (CS 5999/7999), CS 5199, or M.Eng Project (CS 5999).',
    source: 'https://www.cs.cornell.edu/masters/academics/degreerequirements',
    checker: [isAdvancedAcademicCSCourse],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
];

export default mengCSRequirements;
