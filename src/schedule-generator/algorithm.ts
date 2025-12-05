/**
 * Schedule Generation Algorithm
 *
 * This module generates valid course schedules by:
 * 1. Taking a list of courses (including multiple variants for courses with different discussion/lab sections)
 * 2. Randomly selecting ONE variant per course code (ensures discussion variety across generations)
 * 3. Shuffling the order and greedily adding courses that don't conflict
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

/**
 * Selects ONE random variant per course code, then shuffles the order.
 *
 * This is the key to getting variety in discussion sections:
 * - Without this: all variants are shuffled together, and the first valid one always wins
 * - With this: each generation randomly picks a different discussion section to try
 *
 * Example: If CS 2110 has 5 discussion sections, each call to this function
 * will randomly pick one of the 5, giving variety across schedule generations.
 */
function selectAndShuffleVariants(classes: Course[]): Course[] {
  const grouped = groupCoursesByCode(classes);

  // For each course code, randomly pick ONE of its variants
  const selected: Course[] = [];
  grouped.forEach(variants => {
    const randomIdx = Math.floor(Math.random() * variants.length);
    selected.push(variants[randomIdx]);
  });

  // Shuffle the order of courses (affects which courses get priority)
  return selected.sort(() => Math.random() - 0.5);
}

export default class ScheduleGenerator {
  /**
   * Generates a single schedule using a greedy algorithm:
   * 1. Select one random variant per course and shuffle the order
   * 2. For each course, check if it can be added (no conflicts, under credit limit)
   * 3. If valid, add it to the schedule
   *
   * The randomization in step 1 means calling this multiple times
   * will produce different schedules.
   */
  static generateSchedule(request: GeneratorRequest): GeneratedScheduleOutput {
    const { classes, semester } = request;
    let { creditLimit } = request;

    const schedule: Map<Course, Timeslot[]> = new Map();
    const fulfilledRequirements: Map<string, Requirement[]> = new Map();
    const actualFulfilledRequirements: Set<string> = new Set(); // Track fulfilled requirement names
    const usedCourseCodes: Set<string> = new Set(); // Prevent adding same course twice

    // Store pre-parsed timeslots for O(n) conflict checking
    const scheduledParsedSlots: ParsedTimeslot[] = [];

    // Key step: select one variant per course, then shuffle
    // This ensures different discussion sections are explored across generations
    const shuffledClasses = selectAndShuffleVariants(classes);

    let totalCredits = 0;

    shuffledClasses.forEach(course => {
      // Skip if not offered this semester
      if (!course.offeredSemesters.includes(semester)) return;

      const primaryReq = course.requirements[0]?.name ?? '';

      // Skip if:
      // 1. This requirement is already fulfilled by another course
      // 2. This course code is already in the schedule (shouldn't happen with variant selection)
      // 3. Adding this course would exceed the credit limit
      if (
        (primaryReq && actualFulfilledRequirements.has(primaryReq)) ||
        usedCourseCodes.has(course.code) ||
        creditLimit - course.credits < 0
      ) {
        return;
      }

      // Pre-parse this course's timeslots for conflict checking
      const courseParsedSlots = course.timeslots.map(parseTimeslot);

      // Check if ANY of this course's timeslots conflict with ANY scheduled timeslot
      let hasConflict = false;
      for (let i = 0; i < courseParsedSlots.length && !hasConflict; i += 1) {
        for (let j = 0; j < scheduledParsedSlots.length && !hasConflict; j += 1) {
          if (timeslotsConflict(courseParsedSlots[i], scheduledParsedSlots[j])) {
            hasConflict = true;
          }
        }
      }

      if (hasConflict) return;

      // No conflicts - add the course to the schedule
      schedule.set(course, course.timeslots);
      scheduledParsedSlots.push(...courseParsedSlots);
      creditLimit -= course.credits;
      totalCredits += course.credits;
      usedCourseCodes.add(course.code);
      fulfilledRequirements.set(course.code, course.requirements);

      // Mark all requirements this course fulfills as done
      course.requirements.forEach(requirement => {
        actualFulfilledRequirements.add(requirement.name);
      });
    });

    return { semester, schedule, fulfilledRequirements, totalCredits };
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
