# Requirements Data

The requirements data and its interpreting algorithm is uniquely developed by and for CoursePlan.
This document aims to give you a high level overview of how it works.

## Workflow

Requirement computation is split into two phases for efficiency concerns:

1. Pre-computation phase.
   In this phase, for each requirement (except a few that almost all classes that fulfill it), we
   enumerate all courses that can fulfill it. We store the enumeration into a "decorated" requirement
   json.
2. Client-side computation phase.
   In this phase, the user's course list is compared against requirement data.

   - For requirements that can be satisfied by almost any course, we run a simple check in
     `ifAllEligible` in [`req-functions.ts`](./reqs-functions.ts) to see whether it can be
     satisfied.
   - For requirements that can be satisfied by a pre-computed list of courses, we check whether the
     user's course is in that list.

   After that, we run some deduplication algorithm to filter away courses that are used to satisfy
   more than one requirement, but it's actually only allowed to be used to fulfill one.

## Where is the code

### Generated Data

- [`filtered-all-courses.json`](./filtered-all-courses.json) contains course information generated
  by `fetcher.ts`.
- [`decorated-requirements.json`](./decorated-requirements.json) contains all requirement metadata
  with additional list of fulfillable courses attached to each requirement. The file
  [`filtered-all-courses.ts`](./``filtered-all-courses.ts) simply reexported a statically-typed
  version of it.

### Requirements Sources

The metadata of all requirements (name, source, minimum count, etc) is stored in
[`source-requirements-json.ts`](./source-requirements-json.ts). It's type is specified by the
`RequirementsJson` type in [`types.ts`](./types.ts). The meanings of the field has been documented
as JSDoc directly in type definitions.

The code for precomputing a list of fulfillable courses are in the [`checkers`](./checkers) folder.
They are organized by colleges and majors. All of those checkers are aggregated together in the
[`checkers/all-requirements.checker.ts`](./checkers/all-requirements-checkers.ts).

## Architecture

### Pre-computation phase

To reiterate, this phase computes a list of satisfying courses for each requirement.

1. Setup: each college or major requirement has a field called `checker`. This is a function or
   an array of function that can be used to check whether a course satisfy a requirement or
   sub-requirements.
2. During pre-computation, we run the `checker` against every possible course, to get a list of
   courses that can satisfy this requirement.
3. We attach this list to the requirement metadata in [`generator.ts`](./generator.ts).
4. Now we created [`decorated-requirements.json`](./decorated-requirements.json).
   Pre-computation is done.

Each checker is either:

- a TypeScript function `(course: Course) => boolean` that directly tells whether the course
  satisfies the requirement that this checker correspond to.
- or a list of such functions, where each function checks whether the course satisfies one of the
  sub-requirements that this checker correspond to.

This is how you should use your checkers:

- Case 1: the requirement contains no sub-requirement. Use option 1. Example: CS major practicum.
- Case 2: the requirement contains sub-requirements. Use option 2. Example: CS Core requirement.

Also consider the cases of double counting with `operator`:

- Operator type 'and' indicates that all instances of a sub-requirement is necessary. Example: CS Introductory Programming
- Operator type 'or' indicates that only one instance of a sub-requirement can be used. Example: ENGL Four 4000 Levels

### Frontend Computation Phase

#### University Requirements

Since too many courses can satisfy these requirements, the satisfying course list is not
pre-computed to reduce the data sent from server to client.

It's computed on the client side directly in `computeUniversityRequirementFulfillments` function
inside [`reqs-functions.ts`](./reqs-functions.ts).

#### College or Major Requirements

1. We first naively compute whether a sub-requirement is fulfilled by checking whether any course in
   user's list is in the pre-computed satisfying course list.
2. Then, we run a deduplication pass to remove all courses that have been double-counted that
   should not be. (NOTE: THIS HAS NOT BEEN IMPLEMENTED YET.)
3. Finally, We sum up the total number of sub-requirements/credits already fulfilled for each
   requirement, to decide whether a requirement as a whole as been satisfied.

## Contributing

### Modifying Requirements

If you want to change a requirement, edit relevant files in `data` folder.

### Add A New Requirement

If you want to add a support for new major or college, add relevant files in `data` folder.
For example, if you want to add support for `CSGO` major, create a file called `csgo.ts` in
`data/majors`. Mimic the examples in neighboring files.

Then, import and link your new checkers in [`data/index.ts`](./data/index.ts).
For example, if you want to add support for `CSGO` major, add

```typescript
import csgoRequirements from './majors/csgo';
```

to `data/index.ts`'s import list, and follow the existing examples to add a new requirement object.

To keep the file clean, you should keep the names alphabetically sorted.

### Run Generator

After that, re-run `npm run req-gen` to generate a new `decorated-requirements.json`.
**Without this step, the frontend will keep using the old requirement data and algorithm.**
