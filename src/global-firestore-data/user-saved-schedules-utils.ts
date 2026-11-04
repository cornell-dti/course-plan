/**
 * Pure helpers for saved schedules. Kept free of Firestore and store imports so they can be unit
 * tested directly.
 */
import type { GeneratedScheduleOutput } from '../schedule-generator/algorithm';
import type { DayOfTheWeek } from '../schedule-generator/course-unit';

/** One block on the weekly calendar, in the shape `Schedule.vue` renders. */
export type ScheduleCalendarClass = {
  readonly title: string;
  readonly name: string;
  readonly color: string;
  readonly timeStart: string;
  readonly timeEnd: string;
};

export type ScheduleCalendar = Record<DayOfTheWeek, ScheduleCalendarClass[]>;

type CalendarCourse = {
  readonly code: string;
  readonly color: string;
  readonly timeslots: readonly {
    readonly daysOfTheWeek: readonly DayOfTheWeek[];
    readonly start: string;
    readonly end: string;
  }[];
};

export type SavedScheduleMetadata = {
  readonly id: string;
  readonly name: string;
  readonly year: number;
  readonly season: FirestoreSemesterSeason;
};

/**
 * Converts generator output into plain data Firestore can store. `titleByCode` supplies course
 * titles, which the generator's `Course` objects do not carry.
 */
export const generatedScheduleToFirestore = (
  output: GeneratedScheduleOutput,
  metadata: SavedScheduleMetadata,
  titleByCode: (code: string) => string | undefined,
  now: number
): FirestoreSavedSchedule => ({
  ...metadata,
  totalCredits: output.totalCredits,
  courses: Array.from(output.schedule, ([course, timeslots]) => ({
    code: course.code,
    title: titleByCode(course.code) ?? course.code,
    credits: course.credits,
    color: course.color,
    timeslots: timeslots.map(({ daysOfTheWeek, start, end }) => ({
      daysOfTheWeek: [...daysOfTheWeek],
      start,
      end,
    })),
  })),
  createdAt: now,
  updatedAt: now,
});

/** Groups each course's timeslots by day for the weekly calendar. */
export const toScheduleCalendar = (courses: readonly CalendarCourse[]): ScheduleCalendar => {
  const calendar: ScheduleCalendar = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
  courses.forEach(course =>
    course.timeslots.forEach(timeslot =>
      timeslot.daysOfTheWeek.forEach(day => {
        calendar[day].push({
          title: course.code,
          name: course.code,
          color: course.color,
          timeStart: timeslot.start,
          timeEnd: timeslot.end,
        });
      })
    )
  );
  return calendar;
};

/** Calendar for a saved schedule, e.g. one loaded from a friend. */
export const savedScheduleToClassesSchedule = (
  schedule: FirestoreSavedSchedule
): ScheduleCalendar => toScheduleCalendar(schedule.courses);

/** Calendar for generator output, as shown in the schedule generator modal. */
export const generatedScheduleToClassesSchedule = (
  output: GeneratedScheduleOutput
): ScheduleCalendar =>
  toScheduleCalendar(
    Array.from(output.schedule, ([course, timeslots]) => ({
      code: course.code,
      color: course.color,
      timeslots,
    }))
  );
