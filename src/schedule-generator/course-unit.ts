import Requirement from './requirement';

export type DayOfTheWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type Timeslot = {
  daysOfTheWeek: DayOfTheWeek[]; // e.g. ['Monday', 'Wednesday', 'Friday']
  start: string; // e.g. '10:00 AM'
  end: string; // e.g. '11:30 AM'
};

export default class Course {
  name: string;

  credits: number;

  /*
  *all* of these have to be available for the course to be scheduled.
  will usually just be one, but if there is e.g. a lab or a discussion then it could be two
  for now, just going to have multiple copies of the course.
  
  say we have one lecture L and two discussions D1 and D2.
  then there would be generated:

  Course(name=L, timeslots=[LectureTimeslot, D1Timeslot])
  Course(name=L, timeslots=[LectureTimeslot, D2Timeslot])

  then the algorithm will just choose one of these to schedule
  */
  timeslots: Timeslot[];

  offeredSemesters: string[];

  requirements: Requirement[];

  constructor(
    name = '',
    credits = 0,
    timeslots: Timeslot[] = [],
    offeredSemesters: string[] = [],
    requirements: Requirement[] = []
  ) {
    this.name = name;
    this.credits = credits;
    this.timeslots = timeslots;
    this.offeredSemesters = offeredSemesters;
    this.requirements = requirements;
  }

  toString(): string {
    return `${this.name}: 
          -------------------
          ${this.credits} credits
          `;
  }
}
