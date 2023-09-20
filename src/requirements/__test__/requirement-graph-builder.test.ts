import RequirementFulfillmentGraph from '../requirement-graph';
import {
  buildRequirementFulfillmentGraph,
  removeIllegalEdgesFromRequirementFulfillmentGraph,
} from '../requirement-graph-builder';

const CS3410 = { uniqueId: 3410, courseId: 1 };
const CS3420 = { uniqueId: 3420, courseId: 2 };
const MATH4710 = { uniqueId: 4710, courseId: 3 };

const requirements = ['CS3410/CS3420', 'Probability', 'Elective'];

const getAllCoursesThatCanPotentiallySatisfyRequirement = (
  requirement: string,
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
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: {},
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410, CS3420]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// This test ensures that we are actually using userCourses and drop any courses from pre-computed
// course list that are not in userCourses.
it('buildRequirementFulfillmentGraph phase 1 test 2', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, MATH4710],
    userChoiceOnFulfillmentStrategy: {},
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, MATH4710]);
});

// Following two tests test how we are removing edges depending on user choices on fulfillment strategy.
it('buildRequirementFulfillmentGraph phase 2-1 test', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  // In this case, 3420 is removed since user chooses strategy 1.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

it('buildRequirementFulfillmentGraph phase 2-2 test', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3420.courseId] },
    userChoiceOnRequirementOverrides: {},
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  // In this case, 3410 is removed since user chooses strategy 2.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3420]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// The following two tests test that we will remove edges incompatible with user supplied choices.
it('buildRequirementFulfillmentGraph phase 3 test 1', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnRequirementOverrides: {
      [MATH4710.uniqueId]: { optIn: [], optOut: ['Elective'] },
    },
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420]);
});

it('buildRequirementFulfillmentGraph phase 3 test 2', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnRequirementOverrides: {
      [MATH4710.uniqueId]: { optIn: [], optOut: ['Probability'] },
    },
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3410, CS3420, MATH4710]);
});

// The following test runs on a fully specified graph algorithm on complete user choices
it('buildRequirementFulfillmentGraph phase 3 test 3', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: [CS3410, CS3420, MATH4710],
    userChoiceOnFulfillmentStrategy: { 'CS3410/CS3420': [CS3410.courseId] },
    userChoiceOnRequirementOverrides: {
      [CS3410.uniqueId]: { optIn: [], optOut: ['Elective'] },
      [MATH4710.uniqueId]: { optIn: [], optOut: ['Elective'] },
    },
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([CS3420]);
});

it('removeIllegalEdgesFromRequirementFulfillmentGraph tests', () => {
  const graph = new RequirementFulfillmentGraph<string, { uniqueId: number; courseId: 0 }>();
  graph.addEdge('R1', { uniqueId: 1, courseId: 0 });
  graph.addEdge('R2', { uniqueId: 1, courseId: 0 });
  graph.addEdge('R3', { uniqueId: 1, courseId: 0 });
  graph.addEdge('R1', { uniqueId: 2, courseId: 0 });
  graph.addEdge('R2', { uniqueId: 2, courseId: 0 });
  graph.addEdge('R1', { uniqueId: 2, courseId: 0 });
  graph.addEdge('R1', { uniqueId: 3, courseId: 0 });
  graph.addEdge('R4', { uniqueId: 3, courseId: 0 });
  const doubleCountable = ['R1', 'R4'];
  expect(
    Array.from(
      removeIllegalEdgesFromRequirementFulfillmentGraph(
        graph,
        (rA, rB) => doubleCountable.includes(rA) || doubleCountable.includes(rB),
      ).doubleCountedCourseUniqueIDSet,
    ),
  ).toEqual([1]);

  // Illegal double counting edges R2-1, R3-1 removed
  expect(graph.getConnectedRequirementsFromCourse({ uniqueId: 1 })).toEqual(['R1']);
  // Nothing removed
  expect(graph.getConnectedRequirementsFromCourse({ uniqueId: 2 })).toEqual(['R1', 'R2']);
  // Nothing removed
  expect(graph.getConnectedRequirementsFromCourse({ uniqueId: 3 })).toEqual(['R1', 'R4']);
});
