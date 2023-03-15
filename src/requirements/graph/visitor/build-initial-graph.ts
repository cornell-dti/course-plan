import GraphVisitor from './definition';
import { RequirementFulfillmentGraph, ReadonlyRequirementFulfillmentGraph } from '..';
import { CourseForRequirementGraph, CourseWithUniqueId } from '../types';

export type BuildInitialGraphParameters<Requirement, Course> = {
  /**
   * A list of applicable requirements in the system. e.g. if the user is CS major
   * in COE, then the list should contain all university requirements, COE requirements, and CS major
   * requirements.
   */
  readonly requirements: readonly Requirement[];
  /** A list of courses user inputted into course plan, regardless of semesters. */
  readonly courses: readonly Course[];
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
 * Build the initial graph. The intended use is to pass in an undefined or empty graph.
 */
export default class BuildInitialGraph<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> extends GraphVisitor<Requirement, Course> {
  private buildInitialGraphParameters: BuildInitialGraphParameters<Requirement, Course>;

  constructor(buildInitialGraphParameters: BuildInitialGraphParameters<Requirement, Course>) {
    super();
    this.buildInitialGraphParameters = buildInitialGraphParameters;
  }

  public process(graph?: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return buildInitialGraph(
      graph?.copy() ?? new ReadonlyRequirementFulfillmentGraph<Requirement, Course>(),
      this.buildInitialGraphParameters
    );
  }
}

export type BuildRequirementFulfillmentGraphParameters<
  Requirement extends string,
  Course extends CourseWithUniqueId
> = {
  /**
   * A list of applicable requirements in the system. e.g. if the user is CS major
   * in COE, then the list should contain all university requirements, COE requirements, and CS major
   * requirements.
   */
  readonly requirements: readonly Requirement[];
  /** A list of courses user inputted into course plan, regardless of semesters. */
  readonly courses: readonly Course[];
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
 * Build an initial requirement graph from the user's requirements and courses.
 *
 * This is not directly implemented in the constructor of RequirementFulfillmentGraph,
 * in order to abstract the class for testing purposes.
 */
export function buildInitialGraph<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  {
    requirements,
    courses,
    getAllCoursesThatCanPotentiallySatisfyRequirement,
  }: BuildRequirementFulfillmentGraphParameters<Requirement, Course>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  const userCourseCourseIDToCourseMap = new Map<number, Course[]>();
  courses.forEach(course => {
    let existing = userCourseCourseIDToCourseMap.get(course.courseId);
    if (existing == null) {
      existing = [];
      userCourseCourseIDToCourseMap.set(course.courseId, existing);
    }
    existing.push(course);
  });

  // Build a rough graph by naively connecting requirements and courses based on
  // `getAllCoursesThatCanPotentiallySatisfyRequirement`.
  requirements.forEach(requirement => {
    newGraph.addRequirementNode(requirement);
    getAllCoursesThatCanPotentiallySatisfyRequirement(requirement).forEach(courseId => {
      userCourseCourseIDToCourseMap
        .get(courseId)
        ?.forEach(course => newGraph.addEdge(requirement, course));
    });
  });

  return newGraph;
}
