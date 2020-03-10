import { Course } from '../../types';

const historyPre1800Classes = (course: Course): boolean => (
  // REQ_TODO: investigate whether course data has this field (catalogCourseSubfield)
  // @ts-ignore
  course.catalogCourseSubfield && course.catalogCourseSubfield.includes('HPE')
);

export default { historyPre1800Classes };
