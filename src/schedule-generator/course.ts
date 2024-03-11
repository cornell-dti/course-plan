import Requirement from './requirement';

export type TimeSlot = {
  start: string; // e.g. '10:00 AM'
  end: string; // e.g. '11:30 AM'
};

export default class Course {
  private name: string;

  private credits: number;

  private timeSlots: TimeSlot[];

  private offeredSemesters: string[];

  private requirements: Requirement[];

  constructor(
    name = '',
    credits = 0,
    timeSlots: TimeSlot[] = [],
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

  getTimeSlots(): TimeSlot[] {
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

  setTimeSlots(timeSlots: TimeSlot[]): void {
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
