import RequirementFulfillmentGraph from '../requirement-graph';

it('RequirementFulfillmentGraph works.', () => {
  // We mock a requirement graph built using plain strings to represents requirement and courses.
  const graph = new RequirementFulfillmentGraph<string, string>(s => s);

  graph.addEdge('CS3410/CS3420', 'CS 3410');
  graph.addEdge('CS3410/CS3420', 'CS 3420');
  graph.addEdge('Probability', 'MATH 4710');
  graph.addEdge('Elective', 'MATH 4710');

  expect(graph.getAllEdges()).toEqual([
    ['CS3410/CS3420', 'CS 3410'],
    ['CS3410/CS3420', 'CS 3420'],
    ['Probability', 'MATH 4710'],
    ['Elective', 'MATH 4710'],
  ]);
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS 3410', 'CS 3420']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH 4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual(['MATH 4710']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3410')).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3420')).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse('MATH 4710')).toEqual([
    'Probability',
    'Elective',
  ]);

  graph.removeEdge('CS3410/CS3420', 'CS 3420');
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS 3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH 4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual(['MATH 4710']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3410')).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3420')).toEqual([]);
  expect(graph.getConnectedRequirementsFromCourse('MATH 4710')).toEqual([
    'Probability',
    'Elective',
  ]);

  graph.removeEdge('Probability', 'MATH 4710');
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS 3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([]);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual(['MATH 4710']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3410')).toEqual(['CS3410/CS3420']);
  expect(graph.getConnectedRequirementsFromCourse('CS 3420')).toEqual([]);
  expect(graph.getConnectedRequirementsFromCourse('MATH 4710')).toEqual(['Elective']);
});

it('RequirementFulfillmentGraph.addRequirementNode() works', () => {
  const graph = new RequirementFulfillmentGraph<string, string>(s => s);
  graph.addRequirementNode('foo');

  // Test that adding node already exist doesn't erase edges connection.
  graph.addEdge('foo', 'bar');
  graph.addRequirementNode('foo');
  expect(graph.getConnectedCoursesFromRequirement('foo')).toEqual(['bar']);
});
