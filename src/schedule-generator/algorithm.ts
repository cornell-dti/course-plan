import { db } from '@/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Course, { Timeslot } from './course-unit';
import GeneratorRequest from './generator-request';
import Requirement from './requirement';

export type GeneratedScheduleOutput = {
  semester: string;
  schedule: Map<Course, Timeslot[]>;
  fulfilledRequirements: Map<string, Requirement[]>; // maps course name to fulfilled requirements
  // (We can no longer use Course keys as there are now duplicates using the new logic.)
  totalCredits: number;
};

export default class ScheduleGenerator {
  static async generateSchedule(request: GeneratorRequest): Promise<GeneratedScheduleOutput> {
    const { classes, semester } = request;
    let { creditLimit } = request;

    const scheduleString = this.computeScheduleString(classes, creditLimit, semester);
    const scheduleDoc = doc(db, "generated-schedules", scheduleString)
    const scheduleSnap = await getDoc(scheduleDoc);
    if (scheduleSnap.exists()) {
      return scheduleSnap.data() as GeneratedScheduleOutput;
    }

    const schedule: Map<Course, Timeslot[]> = new Map();
    const fulfilledRequirements: Map<string, Requirement[]> = new Map(); // used for checking no course duplicates
    const actualFulfilledRequirements: Set<string> = new Set(); // used for checking no requirement duplicates

    // Randomly shuffle the list of available courses
    classes.sort(() => Math.random() - 0.5);

    let totalCredits = 0;

    classes.forEach(course => {
      if (course.offeredSemesters.includes(semester)) {
        let performAdditionFlag = true;
        const onlyCourseRequirement = course.requirements[0].name ?? 'nonsense-requirement';

        // New logic: must be free for *all* time slots.
        if (
          actualFulfilledRequirements.has(onlyCourseRequirement) ||
          fulfilledRequirements.has(course.code) ||
          creditLimit - course.credits < 0
        ) {
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
          for (const requirement of course.requirements) {
            actualFulfilledRequirements.add(requirement.name);
          }
        }
      }
    });

    await setDoc(scheduleDoc, {
      semester,
      schedule,
      fulfilledRequirements,
      totalCredits
    })

    return { semester, schedule, fulfilledRequirements, totalCredits };
  }

  static computeScheduleString(courses: Course[], creditLimit: number, semester: string): string {
    let scheduleString = "";
    const sortedCourses = courses.sort((a, b) => a.code.localeCompare(b.code));
    for (const course of sortedCourses) {
      scheduleString += `${course.code};`
    }
    scheduleString += `|${creditLimit}|`
    scheduleString += `$${semester}$`
    return scheduleString
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
    const timeslotCopy = { ...timeslot };

    if (!timeslotCopy.start.includes(' ')) {
      timeslotCopy.start = `${timeslotCopy.start.slice(0, -2)} ${timeslotCopy.start.slice(-2)}`;
    }
    if (!timeslotCopy.end.includes(' ')) {
      timeslotCopy.end = `${timeslotCopy.end.slice(0, -2)} ${timeslotCopy.end.slice(-2)}`;
    }

    const timeslotStartMS = new Date(`01/01/1970 ${timeslotCopy.start}`).getTime();
    const timeslotEndMS = new Date(`01/01/1970 ${timeslotCopy.end}`).getTime();
    const timeslotDaysOfTheWeek = new Set(timeslotCopy.daysOfTheWeek);

    for (const slotArray of Array.from(schedule.values())) {
      for (const slot of slotArray) {
        const slotCopy = { ...slot };
        if (!slotCopy.start.includes(' ')) {
          slotCopy.start = `${slotCopy.start.slice(0, -2)} ${slotCopy.start.slice(-2)}`;
        }
        if (!slotCopy.end.includes(' ')) {
          slotCopy.end = `${slotCopy.end.slice(0, -2)} ${slotCopy.end.slice(-2)}`;
        }

        const slotStartMS = new Date(`01/01/1970 ${slotCopy.start}`).getTime();
        const slotEndMS = new Date(`01/01/1970 ${slotCopy.end}`).getTime();

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
