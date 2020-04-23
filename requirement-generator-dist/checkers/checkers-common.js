"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param courseName name of the course (as a code)
 * @param code code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
function ifCodeMatch(courseName, code) {
    for (let i = 0; i < courseName.length; i += 1) {
        if (code[i] !== '*' && courseName[i] !== code[i])
            return false;
    }
    return true;
}
exports.ifCodeMatch = ifCodeMatch;
/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param code code to check courseName (can contain * to denote any value)
 * @see ifCodeMatch
 * @returns if a code matches the course.
 */
exports.courseMatchesCode = (course, code) => (ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code));
/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param codeOptions a list of all satisfiable course code options.
 * @see courseMatchesCode
 * @returns if any code in `codeOptions` matches the course.
 */
exports.courseMatchesCodeOptions = (course, codeOptions) => (codeOptions.some(code => ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code)));
/**
 * Almost colleges have FWS requirements. Instead of writing them from scratch each time, call this
 * function.
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns if the course satisfies FWS requirement.
 */
exports.courseIsFWS = (course) => {
    var _a, _b;
    return (course.titleLong.includes('FWS:')
        || (_b = (_a = course.catalogSatisfiesReq) === null || _a === void 0 ? void 0 : _a.includes('First-Year Writing Seminar'), (_b !== null && _b !== void 0 ? _b : false)));
};
