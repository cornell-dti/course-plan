"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
/**
 * A object that contains all checkers for requirements.
 * To get a checker, do:
 *
 * ```typescript
 * import checkers from './all-requirements-checkers';
 *
 * const checker = checkers['name-of-your-checker'];
 * ```
 *
 * A checker might be a function that you can directly call.
 *
 * ```typescript
 * if (checker(course)) {
 *   // Course satisfies the requirement.
 * }
 * ```
 *
 * Or it can be an array that represents checkers for all subrequirements:
 *
 * ```typescript
 * if (checker.all(oneChecker => oneChecker(course))) {
 *   // Course satisfies all sub-requirements.
 * }
 * ```
 */
const requirementCheckers = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ag_1.default), ar_1.default), as_1.default), bu_1.default), en_1.default), he_1.default), il_1.default), aem_1.default), be_1.default), cs_1.default), econ_1.default), engl_1.default), govt_1.default), hadm_1.default), hist_1.default), info_1.default), isst_1.default), me_1.default), orie_1.default);
exports.default = requirementCheckers;
