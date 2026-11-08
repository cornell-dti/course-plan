import { RequirementsJson } from '../requirements/types';
import universityRequirements from './university';
import calsRequirements, { calsAdvisors } from './colleges/ag';
import aapRequirements, { aapAdvisors } from './colleges/ar';
import casPreFA2020Requirements from './colleges/asPreFA2020';
import casFA2020Requirements, { casAdvisors } from './colleges/asFA2020';
import businessRequirements, { businessAdvisors } from './colleges/bu';
import engineeringRequirements, { engineeringAdvisors, engineeringMigrations } from './colleges/en';
import humanEcologyRequirements, { humanEcologyAdvisors } from './colleges/he';
import ilrRequirements, { ilrAdvisors } from './colleges/il';
import aemRequirements, { aemAdvisors } from './majors/aem';
import anthrRequirements, { anthrAdvisors } from './majors/anthr';
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
import csRequirements, { csAdvisors, csMigrations } from './majors/cs';
import deaRequirements, { deaAdvisors } from './majors/dea';
import easRequirements, { easAdvisors } from './majors/eas';
import economicsRequirements, { economicsAdvisors } from './majors/econ';
import eceRequirements, { eceAdvisors, eceMigrations } from './majors/ece';
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
import vienRequirements, { vienAdvisors } from './majors/vien';
import aerospaceMinorRequirements, { aerospaceMinorAdvisors } from './minors/aerospace';
import animalSciRequirements, { animalSciAdvisors } from './minors/animal-sci';
import aiMinorRequirements, { aiMinorAdvisors } from './minors/artificial-intelligence';
import appliedMathMinorRequirements, { appliedMathMinorAdvisors } from './minors/applied-math';
import buMinorRequirements, { buMinorAdvisors } from './minors/bu';
import cogsciMinorRequirements, { cogsciMinorAdvisors } from './minors/cogsci';
import csMinorRequirements, { csMinorAdvisors } from './minors/cs';
import dsMinorRequirements, { dsMinorAdvisors } from './minors/ds';
import dbmeMinorRequirements, { dbmeAdvisors } from './minors/dbme';
import deaMinorRequirements from './minors/dea';
import eceMinorRequirements, { eceMinorAdvisors } from './minors/ece';
import gameDesignMinorRequirements, { gameDesignMinorAdvisors } from './minors/game-design';
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
import appliedEconMinorRequirements, { appliedEconMinorAdvisors } from './minors/aem';
import earthAndAtmosphericSciencesMinorRequirements, {
  easMinorAdvisors,
} from './minors/earth-atmo';

import mpaRequirements, { mpaAdvisors } from './grad/mpa';

