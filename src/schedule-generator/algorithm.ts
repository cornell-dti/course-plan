// import Requirement from './requirement';
// import Course, { Timeslot } from './course-unit';
// import GeneratorRequest from './generator-request';

import Course, { DayOfTheWeek, Timeslot } from './course-unit';
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
        if (fulfilledRequirements.has(course.name) || creditLimit - course.credits < 0) {
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
          fulfilledRequirements.set(course.name, course.requirements);
        }
      }
    });

    return { semester, schedule, fulfilledRequirements, totalCredits };
  }

  static prettyPrintSchedule(output: GeneratedScheduleOutput): void {
    // Print generated schedule
    console.log('************************');
    console.log(`Generated Schedule for ${output.semester}:`);
    // output.schedule.forEach((timeslots, course) => {
    //   const fulfilledReqs = output.fulfilledRequirements
    //     .get(course.name)
    //     ?.map(req => req.type)
    //     .join(', ');
    //   console.log(`- ${course.name} (${fulfilledReqs}, ${course.credits} credits)`);

    //   timeslots.forEach(timeslot => {
    //     console.log(
    //       `\tTime Slot: ${timeslot.start} – ${timeslot.end}. Days: ${timeslot.daysOfTheWeek.join(
    //         ', '
    //       )}`
    //     );
    //   });
    // });
    output.schedule.forEach((timeslots, course) => {
      const fulfilledReqs = output.fulfilledRequirements
        .get(course.name)
        ?.map(req => req.type)
        .join(', ');

      console.log(`- ${course.name} (${fulfilledReqs}, ${course.credits} credits)`);

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

// *******

// type DaySchedule = {
//   course: string;
//   credits: number;
//   timeslot: Timeslot;
// };

// type WeeklySchedule = {
//   [day in DayOfTheWeek]?: DaySchedule[];
// };

// type GeneratedScheduleOutput = {
//   semester: string;
//   schedule: WeeklySchedule;
//   fulfilledRequirements: Map<string, Requirement[]>;
//   totalCredits: number;
// };

// export default class ScheduleGenerator {
//   static generateSchedule(request: GeneratorRequest): GeneratedScheduleOutput {
//     const { classes, semester } = request;
//     let { creditLimit } = request;

//     const schedule: WeeklySchedule = {};
//     const fulfilledRequirements: Map<string, Requirement[]> = new Map();
//     let totalCredits = 0;

//     // Randomly shuffle the list of available courses
//     classes.sort(() => Math.random() - 0.5);

//     classes.forEach(course => {
//       if (course.offeredSemesters.includes(semester)) {
//         course.timeslots.forEach(timeslot => {
//           if (
//             creditLimit - course.credits >= 0 &&
//             !ScheduleGenerator.isTimeslotOccupied(schedule, timeslot)
//           ) {
//             // Check each day in the timeslot
//             timeslot.daysOfTheWeek.forEach(day => {
//               if (!schedule[day]) {
//                 schedule[day] = [];
//               }
//               schedule[day].push({
//                 course: course.name,
//                 credits: course.credits,
//                 timeslot,
//               });
//             });

//             creditLimit -= course.credits;
//             totalCredits += course.credits;
//             if (!fulfilledRequirements.has(course.name)) {
//               fulfilledRequirements.set(course.name, course.requirements);
//             }
//           }
//         });
//       }
//     });

//     return { semester, schedule, fulfilledRequirements, totalCredits };
//   }

//   private static isTimeslotOccupied(schedule: WeeklySchedule, timeslot: Timeslot): boolean {
//     const gap = 15 * 60 * 1000; // 15 minutes in milliseconds
//     const timeslotStartMS = new Date(`01/01/1970 ${timeslot.start}`).getTime();
//     const timeslotEndMS = new Date(`01/01/1970 ${timeslot.end}`).getTime();

//     return Object.values(schedule).some(days =>
//       days.some(entry => {
//         const slotStartMS = new Date(`01/01/1970 ${entry.timeslot.start}`).getTime();
//         const slotEndMS = new Date(`01/01/1970 ${entry.timeslot.end}`).getTime();
//         return timeslotStartMS < slotEndMS + gap && slotStartMS < timeslotEndMS + gap;
//       })
//     );
//   }

//   static prettyPrintSchedule(output: GeneratedScheduleOutput): void {
//     console.log('************************');
//     console.log(`Generated Schedule for ${output.semester}:`);
//     console.log('************************');
//     Object.entries(output.schedule).forEach(([day, courses]) => {
//       console.log(`${day}:`);
//       courses.forEach(course => {
//         console.log(`  - ${course.course} (${course.credits} credits)`);
//         console.log(`    Time Slot: ${course.timeslot.start} – ${course.timeslot.end}`);
//       });
//     });
//     console.log('Total Credits in the Schedule:', output.totalCredits);
//     console.log('************************');
//   }
// }
