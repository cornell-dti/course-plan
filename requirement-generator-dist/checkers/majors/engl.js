"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const englishTotalCredits = (course) => {
    if (checkers_common_1.courseMatchesCodeOptions(course, ['ENGL 2800', 'ENGL 2810', 'ENGL 2880', 'ENGL 2890'])) {
        return false;
    }
    return checkers_common_1.courseMatchesCodeOptions(course, ['ENGL 2***', 'ENGL 3***', 'ENGL 4***', 'ENGL 5***', 'ENGL 6***']);
};
const englishPre1800 = (course) => {
    var _a, _b, _c, _d;
    return ((_b = (_a = course.catalogComments) === null || _a === void 0 ? void 0 : _a.includes('pre-1800'), (_b !== null && _b !== void 0 ? _b : false))
        || (_d = (_c = course.catalogSatisfiesReq) === null || _c === void 0 ? void 0 : _c.includes('pre-1800'), (_d !== null && _d !== void 0 ? _d : false)));
};
const english4000OrAbove = (course) => checkers_common_1.courseMatchesCode(course, 'ENGL 4***');
exports.default = { englishTotalCredits, englishPre1800, english4000OrAbove };
