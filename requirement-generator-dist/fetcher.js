"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Disabled because we want to log progress.
/* eslint-disable no-await-in-loop */
// Disabled because we want the inefficiency to rate-limit ourselves.
/* eslint-disable no-console */
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const PREFIX = 'https://classes.cornell.edu/api/2.0';
const wait = (time) => new Promise(resolve => setTimeout(() => resolve(), time));
const getSemesters = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(`${PREFIX}/config/rosters.json`);
    const json = yield response.json();
    return json.data.rosters.map((it) => it.slug);
});
const getSubjects = (semester) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield node_fetch_1.default(`${PREFIX}/config/subjects.json?roster=${semester}`);
        const json = yield response.json();
        return json.data.subjects.map((it) => it.value);
    }
    catch (_a) {
        return [];
    }
});
const getCourseFieldFilter = (allowedFields) => (course) => {
    const filteredCourseObject = {};
    Object.entries(course).forEach(([field, value]) => {
        if (allowedFields.includes(field)) {
            filteredCourseObject[field] = value;
        }
    });
    return filteredCourseObject;
};
const getCoursesInSemesterAndSubject = (semester, subject, courseFieldFilter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield node_fetch_1.default(`${PREFIX}/search/classes.json?roster=${semester}&subject=${subject}`);
        const json = yield response.json();
        return json.data.classes.map(courseFieldFilter);
    }
    catch (_b) {
        return [];
    }
});
const getAllCoursesInSemester = (semester, courseFieldFilter, coolingTimeMs = 50, doPrintDebuggingInfo = false) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = [];
    const subjects = yield getSubjects(semester);
    if (doPrintDebuggingInfo) {
        console.log(`We have ${subjects.length} subjects in ${semester} total.`);
    }
    let subjectCount = 0;
    for (const subject of subjects) {
        const semesterCourses = yield getCoursesInSemesterAndSubject(semester, subject, courseFieldFilter);
        courses.push(...semesterCourses);
        yield wait(coolingTimeMs);
        subjectCount += 1;
        if (doPrintDebuggingInfo) {
            console.log(`There're ${semesterCourses.length} courses in ${subject} in ${semester}.`);
            console.log(`We fetched ${subjectCount} out of ${subjects.length} subjects in ${semester}.`);
        }
    }
    return courses;
});
const getAllCourses = (courseFieldFilter, coolingTimeMs = 50, doPrintDebuggingInfo = true) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = new Date().getTime();
    const courses = {};
    const semesters = yield getSemesters();
    if (doPrintDebuggingInfo) {
        console.log(`We have ${semesters.length} semesters in total.`);
    }
    let semesterCount = 0;
    for (const semester of semesters) {
        const semesterCourses = yield getAllCoursesInSemester(semester, courseFieldFilter, coolingTimeMs, doPrintDebuggingInfo);
        courses[semester] = semesterCourses;
        semesterCount += 1;
        if (doPrintDebuggingInfo) {
            console.log(`We fetched ${semesterCount} out of ${semesters.length} semesters.`);
        }
    }
    if (doPrintDebuggingInfo) {
        console.log(`Total Running Time: ${new Date().getTime() - startTime}ms.`);
    }
    return courses;
});
const courseFieldFilter = getCourseFieldFilter([
    'subject',
    'catalogNbr',
    'titleLong',
    'description',
    'catalogBreadth',
    'catalogDistr',
    'catalogAttribute',
    'catalogComments',
    'catalogSatisfiesReq',
    'acadCareer',
    'acadGroup'
]);
getAllCourses(courseFieldFilter).then(allCourses => {
    fs_1.writeFileSync('src/requirements/filtered-all-courses.json', JSON.stringify(allCourses));
});
