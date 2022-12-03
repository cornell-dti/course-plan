import { CourseWithUniqueId } from './types';

/**
 * An immutable graph data structure that represents the relation between requirements and courses.
 *
 * An edge between requirement `r` and course `c` implies that `c` may help satisfy `r`. It's up to
 * the client of the data structure to gradually refine the graph so that an edge `r-c` implies that
 * `c` definitely helps satisfies `r`.
 *
 * We keep type of `Requirement` and `Course` generic, so that they can be easily mocked during
 * testing and make this basic graph implementation not tied to anything specific representation.
 */
export class ReadonlyRequirementFulfillmentGraph<
  Requirement extends string,
  Course extends CourseWithUniqueId
> {
  // Internally, we use a two hash map to represent the bidirection relation
  // between requirement and courses.

  protected readonly requirementToCoursesMap: Map<
    Requirement,
    Map<string | number, Course>
  > = new Map();

  protected readonly courseToRequirementsMap: Map<string | number, Set<Requirement>> = new Map();

  public getAllRequirements(): readonly Requirement[] {
    return Array.from(this.requirementToCoursesMap.keys());
  }

  public getAllCourses(): readonly Course[] {
    const coursesMap = new Map<string | number, Course>();
    Array.from(this.requirementToCoursesMap.values()).forEach(map => {
      map.forEach((course, id) => {
        coursesMap.set(id, course);
      });
    });
    return Array.from(coursesMap.values());
  }

  public getAllEdges(): readonly (readonly [Requirement, Course])[] {
    const edges: (readonly [Requirement, Course])[] = [];
    this.requirementToCoursesMap.forEach((courses, requirement) => {
      courses.forEach(course => edges.push([requirement, course]));
    });
    return edges;
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

  public copy(): RequirementFulfillmentGraph<Requirement, Course> {
    const newCopy = new RequirementFulfillmentGraph<Requirement, Course>();
    this.requirementToCoursesMap.forEach((courseIdToCourseMap, key) => {
      newCopy.requirementToCoursesMap.set(key, new Map(courseIdToCourseMap.entries()));
    });
    this.courseToRequirementsMap.forEach((requirementSet, key) => {
      newCopy.courseToRequirementsMap.set(key, new Set(Array.from(requirementSet)));
    });
    return newCopy;
  }
}

/**
 * An mutable graph data structure that represents the relation between requirements and courses.
 */
export class RequirementFulfillmentGraph<
  Requirement extends string,
  Course extends CourseWithUniqueId
> extends ReadonlyRequirementFulfillmentGraph<Requirement, Course> {
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

  // adds requirement nodes and graph edges
  public addGraph(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>): void {
    graph.getAllRequirements().forEach(req => {
      this.addRequirementNode(req);
    });
    graph.getAllEdges().forEach(([req, course]) => {
      this.addEdge(req, course);
    });
  }

  // subtracts graph edges (but does not subtract requirement nodes)
  public subtractGraphEdges(
    graph: ReadonlyRequirementFulfillmentGraph<Requirement, CourseWithUniqueId>
  ): void {
    graph.getAllEdges().forEach(([req, course]) => {
      this.removeEdge(req, course);
    });
  }
}
