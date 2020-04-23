"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const university_1 = __importDefault(require("./university"));
const ag_1 = __importDefault(require("./colleges/ag"));
const ar_1 = __importDefault(require("./colleges/ar"));
const as_1 = __importDefault(require("./colleges/as"));
const bu_1 = __importDefault(require("./colleges/bu"));
const en_1 = __importDefault(require("./colleges/en"));
const he_1 = __importDefault(require("./colleges/he"));
const il_1 = __importDefault(require("./colleges/il"));
const aem_1 = __importDefault(require("./majors/aem"));
const be_1 = __importDefault(require("./majors/be"));
const cs_1 = __importDefault(require("./majors/cs"));
const econ_1 = __importDefault(require("./majors/econ"));
const engl_1 = __importDefault(require("./majors/engl"));
const govt_1 = __importDefault(require("./majors/govt"));
const hadm_1 = __importDefault(require("./majors/hadm"));
const hist_1 = __importDefault(require("./majors/hist"));
const info_1 = __importDefault(require("./majors/info"));
const isst_1 = __importDefault(require("./majors/isst"));
const me_1 = __importDefault(require("./majors/me"));
const orie_1 = __importDefault(require("./majors/orie"));
const json = {
    university: {
        value: 'UNI',
        name: 'University',
        requirements: university_1.default
    },
    college: {
        AG: {
            name: 'Agriculture and Life Sciences',
            requirements: ag_1.default
        },
        AR: {
            name: 'Architecture, Art and Planning',
            requirements: ar_1.default
        },
        AS: {
            name: 'Arts and Sciences',
            requirements: as_1.default
        },
        EN: {
            name: 'Engineering',
            requirements: en_1.default
        },
        HE: {
            name: 'Human Ecology',
            requirements: he_1.default
        },
        IL: {
            name: 'Industrial Labor Relations',
            requirements: il_1.default
        },
        BU: {
            name: 'SC Johnson College of Business',
            requirements: bu_1.default
        }
    },
    major: {
        AEM: {
            name: 'Applied Economics and Management',
            schools: ['AG', 'BU'],
            requirements: aem_1.default
        },
        BE: {
            name: 'Biological Engineering',
            schools: ['EN'],
            requirements: be_1.default
        },
        CS: {
            name: 'Computer Science',
            schools: ['EN', 'AS'],
            requirements: cs_1.default
        },
        ECON: {
            name: 'Economics',
            schools: ['AS'],
            requirements: econ_1.default
        },
        ENGL: {
            name: 'English',
            schools: ['AS'],
            requirements: engl_1.default
        },
        GOVT: {
            name: 'Government',
            schools: ['AS'],
            requirements: govt_1.default
        },
        HADM: {
            name: 'Hotel Administration',
            schools: ['BU'],
            requirements: hadm_1.default
        },
        HIST: {
            name: 'History',
            schools: ['AS'],
            requirements: hist_1.default
        },
        INFO: {
            name: 'Information Science',
            schools: ['AS', 'AG'],
            requirements: info_1.default
        },
        ISST: {
            name: 'Information Science, Systems, and Technology',
            schools: ['EN'],
            requirements: isst_1.default
        },
        ME: {
            name: 'Mechanical Engineering',
            schools: ['EN'],
            requirements: me_1.default
        },
        ORIE: {
            name: 'Operations Research and Engineering',
            schools: ['EN'],
            requirements: orie_1.default
        }
    }
};
exports.default = json;
