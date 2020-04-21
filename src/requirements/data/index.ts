import { RequirementsJson } from '../types';
import universityRequirements from './university';
import calsRequirements from './colleges/ag';
import aapRequirements from './colleges/ar';
import casRequirements from './colleges/as';
import businessRequirements from './colleges/bu';
import engineeringRequirements from './colleges/en';
import humanEcologyRequirements from './colleges/he';
import irlRequirements from './colleges/il';
import aemRequirements from './majors/aem';
import bioEngineeringRequirements from './majors/be';
import csRequirements from './majors/cs';
import economicsRequirements from './majors/econ';
import englishRequirements from './majors/engl';
import governmentRequirements from './majors/govt';
import hotelAdminRequirements from './majors/hadm';
import historyRequirements from './majors/hist';
import infoRequirements from './majors/info';
import isstRequirements from './majors/isst';
import mechnicalEngineeringRequirements from './majors/me';
import orieRequirements from './majors/orie';

const json: RequirementsJson = {
  university: {
    value: 'UNI',
    name: 'University',
    requirements: universityRequirements
  },
  college: {
    AG: {
      name: 'Agriculture and Life Sciences',
      requirements: calsRequirements
    },
    AR: {
      name: 'Architecture, Art and Planning',
      requirements: aapRequirements
    },
    AS: {
      name: 'Arts and Sciences',
      requirements: casRequirements
    },
    EN: {
      name: 'Engineering',
      requirements: engineeringRequirements
    },
    HE: {
      name: 'Human Ecology',
      requirements: humanEcologyRequirements
    },
    IL: {
      name: 'Industrial Labor Relations',
      requirements: irlRequirements
    },
    BU: {
      name: 'SC Johnson College of Business',
      requirements: businessRequirements
    }
  },
  major: {
    AEM: {
      name: 'Applied Economics and Management',
      schools: ['AG', 'BU'],
      requirements: aemRequirements
    },
    BE: {
      name: 'Biological Engineering',
      schools: ['EN'],
      requirements: bioEngineeringRequirements
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS'],
      requirements: csRequirements
    },
    ECON: {
      name: 'Economics',
      schools: ['AS'],
      requirements: economicsRequirements
    },
    ENGL: {
      name: 'English',
      schools: ['AS'],
      requirements: englishRequirements
    },
    GOVT: {
      name: 'Government',
      schools: ['AS'],
      requirements: governmentRequirements
    },
    HADM: {
      name: 'Hotel Administration',
      schools: ['BU'],
      requirements: hotelAdminRequirements
    },
    HIST: {
      name: 'History',
      schools: ['AS'],
      requirements: historyRequirements
    },
    INFO: {
      name: 'Information Science',
      schools: ['AS', 'AG'],
      requirements: infoRequirements
    },
    ISST: {
      name: 'Information Science, Systems, and Technology',
      schools: ['EN'],
      requirements: isstRequirements
    },
    ME: {
      name: 'Mechanical Engineering',
      schools: ['EN'],
      requirements: mechnicalEngineeringRequirements
    },
    ORIE: {
      name: 'Operations Research and Engineering',
      schools: ['EN'],
      requirements: orieRequirements
    }
  }
};

export default json;
