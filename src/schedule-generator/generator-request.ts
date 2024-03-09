import Course from './course';
import Requirement from './requirement';

export default class GeneratorRequest {
  private classes: Course[];

  private requirements: Requirement[];

  private creditLimit: number;

  private semester: string;

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

  getClasses(): Course[] {
    return this.classes;
  }

  getRequirements(): Requirement[] {
    return this.requirements;
  }

  getCreditLimit(): number {
    return this.creditLimit;
  }

  getSemester(): string {
    return this.semester;
  }

  setClasses(classes: Course[]): void {
    this.classes = classes;
  }

  setRequirements(requirements: Requirement[]): void {
    this.requirements = requirements;
  }

  setCreditLimit(creditLimit: number): void {
    this.creditLimit = creditLimit;
  }

  setSemester(semester: string): void {
    this.semester = semester;
  }

  addCourse(course: Course): void {
    this.classes.push(course);
  }

  addRequirement(requirement: Requirement): void {
    this.requirements.push(requirement);
  }
}
