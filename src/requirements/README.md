# Requirement Computation Overview

The requirements data and its interpreting algorithm is uniquely developed by and for CoursePlan.
This document aims to give you a high level overview of how it works.

## Concepts

### Requirement Type

Requirement type describes how a requirement can be fulfilled by classes. In the code, it is usually
represented by the `fulfilledBy` field.

There are two base types we support: fulfill by credit sum (`fulfilledBy: 'credits'`) and fulfill by
course count (`fulfilledBy: 'courses'`).

We also have toggleable requirements (`fulfilledBy: 'toggleable'`), which has multiple potential
ways to be fulfilled, and the user must choose one of them. Each choice can be either `courses` or
`credits`.

Finally, we have a special type called self-check requirements (`fulfilledBy: 'self-check'`). You
should think of this type as "we give up". Ideally, we should have fewer and fewer of this kind of
requirements while our requirement infra improves.

### Requirement Checker and Eligible Courses

A checker is a function that takes in a course and tells whether this course can be used to fulfill
a requirement. Note that a course doesn't need to completely check off a requirement for this
function to `return true`. A course just needs to help fulfill the requirement. For example, if a
requirement can be fulfilled by course A and course B together, then running on the checker on both
courses should return true, and it should return false on all the other checkers.

Eligible courses are a list of courses IDs, organized by semesters, that you can get after running
checkers against all courses. It is used by the graph algorithm to build the requirement graph.

### Requirement Fulfillment Progress

The fulfillment progress can be considered as simple tuple `(# of XYZ fulfilled, # of XYZ required)`,
where `XYZ` can be courses or credits.

### Requirement Graph

The requirement graph is a bipartite graph between requirements and courses. It describes how
requirements are linked to courses, but it knows nothing about the requirement fulfillment progress.

### Grouped Requirement Report

It is the list of requirement fulfillment progress report, grouped into colleges, majors and minors.
It knows nothing about the requirement graph structure.

### Requirement Fulfillment

A single requirement with several subrequirements, including the current fulfillment progress.

### Subrequirement

Sub-requirement is nested inside a requirement. It corresponds to one slot in the requirement data.

### Double Counting

Double counting happens when one course is used to help fulfill two requirements. Not all double
countings are illegal. For example, the engineering probability requirement allows it.

A course `c` is double-counted if for the number of requirements connected to `c` that don't allow
double-counting is `>= 2`.

Note that allowing double counting is a property of requirement (`allowDoubleCounting` field)
instead of a course. For example, it's correct to say that engineering probability requirement
allows double counting, while engineering distribution does not allow double counting. It's
incorrect to say that `MATH 4710` allows double counting.

TLDR: Requirements allow or disallow double counting. Courses are double-counted or not.

## Workflow

Requirement computation is split into 3 phases for efficiency concerns:

1. Pre-computation phase.

   In this phase, for each requirement (except a few that almost all classes that fulfill it), we
   enumerate all courses that can fulfill it. We store the enumeration into a "decorated" requirement
   json.

2. Requirement graph building phase.

   In this phase, we build the requirement graph using the graph algorithm. The algorithm will be
   discussed in detail in later sections.

3. Client-side computation phase.

   In this phase, we look up the data in the requirement graph to determine the fulfillment progress
   for each requirement. Then we produce a list of grouped requirement report to be displayed in
   requirement bar.

## Detailed Architecture

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

Each checker is a list of functions `(course: Course) => boolean`, where each function checks
whether the course satisfies one of the sub-requirements that this checker correspond to.

For each checker, there is an associated minimal number of course/credit required for that
sub-requirement stored in `perSlotMinCount`. There can also be a `minNumberOfSlots` field, which
specifies that we don't need to fulfill every slot, but only `minNumberOfSlots` of sub-requirements.

### Frontend Computation Phase

#### University Requirements

Since too many courses can satisfy these requirements, the satisfying course list is not
pre-computed to reduce the data sent from server to client.

It's computed on the client side directly inside
[`requirement-fronend-computation.ts`](./requirement-fronend-computation.ts).

#### College/Major/Minor Requirements

See the later section on requirement graph.

## The Requirement Graph in Depth

The core of the requirement graph building steps are follows:

1. Building a rough graph. In this step, we connect requirement `r` and course `c` whenever we find
   that `c` is in the course list of `r` in the big requirement json.
2. Some requirements might have multiple fulfillment options and the user may choose one of them
   Remove all the edges from requirements to courses that are not part of the user’s choice.
3. The user might make some choices on tie-breaking for double-counted courses. Remove all the edges
   from courses to requirements that are not the picked requirement in the choice.
4. After that, we can inspect the graph from the courses side, and then find all the courses that
   are connected to more than one requirement that doesn't allow double counting. We report these
   courses are being illegally double counted.

This graph algorithm allows us to elegantly deal with AP/IB credits. For each type of AP/IB credits,
we link them to an equivalent course by giving them the same ID as the equivalent course.

The graph also allows us to auto count cross-listed courses. We use the `crseId` from the course
roster to decide whether two courses are equal. Two courses with the same `crseId` are known to be
crosslisted.

The CoursePlan DevSesh linked on the
[dev website](https://dev.cornelldti.org/docs/resource-devsesh#subteam-architecture) provides all
the rationale and visualization of the process. The
[design document example](https://dev.cornelldti.org/docs/assignments-examples-cp-requirements-algo)
on the dev website provides more technical discussion for implementation.

## Where is the code

### Generated Data

- [`functions/filtered_courses/*.json`](../../functions/filtered_courses) contains course
  information generated by `fetcher.ts`. The file
  [`filtered-all-courses.ts`](./filtered-all-courses.ts) simply reexported a statically-typed
  version of it.
- [`decorated-requirements.json`](./decorated-requirements.json) contains all requirement metadata
  with additional list of fulfillable courses attached to each requirement. The file
  [`typed-requirement-json.ts`](./typed-requirement-json.ts) simply reexported a statically-typed
  version of it.

### Requirements Data Sources

The metadata of all requirements (name, source, minimum count, etc) is stored in [`data`](./data).
It's type is specified by the `RequirementsJson` type in [`types.ts`](./types.ts). The meanings of
the field has been documented as JSDoc directly in type definitions.

The code for precomputing a list of fulfillable courses are in the [`data`](./data) folder. The
requirements are reorganized into college, major and minor folders. Each college, major and minor's
requirement is in it's own file.

### Requirement Graph Sources

- [`requirement-graph.ts`](./requirement-graph.ts) is the abstract data structure about the
  requirement graph. It does not contain any logic specific to requirement computation, other than
  that it encodes a bidirectional graph.
  [PR 140](https://github.com/cornell-dti/course-plan/pull/140) provides the rational behind this
  choice.
- [`requirement-graph-builder.ts`](./requirement-graph-builder.ts) implements the main requirement
  graph building algorithm. It leaves out some methods abstract (e.g. how you decide whether a
  requirement allows double counting), so that the algorithm itself can be easily tested independent
  of the actual implementation.
- [`./requirement-graph-builder-from-user-data`](./requirement-graph-builder-from-user-data.ts)
  calls `requirement-graph-builder.ts`, but with all the abstract function filled in. It can take in
  courses and user choices and produce the graph.

### Final Computation for Frontend Vue Components

- [`requirement-frontend-computation.ts`](./requirement-frontend-computation.ts) builds the
  requirement graph and fulfillment progress for each requirement.

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
