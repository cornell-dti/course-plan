import { Course } from '../types';

const humanEcologyCredits = (course: Course): boolean => course.acadGroup.includes('HE');

export default { humanEcologyCredits };
