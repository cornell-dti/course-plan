import Requirement from './requirement';
import Course from './course';
import GeneratorRequest from './generator-request';

export default class ScheduleGenerator {
  // TODO: output meaningful type.
  static generateSchedule(request: GeneratorRequest): void {
    const semester = request.getSemester();
    let creditLimit = request.getCreditLimit();
    const classes = request.getClasses();

    const schedule: Map<string, Course[]> = new Map();
    const fulfilledRequirements: Map<Course, Requirement[]> = new Map();

    // Randomly shuffle the list of available courses
    classes.sort(() => Math.random() - 0.5);

    let totalCredits = 0;

    classes.forEach(course => {
      if (course.getOfferedSemesters().includes(semester)) {
        course.getTimeSlots().forEach(timeSlot => {
          if (
            !ScheduleGenerator.isTimeSlotOccupied(schedule, timeSlot) &&
            creditLimit - course.getCredits() >= 0
          ) {
            ScheduleGenerator.addToSchedule(schedule, course, timeSlot);
            creditLimit -= course.getCredits();
            totalCredits += course.getCredits();
            fulfilledRequirements.set(course, course.getRequirements());
          }
        });
      }
    });

    // Print generated schedule
    console.log('************************');
    console.log(`Generated Schedule for ${semester}:`);
    schedule.forEach((courses, timeSlot) => {
      console.log(`Time Slot: ${timeSlot}`);
      courses.forEach(course => {
        const fulfilledReqs = ScheduleGenerator.getFulfilledRequirements(
          course,
          fulfilledRequirements
        );
        console.log(`- ${course.getName()} (${fulfilledReqs}, ${course.getCredits()} credits)`);
      });
    });
    console.log();
    console.log(`Total Credits in the Schedule: ${totalCredits}`);
  }

  private static isTimeSlotOccupied(schedule: Map<string, Course[]>, timeSlot: string): boolean {
    return schedule.has(timeSlot);
  }

  private static addToSchedule(
    schedule: Map<string, Course[]>,
    course: Course,
    timeSlot: string
  ): void {
    const coursesInTimeSlot = schedule.get(timeSlot) || [];
    coursesInTimeSlot.push(course);
    schedule.set(timeSlot, coursesInTimeSlot);
  }

  private static getFulfilledRequirements(
    course: Course,
    fulfilledRequirements: Map<Course, Requirement[]>
  ): string {
    const requirements = fulfilledRequirements.get(course) || [];
    return requirements.map(req => req.getType()).join(', ');
  }
}
