/**
 * The module that re-exposes all jsons with strict static types.
 */
import { Course } from './types';
/** All courses fetch from Cornell Class API, with only the fields we need. */
declare const filteredAllCourses: {
    readonly [semester: string]: readonly Course[];
};
export default filteredAllCourses;
