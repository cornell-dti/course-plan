import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const csIntroProgramming = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'])
  || courseMatchesCodeOptions(course, ['CS 2110', 'CS 2112'])
);

const csCore = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['CS 2800', 'CS 2802'])
  || courseMatchesCodeOptions(course, ['CS 3110'])
  || courseMatchesCodeOptions(course, ['CS 3410', 'CS 3420'])
  || courseMatchesCodeOptions(course, ['CS 4820'])
  || courseMatchesCodeOptions(course, ['CS 4410'])
);

const csPracticumOrProject = (course: Course): boolean => (
  courseMatchesCode(course, 'CS 4**1')
  || courseMatchesCode(course, 'CS 3152')
  || courseMatchesCode(course, 'CS 4152')
  || courseMatchesCode(course, 'CS 4154')
  || courseMatchesCode(course, 'CS 4740')
  || courseMatchesCode(course, 'CS 4752')
  || courseMatchesCode(course, 'CS 5150')
  || courseMatchesCode(course, 'CS 5152')
  || courseMatchesCode(course, 'CS 5412')
  || courseMatchesCode(course, 'CS 5414')
  || courseMatchesCode(course, 'CS 5431')
  || courseMatchesCode(course, 'CS 5625')
  || courseMatchesCode(course, 'CS 5643')
);

export default { csIntroProgramming, csCore, csPracticumOrProject };
