import { RequirementsJson } from '../types';
import universityRequirements from './university';
import calsRequirements from './colleges/ag';
import aapRequirements from './colleges/ar';
import casPreFA2020Requirements from './colleges/asPreFA2020';
import casFA2020Requirements from './colleges/asFA2020';
import businessRequirements from './colleges/bu';
import engineeringRequirements from './colleges/en';
import humanEcologyRequirements from './colleges/he';
import ilrRequirements from './colleges/il';

import aemRequirements from './majors/aem';
import astroRequrements from './majors/astro';
import bioRequirements from './majors/bio';
import bioEngineeringRequirements from './majors/be';
import bsocRequirements from './majors/bsoc';
import biomedicalEngineeringRequirements from './majors/bme';
import chemERequirements from './majors/chemE';
import civilRequirements from './majors/ce';
import commRequirements from './majors/comm';
import crpRequirements from './majors/crp';
import csRequirements from './majors/cs';
import deaRequirements from './majors/dea';
import economicsRequirements from './majors/econ';
import eceRequirements from './majors/ece';
import essRequirements from './majors/ess';
import englishRequirements from './majors/engl';
import envEngineeringRequirements from './majors/envE';
import epRequirements from './majors/ep';
import foodSciRequirements from './majors/foodsci';
import governmentRequirements from './majors/govt';
import hdRequirements from './majors/hd';
import hotelAdminRequirements from './majors/hadm';
import historyRequirements from './majors/hist';
import infoRequirements from './majors/info';
import isstRequirements from './majors/isst';
import lingRequirements from './majors/ling';
import mathRequirements from './majors/math';
import mechnicalEngineeringRequirements from './majors/me';
import mseRequirements from './majors/mse';
import oldIsstRequirements from './majors/oldIsst';
import orieRequirements from './majors/orie';
import pamRequirements from './majors/pam';
import physRequirements from './majors/phys';
import spanishRequirements from './majors/spanish';
import stsRequirements from './majors/sts';

import aerospaceMinorRequirements from './minors/aerospace';
import appliedMathMinorRequirements from './minors/applied-math';
import buMinorRequirements from './minors/bu';
import cogsciMinorRequirements from './minors/cogsci';
import csMinorRequirements from './minors/cs';
import dbmeMinorRequirements from './minors/dbme';
import deaMinorRequirements from './minors/dea';
import eceMinorRequirements from './minors/ece';
import hpMinorRequirements from './minors/hp';
import hdMinorRequirements from './minors/hd';
import infoENMinorRequirements from './minors/infoEN';
import lingMinorRequirements from './minors/ling';
import mathMinorRequirements from './minors/math';
import ormsMinorRequirements from './minors/orms';
import policyMinorRequirements from './minors/policy';
import psychMinorRequirements from './minors/psych';
import roboticsMinorRequirements from './minors/robotics';
import spanishMinorRequirements from './minors/spanish';

