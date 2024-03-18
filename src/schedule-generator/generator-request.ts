import Course from './course-unit';
import Requirement from './requirement';

export default class GeneratorRequest {
  classes: Course[];

  requirements: Requirement[];

  creditLimit: number;

  semester: string;

  constructor(
    classes: Course[] = [],
    requirements: Requirement[] = [],
    creditLimit = 0,
    semester = ''
  ) {
    this.classes = classes;
    this.requirements = requirements;
    this.creditLimit = creditLimit;
    this.semester = semester;
  }

  addCourse(course: Course): void {
    this.classes.push(course);
  }

  addRequirement(requirement: Requirement): void {
    this.requirements.push(requirement);
  }
}
