# schedule-generator

This folder contains everything necessary to the functionality of the schedule-generation _algorithm_, for the new semesterly schedule-generation feature launching SP24.

Below is a detailed file-by-file breakdown:

## `algorithm.ts`

This is essentially what is imported and used by the frontend. It takes in a request (type `GeneratorRequest`, see `generator-request.ts`) and outputs a meaningful value of type `GeneratedScheduleOutput` which can be used to see what courses fulfill what requirements and are at what times.

Currenlty the algorithm functions by randomly shuffling potential courses the user inputted, and then generating the first valid schedule that can be constructed through iteration through this randomly shuffled list.

## `course-unit.ts`

A `CourseUnit` is a class that represents a single course _in a single semester and "meta-timeslot"_. Example:

Say we have one lecture L and two discussions D1 and D2. Then there would be generated:

```typescript
Course(name=L, timeslots=[LectureTimeslot, D1Timeslot], ...)
Course(name=L, timeslots=[LectureTimeslot, D2Timeslot], ...)
```

This is done to aid in the random-shuffling algorithm as well as overlap-checking mechanism (in `algorithm.ts`).

A `Course` has associated with it 1-7 days of the week (hence why we need multiple `Course`s for a single class representation, as some may meet on different days — this is the easiest way to represent this).

## `generator-request.ts`

Just a narrow wrapper around the information you send to `algorithm.ts` for schedule generation. It stores the user's inputted courses to fulfill requirements, desired requirements to be fulfilled, the name of the semester, and a maximum amount of credits.

## `requirement.ts`

To be honest this probably shouldn't even exist, it's a super-simple class that just stores the "`type`" (name) of a requirement. One example such requirement type could be: "First-year Writing Seminar".

## `testing.ts`

Through some custom Node configuration (see `tsconfig.json`), we can run this file to test the algorithm. It will generate a schedule and print it to the console using the `ScheduleGenerator.prettyPrintSchedule` function. Current testing is done with a manually-written static set of requirements, courses, credit limit, etc.

You can run `testing.ts` with the following command:

```bash
ts-node testing.ts
```

If you get some complaint about `ts-node` not being defined you should just install it globally:

```bash
`npm install -g ts-node typescript "@types/node"`
```

Eventually, once we have frontend tests or whatnot, we can remove this file (as well as `testing.ts`
for that matter).
