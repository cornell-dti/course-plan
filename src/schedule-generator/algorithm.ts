import Requirement from './requirement';
import Course, { TimeSlot } from './course-unit';
import GeneratorRequest from './generator-request';

type GeneratedScheduleOutput = {
  semester: string;
  schedule: Map<TimeSlot, Course[]>;
  fulfilledRequirements: Map<Course, Requirement[]>;
  totalCredits: number;
};

export default class ScheduleGenerator {
  static generateSchedule(request: GeneratorRequest): GeneratedScheduleOutput {
    const { classes, semester } = request;
    let { creditLimit } = request;

    const schedule: Map<TimeSlot, Course[]> = new Map();
    const fulfilledRequirements: Map<Course, Requirement[]> = new Map();

    // Randomly shuffle the list of available courses
    classes.sort(() => Math.random() - 0.5);

    let totalCredits = 0;

    classes.forEach(course => {
      if (course.offeredSemesters.includes(semester)) {
        course.timeSlots.forEach(timeSlot => {
          if (
            !ScheduleGenerator.isTimeSlotOccupied(schedule, timeSlot) &&
            !fulfilledRequirements.has(course) && // prevent duplication
            creditLimit - course.credits >= 0
          ) {
            ScheduleGenerator.addToSchedule(schedule, course, timeSlot);
            creditLimit -= course.credits;
            totalCredits += course.credits;
            fulfilledRequirements.set(course, course.requirements);
          }
        });
      }
    });

    return { semester, schedule, fulfilledRequirements, totalCredits };
  }

  static prettyPrintSchedule(output: GeneratedScheduleOutput): void {
    // Print generated schedule
    console.log('************************');
    console.log(`Generated Schedule for ${output.semester}:`);
    output.schedule.forEach((courses, timeSlot) => {
      console.log(`Time Slot: ${timeSlot.start} – ${timeSlot.end}. Days: ${timeSlot.daysOfTheWeek.join(', ')}`);
      courses.forEach(course => {
        const fulfilledReqs = ScheduleGenerator.getFulfilledRequirements(
          course,
          output.fulfilledRequirements
        );
        console.log(`- ${course.name} (${fulfilledReqs}, ${course.credits} credits)`);
      });
    });
    console.log();
    console.log(`Total Credits in the Schedule: ${output.totalCredits}`);
  }

  private static isTimeSlotOccupied(
    schedule: Map<TimeSlot, Course[]>,
    timeSlot: TimeSlot
  ): boolean {
    // TODO: deal with days of the week, *all timeslots*.
    // Check for overlap.
    const gap = 15 * 60 * 1000; // 15 minutes in milliseconds
    const timeSlotStartMS = new Date(`01/01/1970 ${timeSlot.start}`).getTime();
    const timeSlotEndMS = new Date(`01/01/1970 ${timeSlot.end}`).getTime();

    for (const slot of Array.from(schedule.keys())) {
      const slotStartMS = new Date(`01/01/1970 ${slot.start}`).getTime();
      const slotEndMS = new Date(`01/01/1970 ${slot.end}`).getTime();
      if (timeSlotStartMS < slotEndMS + gap && slotStartMS < timeSlotEndMS + gap) {
        return true;
      }
    }

    return false;
  }

  private static addToSchedule(
    schedule: Map<TimeSlot, Course[]>,
    course: Course,
    timeSlot: TimeSlot
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
    return requirements.map(req => req.type).join(', ');
  }
}
