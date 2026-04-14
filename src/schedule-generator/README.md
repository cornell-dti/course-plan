# schedule-generator

This folder contains everything necessary to the functionality of the schedule-generation _algorithm_, for the semesterly schedule-generation feature.

Below is a detailed file-by-file breakdown:

## `algorithm.ts`

This is essentially what is imported and used by the frontend. It takes in a request (type `GeneratorRequest`, see `generator-request.ts`) and outputs a meaningful value of type `GeneratedScheduleOutput` which can be used to see what courses fulfill what requirements and are at what times.

### How it works

The algorithm generates schedules using a greedy approach with variant-aware randomization:

1. **Variant Selection**: Courses with multiple discussion/lab sections are treated as "variants" (same course code, different timeslots). The algorithm randomly picks ONE variant per course code for each generation attempt. This ensures variety in discussion sections across generated schedules.

2. **Shuffling**: The selected courses are randomly shuffled to vary which courses get scheduling priority.

3. **Greedy Addition**: Courses are added one-by-one if they don't conflict with already-scheduled courses and don't exceed the credit limit.

4. **Duplicate Detection**: When generating multiple schedules, a hash of each schedule (including timeslots) is used to detect and skip duplicates.

### Key functions

- `generateSchedule()`: Generates a single schedule with random variant selection
- `generateMultipleSchedules()`: Generates N unique schedules by calling `generateSchedule()` repeatedly and filtering duplicates
- `selectAndShuffleVariants()`: The key to discussion variety — picks one random variant per course code

### Performance optimizations

- Time strings are pre-parsed to milliseconds once (not on every comparison)
- A 15-minute gap is enforced between classes for walking time

## `course-unit.ts`

A `Course` is a class that represents a single course _in a single semester and "meta-timeslot"_.

When a course has multiple discussion or lab sections, we create multiple `Course` objects (variants) with the same code but different timeslots. Example:

Say we have one lecture L and two discussions D1 and D2. Then there would be generated:

```typescript
Course(code="CS2110", timeslots=[LectureTimeslot, D1Timeslot], ...)
Course(code="CS2110", timeslots=[LectureTimeslot, D2Timeslot], ...)
```

The algorithm then randomly picks one of these variants per generation, ensuring different discussion sections get explored.

Also exports `CourseForFrontend`, which includes optional `allTimeslots` (for courses with discussions/labs) and `variantId` (to distinguish variants).

## `generator-request.ts`

Just a narrow wrapper around the information you send to `algorithm.ts` for schedule generation. It stores the user's inputted courses to fulfill requirements, desired requirements to be fulfilled, the name of the semester, and a maximum amount of credits.

## `requirement.ts`

A super-simple class that just stores the "`name`" of a requirement, as well as the type of the requirement (e.g. "College") and its typeValue (e.g. "CS").

## `testing.ts`

Through some custom Node configuration (see `tsconfig.json`), we can run this file to test the algorithm. It will generate multiple schedules and print them to the console using the `ScheduleGenerator.prettyPrintSchedule` function. Current testing is done with a manually-written static set of requirements, courses, credit limit, etc.

You can run `testing.ts` with the following command:

```bash
npx tsx src/schedule-generator/testing.ts
```

(Run from the project root, not this folder.)
