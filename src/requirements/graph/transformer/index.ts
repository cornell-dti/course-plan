import RequirementGraph from '..';
import { CourseForRequirementGraph } from '../types';

/**
 * A transformer interface for pipelining requirement graphs through transformations.
 */
export default interface GraphTransformer<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> {
  transform: (
    graph: RequirementGraph<Requirement, Course>
  ) => RequirementGraph<Requirement, Course>;
}

export function compose<Requirement extends string, Course extends CourseForRequirementGraph>(
  graph: RequirementGraph<Requirement, Course>,
  ...transformers: GraphTransformer<Requirement, Course>[]
) {
  return transformers.reduce((newGraph, transformer) => transformer.transform(newGraph), graph);
}
