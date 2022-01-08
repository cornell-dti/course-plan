import RequirementFulfillmentGraph, { CourseWithUniqueId } from './requirement-graph';

type RequirementFulfillmentGraphConstraintViolations<Requirement extends string> = {
  constraintViolationsGraph: RequirementFulfillmentGraph<Requirement, CourseWithUniqueId>;
  requirementsThatDoNotAllowDoubleCounting: Set<Requirement>;
  doubleCountedCourseUniqueIDSet: Set<string | number>;
};

export const getConstraintViolationsForSingleCourse = <Requirement extends string>(
  course: CourseWithUniqueId,
  requirements: readonly Requirement[],
  allowDoubleCounting: (requirement: Requirement) => boolean
): RequirementFulfillmentGraphConstraintViolations<Requirement> => {
  const constraintViolationsGraph = new RequirementFulfillmentGraph<
    Requirement,
    CourseWithUniqueId
  >();
  // TODO take into consideration grad, minors, etc. (see requirementAllowDoubleCounting())
  const requirementsThatDoNotAllowDoubleCounting = new Set(
    requirements.filter(req => !allowDoubleCounting(req))
  );
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  if (requirementsThatDoNotAllowDoubleCounting.size > 1) {
    requirementsThatDoNotAllowDoubleCounting.forEach(req => {
      constraintViolationsGraph.addRequirementNode(req);
      constraintViolationsGraph.addEdge(req, course);
    });
    doubleCountedCourseUniqueIDSet.add(course.uniqueId);
  }
  return {
    constraintViolationsGraph,
    requirementsThatDoNotAllowDoubleCounting,
    doubleCountedCourseUniqueIDSet,
  };
};

export const getConstraintViolations = <Requirement extends string>(
  graph: RequirementFulfillmentGraph<Requirement, CourseWithUniqueId>,
  allowDoubleCounting: (requirement: Requirement) => boolean
): RequirementFulfillmentGraphConstraintViolations<Requirement> => {
  const constraintViolationsGraph = new RequirementFulfillmentGraph<
    Requirement,
    CourseWithUniqueId
  >();
  const requirementsThatDoNotAllowDoubleCounting = new Set<Requirement>();
  const doubleCountedCourseUniqueIDSet = new Set<string | number>();
  graph.getAllCourses().forEach(course => {
    const {
      constraintViolationsGraph: constraintViolationsGraphForSingleCourse,
      requirementsThatDoNotAllowDoubleCounting: requirementsThatDoNotAllowDoubleCountingForSingleCourse,
      doubleCountedCourseUniqueIDSet: doubleCountedCourseUniqueIDSetForSingleCourse,
    } = getConstraintViolationsForSingleCourse(
      course,
      graph.getConnectedRequirementsFromCourse(course),
      allowDoubleCounting
    );
    constraintViolationsGraph.add(constraintViolationsGraphForSingleCourse);
    requirementsThatDoNotAllowDoubleCountingForSingleCourse.forEach(id =>
      requirementsThatDoNotAllowDoubleCounting.add(id)
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
