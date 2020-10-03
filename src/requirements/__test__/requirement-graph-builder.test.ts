import buildRequirementFulfillmentGraph from '../requirement-graph-builder';

const requirements = ['CS3410/CS3420', 'Probability', 'Elective'];
const getUniqueID = (it: string) => it;
const getAllCoursesThatCanPotentiallySatisfyRequirement = (
  requirement: string
): readonly string[] => {
  switch (requirement) {
    case 'CS3410/CS3420':
      return ['CS3410', 'CS3420'];
    case 'Probability':
      return ['MATH4710'];
    case 'Elective':
      return ['CS3410', 'CS3420', 'MATH4710'];
    default:
      throw new Error('Should not get here!');
  }
};
// If choice is 1, pick 3410 fulfillment strategy, else, choose 3420
const getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy = (
  choice: 1 | 2
) => ({
  correspondingRequirement: 'CS3410/CS3420',
  coursesOfChosenFulfillmentStrategy: [choice === 1 ? 'CS3410' : 'CS3420']
});

it('buildRequirementFulfillmentGraph phase 1 test 1', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: ['CS3410', 'CS3420', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [],
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3410', 'CS3420']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([
    'CS3410',
    'CS3420',
    'MATH4710'
  ]);
});

// This test ensures that we are actually using userCourses and drop any courses from pre-computed
// course list that are not in userCourses.
it('buildRequirementFulfillmentGraph phase 1 test 2', () => {
  const graph = buildRequirementFulfillmentGraph({
    requirements,
    userCourses: ['CS3410', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [],
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual(['CS3410', 'MATH4710']);
});

// Following two tests test how we are removing edges depending on user choices on fulfillment strategy.
it('buildRequirementFulfillmentGraph phase 2-1 test', () => {
  const graph = buildRequirementFulfillmentGraph<string, string, 1 | 2>({
    requirements,
    userCourses: ['CS3410', 'CS3420', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [1],
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  // In this case, 3420 is removed since user chooses strategy 1.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([
    'CS3410',
    'CS3420',
    'MATH4710'
  ]);
});

it('buildRequirementFulfillmentGraph phase 2-2 test', () => {
  const graph = buildRequirementFulfillmentGraph<string, string, 1 | 2>({
    requirements,
    userCourses: ['CS3410', 'CS3420', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [2],
    userChoiceOnDoubleCountingElimiation: [],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  // In this case, 3410 is removed since user chooses strategy 2.
  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3420']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH4710']);
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([
    'CS3410',
    'CS3420',
    'MATH4710'
  ]);
});

// The following two tests test that we will remove edges incompatible with user supplied choices.
it('buildRequirementFulfillmentGraph phase 3-1 test 1', () => {
  const graph = buildRequirementFulfillmentGraph<string, string, 1 | 2>({
    requirements,
    userCourses: ['CS3410', 'CS3420', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [1],
    userChoiceOnDoubleCountingElimiation: [['Probability', 'MATH4710']],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual(['MATH4710']);
  // We need a functional phase 3-2 to eliminate CS3410 here.
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual(['CS3410', 'CS3420']);
});

it('buildRequirementFulfillmentGraph phase 3-1 test 2', () => {
  const graph = buildRequirementFulfillmentGraph<string, string, 1 | 2>({
    requirements,
    userCourses: ['CS3410', 'CS3420', 'MATH4710'],
    userChoiceOnFulfillmentStrategy: [1],
    userChoiceOnDoubleCountingElimiation: [['Elective', 'MATH4710']],
    getRequirementUniqueID: getUniqueID,
    getCourseUniqueID: getUniqueID,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
    getCorrespondingRequirementAndAllRelevantCoursesUnderFulfillmentStrategy
  });

  expect(graph.getConnectedCoursesFromRequirement('CS3410/CS3420')).toEqual(['CS3410']);
  expect(graph.getConnectedCoursesFromRequirement('Probability')).toEqual([]);
  // We need a functional phase 3-2 to eliminate CS3410 here.
  expect(graph.getConnectedCoursesFromRequirement('Elective')).toEqual([
    'CS3410',
    'CS3420',
    'MATH4710'
  ]);
});
