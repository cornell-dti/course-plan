import RequirementFulfillmentGraph from './requirement-graph';
import { HashMap } from './util/collections';

type BuildRequirementFulfillmentGraphParameters<Requirement extends string, Course> = {
  /**
   * A list of applicable requirements in the system. e.g. if the user is CS major
   * in COE, then the list should contain all university requirements, COE requirements, and CS major
   * requirements.
   */
  readonly requirements: readonly Requirement[];
  /** A list of courses user inputted into course plan, regardless of semesters. */
  readonly userCourses: readonly Course[];
  /**
   * Some requirements might have several different ways to fulfill them. This is a map from
   * toggleable requirements to a list of courses that could be applied to the requirement under
   * the user's choice.
   */
  readonly userChoiceOnFulfillmentStrategy: Readonly<Record<Requirement, readonly Course[]>>;
  /**
   * A list of (requirement, course) tuple that describe how the user decides how a course is used to
   * satisfy requirements. Suppose a course c can be used to satisfy both r1 and r2, but the
   * requirements do not allow double counting, then a tuple (r1, c) means that we should keep the
   * (r1, c) edge in the graph and drop the (r2, c) edge.
   */
  readonly userChoiceOnDoubleCountingElimination: readonly (readonly [Requirement, Course])[];
  /** See RequirementFulfillmentGraph for its usage. */
  readonly getCourseUniqueID: (c: Course) => string | number;
  /**
   * Naively give a list of courses that can satisfy a requirement. Most of the time this function
   * should just return the pre-computed course list. For requirements have multiple fulfillment
   * strategies, it will return the union of all pre-computed course list.
   */
  readonly getAllCoursesThatCanPotentiallySatisfyRequirement: (
    requirement: Requirement
  ) => readonly Course[];
  /**
   * Report whether a requirement allows a course connected to it to also be used to fulfill some
   * other requirement.
   */
  readonly allowDoubleCounting: (requirement: Requirement) => boolean;
};

const buildRequirementFulfillmentGraph = <Requirement extends string, Course>({
  requirements,
  userCourses,
  userChoiceOnFulfillmentStrategy,
  userChoiceOnDoubleCountingElimination,
  getCourseUniqueID,
  getAllCoursesThatCanPotentiallySatisfyRequirement,
  allowDoubleCounting,
}: BuildRequirementFulfillmentGraphParameters<Requirement, Course>): {
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<Requirement, Course>;
  readonly illegallyDoubleCountedCourses: readonly Course[];
} => {
  const graph = new RequirementFulfillmentGraph<Requirement, Course>(getCourseUniqueID);
  const userCourseSet = new HashMap<Course, Course>(getCourseUniqueID);
  userCourses.forEach(course => userCourseSet.set(course, course));

  // Phase 1:
  //   Building a rough graph by naively connecting requirements and courses based on
  //   `getAllCoursesThatCanPotentiallySatisfyRequirement`.
  requirements.forEach(requirement => {
    graph.addRequirementNode(requirement);
    getAllCoursesThatCanPotentiallySatisfyRequirement(requirement).forEach(course => {
      const userCourse = userCourseSet.get(course);
      if (userCourse != null) graph.addEdge(requirement, userCourse);
    });
  });

  // Phase 2: Respect user's choices on fulfillment strategies.
  Object.entries<readonly Course[]>(userChoiceOnFulfillmentStrategy).forEach(
    ([key, coursesOfChosenFulfillmentStrategy]) => {
      const correspondingRequirement = key as Requirement;
      const coursesToKeepSet = new HashMap<Course, null>(getCourseUniqueID);
      coursesOfChosenFulfillmentStrategy.forEach(course => coursesToKeepSet.set(course, null));

      graph
        .getConnectedCoursesFromRequirement(correspondingRequirement)
        .forEach(connectedCourse => {
          if (!coursesToKeepSet.has(connectedCourse)) {
            graph.removeEdge(correspondingRequirement, connectedCourse);
          }
        });
    }
  );

  // Phase 3: Respect user's choices on double-counted courses.
  userChoiceOnDoubleCountingElimination.forEach(([chosenRequirement, course]) => {
    graph.getConnectedRequirementsFromCourse(course).forEach(connectedRequirement => {
      if (allowDoubleCounting(connectedRequirement)) return;
      if (connectedRequirement !== chosenRequirement) {
        graph.removeEdge(connectedRequirement, course);
      }
    });
  });

  // Phase 4: Detect illegally double counted courses.
  const illegallyDoubleCountedCourses = userCourses.filter(
    course =>
      graph.getConnectedRequirementsFromCourse(course).filter(it => !allowDoubleCounting(it))
        .length > 1
  );

  // Phase MAX_INT: PROFIT!
  return { requirementFulfillmentGraph: graph, illegallyDoubleCountedCourses };
};

export default buildRequirementFulfillmentGraph;
