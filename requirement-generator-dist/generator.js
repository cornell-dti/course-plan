"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const data_1 = __importDefault(require("./data"));
const filtered_all_courses_1 = __importDefault(require("./filtered-all-courses"));
const getEligibleCourses = (requirement) => {
    // eligibleCoursesMap[semester][subject]
    // gives you all courses number of the courses eligible for the given requirements.
    const { checker: requirementChecker } = requirement;
    if (requirementChecker === null) {
        // Self check courses have zero satisfiable course.
        return [];
    }
    const subRequirementCheckers = typeof requirementChecker === 'function'
        ? [requirementChecker]
        : requirementChecker;
    return subRequirementCheckers.map(oneRequirementChecker => {
        const eligibleCoursesMap = {};
        Object.entries(filtered_all_courses_1.default).forEach(([semester, courses]) => {
            const semesterMap = {};
            courses
                .filter(course => oneRequirementChecker(course))
                .forEach(course => {
                let subjectSet = semesterMap[course.subject];
                if (subjectSet == null) {
                    subjectSet = [];
                }
                subjectSet.push(course.catalogNbr);
                semesterMap[course.subject] = subjectSet;
            });
            if (Object.keys(semesterMap).length > 0) {
                // Do not include empty semesters.
                eligibleCoursesMap[semester] = semesterMap;
            }
        });
        return eligibleCoursesMap;
    });
};
const produceSatisfiableCoursesAttachedRequirementJson = () => {
    const { university, college, major } = data_1.default;
    const decoratedJson = { university, college: {}, major: {} };
    const decorateRequirements = (requirements) => (requirements.map(requirement => {
        const { checker } = requirement, rest = __rest(requirement, ["checker"]);
        return Object.assign(Object.assign({}, rest), { courses: getEligibleCourses(requirement) });
    }));
    Object.entries(college).forEach(([collegeName, collegeRequirement]) => {
        const { requirements } = collegeRequirement, rest = __rest(collegeRequirement, ["requirements"]);
        decoratedJson.college[collegeName] = Object.assign(Object.assign({}, rest), { requirements: decorateRequirements(requirements) });
    });
    Object.entries(major).forEach(([majorName, majorRequirement]) => {
        const { requirements } = majorRequirement, rest = __rest(majorRequirement, ["requirements"]);
        decoratedJson.major[majorName] = Object.assign(Object.assign({}, rest), { requirements: decorateRequirements(requirements) });
    });
    return decoratedJson;
};
const decoratedRequirementString = JSON.stringify(produceSatisfiableCoursesAttachedRequirementJson());
fs_1.writeFileSync('src/requirements/decorated-requirements.json', decoratedRequirementString);
