import { getConstraintViolations } from '../requirement-constraints-utils';
import RequirementFulfillmentGraph from '.';
import { CourseForRequirementGraph } from './types';

/**
 * @deprecated Use visitor pipeline model.
 */
export type BuildRequirementFulfillmentGraphParametersDeprecated<
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
   * The mapping from course's unique ID to requirement override opt-in and opt-out options.
   * It describes how the user wants to use a course to override requirements.
   * This handles AP/IB overrides, as well as general overrides. This can encode double counting
   * elimination as opt-out.
   * The granularity of optIn/optOut being slot-specific requires the actual
   * slot computation to be handled in the frontend computation. When building the
   * graph, only optIn/optOut choices are relevant (to add the extra edges).
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      // Including both acknowledged and arbitrary opt-in.
      readonly optIn: readonly Requirement[];
      readonly optOut: readonly Requirement[];
    };
  };
  /**
   * Naively give a list of courses ID that can satisfy a requirement. Most of the time this function
   * should just return the pre-computed eligible course id list. For requirements have multiple
   * fulfillment strategies, it will return the union of all pre-computed course list.
   */
  readonly getAllCoursesThatCanPotentiallySatisfyRequirement: (
    requirement: Requirement
  ) => readonly number[];
};

/**
 * @deprecated Use visitor pipeline model.
 */
export const buildRequirementFulfillmentGraphDeprecated = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>({
  requirements,
  userCourses,
  userChoiceOnFulfillmentStrategy,
  userChoiceOnRequirementOverrides,
  getAllCoursesThatCanPotentiallySatisfyRequirement,
}: BuildRequirementFulfillmentGraphParametersDeprecated<
  Requirement,
  Course
>): RequirementFulfillmentGraph<Requirement, Course> => {
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

  // Phase 3: Respect user's choices on opt-in/opt-out.
  userCourses.forEach(course => {
    const userChoiceOnOptInOptOutCourse = userChoiceOnRequirementOverrides[course.uniqueId];
    if (userChoiceOnOptInOptOutCourse == null) return;
    userChoiceOnOptInOptOutCourse.optIn.forEach(optedInRequirement => {
      graph.addEdge(optedInRequirement, course);
    });
    userChoiceOnOptInOptOutCourse.optOut.forEach(optedOutRequirement => {
      graph.removeEdge(optedOutRequirement, course);
    });
  });

  // Phase MAX_INT: PROFIT!
  return graph;
};

/**
 * @deprecated Use visitor pipeline model.
 */
export const removeIllegalEdgesFromRequirementFulfillmentGraph = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  requirementConstraintHolds: (requirementA: Requirement, requirementB: Requirement) => boolean
): {
  courseToRequirementsInConstraintViolations: Map<string | number, Set<Requirement[]>>;
  doubleCountedCourseUniqueIDSet: ReadonlySet<string | number>;
} => {
  const {
    constraintViolationsGraph,
    courseToRequirementsInConstraintViolations,
    doubleCountedCourseUniqueIDSet,
  } = getConstraintViolations(graph, requirementConstraintHolds);
  graph.subtractGraphEdges(constraintViolationsGraph);
  return { courseToRequirementsInConstraintViolations, doubleCountedCourseUniqueIDSet };
};
