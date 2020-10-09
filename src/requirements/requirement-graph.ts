import { HashMap, HashSet } from './util/collections';

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
export default class RequirementFulfillmentGraph<Requirement, Course> {
  // Internally, we use a two hash map to represent the bidirection relation
  // between requirement and courses.

  private readonly requirementToCoursesMap: HashMap<Requirement, HashSet<Course>>;

  private readonly courseToRequirementsMap: HashMap<Course, HashSet<Requirement>>;

  constructor(
    private readonly getRequirementUniqueID: (r: Requirement) => string,
    private readonly getCourseUniqueID: (c: Course) => string
  ) {
    this.requirementToCoursesMap = new HashMap(getRequirementUniqueID);
    this.courseToRequirementsMap = new HashMap(getCourseUniqueID);
  }

  public getAllRequirements(): readonly Requirement[] {
    return this.requirementToCoursesMap.keys();
  }

  public getAllCourses(): readonly Course[] {
    return this.courseToRequirementsMap.keys();
  }

  public getAllEdges(): readonly (readonly [Requirement, Course])[] {
    const edges: (readonly [Requirement, Course])[] = [];
    this.requirementToCoursesMap.forEach((courses, requirement) => {
      courses.forEach(course => edges.push([requirement, course]));
    });
    return edges;
  }

  public addRequirementNode(requirement: Requirement): void {
    if (!this.requirementToCoursesMap.has(requirement)) {
      this.requirementToCoursesMap.set(requirement, new HashSet(this.getCourseUniqueID));
    }
  }

  public addEdge(requirement: Requirement, course: Course): void {
    let existingCoursesLinkedToRequirement = this.requirementToCoursesMap.get(requirement);
    if (existingCoursesLinkedToRequirement == null) {
      existingCoursesLinkedToRequirement = new HashSet(this.getCourseUniqueID);
      this.requirementToCoursesMap.set(requirement, existingCoursesLinkedToRequirement);
    }
    existingCoursesLinkedToRequirement.add(course);

    let existingRequirementsLinkedToCourse = this.courseToRequirementsMap.get(course);
    if (existingRequirementsLinkedToCourse == null) {
      existingRequirementsLinkedToCourse = new HashSet(this.getRequirementUniqueID);
      this.courseToRequirementsMap.set(course, existingRequirementsLinkedToCourse);
    }
    existingRequirementsLinkedToCourse.add(requirement);
  }

  public removeEdge(requirement: Requirement, course: Course): void {
    const existingCoursesLinkedToRequirement = this.requirementToCoursesMap.get(requirement);
    if (existingCoursesLinkedToRequirement != null) {
      existingCoursesLinkedToRequirement.delete(course);
    }

    const existingRequirementsLinkedToCourse = this.courseToRequirementsMap.get(course);
    if (existingRequirementsLinkedToCourse != null) {
      existingRequirementsLinkedToCourse.delete(requirement);
    }
  }

  public getConnectedCoursesFromRequirement(requirement: Requirement): readonly Course[] {
    const courseSet = this.requirementToCoursesMap.get(requirement);
    if (courseSet == null) return [];
    return courseSet.toArray();
  }

  public getConnectedRequirementsFromCourse(course: Course): readonly Requirement[] {
    const requirementSet = this.courseToRequirementsMap.get(course);
    if (requirementSet == null) return [];
    return requirementSet.toArray();
  }

  public existsEdge(requirement: Requirement, course: Course): boolean {
    const existingCoursesLinkedToRequirement = this.requirementToCoursesMap.get(requirement);
    return (
      existingCoursesLinkedToRequirement != null && existingCoursesLinkedToRequirement.has(course)
    );
  }
}
