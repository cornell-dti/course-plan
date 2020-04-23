import { CourseTaken, GroupedRequirementFulfillmentReport } from './types';
declare type RequirementMap = {
    readonly [code: string]: readonly string[];
};
/**
 * @param coursesTaken a list of classes taken by the user, with some metadata (e.g. no. of credits)
 * helping to compute requirement progress.
 * @param college user's college.
 * @param major user's major.
 * @param minor user's minor.
 * @returns all requirements fulfillments, grouped by University, College, Major.
 */
export declare function computeRequirements(coursesTaken: readonly CourseTaken[], college: string, major: string, minor: string): readonly GroupedRequirementFulfillmentReport[];
/**
 * @param groups all requirements fulfillments, grouped by University, College, Major.
 * @returns a object where keys are course code and values are a list of requirement a class fulfills.
 */
export declare function computeRequirementMap(groups: readonly GroupedRequirementFulfillmentReport[]): RequirementMap;
export {};
