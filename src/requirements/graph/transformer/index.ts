import RequirementGraph from '..';
import { CourseForRequirementGraph } from '../types';

/**
 * A transformer interface for pipelining requirement graphs through transformations.
 */
export default interface GraphTransformer<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> {
  /** Non-mutating function to generate output graph from input graph */
  transform: (
    graph: RequirementGraph<Requirement, Course>
  ) => RequirementGraph<Requirement, Course>;
}

/**
 * Compose zero or more transformers on a requirement graph.
 */
export function transform<Requirement extends string, Course extends CourseForRequirementGraph>(
  graph: RequirementGraph<Requirement, Course>,
  ...transformers: GraphTransformer<Requirement, Course>[]
) {
  return transformers.reduce((newGraph, transformer) => transformer.transform(newGraph), graph);
}
