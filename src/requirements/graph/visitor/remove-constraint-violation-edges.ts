import GraphVisitor from './interface';
import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';
import { getConstraintViolations } from '../../requirement-constraints-utils';

export type RemoveConstraintViolationEdgesParameters<Requirement> = {
  requirementConstraintHolds: (requirementA: Requirement, requirementB: Requirement) => boolean;
};

/**
 * Remove constraint violation edges from the graph.
 */
export default class RemoveConstraintViolationEdges<
  Requirement extends string,
  Course extends CourseWithUniqueId
> implements GraphVisitor<Requirement, Course> {
  private removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>;

  constructor(
    removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>
  ) {
    this.removeConstraintViolationEdgesParameters = removeConstraintViolationEdgesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return removeConstraintViolationEdges(
      graph.copy(),
      this.removeConstraintViolationEdgesParameters
    );
  }
}

export function removeConstraintViolationEdges<
  Requirement extends string,
  Course extends CourseWithUniqueId
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { requirementConstraintHolds }: RemoveConstraintViolationEdgesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const { constraintViolationsGraph } = getConstraintViolations(graph, requirementConstraintHolds);
  graph.subtractGraphEdges(constraintViolationsGraph);
  return graph;
}
