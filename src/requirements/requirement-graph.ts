export interface CourseWithUniqueId {
  readonly uniqueId: number;
}

/**
 * A mutable graph data structure that represents the mathematically relation between requirement
 * and course.
 * An edge between requirement `r` and course `c` implies that `c` may help satisfy `r`. It's up to
 * the client of the data structure to gradually refine the graph so that an edge `r-c` implies that
 * `c` definitely helps satisfies `r`.
 *
 * We keep type of `Requirement` and `Course` generic, so that they can be easily mocked during
 * testing and make this basic graph implementation not tied to anything specific representation.
 */
export default class RequirementFulfillmentGraph<
  Requirement extends string,
  Course extends CourseWithUniqueId
> {
  // Internally, we use a two hash map to represent the bidirection relation
  // between requirement and courses.

  private readonly requirementToCoursesMap: Map<Requirement, Map<number, Course>> = new Map();

  private readonly courseToRequirementsMap: Map<number, Set<Requirement>> = new Map();

  public getAllEdges(): readonly (readonly [Requirement, Course])[] {
    const edges: (readonly [Requirement, Course])[] = [];
    this.requirementToCoursesMap.forEach((courses, requirement) => {
      courses.forEach(course => edges.push([requirement, course]));
    });
    return edges;
  }

  public addRequirementNode(requirement: Requirement): void {
    if (!this.requirementToCoursesMap.has(requirement)) {
      this.requirementToCoursesMap.set(requirement, new Map());
    }
  }

  public addEdge(requirement: Requirement, course: Course): void {
    let existingCoursesLinkedToRequirement = this.requirementToCoursesMap.get(requirement);
    if (existingCoursesLinkedToRequirement == null) {
      existingCoursesLinkedToRequirement = new Map();
      this.requirementToCoursesMap.set(requirement, existingCoursesLinkedToRequirement);
    }
    existingCoursesLinkedToRequirement.set(course.uniqueId, course);

    let existingRequirementsLinkedToCourse = this.courseToRequirementsMap.get(course.uniqueId);
    if (existingRequirementsLinkedToCourse == null) {
      existingRequirementsLinkedToCourse = new Set();
      this.courseToRequirementsMap.set(course.uniqueId, existingRequirementsLinkedToCourse);
    }
    existingRequirementsLinkedToCourse.add(requirement);
  }

  public removeEdge(requirement: Requirement, course: CourseWithUniqueId): void {
    const existingCoursesLinkedToRequirement = this.requirementToCoursesMap.get(requirement);
    if (existingCoursesLinkedToRequirement != null) {
      existingCoursesLinkedToRequirement.delete(course.uniqueId);
    }

    const existingRequirementsLinkedToCourse = this.courseToRequirementsMap.get(course.uniqueId);
    if (existingRequirementsLinkedToCourse != null) {
      existingRequirementsLinkedToCourse.delete(requirement);
    }
  }

  public getConnectedCoursesFromRequirement(requirement: Requirement): readonly Course[] {
    const courseSet = this.requirementToCoursesMap.get(requirement);
    if (courseSet == null) return [];
    return Array.from(courseSet.values());
  }

  public getConnectedRequirementsFromCourse(course: CourseWithUniqueId): readonly Requirement[] {
    const requirementSet = this.courseToRequirementsMap.get(course.uniqueId);
    if (requirementSet == null) return [];
    return Array.from(requirementSet);
  }
}
