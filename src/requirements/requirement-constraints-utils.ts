import RequirementFulfillmentGraph, { CourseWithUniqueId } from './requirement-graph';

type RequirementFulfillmentGraphConstraintViolations<Requirement extends string> = {
  constraintViolationsGraph: RequirementFulfillmentGraph<Requirement, CourseWithUniqueId>;
  requirementsThatDoNotAllowDoubleCounting: Map<string | number, Set<Requirement[]>>;
  doubleCountedCourseUniqueIDSet: Set<string | number>;
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
  } else set.add(value);
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
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  const constraintViolatingRequirements = new Map<Requirement, Set<Requirement>>();
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
    }
  });
  const requirementsThatDoNotAllowDoubleCountingForSingleCourse = new Set<Requirement[]>();
  Array.from(constraintViolatingRequirements.entries()).forEach(([k, v]) => {
    setAdd(
      requirementsThatDoNotAllowDoubleCountingForSingleCourse,
      // use the original requirements list to maintain order
      requirements.filter(requirement => requirement === k || v.has(k))
    );
  });
  const requirementsThatDoNotAllowDoubleCounting = new Map<string | number, Set<Requirement[]>>();
  if (requirementsThatDoNotAllowDoubleCountingForSingleCourse.size > 0) {
    requirementsThatDoNotAllowDoubleCounting.set(
      course.uniqueId,
      requirementsThatDoNotAllowDoubleCountingForSingleCourse
    );
  }
  return {
    constraintViolationsGraph,
    requirementsThatDoNotAllowDoubleCounting,
    doubleCountedCourseUniqueIDSet,
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
  const requirementsThatDoNotAllowDoubleCounting = new Map<string | number, Set<Requirement[]>>();
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  graph.getAllCourses().forEach(course => {
    const {
      constraintViolationsGraph: constraintViolationsGraphForSingleCourse,
      requirementsThatDoNotAllowDoubleCounting: requirementsThatDoNotAllowDoubleCountingForSingleCourse,
      doubleCountedCourseUniqueIDSet: doubleCountedCourseUniqueIDSetForSingleCourse,
    } = getConstraintViolationsForSingleCourse(
      course,
      graph.getConnectedRequirementsFromCourse(course),
      requirementConstraintHolds
    );
    constraintViolationsGraph.add(constraintViolationsGraphForSingleCourse);
    requirementsThatDoNotAllowDoubleCountingForSingleCourse.forEach((v, k) =>
      requirementsThatDoNotAllowDoubleCounting.set(k, v)
    );
    doubleCountedCourseUniqueIDSetForSingleCourse.forEach(id =>
      doubleCountedCourseUniqueIDSet.add(id)
    );
  });
  return {
    constraintViolationsGraph,
    requirementsThatDoNotAllowDoubleCounting,
    doubleCountedCourseUniqueIDSet,
  };
};
