import RequirementFulfillmentGraph, { CourseWithUniqueId } from '../requirement-graph';

const CS3410 = { uniqueId: 3410 };
const CS3420 = { uniqueId: 3420 };
const MATH4710 = { uniqueId: 4710 };

it('RequirementFulfillmentGraph works.', () => {
  // We mock a requirement graph built using plain strings to represents requirement and courses.
  const graph = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();

  graph.addEdge('CS3410/CS3420', CS3410);
  graph.addEdge('CS3410/CS3420', CS3420);
  graph.addEdge('Probability', MATH4710);
  graph.addEdge('Elective', MATH4710);

  expect(graph.getAllEdges()).toEqual([
    ['CS3410/CS3420', CS3410],
    ['CS3410/CS3420', CS3420],
    ['Probability', MATH4710],
    ['Elective', MATH4710],
  ]);
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410, CS3420]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([MATH4710]);
  expect(graph.getConnectedRequirementsFromCourse(CS3410)).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse(CS3420)).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse(MATH4710)).toEqual(['Probability', 'Elective']);

  graph.removeEdge('CS3410/CS3420', CS3420);
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([MATH4710]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([MATH4710]);
  expect(graph.getConnectedRequirementsFromCourse(CS3410)).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse(CS3420)).toEqual([]);
  expect(graph.getConnectedRequirementsFromCourse(MATH4710)).toEqual(['Probability', 'Elective']);

  graph.removeEdge('Probability', MATH4710);
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual([CS3410]);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([MATH4710]);
  expect(graph.getConnectedRequirementsFromCourse(CS3410)).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse(CS3420)).toEqual([]);
  expect(graph.getConnectedRequirementsFromCourse(MATH4710)).toEqual(['Elective']);
});

it('RequirementFulfillmentGraph.addRequirementNode() works', () => {
  const graph = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();
  graph.addRequirementNode('foo');

  // Test that adding node already exist doesn't erase edges connection.
  graph.addEdge('foo', { uniqueId: 234 });
  graph.addRequirementNode('foo');
  expect(graph.getConnectedCoursesFromRequirement('foo')).toEqual([{ uniqueId: 234 }]);
});

it('RequirementFulfillmentGraph.addGraph() works', () => {
  const graph1 = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();
  graph1.addRequirementNode('foo');
  graph1.addEdge('foo', { uniqueId: 123 });

  const graph2 = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();
  graph2.addRequirementNode('foo');
  graph2.addEdge('foo', { uniqueId: 234 });
  graph2.addRequirementNode('bar');

  graph1.addGraph(graph2);
  expect(graph1.getAllRequirements()).toContainEqual('bar');
  expect(graph1.getConnectedCoursesFromRequirement('foo')).toContainEqual({ uniqueId: 123 });
  expect(graph1.getConnectedCoursesFromRequirement('foo')).toContainEqual({ uniqueId: 234 });
});

it('RequirementFulfillmentGraph.subtractGraphEdges() works', () => {
  const graph1 = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();
  graph1.addRequirementNode('foo');
  graph1.addEdge('foo', { uniqueId: 123 });
  graph1.addEdge('foo', { uniqueId: 234 });

  const graph2 = new RequirementFulfillmentGraph<string, CourseWithUniqueId>();
  graph2.addRequirementNode('foo');
  graph2.addEdge('foo', { uniqueId: 234 });

  graph1.subtractGraphEdges(graph2);
  expect(graph1.getConnectedCoursesFromRequirement('foo')).toContainEqual({ uniqueId: 123 });
  expect(graph1.getConnectedCoursesFromRequirement('foo')).not.toContainEqual({ uniqueId: 234 });
});
