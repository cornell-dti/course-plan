/**
 * Schedule Generation Algorithm
 *
 * This module generates valid course schedules by:
 * 1. Taking a list of courses (including multiple variants for courses with different discussion/lab sections)
 * 2. Shuffling courses and their variants (ensures variety across generations)
 * 3. Backtracking over every variant to fit as many courses as possible without conflicts
 * 4. Generating multiple unique schedules by repeating with different random selections
 */

import Course, { Timeslot, DayOfTheWeek } from './course-unit';
import GeneratorRequest from './generator-request';
import Requirement from './requirement';

export type GeneratedScheduleOutput = {
  semester: string;
  schedule: Map<Course, Timeslot[]>;
  fulfilledRequirements: Map<string, Requirement[]>;
  totalCredits: number;
  unscheduledCourses: { code: string; conflictsWith: string[] }[];
};

/**
 * Pre-parsed timeslot with times converted to milliseconds for fast comparison.
 * Parsing time strings is expensive, so we do it once upfront.
 */
type ParsedTimeslot = {
  startMS: number; // Start time in ms since midnight
  endMS: number; // End time in ms since midnight
  days: Set<DayOfTheWeek>; // Days this slot occurs on
};

/**
 * Converts a time string like "10:00am" or "10:00 AM" to milliseconds since midnight.
 * Handles both formats (with and without space before am/pm).
 */
function parseTimeToMS(timeStr: string): number {
  if (!timeStr) return 0;

  // Normalize format: ensure space before am/pm (e.g., "10:00am" -> "10:00 am")
  let normalized = timeStr;
  if (!normalized.includes(' ')) {
    normalized = `${normalized.slice(0, -2)} ${normalized.slice(-2)}`;
  }

  const match = normalized.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toLowerCase() === 'pm';

  // Convert to 24-hour format
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  return (hours * 60 + minutes) * 60 * 1000;
}

/**
 * Pre-parses a timeslot for faster conflict checking.
 * Called once per timeslot rather than on every comparison.
 */
function parseTimeslot(timeslot: Timeslot): ParsedTimeslot {
  return {
    startMS: parseTimeToMS(timeslot.start),
    endMS: parseTimeToMS(timeslot.end),
    days: new Set(timeslot.daysOfTheWeek),
  };
}

/**
 * Checks if two timeslots conflict (overlap in time on the same day).
 * Includes a 15-minute buffer between classes for walking time.
 */
function timeslotsConflict(a: ParsedTimeslot, b: ParsedTimeslot): boolean {
  const gap = 15 * 60 * 1000; // 15 minutes walking time buffer

  // First check: do the time ranges overlap (with gap)?
  // Two ranges [a.start, a.end] and [b.start, b.end] overlap if:
  // a.start < b.end AND b.start < a.end
  const timesOverlap = a.startMS < b.endMS + gap && b.startMS < a.endMS + gap;
  if (!timesOverlap) return false;

  // Second check: do they share any days?
  const aDays = Array.from(a.days);
  return aDays.some(day => b.days.has(day));
}

/**
 * Groups courses by their course code.
 *
 * This is used to identify "variants" - the same course with different
 * discussion/lab sections. For example, CS 2110 might have:
 *   - CS2110 variant 1: Lecture MWF 10am + Discussion T 2pm
 *   - CS2110 variant 2: Lecture MWF 10am + Discussion W 3pm
 *   - CS2110 variant 3: Lecture MWF 10am + Discussion R 4pm
 *
 * All three have the same code "CS2110" but different timeslots.
 */
