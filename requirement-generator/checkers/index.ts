import { Checkers } from './types';
import checkersCollegeAG from './checkers-college-ag';
import checkersCollegeAR from './checkers-college-ar';
import checkersCollegeAS from './checkers-college-as';
import checkersCollegeBU from './checkers-college-bu';
import checkersCollegeEN from './checkers-college-en';
import checkersCollegeHE from './checkers-college-he';
import checkersCollegeIL from './checkers-college-il';
import checkersMajorAEM from './checkers-major-aem';
import checkersMajorBE from './checkers-major-be';
import checkersMajorCS from './checkers-major-cs';
import checkersMajorECON from './checkers-major-econ';
import checkersMajorENGL from './checkers-major-engl';
import checkersMajorGOVT from './checkers-major-govt';
import checkersMajorHADM from './checkers-major-hadm';
import checkersMajorHIST from './checkers-major-hist';
import checkersMajorINFO from './checkers-major-info';
import checkersMajorISST from './checkers-major-isst';
import checkersMajorME from './checkers-major-me';
import checkersMajorORIE from './checkers-major-orie';

const checkers: Checkers = {
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

export default checkers;
