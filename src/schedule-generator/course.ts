import Requirement from './requirement';

export default class Course {
  private name: string;

  private credits: number;

  private timeSlots: string[];

  private offeredSemesters: string[];

  private requirements: Requirement[];

  constructor(
    name = '',
    credits = 0,
    timeSlots: string[] = [],
    offeredSemesters: string[] = [],
    requirements: Requirement[] = []
  ) {
    this.name = name;
    this.credits = credits;
    this.timeSlots = timeSlots;
    this.offeredSemesters = offeredSemesters;
    this.requirements = requirements;
  }

  getName(): string {
    return this.name;
  }

  getTimeSlots(): string[] {
    return this.timeSlots;
  }

  getOfferedSemesters(): string[] {
    return this.offeredSemesters;
  }

  getRequirements(): Requirement[] {
    return this.requirements;
  }

  getCredits(): number {
    return this.credits;
  }

  setName(name: string): void {
    this.name = name;
  }

  setTimeSlots(timeSlots: string[]): void {
    this.timeSlots = timeSlots;
  }

  setOfferedSemesters(offeredSemesters: string[]): void {
    this.offeredSemesters = offeredSemesters;
  }

  setRequirements(requirements: Requirement[]): void {
    this.requirements = requirements;
  }

  setCredits(credits: number): void {
    this.credits = credits;
  }

  toString(): string {
    return `${this.name}: 
          -------------------
          ${this.credits} credits
          `;
  }
}