function groupCoursesByCode(courses: Course[]): Map<string, Course[]> {
  const groups = new Map<string, Course[]>();
  courses.forEach(course => {
    const existing = groups.get(course.code) || [];
    existing.push(course);
    groups.set(course.code, existing);
  });
  return groups;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type CandidateVariant = { course: Course; slots: ParsedTimeslot[] };

export default class ScheduleGenerator {
  static generateSchedule(request: GeneratorRequest, maxNodes = 5000): GeneratedScheduleOutput {
    const { classes, semester, creditLimit } = request;

    const offered = classes.filter(course => course.offeredSemesters.includes(semester));
    const candidates: CandidateVariant[][] = shuffle(
      Array.from(groupCoursesByCode(offered).values())
    ).map(variants =>
      shuffle(variants).map(course => ({ course, slots: course.timeslots.map(parseTimeslot) }))
    );

    let best: CandidateVariant[] = [];
    const chosen: CandidateVariant[] = [];
    const chosenSlots: ParsedTimeslot[] = [];
    const usedReqs = new Set<string>();
    let nodes = 0;

    const primaryReqOf = (course: Course) => course.requirements[0]?.name ?? '';
    const maxCourses =
      new Set(offered.map(primaryReqOf).filter(Boolean)).size +
      candidates.filter(variants => !primaryReqOf(variants[0].course)).length;
    const isDone = () => best.length === maxCourses || nodes >= maxNodes;

    const fits = ({ course, slots }: CandidateVariant, credits: number) => {
      const primaryReq = primaryReqOf(course);
      return (
        !(primaryReq && usedReqs.has(primaryReq)) &&
        credits + course.credits <= creditLimit &&
        !slots.some(slot => chosenSlots.some(other => timeslotsConflict(slot, other)))
      );
    };
    const add = (variant: CandidateVariant) => {
      const newReqs = variant.course.requirements
        .map(r => r.name)
        .filter(name => !usedReqs.has(name));
      newReqs.forEach(name => usedReqs.add(name));
      chosen.push(variant);
      chosenSlots.push(...variant.slots);
      return newReqs;
    };
    const remove = (variant: CandidateVariant, newReqs: string[]) => {
      chosen.pop();
      chosenSlots.splice(chosenSlots.length - variant.slots.length);
      newReqs.forEach(name => usedReqs.delete(name));
    };

    const search = (index: number, credits: number): void => {
      if (chosen.length > best.length) best = [...chosen];
      if (isDone() || chosen.length + candidates.length - index <= best.length) return;
      nodes += 1;

      for (const variant of candidates[index]) {
        if (fits(variant, credits)) {
          const newReqs = add(variant);
          search(index + 1, credits + variant.course.credits);
          remove(variant, newReqs);
          if (isDone()) return;
        }
      }

      search(index + 1, credits);
    };

    search(0, 0);

    let totalCredits = 0;
    const take = (variant: CandidateVariant) => {
      add(variant);
      totalCredits += variant.course.credits;
    };
    best.forEach(take);
    candidates
      .filter(variants => !chosen.some(c => c.course.code === variants[0].course.code))
      .forEach(variants => {
        const variant = variants.find(v => fits(v, totalCredits));
        if (variant) take(variant);
      });

    const schedule: Map<Course, Timeslot[]> = new Map();
    const fulfilledRequirements: Map<string, Requirement[]> = new Map();
    chosen.forEach(({ course }) => {
      schedule.set(course, course.timeslots);
      fulfilledRequirements.set(course.code, course.requirements);
    });

    const clashesFor = ({ slots }: CandidateVariant) =>
      chosen
        .filter(other => slots.some(slot => other.slots.some(o => timeslotsConflict(slot, o))))
        .map(other => other.course.code);
    const unscheduledCourses = candidates
      .filter(
        variants =>
          !chosen.some(c => c.course.code === variants[0].course.code) &&
          !usedReqs.has(primaryReqOf(variants[0].course))
      )
      .map(variants => ({
        code: variants[0].course.code,
        conflictsWith: variants
          .map(clashesFor)
          .reduce((fewest, clashes) => (clashes.length < fewest.length ? clashes : fewest)),
      }));

    return { semester, schedule, fulfilledRequirements, totalCredits, unscheduledCourses };
  }

  /**
   * Generates multiple UNIQUE schedules.
   *
   * Because generateSchedule() uses random variant selection and shuffling,
   * calling it multiple times produces different results. We use hashing
   * to detect and skip duplicates.
   *
   * @param request - The courses, requirements, credit limit, and semester
   * @param count - How many unique schedules to generate
   * @param maxAttempts - Maximum attempts before giving up (prevents infinite loops)
   */
  static generateMultipleSchedules(
    request: GeneratorRequest,
    count: number,
    maxAttempts = 100
  ): GeneratedScheduleOutput[] {
    const results: GeneratedScheduleOutput[] = [];
    const seenScheduleHashes = new Set<string>();

    for (let attempt = 0; attempt < maxAttempts && results.length < count; attempt += 1) {
      const schedule = ScheduleGenerator.generateSchedule(request);
      const hash = ScheduleGenerator.hashSchedule(schedule);

      // Only add if we haven't seen this exact schedule before
      if (!seenScheduleHashes.has(hash)) {
        seenScheduleHashes.add(hash);
        results.push(schedule);
      }
    }

    return results;
  }

  /**
   * Creates a unique hash string for a schedule.
   *
   * The hash includes both course codes AND timeslots, so two schedules
   * with the same courses but different discussion sections are considered different.
   *
   * Example hash: "CS2110:10:00am-11:00am-M,W|2:00pm-3:00pm-T;MATH1920:..."
   */
  private static hashSchedule(output: GeneratedScheduleOutput): string {
    const courseKeys = Array.from(output.schedule.keys())
      .map(course => {
        // Include timeslots in hash to distinguish variants
        const timeslotStr = course.timeslots
          .map(t => `${t.start}-${t.end}-${t.daysOfTheWeek.sort().join(',')}`)
          .sort()
          .join('|');
        return `${course.code}:${timeslotStr}`;
      })
      .sort(); // Sort for consistent ordering

    return courseKeys.join(';');
  }

  /** Debug utility: prints a schedule to the console */
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
}
