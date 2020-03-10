import { Checkers } from './types';
import checkersCollegeAG from './colleges/checkers-college-ag';
import checkersCollegeAR from './colleges/checkers-college-ar';
import checkersCollegeAS from './colleges/checkers-college-as';
import checkersCollegeBU from './colleges/checkers-college-bu';
import checkersCollegeEN from './colleges/checkers-college-en';
import checkersCollegeHE from './colleges/checkers-college-he';
import checkersCollegeIL from './colleges/checkers-college-il';
import checkersMajorAEM from './majors/checkers-major-aem';
import checkersMajorBE from './majors/checkers-major-be';
import checkersMajorCS from './majors/checkers-major-cs';
import checkersMajorECON from './majors/checkers-major-econ';
import checkersMajorENGL from './majors/checkers-major-engl';
import checkersMajorGOVT from './majors/checkers-major-govt';
import checkersMajorHADM from './majors/checkers-major-hadm';
import checkersMajorHIST from './majors/checkers-major-hist';
import checkersMajorINFO from './majors/checkers-major-info';
import checkersMajorISST from './majors/checkers-major-isst';
import checkersMajorME from './majors/checkers-major-me';
import checkersMajorORIE from './majors/checkers-major-orie';

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
