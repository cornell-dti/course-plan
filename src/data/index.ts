import { RequirementsJson } from '../requirements/types';
import universityRequirements from './university';
import calsRequirements, { calsAdvisors } from './colleges/ag';
import aapRequirements, { aapAdvisors } from './colleges/ar';
import casPreFA2020Requirements from './colleges/asPreFA2020';
import casFA2020Requirements, { casAdvisors } from './colleges/asFA2020';
import businessRequirements, { businessAdvisors } from './colleges/bu';
import engineeringRequirements, { engineeringAdvisors } from './colleges/en';
import humanEcologyRequirements, { humanEcologyAdvisors } from './colleges/he';
import ilrRequirements, { ilrAdvisors } from './colleges/il';
import aemRequirements, { aemAdvisors } from './majors/aem';
import asRequirements, { asAdvisors } from './majors/as';
import astroRequrements, { astroAdvisors } from './majors/astro';
import bioRequirements, { bioAdvisors } from './majors/bio';
import bioEngineeringRequirements, { bioEngineeringAdvisors } from './majors/be';
import bsocRequirements from './majors/bsoc';
import biomedicalEngineeringRequirements, { biomedicalEngineeringAdvisors } from './majors/bme';
import chemRequirements, { chemAdvisors } from './majors/chem';
import chemERequirements, { chemEAdvisors } from './majors/chemE';
import civilRequirements, { civilAdvisors } from './majors/ce';
import commRequirements, { commAdvisors } from './majors/comm';
import crpRequirements, { crpAdvisors } from './majors/crp';
import csRequirements, { csAdvisors } from './majors/cs';
import deaRequirements, { deaAdvisors } from './majors/dea';
import easRequirements, { easAdvisors } from './majors/eas';
import economicsRequirements, { economicsAdvisors } from './majors/econ';
import eceRequirements, { eceAdvisors } from './majors/ece';
import essRequirements, { essAdvisors } from './majors/ess';
import englishRequirements, { englishAdvisors } from './majors/engl';
import envEngineeringRequirements, { envEngineeringAdvisors } from './majors/envE';
import epRequirements, { epAdvisors } from './majors/ep';
import fashionDesignRequirements, { fashionDesignAdvisors } from './majors/fsad';
import foodSciRequirements, { foodSciAdvisors } from './majors/foodsci';
import governmentRequirements, { governmentAdvisors } from './majors/govt';
import hdRequirements, { hdAdvisors } from './majors/hd';
import hotelAdminRequirements, { hotelAdminAdvisors } from './majors/hadm';
import historyRequirements, { historyAdvisors } from './majors/hist';
import infoRequirements, { infoAdvisors } from './majors/info';
import isstRequirements, { isstAdvisors } from './majors/isst';
import lingRequirements, { lingAdvisors } from './majors/ling';
import mathRequirements, { mathAdvisors } from './majors/math';
import mechanicalEngineeringRequirements, { mechanicalEngineeringAdvisors } from './majors/me';
import mseRequirements, { mseAdvisors } from './majors/mse';
import oldIsstRequirements from './majors/oldIsst';
import orieRequirements, { orieAdvisors } from './majors/orie';
import pamRequirements, { pamAdvisors } from './majors/pam';
import physRequirements, { physAdvisors } from './majors/phys';
import spanishRequirements, { spanishAdvisors } from './majors/spanish';
import psychRequirements, { psychAdvisors } from './majors/psych';
import stsRequirements, { stsAdvisors } from './majors/sts';
import appliedEconMinorRequirements, { appliedEconMinorAdvisors } from './minors/aem';
import aerospaceMinorRequirements, { aerospaceMinorAdvisors } from './minors/aerospace';
import appliedMathMinorRequirements, { appliedMathMinorAdvisors } from './minors/applied-math';
import buMinorRequirements, { buMinorAdvisors } from './minors/bu';
import cogsciMinorRequirements, { cogsciMinorAdvisors } from './minors/cogsci';
import csMinorRequirements, { csMinorAdvisors } from './minors/cs';
import dbmeMinorRequirements, { dbmeAdvisors } from './minors/dbme';
import deaMinorRequirements from './minors/dea';
import eceMinorRequirements, { eceMinorAdvisors } from './minors/ece';
import gamedesignMinorRequirements, { gamedesignMinorAdvisors } from './minors/gamedesign';
import hpMinorRequirements, { hpMinorAdvisors } from './minors/hp';
import hdMinorRequirements, { hdMinorAdvisors } from './minors/hd';
import inequalityRequirements, { inequalityAdvisors } from './minors/ineq';
import infoENMinorRequirements, { infoENMinorAdvisors } from './minors/infoEN';
import lingMinorRequirements, { lingMinorAdvisors } from './minors/ling';
import mathMinorRequirements, { mathMinorAdvisors } from './minors/math';
import ormsMinorRequirements, { ormsMinorAdvisors } from './minors/orms';
import policyMinorRequirements, { policyMinorAdvisors } from './minors/policy';
import psychMinorRequirements, { psychMinorAdvisors } from './minors/psych';
import roboticsMinorRequirements, { roboticsMinorAdvisors } from './minors/robotics';
import spanishMinorRequirements, { spanishMinorAdvisors } from './minors/spanish';

