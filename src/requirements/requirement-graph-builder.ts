import RequirementFulfillmentGraph, { CourseWithUniqueId } from './requirement-graph';

interface CourseForRequirementGraph extends CourseWithUniqueId {
  readonly courseId: number;
}

type BuildRequirementFulfillmentGraphParameters<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> = {
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
   * toggleable requirements to a list of course IDs that could be applied to the requirement under
   * the user's choice.
   * (Note: it has to be course id because we want to match course id against eligible course id list.)
   */
  readonly userChoiceOnFulfillmentStrategy: Readonly<Record<Requirement, readonly number[]>>;
  /**
   * The mapping from course's unique ID to requirement.
   * It describes how the user decides how a course is used to satisfy requirements.
   * Suppose a course with unique ID c can be used to satisfy both r1 and r2, but the
   * requirements do not allow double counting, then a mapping `c => r1` means that we should keep the
   * (r1, c) edge in the graph and drop the (r2, c) edge.
   */
  readonly userChoiceOnDoubleCountingElimination: Readonly<Record<number, Requirement>>;
  /**
   * Naively give a list of courses ID that can satisfy a requirement. Most of the time this function
   * should just return the pre-computed eligible course id list. For requirements have multiple
   * fulfillment strategies, it will return the union of all pre-computed course list.
   */
  readonly getAllCoursesThatCanPotentiallySatisfyRequirement: (
    requirement: Requirement
  ) => readonly number[];
  /**
   * Report whether a requirement allows a course connected to it to also be used to fulfill some
   * other requirement.
   */
  readonly allowDoubleCounting: (requirement: Requirement) => boolean;
};

const buildRequirementFulfillmentGraph = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>({
  requirements,
  userCourses,
  userChoiceOnFulfillmentStrategy,
  userChoiceOnDoubleCountingElimination,
  getAllCoursesThatCanPotentiallySatisfyRequirement,
  allowDoubleCounting,
}: BuildRequirementFulfillmentGraphParameters<Requirement, Course>): {
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<Requirement, Course>;
  readonly illegallyDoubleCountedCourses: readonly Course[];
} => {
  const graph = new RequirementFulfillmentGraph<Requirement, Course>();
  const userCourseCourseIDToCourseMap = new Map<number, Course[]>();
  userCourses.forEach(course => {
    let existing = userCourseCourseIDToCourseMap.get(course.courseId);
    if (existing == null) {
      existing = [];
      userCourseCourseIDToCourseMap.set(course.courseId, existing);
    }
    existing.push(course);
  });

  // Phase 1:
  //   Building a rough graph by naively connecting requirements and courses based on
  //   `getAllCoursesThatCanPotentiallySatisfyRequirement`.
  requirements.forEach(requirement => {
    graph.addRequirementNode(requirement);
    getAllCoursesThatCanPotentiallySatisfyRequirement(requirement).forEach(courseId => {
      (userCourseCourseIDToCourseMap.get(courseId) || []).forEach(userCourse =>
        graph.addEdge(requirement, userCourse)
      );
    });
  });

  // Phase 2: Respect user's choices on fulfillment strategies.
  Object.entries<readonly number[]>(userChoiceOnFulfillmentStrategy).forEach(
    ([key, coursesOfChosenFulfillmentStrategy]) => {
      const correspondingRequirement = key as Requirement;
      const coursesToKeepSet = new Set(coursesOfChosenFulfillmentStrategy);

      graph
        .getConnectedCoursesFromRequirement(correspondingRequirement)
        .forEach(connectedCourse => {
          if (!coursesToKeepSet.has(connectedCourse.courseId)) {
            graph.removeEdge(correspondingRequirement, connectedCourse);
          }
        });
    }
  );

  // Phase 3: Respect user's choices on double-counted courses.
  Object.entries(userChoiceOnDoubleCountingElimination).forEach(([key, chosenRequirement]) => {
    const courseUniqueID = parseInt(key, 10);
    graph
      .getConnectedRequirementsFromCourse({ uniqueId: courseUniqueID })
      .forEach(connectedRequirement => {
        if (allowDoubleCounting(connectedRequirement)) return;
        if (connectedRequirement !== chosenRequirement) {
          graph.removeEdge(connectedRequirement, { uniqueId: courseUniqueID });
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
