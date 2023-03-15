import GraphVisitor from './definition';
import { RequirementFulfillmentGraph, ReadonlyRequirementFulfillmentGraph } from '..';
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
> extends GraphVisitor<Requirement, Course> {
  private removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>;

  constructor(
    removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>
  ) {
    super();
    this.removeConstraintViolationEdgesParameters = removeConstraintViolationEdgesParameters;
  }

  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return removeConstraintViolationEdges(graph, this.removeConstraintViolationEdgesParameters);
  }
}

export function removeConstraintViolationEdges<
  Requirement extends string,
  Course extends CourseWithUniqueId
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  { requirementConstraintHolds }: RemoveConstraintViolationEdgesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  const { constraintViolationsGraph } = getConstraintViolations(
    newGraph,
    requirementConstraintHolds
  );
  newGraph.subtractGraphEdges(constraintViolationsGraph);

  return newGraph;
}
