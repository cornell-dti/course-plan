import buildRequirementFulfillmentGraph from '../requirement-graph-builder';

const CS3410 = { uniqueId: 3410, courseId: 1 };
const CS3420 = { uniqueId: 3420, courseId: 2 };
const MATH4710 = { uniqueId: 4710, courseId: 3 };

const requirements = ['CS3410/CS3420', 'Probability', 'Elective'];

const getAllCoursesThatCanPotentiallySatisfyRequirement = (
  requirement: string
): readonly number[] => {
  switch (requirement) {
    case 'CS3410/CS3420':
      return [CS3410.courseId, CS3420.courseId];
    case 'Probability':
      return [MATH4710.courseId];
    case 'Elective':
      return [CS3410.courseId, CS3420.courseId, MATH4710.courseId];
    default:
      throw new Error('Should not get here!');
  }
};

it('buildRequirementFulfillmentGraph phase 1 test 1', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, CS3420, MATH4710],
      userChoiceOnFulfillmentStrategy: {},
      userChoiceOnDoubleCountingElimination: {},
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410, CS3420]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// This test ensures that we are actually using userCourses and drop any courses from pre-computed
// course list that are not in userCourses.
it('buildRequirementFulfillmentGraph phase 1 test 2', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, MATH4710],
      userChoiceOnFulfillmentStrategy: {},
      userChoiceOnDoubleCountingElimination: {},
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, MATH4710]);
});

// Following two tests test how we are removing edges depending on user choices on fulfillment strategy.
it('buildRequirementFulfillmentGraph phase 2-1 test', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, CS3420, MATH4710],
      userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
      userChoiceOnDoubleCountingElimination: {},
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  // In this case, 3420 is removed since user chooses strategy 1.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

it('buildRequirementFulfillmentGraph phase 2-2 test', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, CS3420, MATH4710],
      userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3420.courseId] },
      userChoiceOnDoubleCountingElimination: {},
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  // In this case, 3410 is removed since user chooses strategy 2.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3420]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// The following two tests test that we will remove edges incompatible with user supplied choices.
it('buildRequirementFulfillmentGraph phase 3 test 1', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, CS3420, MATH4710],
      userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
      userChoiceOnDoubleCountingElimination: { [MATH4710.uniqueId]: 'Probability' },
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420]);
});

it('buildRequirementFulfillmentGraph phase 3 test 2', () => {
  const graph = buildRequirementFulfillmentGraph(
    {
      requirements,
      userCourses: [CS3410, CS3420, MATH4710],
      userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
      userChoiceOnDoubleCountingElimination: { [MATH4710.uniqueId]: 'Elective' },
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: () => false,
    },
    /* keepCoursesWithoutDoubleCountingEliminationChoice */ true
  );

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// The following test ensures that we will remove edges when user makes no choice on courses.
it('buildRequirementFulfillmentGraph phase 3 test 3', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnDoubleCountingElimination: { [MATH4710.uniqueId]: 'Probability' },
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    allowDoubleCounting: () => false,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([]);
});

// The following test runs on a fully specified graph algorithm on complete user choices
it('buildRequirementFulfillmentGraph phase 3 test 4', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnDoubleCountingElimination: {
      [CS3410.uniqueId]: 'CS3410/CS3420',
      [CS3420.uniqueId]: 'Elective',
      [MATH4710.uniqueId]: 'Elective',
    },
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    allowDoubleCounting: r => r === 'Probability',
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3420, MATH4710]);
});

// Normally, we will remove all edges when there is no user choice associated with a unique ID.
// If we do the same for AP/IB/swim courses, then all these courses will never be able to fulfill
// anything.
// The following test ensures that we don't regress again.
it('AP/IB/swim test course edge is not removed in step 3', () => {
  // Test this for a lot of different unique ID less than
  for (let uniqueId = -1; uniqueId >= -10; uniqueId -= 1) {
    const graph = buildRequirementFulfillmentGraph({
      requirements,
      userCourses: [{ courseId: CS3410.courseId, uniqueId }], // mock an AP/IB course
      userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
      userChoiceOnDoubleCountingElimination: {},
      userChoiceOnRequirementOverrides: {},
      getAllCoursesThatCanPotentiallySatisfyRequirement,
      allowDoubleCounting: r => r === 'Probability',
    });

    expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([
      { courseId: CS3410.courseId, uniqueId },
    ]);
  }
});