// import mengCSRequirements from './grad/meng-cs';
import mpaRequirements, { mpaAdvisors } from './grad/mpa';

import { MATH2940, CHEM2080 } from './specializations/en';
import earthAndAtmosphericSciencesMinorRequirements, {
  easMinorAdvisors,
} from './minors/earth-atmo';

const json: RequirementsJson = {
  university: {
    UNI: {
      name: 'University',
      requirements: universityRequirements,
      abbrev: 'other',
    },
  },
  college: {
    AG: {
      name: 'Agriculture and Life Sciences',
      requirements: calsRequirements,
      abbrev: 'cals',
      advisors: calsAdvisors,
    },
    AR: {
      name: 'Architecture, Art and Planning',
      requirements: aapRequirements,
      abbrev: 'aap',
      advisors: aapAdvisors,
    },
    AS1: {
      name: 'Arts and Sciences [before Fall 2020]',
      requirements: casPreFA2020Requirements,
      abbrev: 'cas',
      advisors: casAdvisors,
    },
    AS2: {
      name: 'Arts and Sciences [Fall 2020 and later]',
      requirements: casFA2020Requirements,
      abbrev: 'cas',
      advisors: casAdvisors,
    },
    EN: {
      name: 'Engineering',
      requirements: engineeringRequirements,
      advisors: engineeringAdvisors,
      abbrev: 'eng',
    },
    HE: {
      name: 'Human Ecology',
      requirements: humanEcologyRequirements,
      abbrev: 'humec',
      advisors: humanEcologyAdvisors,
    },
    IL: {
      name: 'Industrial Labor Relations',
      requirements: ilrRequirements,
      abbrev: 'ilr',
      advisors: ilrAdvisors,
    },
    BU: {
      name: 'SC Johnson College of Business',
      requirements: businessRequirements,
      abbrev: 'johnson',
      advisors: businessAdvisors,
    },
  },
  major: {
    AEM: {
      name: 'Applied Economics and Management',
      schools: ['AG', 'BU'],
      requirements: aemRequirements,
      advisors: aemAdvisors,
    },
    AS: {
      name: 'Atmospheric Science',
      schools: ['AG'],
      requirements: asRequirements,
      advisors: asAdvisors,
    },
    ASTRO: {
      name: 'Astronomy',
      schools: ['AS1', 'AS2'],
      requirements: astroRequrements,
      advisors: astroAdvisors,
    },
    BIO: {
      name: 'Biological Sciences',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bioRequirements,
      advisors: bioAdvisors,
    },
    BSOC: {
      name: 'Biology and Society',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bsocRequirements,
      advisors: bioAdvisors,
    },
    BME: {
      name: 'Biomedical Engineering',
      schools: ['EN'],
      requirements: biomedicalEngineeringRequirements,
      advisors: biomedicalEngineeringAdvisors,
    },
    BE: {
      name: 'Biological Engineering',
      schools: ['EN'],
      requirements: bioEngineeringRequirements,
      advisors: bioEngineeringAdvisors,
    },
    CE: {
      name: 'Civil Engineering',
      schools: ['EN'],
      requirements: civilRequirements,
      advisors: civilAdvisors,
    },
    CHEM: {
      name: 'Chemistry',
      schools: ['AS1', 'AS2'],
      requirements: chemRequirements,
      advisors: chemAdvisors,
    },
    CHEME: {
      name: 'Chemical and Biomolecular Engineering',
      schools: ['EN'],
      requirements: chemERequirements,
      advisors: chemEAdvisors,
    },
    COMM: {
      name: 'Communication',
      schools: ['AG'],
      requirements: commRequirements,
      advisors: commAdvisors,
    },
    CRP: {
      name: 'City and Regional Planning',
      schools: ['AR'],
      requirements: crpRequirements,
      advisors: crpAdvisors,
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csRequirements,
      specializations: [MATH2940, CHEM2080],
      advisors: csAdvisors,
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaRequirements,
      advisors: deaAdvisors,
    },
    EAS: {
      name: 'Earth and Atmospheric Sciences',
      schools: ['AG', 'AS1', 'AS2', 'EN'],
      requirements: easRequirements,
      advisors: easAdvisors,
    },
    ECON: {
      name: 'Economics',
      schools: ['AS1', 'AS2'],
      requirements: economicsRequirements,
      advisors: economicsAdvisors,
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceRequirements,
      advisors: eceAdvisors,
    },
    ENGL: {
      name: 'English',
      schools: ['AS1', 'AS2'],
      requirements: englishRequirements,
      advisors: englishAdvisors,
    },
    ENV: {
      name: 'Environmental Engineering',
      schools: ['EN'],
      requirements: envEngineeringRequirements,
      advisors: envEngineeringAdvisors,
    },
    ESS: {
      name: 'Environment and Sustainability',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: essRequirements,
      advisors: essAdvisors,
    },
    EP: {
      name: 'Engineering Physics',
      schools: ['EN'],
      requirements: epRequirements,
      advisors: epAdvisors,
    },
    FSAD: {
      name: 'Fashion Design',
      schools: ['HE'],
      requirements: fashionDesignRequirements,
      advisors: fashionDesignAdvisors,
    },
    FDSC: {
      name: 'Food Science',
      schools: ['AG'],
      requirements: foodSciRequirements,
      advisors: foodSciAdvisors,
    },
    GOVT: {
      name: 'Government',
      schools: ['AS1', 'AS2'],
      requirements: governmentRequirements,
      advisors: governmentAdvisors,
    },
    HADM: {
      name: 'Hotel Administration',
      schools: ['BU'],
      requirements: hotelAdminRequirements,
      advisors: hotelAdminAdvisors,
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdRequirements,
      advisors: hdAdvisors,
    },
    HIST: {
      name: 'History',
      schools: ['AS1', 'AS2'],
      requirements: historyRequirements,
      advisors: historyAdvisors,
    },
    INFO: {
      name: 'Information Science',
      schools: ['AS1', 'AG', 'AS2'],
      requirements: infoRequirements,
      advisors: infoAdvisors,
    },
    ISST1: {
      name: 'Information Science, Systems, and Technology [before Fall 2020]',
      schools: ['EN'],
      requirements: oldIsstRequirements,
      advisors: isstAdvisors,
    },
    ISST2: {
      name: 'Information Science, Systems, and Technology [Fall 2020 and after]',
      schools: ['EN'],
      requirements: isstRequirements,
      advisors: isstAdvisors,
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingRequirements,
      advisors: lingAdvisors,
    },
    MATH: {
      name: 'Math',
      schools: ['AS1', 'AS2'],
      requirements: mathRequirements,
      advisors: mathAdvisors,
    },
    ME: {
      name: 'Mechanical Engineering',
      schools: ['EN'],
      requirements: mechanicalEngineeringRequirements,
      advisors: mechanicalEngineeringAdvisors,
    },
    MSE: {
      name: 'Materials Science & Engineering',
      schools: ['EN'],
      requirements: mseRequirements,
      advisors: mseAdvisors,
    },
    ORIE: {
      name: 'Operations Research and Engineering',
      schools: ['EN'],
      requirements: orieRequirements,
      advisors: orieAdvisors,
    },
    PAM: {
      name: 'Policy Analysis and Management',
      schools: ['HE'],
      requirements: pamRequirements,
      advisors: pamAdvisors,
    },
    PHYS: {
      name: 'Physics',
      schools: ['AS1', 'AS2'],
      requirements: physRequirements,
      advisors: physAdvisors,
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS1', 'AS2'],
      requirements: psychRequirements,
      advisors: psychAdvisors,
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishRequirements,
      advisors: spanishAdvisors,
    },
    STS: {
      name: 'Science & Technology Studies',
      schools: ['AS1', 'AS2'],
      requirements: stsRequirements,
      advisors: stsAdvisors,
    },
  },
  minor: {
    APPLIEDECON: {
      name: 'Applied Economics',
      schools: ['AG', 'BU'],
      requirements: appliedEconMinorRequirements,
      advisors: appliedEconMinorAdvisors,
    },
    AEROSPACE: {
      name: 'Aerospace Engineering',
      schools: ['EN'],
      requirements: aerospaceMinorRequirements,
      advisors: aerospaceMinorAdvisors,
    },
    APPLIEDMATH: {
      name: 'Applied Mathematics',
      schools: ['EN'],
      requirements: appliedMathMinorRequirements,
      advisors: appliedMathMinorAdvisors,
    },
    BU: {
      name: 'Business',
      schools: ['BU'],
      requirements: buMinorRequirements,
      advisors: buMinorAdvisors,
    },
    COGSCI: {
      name: 'Cognitive Science',
      schools: ['AS1', 'AS2'],
      requirements: cogsciMinorRequirements,
      advisors: cogsciMinorAdvisors,
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csMinorRequirements,
      advisors: csMinorAdvisors,
    },
    DBME: {
      name: 'Dyson Business Minor for Engineers',
      schools: ['BU'],
      requirements: dbmeMinorRequirements,
      advisors: dbmeAdvisors,
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaMinorRequirements,
      advisors: deaAdvisors,
    },
    EAS: {
      name: 'Earth and Atmospheric Sciences',
      schools: ['EN', 'AG'],
      requirements: earthAndAtmosphericSciencesMinorRequirements,
      advisors: easMinorAdvisors,
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceMinorRequirements,
      advisors: eceMinorAdvisors,
    },
    GAMEDESIGN: {
      name: 'Game Design',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: gamedesignMinorRequirements,
      advisors: gamedesignMinorAdvisors,
    },
    HP: {
      name: 'Health Policy',
      schools: ['HE'],
      requirements: hpMinorRequirements,
      advisors: hpMinorAdvisors,
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdMinorRequirements,
      advisors: hdMinorAdvisors,
    },
    INEQ: {
      name: 'Inequality Studies',
      schools: ['AS1', 'AS2'],
      requirements: inequalityRequirements,
      advisors: inequalityAdvisors,
    },
    ISST: {
      name: 'Information Science [Engineering]',
      schools: ['EN'],
      requirements: infoENMinorRequirements,
      advisors: infoENMinorAdvisors,
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingMinorRequirements,
      advisors: lingMinorAdvisors,
    },
    MATH: {
      name: 'Mathematics',
      schools: ['AS1', 'AS2'],
      requirements: mathMinorRequirements,
      advisors: mathMinorAdvisors,
    },
    ORMS: {
      name: 'Operations Research and Management Science',
      schools: ['EN'],
      requirements: ormsMinorRequirements,
      advisors: ormsMinorAdvisors,
    },
    POLICY: {
      name: 'Public Policy',
      schools: ['AS1', 'AS2'],
      requirements: policyMinorRequirements,
      advisors: policyMinorAdvisors,
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS1', 'AS2'],
      requirements: psychMinorRequirements,
      advisors: psychMinorAdvisors,
    },
    ROBOTICS: {
      name: 'Robotics',
      schools: ['EN'],
      requirements: roboticsMinorRequirements,
      advisors: roboticsMinorAdvisors,
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishMinorRequirements,
      advisors: spanishMinorAdvisors,
    },
  },
  grad: {
    /* TODO add back after undergrad-grad constraints are implemented
    MENGCS: {
      name: 'MEng in Computer Science',
      schools: ['EN'],
      requirements: mengCSRequirements,
    },
    */
    MPA: {
      name: 'Master of Public Administration (MPA) Program',
      schools: ['HE'],
      requirements: mpaRequirements,
      advisors: mpaAdvisors,
    },
  },
};

export const colleges = ['AG', 'AR', 'AS1', 'AS2', 'EN', 'HE', 'IL', 'BU'] as const;
export type College = typeof colleges[number];
export default json;

/** Get the abbreviation associated with a specified college */
export const getCollegeAbbrev = (collegeCode: string): string =>
  json.college[collegeCode]?.abbrev ?? 'other';
