import { Course } from '../../types';
declare const _default: {
    orieMajorRequiredClasses: ((course: Course) => boolean)[];
    orieElectives: (course: Course) => boolean;
    orieEngineeringDistributionCourses: ((course: Course) => boolean)[];
};
export default _default;
