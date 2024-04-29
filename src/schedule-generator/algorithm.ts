import Course, { Timeslot } from './course-unit';
import GeneratorRequest from './generator-request';
import Requirement from './requirement';

type GeneratedScheduleOutput = {
  semester: string;
  schedule: Map<Course, Timeslot[]>;
  fulfilledRequirements: Map<string, Requirement[]>; // maps course name to fulfilled requirements
  // (We can no longer use Course keys as there are now duplicates using the new logic.)
  totalCredits: number;
};

export default class ScheduleGenerator {
  static generateSchedule(request: GeneratorRequest): GeneratedScheduleOutput {
    const { classes, semester } = request;
    let { creditLimit } = request;

    const schedule: Map<Course, Timeslot[]> = new Map();
    const fulfilledRequirements: Map<string, Requirement[]> = new Map();

    // Randomly shuffle the list of available courses
    classes.sort(() => Math.random() - 0.5);

    let totalCredits = 0;

    classes.forEach(course => {
      if (course.offeredSemesters.includes(semester)) {
        let performAdditionFlag = true;

        // New logic: must be free for *all* time slots.
        if (fulfilledRequirements.has(course.code) || creditLimit - course.credits < 0) {
          performAdditionFlag = false;
        } else {
          for (const timeslot of course.timeslots) {
            if (ScheduleGenerator.isTimeslotOccupied(schedule, timeslot)) {
              performAdditionFlag = false;
            }
          }
        }

        course.timeslots.forEach(timeslot => {
          if (ScheduleGenerator.isTimeslotOccupied(schedule, timeslot)) {
            performAdditionFlag = false;
          }
        });

        if (performAdditionFlag) {
          ScheduleGenerator.addToSchedule(schedule, course, course.timeslots);
          creditLimit -= course.credits;
          totalCredits += course.credits;
          fulfilledRequirements.set(course.code, course.requirements);
        }
      }
    });

    return { semester, schedule, fulfilledRequirements, totalCredits };
  }

  static prettyPrintSchedule(output: GeneratedScheduleOutput): void {
    console.log('************************');
    console.log(`Generated Schedule for ${output.semester}:`);
    output.schedule.forEach((timeslots, course) => {
      const fulfilledReqs = output.fulfilledRequirements
        .get(course.code)
        ?.map(req => req.name)
        .join(', ');

      console.log(`- ${course.code} (${fulfilledReqs}, ${course.credits} credits)`);

      timeslots.forEach(timeslot => {
        if (timeslot.daysOfTheWeek && timeslot.daysOfTheWeek.length > 0) {
          console.log(
            `\tTime Slot: ${timeslot.start} – ${timeslot.end}. Days: ${timeslot.daysOfTheWeek.join(
              ', '
            )}`
          );
        } else {
          console.log(`\tTime Slot: ${timeslot.start} – ${timeslot.end}. Days: not specified`);
        }
      });
    });
    console.log();
    console.log(`Total Credits in the Schedule: ${output.totalCredits}`);
  }

  private static isTimeslotOccupied(
    schedule: Map<Course, Timeslot[]>,
    timeslot: Timeslot
  ): boolean {
    // Check for overlap.
    const gap = 15 * 60 * 1000; // 15 minutes in milliseconds
    const timeslotStartMS = new Date(`01/01/1970 ${timeslot.start}`).getTime();
    const timeslotEndMS = new Date(`01/01/1970 ${timeslot.end}`).getTime();
    const timeslotDaysOfTheWeek = new Set(timeslot.daysOfTheWeek);

    for (const slotArray of Array.from(schedule.values())) {
      for (const slot of slotArray) {
        const slotStartMS = new Date(`01/01/1970 ${slot.start}`).getTime();
        const slotEndMS = new Date(`01/01/1970 ${slot.end}`).getTime();

        if (
          timeslotStartMS < slotEndMS + gap &&
          slotStartMS < timeslotEndMS + gap &&
          new Set([...slot.daysOfTheWeek].filter(x => timeslotDaysOfTheWeek.has(x))).size > 0
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private static addToSchedule(
    schedule: Map<Course, Timeslot[]>,
    course: Course,
    timeslots: Timeslot[]
  ): void {
    schedule.set(course, timeslots);
  }
}
