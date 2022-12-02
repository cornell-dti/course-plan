import RequirementFulfillmentGraph, { CourseWithUniqueId } from './graph';

type RequirementFulfillmentGraphConstraintViolations<Requirement extends string> = {
  constraintViolationsGraph: RequirementFulfillmentGraph<Requirement, CourseWithUniqueId>;
  courseToRequirementsInConstraintViolations: Map<string | number, Set<Requirement[]>>;
  doubleCountedCourseUniqueIDSet: Set<string | number>;
  requirementsThatDoNotAllowDoubleCounting: Set<Requirement>;
};

// utility functions for nested set computations
const setEquals = <T>(a: Set<T>, b: Set<T>) =>
  a.size === b.size && [...a].every(value => b.has(value));
const setAdd = <T>(set: Set<T>, value: T) => {
  if (
    value instanceof Set &&
    ![...set].some(nestedSet => nestedSet instanceof Set && setEquals(nestedSet, value))
  ) {
    set.add(value);
  } else if (
    Array.isArray(value) &&
    ![...set].some(
      nestedList => Array.isArray(nestedList) && setEquals(new Set(nestedList), new Set(value))
    )
  ) {
    set.add(value);
  } else if (!(value instanceof Set) && !Array.isArray(value)) {
    set.add(value);
  }
};

export const getConstraintViolationsForSingleCourse = <Requirement extends string>(
  course: CourseWithUniqueId,
  requirements: readonly Requirement[],
  requirementConstraintHolds: (requirementA: Requirement, requirementB: Requirement) => boolean
): RequirementFulfillmentGraphConstraintViolations<Requirement> => {
  const constraintViolationsGraph = new RequirementFulfillmentGraph<
    Requirement,
    CourseWithUniqueId
  >();
  const constraintViolatingRequirements = new Map<Requirement, Set<Requirement>>();
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  const requirementsThatDoNotAllowDoubleCounting = new Set<Requirement>();
  requirements.forEach(requirement => {
    const constraintViolatingRequirementsForCurrentRequirement = new Set(
      requirements.filter(
        otherRequirement =>
          requirement !== otherRequirement &&
          !requirementConstraintHolds(requirement, otherRequirement)
      )
    );
    if (constraintViolatingRequirementsForCurrentRequirement.size > 0) {
      constraintViolatingRequirements.set(
        requirement,
        constraintViolatingRequirementsForCurrentRequirement
      );
      constraintViolationsGraph.addRequirementNode(requirement);
      constraintViolationsGraph.addEdge(requirement, course);
      doubleCountedCourseUniqueIDSet.add(course.uniqueId);
      requirementsThatDoNotAllowDoubleCounting.add(requirement);
    }
  });
  const courseToRequirementsInConstraintViolationsForSingleCourse = new Set<Requirement[]>();
  Array.from(constraintViolatingRequirements.entries()).forEach(([k, v]) => {
    setAdd(
      courseToRequirementsInConstraintViolationsForSingleCourse,
      // use the original requirements list to maintain order
      requirements.filter(requirement => requirement === k || v.has(requirement))
    );
  });
  const courseToRequirementsInConstraintViolations = new Map<string | number, Set<Requirement[]>>();
  if (courseToRequirementsInConstraintViolationsForSingleCourse.size > 0) {
    courseToRequirementsInConstraintViolations.set(
      course.uniqueId,
      courseToRequirementsInConstraintViolationsForSingleCourse
    );
  }
  return {
    constraintViolationsGraph,
    courseToRequirementsInConstraintViolations,
    doubleCountedCourseUniqueIDSet,
    requirementsThatDoNotAllowDoubleCounting,
  };
};

export const getConstraintViolations = <Requirement extends string>(
  graph: RequirementFulfillmentGraph<Requirement, CourseWithUniqueId>,
  requirementConstraintHolds: (requirementA: Requirement, requirementB: Requirement) => boolean
): RequirementFulfillmentGraphConstraintViolations<Requirement> => {
  const constraintViolationsGraph = new RequirementFulfillmentGraph<
    Requirement,
    CourseWithUniqueId
  >();
  const courseToRequirementsInConstraintViolations = new Map<string | number, Set<Requirement[]>>();
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  const requirementsThatDoNotAllowDoubleCounting = new Set<Requirement>();
  graph.getAllCourses().forEach(course => {
    const {
      constraintViolationsGraph: constraintViolationsGraphForSingleCourse,
      courseToRequirementsInConstraintViolations: courseToRequirementsInConstraintViolationsForSingleCourse,
      doubleCountedCourseUniqueIDSet: doubleCountedCourseUniqueIDSetForSingleCourse,
      requirementsThatDoNotAllowDoubleCounting: requirementsThatDoNotAllowDoubleCountingForSingleCourse,
    } = getConstraintViolationsForSingleCourse(
      course,
      graph.getConnectedRequirementsFromCourse(course),
      requirementConstraintHolds
    );
    constraintViolationsGraph.addGraph(constraintViolationsGraphForSingleCourse);
    courseToRequirementsInConstraintViolationsForSingleCourse.forEach((v, k) =>
      courseToRequirementsInConstraintViolations.set(k, v)
    );
    doubleCountedCourseUniqueIDSetForSingleCourse.forEach(id =>
      doubleCountedCourseUniqueIDSet.add(id)
    );
    requirementsThatDoNotAllowDoubleCountingForSingleCourse.forEach(req =>
      requirementsThatDoNotAllowDoubleCounting.add(req)
    );
  });
  return {
    constraintViolationsGraph,
    courseToRequirementsInConstraintViolations,
    doubleCountedCourseUniqueIDSet,
    requirementsThatDoNotAllowDoubleCounting,
  };
};
