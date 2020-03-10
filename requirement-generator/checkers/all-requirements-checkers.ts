import { Checkers } from './types';
import checkersCollegeAG from './colleges/ag';
import checkersCollegeAR from './colleges/ar';
import checkersCollegeAS from './colleges/as';
import checkersCollegeBU from './colleges/bu';
import checkersCollegeEN from './colleges/en';
import checkersCollegeHE from './colleges/he';
import checkersCollegeIL from './colleges/il';
import checkersMajorAEM from './majors/aem';
import checkersMajorBE from './majors/be';
import checkersMajorCS from './majors/cs';
import checkersMajorECON from './majors/econ';
import checkersMajorENGL from './majors/engl';
import checkersMajorGOVT from './majors/govt';
import checkersMajorHADM from './majors/hadm';
import checkersMajorHIST from './majors/hist';
import checkersMajorINFO from './majors/info';
import checkersMajorISST from './majors/isst';
import checkersMajorME from './majors/me';
import checkersMajorORIE from './majors/orie';

/**
 * A object that contains all checkers for requirements.
 * To get a checker, do:
 *
 * ```typescript
 * import checkers from './all-requirements-checkers';
 *
 * const checker = checkers['name-of-your-checker'];
 * if (checker(course)) {
 *   // Course satisfies the requirement.
 *   // ...
 * }
 * ```
 */
const requirementCheckers: Checkers = {
  ...checkersCollegeAG,
  ...checkersCollegeAR,
  ...checkersCollegeAS,
  ...checkersCollegeBU,
  ...checkersCollegeEN,
  ...checkersCollegeHE,
  ...checkersCollegeIL,
  ...checkersMajorAEM,
  ...checkersMajorBE,
  ...checkersMajorCS,
  ...checkersMajorECON,
  ...checkersMajorENGL,
  ...checkersMajorGOVT,
  ...checkersMajorHADM,
  ...checkersMajorHIST,
  ...checkersMajorINFO,
  ...checkersMajorISST,
  ...checkersMajorME,
  ...checkersMajorORIE
};

export default requirementCheckers;