const json: RequirementsJson = {
  university: {
    UNI: {
      name: 'University',
      requirements: universityRequirements,
    },
  },
  college: {
    AG: {
      name: 'Agriculture and Life Sciences',
      requirements: calsRequirements,
    },
    AR: {
      name: 'Architecture, Art and Planning',
      requirements: aapRequirements,
    },
    AS1: {
      name: 'Arts and Sciences [before Fall 2020]',
      requirements: casPreFA2020Requirements,
    },
    AS2: {
      name: 'Arts and Sciences [Fall 2020 and later]',
      requirements: casFA2020Requirements,
    },
    EN: {
      name: 'Engineering',
      requirements: engineeringRequirements,
    },
    HE: {
      name: 'Human Ecology',
      requirements: humanEcologyRequirements,
    },
    IL: {
      name: 'Industrial Labor Relations',
      requirements: ilrRequirements,
    },
    BU: {
      name: 'SC Johnson College of Business',
      requirements: businessRequirements,
    },
  },
  major: {
    AEM: {
      name: 'Applied Economics and Management',
      schools: ['AG', 'BU'],
      requirements: aemRequirements,
    },
    ASTRO: {
      name: 'Astronomy',
      schools: ['AS1', 'AS2'],
      requirements: astroRequrements,
    },
    BIO: {
      name: 'Biological Sciences',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bioRequirements,
    },
    BSOC: {
      name: 'Biology and Society',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bsocRequirements,
    },
    BME: {
      name: 'Biomedical Engineering',
      schools: ['EN'],
      requirements: biomedicalEngineeringRequirements,
    },
    BE: {
      name: 'Biological Engineering',
      schools: ['EN'],
      requirements: bioEngineeringRequirements,
    },
    CE: {
      name: 'Civil Engineering',
      schools: ['EN'],
      requirements: civilRequirements,
    },
    CHEME: {
      name: 'Chemical and Biomolecular Engineering',
      schools: ['EN'],
      requirements: chemERequirements,
    },
    COMM: {
      name: 'Communication',
      schools: ['AG'],
      requirements: commRequirements,
    },
    CRP: {
      name: 'City and Regional Planning',
      schools: ['AR'],
      requirements: crpRequirements,
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csRequirements,
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaRequirements,
    },
    ECON: {
      name: 'Economics',
      schools: ['AS1', 'AS2'],
      requirements: economicsRequirements,
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceRequirements,
    },
    ENGL: {
      name: 'English',
      schools: ['AS1', 'AS2'],
      requirements: englishRequirements,
    },
    ENV: {
      name: 'Environmental Engineering',
      schools: ['EN'],
      requirements: envEngineeringRequirements,
    },
    ESS: {
      name: 'Environment and Sustainability',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: essRequirements,
    },
    EP: {
      name: 'Engineering Physics',
      schools: ['EN'],
      requirements: epRequirements,
    },
    FDSC: {
      name: 'Food Science',
      schools: ['AG'],
      requirements: foodSciRequirements,
    },
    GOVT: {
      name: 'Government',
      schools: ['AS1', 'AS2'],
      requirements: governmentRequirements,
    },
    HADM: {
      name: 'Hotel Administration',
      schools: ['BU'],
      requirements: hotelAdminRequirements,
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdRequirements,
    },
    HIST: {
      name: 'History',
      schools: ['AS1', 'AS2'],
      requirements: historyRequirements,
    },
    INFO: {
      name: 'Information Science',
      schools: ['AS1', 'AG', 'AS2'],
      requirements: infoRequirements,
    },
    ISST1: {
      name: 'Information Science, Systems, and Technology [before Fall 2020]',
      schools: ['EN'],
      requirements: oldIsstRequirements,
    },
    ISST2: {
      name: 'Information Science, Systems, and Technology [Fall 2020 and after]',
      schools: ['EN'],
      requirements: isstRequirements,
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingRequirements,
    },
    MATH: {
      name: 'Math',
      schools: ['AS1', 'AS2'],
      requirements: mathRequirements,
    },
    ME: {
      name: 'Mechanical Engineering',
      schools: ['EN'],
      requirements: mechnicalEngineeringRequirements,
    },
    MSE: {
      name: 'Materials Science & Engineering',
      schools: ['EN'],
      requirements: mseRequirements,
    },
    ORIE: {
      name: 'Operations Research and Engineering',
      schools: ['EN'],
      requirements: orieRequirements,
    },
    PAM: {
      name: 'Policy Analysis and Management',
      schools: ['HE'],
      requirements: pamRequirements,
    },
    PHYS: {
      name: 'Physics',
      schools: ['AS1', 'AS2'],
      requirements: physRequirements,
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishRequirements,
    },
    STS: {
      name: 'Science & Technology Studies',
      schools: ['AS1', 'AS2'],
      requirements: stsRequirements,
    },
  },
  minor: {
    AEROSPACE: {
      name: 'Aerospace Engineering',
      schools: ['EN'],
      requirements: aerospaceMinorRequirements,
    },
    APPLIEDMATH: {
      name: 'Applied Mathematics',
      schools: ['EN'],
      requirements: appliedMathMinorRequirements,
    },
    BU: {
      name: 'Business',
      schools: ['BU'],
      requirements: buMinorRequirements,
    },
    COGSCI: {
      name: 'Cognitive Science',
      schools: ['AS1', 'AS2'],
      requirements: cogsciMinorRequirements,
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csMinorRequirements,
    },
    DBME: {
      name: 'Dyson Business Minor for Engineers',
      schools: ['BU'],
      requirements: dbmeMinorRequirements,
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaMinorRequirements,
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceMinorRequirements,
    },
    HP: {
      name: 'Human Policy',
      schools: ['HE'],
      requirements: hpMinorRequirements,
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdMinorRequirements,
    },
    ISST: {
      name: 'Information Science [Engineering]',
      schools: ['EN'],
      requirements: infoENMinorRequirements,
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingMinorRequirements,
    },
    MATH: {
      name: 'Mathematics',
      schools: ['AS1', 'AS2'],
      requirements: mathMinorRequirements,
    },
    ORMS: {
      name: 'Operations Research and Management Science',
      schools: ['EN'],
      requirements: ormsMinorRequirements,
    },
    POLICY: {
      name: 'Public Policy',
      schools: ['AS1', 'AS2'],
      requirements: policyMinorRequirements,
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS1', 'AS2'],
      requirements: psychMinorRequirements,
    },
    ROBOTICS: {
      name: 'Robotics',
      schools: ['EN'],
      requirements: roboticsMinorRequirements,
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishMinorRequirements,
    },
  },
};

export default json;
