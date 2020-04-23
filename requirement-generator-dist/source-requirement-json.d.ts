/**
 * The module that re-exposes all jsons with strict static types.
 */
import { Course } from './types';
/** All courses fetch from Cornell Class API, with only the fields we need. */
export declare const filteredAllCourses: {
    readonly [semester: string]: readonly Course[];
};
/** The requirement json that guides our algorithm to decide whether a class satisfies a requirement. */
export declare const sourceRequirements: {
    readonly university: import("./types").UniversityRequirements;
    readonly college: import("./types").CollegeRequirements<import("./types").CollegeOrMajorRequirement>;
    readonly major: import("./types").MajorRequirements<import("./types").CollegeOrMajorRequirement>;
};
