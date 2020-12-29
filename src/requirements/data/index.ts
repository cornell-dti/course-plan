import { RequirementsJson } from '../types';
import universityRequirements from './university';
import calsRequirements from './colleges/ag';
import aapRequirements from './colleges/ar';
import casRequirements from './colleges/as';
import businessRequirements from './colleges/bu';
import engineeringRequirements from './colleges/en';
import humanEcologyRequirements from './colleges/he';
import ilrRequirements from './colleges/il';

import aemRequirements from './majors/aem';
import bioRequirements from './majors/bio';
import bioEngineeringRequirements from './majors/be';
import biomedicalEngineeringRequirements from './majors/bme';
import chemERequirements from './majors/chemE';
import civilRequirements from './majors/ce';
import commRequirements from './majors/comm';
import crpRequirements from './majors/crp';
import csRequirements from './majors/cs';
import deaRequirements from './majors/dea';
import economicsRequirements from './majors/econ';
import englishRequirements from './majors/engl';
import governmentRequirements from './majors/govt';
import hotelAdminRequirements from './majors/hadm';
import historyRequirements from './majors/hist';
import infoRequirements from './majors/info';
import isstRequirements from './majors/isst';
import mechnicalEngineeringRequirements from './majors/me';
import orieRequirements from './majors/orie';

import buMinorRequirements from './minors/bu';
import cogsciMinorRequirements from './minors/cogsci';
import csMinorRequirements from './minors/cs';
import dbmeMinorRequirements from './minors/dbme';
import isstMinorRequirements from './minors/isst';
import mathMinorRequirements from './minors/math';
import ormsMinorRequirements from './minors/orms';
import psychMinorRequirements from './minors/psych';

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
    AS: {
      name: 'Arts and Sciences',
      requirements: casRequirements,
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
    BIO: {
      name: 'Biological Sciences',
      schools: ['AG', 'AS'],
      requirements: bioRequirements,
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
      schools: ['EN', 'AS'],
      requirements: csRequirements,
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaRequirements,
    },
    ECON: {
      name: 'Economics',
      schools: ['AS'],
      requirements: economicsRequirements,
    },
    ENGL: {
      name: 'English',
      schools: ['AS'],
      requirements: englishRequirements,
    },
    GOVT: {
      name: 'Government',
      schools: ['AS'],
      requirements: governmentRequirements,
    },
    HADM: {
      name: 'Hotel Administration',
      schools: ['BU'],
      requirements: hotelAdminRequirements,
    },
    HIST: {
      name: 'History',
      schools: ['AS'],
      requirements: historyRequirements,
    },
    INFO: {
      name: 'Information Science',
      schools: ['AS', 'AG'],
      requirements: infoRequirements,
    },
    ISST: {
      name: 'Information Science, Systems, and Technology',
      schools: ['EN'],
      requirements: isstRequirements,
    },
    ME: {
      name: 'Mechanical Engineering',
      schools: ['EN'],
      requirements: mechnicalEngineeringRequirements,
    },
    ORIE: {
      name: 'Operations Research and Engineering',
      schools: ['EN'],
      requirements: orieRequirements,
    },
  },
  minor: {
    BU: {
      name: 'Business',
      schools: ['BU'],
      requirements: buMinorRequirements,
    },
    COGSCI: {
      name: 'Cognitive Science',
      schools: ['AS'],
      requirements: cogsciMinorRequirements,
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS'],
      requirements: csMinorRequirements,
    },
    DBME: {
      name: 'Dyson Business Minor for Engineers',
      schools: ['BU'],
      requirements: dbmeMinorRequirements,
    },
    ISST: {
      name: 'Industrial Systems and Information Technology',
      schools: ['EN'],
      requirements: isstMinorRequirements,
    },
    MATH: {
      name: 'Applied Mathematics',
      schools: ['EN'],
      requirements: mathMinorRequirements,
    },
    ORMS: {
      name: 'Operations Research and Management Science',
      schools: ['EN'],
      requirements: ormsMinorRequirements,
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS'],
      requirements: psychMinorRequirements,
    },
  },
};

export default json;
