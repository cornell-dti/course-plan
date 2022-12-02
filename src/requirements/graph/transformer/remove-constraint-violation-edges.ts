import { getConstraintViolations } from '@/requirements/requirement-constraints-utils';
import GraphTransformer from '.';
import RequirementFulfillmentGraph from '..';
import { CourseForRequirementGraph } from '../types';

export type RemoveConstraintViolationEdgesParameters<Requirement extends string> = {
  requirementConstraintHolds: (requirementA: Requirement, requirementB: Requirement) => boolean;
};

export default class AddArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> implements GraphTransformer<Requirement, Course> {
  private removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>;

  constructor(
    removeConstraintViolationEdgesParameters: RemoveConstraintViolationEdgesParameters<Requirement>
  ) {
    this.removeConstraintViolationEdgesParameters = removeConstraintViolationEdgesParameters;
  }

  public transform(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return removeConstraintViolationEdges(graph, this.removeConstraintViolationEdgesParameters);
  }
}

export const removeConstraintViolationEdges = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { requirementConstraintHolds }: RemoveConstraintViolationEdgesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> => {
  const newGraph = graph.copy();

  const { constraintViolationsGraph } = getConstraintViolations(graph, requirementConstraintHolds);
  newGraph.subtractGraphEdges(constraintViolationsGraph);

  return newGraph;
};