import { MATH2940, CHEM2080 } from './specializations/en';
import nsRequirements, { nsAdvisors } from './majors/ns';
import africanaRequirements, { africanaAdvisors } from './majors/africana';
import agsciRequirements, { agsciAdvisors } from './majors/agsci';
import amstRequirements, { amstAdvisors } from './majors/amst';
import animalsciRequirements, { animalsciAdvisors } from './majors/animalsci';
import archRequirements, { archAdvisors } from './majors/arch';
import arkeoRequirements, { arkeoAdvisors } from './majors/arkeo';
import artRequirements, { artAdvisors } from './majors/art';
import arthRequirements, { arthAdvisors } from './majors/arth';
import asianRequirements, { asianAdvisors } from './majors/asian';
import biometryRequirements, { biometryAdvisors } from './majors/biometry';
import capsRequirements, { capsAdvisors } from './majors/caps';
import classicsRequirements, { classicsAdvisors } from './majors/classics';
import cogsciRequirements, { cogsciAdvisors } from './majors/cogsci';
import complitRequirements, { complitAdvisors } from './majors/complit';
import entomRequirements, { entomAdvisors } from './majors/entom';
import fgssRequirements, { fgssAdvisors } from './majors/fgss';
import fiberScienceRequirements, { fiberScienceAdvisors } from './majors/fibersci';
import frenchRequirements, { frenchAdvisors } from './majors/french';
import gdevRequirements, { gdevAdvisors } from './majors/gdev';
import germanRequirements, { germanAdvisors } from './majors/german';
import gphsRequirements, { gphsAdvisors } from './majors/gphs';
import haudRequirements, { haudAdvisors } from './majors/haud';
import hbhsRequirements, { hbhsAdvisors } from './majors/hbhs';
import hcpRequirements, { hcpAdvisors } from './majors/hcp';
import ilrMajorRequirements, { ilrAdvisors as ilrMajorAdvisors } from './majors/ilr';
import italianRequirements, { italianAdvisors } from './majors/italian';
import jwstRequirements, { jwstAdvisors } from './majors/jwst';
import laRequirements, { laAdvisors } from './majors/la';
import lspRequirements, { lspAdvisors } from './majors/lsp';
import musicRequirements, { musicAdvisors } from './majors/music';
import nesRequirements, { nesAdvisors } from './majors/nes';
import philosophyRequirements, { philosophyAdvisors } from './majors/philosophy';
import plantsciRequirements, { plantsciAdvisors } from './majors/plantsci';
import pmaRequirements, { pmaAdvisors } from './majors/pma';
import pubpolRequirements, { pubpolAdvisors } from './majors/pubpol';
import relstRequirements, { relstAdvisors } from './majors/relst';
import sociologyRequirements, { sociologyAdvisors } from './majors/sociology';
import stsciRequirements, { stsciAdvisors } from './majors/stsci';
import econILRMinorRequirements, { econILRMinorAdvisors } from './minors/econILR';

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
      name: 'Agriculture and Life Sciences (CALS)',
      requirements: calsRequirements,
      abbrev: 'CALS',
      advisors: calsAdvisors,
    },
    AR: {
      name: 'Architecture, Art and Planning (AAP)',
      requirements: aapRequirements,
      abbrev: 'AAP',
      advisors: aapAdvisors,
    },
    AS1: {
      name: 'Arts and Sciences (A&S) [before Fall 2020]',
      requirements: casPreFA2020Requirements,
      abbrev: 'A&S',
      advisors: casAdvisors,
    },
    AS2: {
      name: 'Arts and Sciences (A&S) [Fall 2020 and later]',
      requirements: casFA2020Requirements,
      abbrev: 'A&S',
      advisors: casAdvisors,
    },
    EN: {
      name: 'Engineering (ENG)',
      requirements: engineeringRequirements,
      advisors: engineeringAdvisors,
      migrations: engineeringMigrations,
      abbrev: 'CoE',
    },
    HE: {
      name: 'Human Ecology (CHE)',
      requirements: humanEcologyRequirements,
      abbrev: 'HumEc',
      advisors: humanEcologyAdvisors,
    },
    IL: {
      name: 'Industrial Labor Relations (ILR)',
      requirements: ilrRequirements,
      abbrev: 'ILR',
      advisors: ilrAdvisors,
    },
    BU: {
      name: 'SC Johnson College of Business (SHA, DYSON)',
      requirements: businessRequirements,
      abbrev: 'Business',
      advisors: businessAdvisors,
    },
  },
  major: {
    AEM: {
      name: 'Applied Economics and Management',
      schools: ['AG', 'BU'],
      requirements: aemRequirements,
      advisors: aemAdvisors,
      abbrev: 'AEM',
    },
    ANTHR: {
      name: 'Anthropology',
      schools: ['AS1', 'AS2'],
      requirements: anthrRequirements,
      advisors: anthrAdvisors,
      abbrev: 'Anthr',
    },
    AS: {
      name: 'Atmospheric Science',
      schools: ['AG'],
      requirements: asRequirements,
      advisors: asAdvisors,
      abbrev: 'AtmoSci',
    },
    ASTRO: {
      name: 'Astronomy',
      schools: ['AS1', 'AS2'],
      requirements: astroRequrements,
      advisors: astroAdvisors,
      abbrev: 'Astro',
    },
    BIO: {
      name: 'Biological Sciences',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bioRequirements,
      advisors: bioAdvisors,
      abbrev: 'BioSci',
    },
    BSOC: {
      name: 'Biology and Society',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: bsocRequirements,
      advisors: bioAdvisors,
      abbrev: 'BioSoc',
    },
    BME: {
      name: 'Biomedical Engineering',
      schools: ['EN'],
      requirements: biomedicalEngineeringRequirements,
      advisors: biomedicalEngineeringAdvisors,
      abbrev: 'BME',
    },
    BE: {
      name: 'Biological Engineering',
      schools: ['EN'],
      requirements: bioEngineeringRequirements,
      advisors: bioEngineeringAdvisors,
      abbrev: 'BioEng',
    },
    CE: {
      name: 'Civil Engineering',
      schools: ['EN'],
      requirements: civilRequirements,
      advisors: civilAdvisors,
      abbrev: 'CivilEng',
    },
    CHEM: {
      name: 'Chemistry',
      schools: ['AS1', 'AS2'],
      requirements: chemRequirements,
      advisors: chemAdvisors,
      abbrev: 'Chem',
    },
    CHEME: {
      name: 'Chemical and Biomolecular Engineering',
      schools: ['EN'],
      requirements: chemERequirements,
      advisors: chemEAdvisors,
      abbrev: 'ChemE',
    },
    COMM: {
      name: 'Communication',
      schools: ['AG'],
      requirements: commRequirements,
      advisors: commAdvisors,
      abbrev: 'Comm',
    },
    CRP: {
      name: 'City and Regional Planning',
      schools: ['AR'],
      requirements: crpRequirements,
      advisors: crpAdvisors,
      abbrev: 'CRP',
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csRequirements,
      specializations: [MATH2940, CHEM2080],
      advisors: csAdvisors,
      migrations: csMigrations,
      abbrev: 'CS',
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaRequirements,
      advisors: deaAdvisors,
      abbrev: 'D+EA',
    },
    EAS: {
      name: 'Earth and Atmospheric Sciences',
      schools: ['AG', 'AS1', 'AS2', 'EN'],
      requirements: easRequirements,
      advisors: easAdvisors,
      abbrev: 'EAS',
    },
    ECON: {
      name: 'Economics',
      schools: ['AS1', 'AS2'],
      requirements: economicsRequirements,
      advisors: economicsAdvisors,
      abbrev: 'Econ',
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceRequirements,
      advisors: eceAdvisors,
      migrations: eceMigrations,
      abbrev: 'ECE',
    },
    ENGL: {
      name: 'English',
      schools: ['AS1', 'AS2'],
      requirements: englishRequirements,
      advisors: englishAdvisors,
      abbrev: 'English',
    },
    ENV: {
      name: 'Environmental Engineering',
      schools: ['EN'],
      requirements: envEngineeringRequirements,
      advisors: envEngineeringAdvisors,
      abbrev: 'EnvEng',
    },
    ESS: {
      name: 'Environment and Sustainability',
      schools: ['AG', 'AS1', 'AS2'],
      requirements: essRequirements,
      advisors: essAdvisors,
      abbrev: 'ESS',
    },
    EP: {
      name: 'Engineering Physics',
      schools: ['EN'],
      requirements: epRequirements,
      advisors: epAdvisors,
      abbrev: 'EngPhys',
    },
    FSAD: {
      name: 'Fashion Design',
      schools: ['HE'],
      requirements: fashionDesignRequirements,
      advisors: fashionDesignAdvisors,
      abbrev: 'Fashion',
    },
    FDSC: {
      name: 'Food Science',
      schools: ['AG'],
      requirements: foodSciRequirements,
      advisors: foodSciAdvisors,
      abbrev: 'FoodSci',
    },
    GOVT: {
      name: 'Government',
      schools: ['AS1', 'AS2'],
      requirements: governmentRequirements,
      advisors: governmentAdvisors,
      abbrev: 'Gov',
    },
    HADM: {
      name: 'Hotel Administration',
      schools: ['BU'],
      requirements: hotelAdminRequirements,
      advisors: hotelAdminAdvisors,
      abbrev: 'Hotel',
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdRequirements,
      advisors: hdAdvisors,
      abbrev: 'HumanDev',
    },
    HIST: {
      name: 'History',
      schools: ['AS1', 'AS2'],
      requirements: historyRequirements,
      advisors: historyAdvisors,
      abbrev: 'History',
    },
    INFO: {
      name: 'Information Science',
      schools: ['AS1', 'AG', 'AS2'],
      requirements: infoRequirements,
      advisors: infoAdvisors,
      abbrev: 'InfoSci',
    },
    ISST1: {
      name: 'Information Science, Systems, and Technology [before Fall 2020]',
      schools: ['EN'],
      requirements: oldIsstRequirements,
      advisors: isstAdvisors,
      abbrev: 'ISST',
    },
    ISST2: {
      name: 'Information Science, Systems, and Technology [Fall 2020 and after]',
      schools: ['EN'],
      requirements: isstRequirements,
      advisors: isstAdvisors,
      abbrev: 'ISST',
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingRequirements,
      advisors: lingAdvisors,
      abbrev: 'Ling',
    },
    MATH: {
      name: 'Math',
      schools: ['AS1', 'AS2'],
      requirements: mathRequirements,
      advisors: mathAdvisors,
      abbrev: 'Math',
    },
    ME: {
      name: 'Mechanical Engineering',
      schools: ['EN'],
      requirements: mechanicalEngineeringRequirements,
      advisors: mechanicalEngineeringAdvisors,
      abbrev: 'MechE',
    },
    MSE: {
      name: 'Materials Science & Engineering',
      schools: ['EN'],
      requirements: mseRequirements,
      advisors: mseAdvisors,
      abbrev: 'MSE',
    },
    NS: {
      name: 'Nutritional Sciences',
      schools: ['AG', 'HE'],
      requirements: nsRequirements,
      advisors: nsAdvisors,
      abbrev: 'NS',
    },
    ORIE: {
      name: 'Operations Research and Engineering',
      schools: ['EN'],
      requirements: orieRequirements,
      advisors: orieAdvisors,
      abbrev: 'ORIE',
    },
    PAM: {
      name: 'Policy Analysis and Management',
      schools: ['HE'],
      requirements: pamRequirements,
      advisors: pamAdvisors,
      abbrev: 'PAM',
    },
    PHYS: {
      name: 'Physics',
      schools: ['AS1', 'AS2'],
      requirements: physRequirements,
      advisors: physAdvisors,
      abbrev: 'Physics',
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS1', 'AS2'],
      requirements: psychRequirements,
      advisors: psychAdvisors,
      abbrev: 'Psych',
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishRequirements,
      advisors: spanishAdvisors,
      abbrev: 'Spanish',
    },
    STS: {
      name: 'Science & Technology Studies',
      schools: ['AS1', 'AS2'],
      requirements: stsRequirements,
      advisors: stsAdvisors,
      abbrev: 'STS',
    },
    VIEN: {
      name: 'Viticulture and Enology',
      schools: ['AG'],
      requirements: vienRequirements,
      advisors: vienAdvisors,
      abbrev: 'VIEN',
    },
    AFRICANA: {
      name: 'Africana Studies',
      schools: ['AS1', 'AS2'],
      requirements: africanaRequirements,
      advisors: africanaAdvisors,
      abbrev: 'Africana',
    },
    AGSCI: {
      name: 'Agricultural Sciences',
      schools: ['AG'],
      requirements: agsciRequirements,
      advisors: agsciAdvisors,
      abbrev: 'Ag Sciences',
    },
    AMST: {
      name: 'American Studies',
      schools: ['AS1', 'AS2'],
      requirements: amstRequirements,
      advisors: amstAdvisors,
      abbrev: 'AmSt',
    },
    ANSC: {
      name: 'Animal Science',
      schools: ['AG'],
      requirements: animalsciRequirements,
      advisors: animalsciAdvisors,
      abbrev: 'Animal Science',
    },
    ARCH: {
      name: 'Architecture',
      schools: ['AR'],
      requirements: archRequirements,
      advisors: archAdvisors,
      abbrev: 'B.Arch',
    },
    ARKEO: {
      name: 'Archaeology',
      schools: ['AS1', 'AS2'],
      requirements: arkeoRequirements,
      advisors: arkeoAdvisors,
      abbrev: 'Archaeology',
    },
    ART: {
      name: 'Fine Arts',
      schools: ['AR'],
      requirements: artRequirements,
      advisors: artAdvisors,
      abbrev: 'Art (BFA)',
    },
    ARTH: {
      name: 'History of Art',
      schools: ['AS1', 'AS2'],
      requirements: arthRequirements,
      advisors: arthAdvisors,
      abbrev: 'Art History',
    },
    ASIAN: {
      name: 'Asian Studies',
      schools: ['AS1', 'AS2'],
      requirements: asianRequirements,
      advisors: asianAdvisors,
      abbrev: 'Asian',
    },
    BTRY: {
      name: 'Statistics & Biometry',
      schools: ['AG'],
      requirements: biometryRequirements,
      advisors: biometryAdvisors,
      abbrev: 'Stats & Biometry',
    },
    CAPS: {
      name: 'China and Asia-Pacific Studies',
      schools: ['AS1', 'AS2'],
      requirements: capsRequirements,
      advisors: capsAdvisors,
      abbrev: 'CAPS',
    },
    CLASSICS: {
      name: 'Classics',
      schools: ['AS1', 'AS2'],
      requirements: classicsRequirements,
      advisors: classicsAdvisors,
      abbrev: 'Classics',
    },
    COGSCI: {
      name: 'Cognitive Science',
      schools: ['AS1', 'AS2'],
      requirements: cogsciRequirements,
      advisors: cogsciAdvisors,
      abbrev: 'Cog Sci',
    },
    COML: {
      name: 'Comparative Literature',
      schools: ['AS1', 'AS2'],
      requirements: complitRequirements,
      advisors: complitAdvisors,
      abbrev: 'Comp Lit',
    },
    ENTOM: {
      name: 'Entomology',
      schools: ['AG'],
      requirements: entomRequirements,
      advisors: entomAdvisors,
      abbrev: 'Entomology',
    },
    FGSS: {
      name: 'Feminist, Gender, & Sexuality Studies',
      schools: ['AS1', 'AS2'],
      requirements: fgssRequirements,
      advisors: fgssAdvisors,
      abbrev: 'FGSS',
    },
    FIBERSCI: {
      name: 'Fiber Science',
      schools: ['HE'],
      requirements: fiberScienceRequirements,
      advisors: fiberScienceAdvisors,
      abbrev: 'Fiber Sci',
    },
    FRENCH: {
      name: 'French',
      schools: ['AS1', 'AS2'],
      requirements: frenchRequirements,
      advisors: frenchAdvisors,
      abbrev: 'French',
    },
    GDEV: {
      name: 'Global Development',
      schools: ['AG'],
      requirements: gdevRequirements,
      advisors: gdevAdvisors,
      abbrev: 'Global Dev',
    },
    GERMAN: {
      name: 'German Studies',
      schools: ['AS1', 'AS2'],
      requirements: germanRequirements,
      advisors: germanAdvisors,
      abbrev: 'German',
    },
    GPHS: {
      name: 'Global & Public Health Sciences',
      schools: ['AG', 'HE'],
      requirements: gphsRequirements,
      advisors: gphsAdvisors,
      abbrev: 'GPHS',
    },
    HAUD: {
      name: 'History of Architecture and Urban Development',
      schools: ['AR'],
      requirements: haudRequirements,
      advisors: haudAdvisors,
      abbrev: 'HAUD',
    },
    HBHS: {
      name: 'Human Biology, Health, and Society',
      schools: ['HE'],
      requirements: hbhsRequirements,
      advisors: hbhsAdvisors,
      abbrev: 'HBHS',
    },
    HCP: {
      name: 'Health Care Policy',
      schools: ['HE'],
      requirements: hcpRequirements,
      advisors: hcpAdvisors,
      abbrev: 'HCP',
    },
    ILR: {
      name: 'Industrial and Labor Relations',
      schools: ['IL'],
      requirements: ilrMajorRequirements,
      advisors: ilrMajorAdvisors,
      abbrev: 'ILR',
    },
    ITALIAN: {
      name: 'Italian',
      schools: ['AS1', 'AS2'],
      requirements: italianRequirements,
      advisors: italianAdvisors,
      abbrev: 'Italian',
    },
    JWST: {
      name: 'Jewish Studies',
      schools: ['AS1', 'AS2'],
      requirements: jwstRequirements,
      advisors: jwstAdvisors,
      abbrev: 'Jewish Studies',
    },
    LA: {
      name: 'Landscape Architecture',
      schools: ['AG'],
      requirements: laRequirements,
      advisors: laAdvisors,
      abbrev: 'Landscape Arch',
    },
    LSP: {
      name: 'Latina/o Studies',
      schools: ['AS1', 'AS2'],
      requirements: lspRequirements,
      advisors: lspAdvisors,
      abbrev: 'Latina/o Studies',
    },
    MUSIC: {
      name: 'Music',
      schools: ['AS1', 'AS2'],
      requirements: musicRequirements,
      advisors: musicAdvisors,
      abbrev: 'Music',
    },
    NES: {
      name: 'Near Eastern Studies',
      schools: ['AS1', 'AS2'],
      requirements: nesRequirements,
      advisors: nesAdvisors,
      abbrev: 'NES',
    },
    PHIL: {
      name: 'Philosophy',
      schools: ['AS1', 'AS2'],
      requirements: philosophyRequirements,
      advisors: philosophyAdvisors,
      abbrev: 'Philosophy',
    },
    PLSCI: {
      name: 'Plant Sciences',
      schools: ['AG'],
      requirements: plantsciRequirements,
      advisors: plantsciAdvisors,
      abbrev: 'Plant Sci',
    },
    PMA: {
      name: 'Performing and Media Arts',
      schools: ['AS1', 'AS2'],
      requirements: pmaRequirements,
      advisors: pmaAdvisors,
      abbrev: 'PMA',
    },
    PUBPOL: {
      name: 'Public Policy',
      schools: ['AS1', 'AS2', 'HE'],
      requirements: pubpolRequirements,
      advisors: pubpolAdvisors,
      abbrev: 'Public Policy',
    },
    RELST: {
      name: 'Religious Studies',
      schools: ['AS1', 'AS2'],
      requirements: relstRequirements,
      advisors: relstAdvisors,
      abbrev: 'Religious Studies',
    },
    SOC: {
      name: 'Sociology',
      schools: ['AS1', 'AS2'],
      requirements: sociologyRequirements,
      advisors: sociologyAdvisors,
      abbrev: 'Sociology',
    },
    STSCI: {
      name: 'Statistical Science',
      schools: ['AS1', 'AS2'],
      requirements: stsciRequirements,
      advisors: stsciAdvisors,
      abbrev: 'Stat Sci',
    },
  },
  minor: {
    AEROSPACE: {
      name: 'Aerospace Engineering',
      schools: ['EN'],
      requirements: aerospaceMinorRequirements,
      advisors: aerospaceMinorAdvisors,
      abbrev: 'AeroEng',
    },
    ANIMALSCIENCE: {
      name: 'Animal Science',
      schools: ['AG'],
      requirements: animalSciRequirements,
      advisors: animalSciAdvisors,
      abbrev: 'AnimalSci',
    },
    AI: {
      name: 'Artificial Intelligence',
      schools: ['AS1', 'AS2'],
      requirements: aiMinorRequirements,
      advisors: aiMinorAdvisors,
      abbrev: 'AI',
    },
    APPLIEDECON: {
      name: 'Applied Economics',
      schools: ['AG', 'BU'],
      requirements: appliedEconMinorRequirements,
      advisors: appliedEconMinorAdvisors,
      abbrev: 'AppliedEcon',
    },
    APPLIEDMATH: {
      name: 'Applied Mathematics',
      schools: ['EN'],
      requirements: appliedMathMinorRequirements,
      advisors: appliedMathMinorAdvisors,
      abbrev: 'AppliedMath',
    },
    BU: {
      name: 'Business',
      schools: ['BU'],
      requirements: buMinorRequirements,
      advisors: buMinorAdvisors,
      abbrev: 'Business',
    },
    COGSCI: {
      name: 'Cognitive Science',
      schools: ['AS1', 'AS2'],
      requirements: cogsciMinorRequirements,
      advisors: cogsciMinorAdvisors,
      abbrev: 'CogSci',
    },
    CS: {
      name: 'Computer Science',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: csMinorRequirements,
      advisors: csMinorAdvisors,
      abbrev: 'CS',
    },
    DS: {
      name: 'Data Science',
      schools: ['EN', 'AG', 'AS2'],
      requirements: dsMinorRequirements,
      advisors: dsMinorAdvisors,
    },
    DBME: {
      name: 'Dyson Business Minor for Engineers',
      schools: ['BU'],
      requirements: dbmeMinorRequirements,
      advisors: dbmeAdvisors,
      abbrev: 'DBME',
    },
    DEA: {
      name: 'Design and Environmental Analysis',
      schools: ['HE'],
      requirements: deaMinorRequirements,
      advisors: deaAdvisors,
      abbrev: 'D+EA',
    },
    EAS: {
      name: 'Earth and Atmospheric Sciences',
      schools: ['EN', 'AG'],
      requirements: earthAndAtmosphericSciencesMinorRequirements,
      advisors: easMinorAdvisors,
      abbrev: 'EAS',
    },
    ECE: {
      name: 'Electrical and Computer Engineering',
      schools: ['EN'],
      requirements: eceMinorRequirements,
      advisors: eceMinorAdvisors,
      abbrev: 'ECE',
    },
    ECONILR: {
      name: 'Economics [ILR]',
      schools: ['IL'],
      requirements: econILRMinorRequirements,
      advisors: econILRMinorAdvisors,
      abbrev: 'EconILR',
    },
    GAMEDESIGN: {
      name: 'Game Design',
      schools: ['EN', 'AS1', 'AS2'],
      requirements: gameDesignMinorRequirements,
      advisors: gameDesignMinorAdvisors,
    },
    HP: {
      name: 'Health Policy',
      schools: ['HE'],
      requirements: hpMinorRequirements,
      advisors: hpMinorAdvisors,
      abbrev: 'HealthPol',
    },
    HD: {
      name: 'Human Development',
      schools: ['HE'],
      requirements: hdMinorRequirements,
      advisors: hdMinorAdvisors,
      abbrev: 'HumanDev',
    },
    INEQ: {
      name: 'Inequality Studies',
      schools: ['AS1', 'AS2'],
      requirements: inequalityRequirements,
      advisors: inequalityAdvisors,
      abbrev: 'IneqStudies',
    },
    ISST: {
      name: 'Information Science [Engineering]',
      schools: ['EN'],
      requirements: infoENMinorRequirements,
      advisors: infoENMinorAdvisors,
      abbrev: 'ISST',
    },
    LING: {
      name: 'Linguistics',
      schools: ['AS1', 'AS2'],
      requirements: lingMinorRequirements,
      advisors: lingMinorAdvisors,
      abbrev: 'Ling',
    },
    MATH: {
      name: 'Mathematics',
      schools: ['AS1', 'AS2'],
      requirements: mathMinorRequirements,
      advisors: mathMinorAdvisors,
      abbrev: 'Math',
    },
    ORMS: {
      name: 'Operations Research and Management Science',
      schools: ['EN'],
      requirements: ormsMinorRequirements,
      advisors: ormsMinorAdvisors,
      abbrev: 'ORMS',
    },
    POLICY: {
      name: 'Public Policy',
      schools: ['AS1', 'AS2'],
      requirements: policyMinorRequirements,
      advisors: policyMinorAdvisors,
      abbrev: 'PublicPolicy',
    },
    PSYCH: {
      name: 'Psychology',
      schools: ['AS1', 'AS2'],
      requirements: psychMinorRequirements,
      advisors: psychMinorAdvisors,
      abbrev: 'Psych',
    },
    ROBOTICS: {
      name: 'Robotics',
      schools: ['EN'],
      requirements: roboticsMinorRequirements,
      advisors: roboticsMinorAdvisors,
      abbrev: 'Robotics',
    },
    SPAN: {
      name: 'Spanish',
      schools: ['AS1', 'AS2'],
      requirements: spanishMinorRequirements,
      advisors: spanishMinorAdvisors,
      abbrev: 'Spanish',
    },
  },
  grad: {
    /* TODO add back after undergrad-grad constraints are implemented
    MENGCS: {
      name: 'MEng in Computer Science',
      schools: ['EN'],
      requirements: mengCSRequirements,
      abbrev: 'CS MEng'
    },
    */
    MPA: {
      name: 'Master of Public Administration (MPA) Program',
      schools: ['HE'],
      requirements: mpaRequirements,
      advisors: mpaAdvisors,
      abbrev: 'MPA',
    },
  },
};

export const colleges = ['AG', 'AR', 'AS1', 'AS2', 'EN', 'HE', 'IL', 'BU'] as const;
export type College = typeof colleges[number];
export default json;

/** Get the abbreviation associated with a specified college */
export const getCollegeAbbrev = (collegeCode: string): string =>
  json.college[collegeCode]?.abbrev ?? collegeCode;

export const getMajorAbbrev = (majorCode: string): string =>
  json.major[majorCode]?.abbrev ?? majorCode;

export const getMinorAbbrev = (minorCode: string): string =>
  json.minor[minorCode]?.abbrev ?? minorCode;

export const getGradAbbrev = (gradCode: string): string => json.grad[gradCode].abbrev ?? gradCode;
