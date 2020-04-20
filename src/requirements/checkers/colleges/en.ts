import { Course } from '../../types';
import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const engineeringMathematics = includesWithSubRequirements(
  ['MATH 1910'],
  ['MATH 1920'],
  ['MATH 2930', 'MATH 2940']
);

const engineeringPhysics = includesWithSubRequirements(
  ['PHYS 1112'],
  ['PHYS 2213']
);

const engineeringChemistry = includesWithSingleRequirement('CHEM 2090');

const engineeringFWS = courseIsFWS;

const engineeringComputing = includesWithSingleRequirement(
  'CS 1110',
  'CS 1112',
  'CS 1114',
  'CS 1115'
);

const engineeringENGRI = (course: Course): boolean => course.subject === 'ENGRI';

const engineeringDistribution = (course: Course): boolean => course.subject === 'ENGRD';

const engineeringLiberalArts = (course: Course): boolean => (
  ['CA', 'HA', 'LA/LAD', 'KCM', 'SBA', 'FL', 'CE'].some(
    distribution => course.catalogDistr?.includes(distribution) ?? false
  )
);

export default {
  engineeringMathematics,
  engineeringPhysics,
  engineeringChemistry,
  engineeringFWS,
  engineeringComputing,
  engineeringENGRI,
  engineeringDistribution,
  engineeringLiberalArts
};
