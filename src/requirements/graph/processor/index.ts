import RequirementGraph from '..';
import { CourseForRequirementGraph } from '../types';

/**
 * A pipelining interface for moving requirement graphs through different stages.
 */
export default interface GraphProcessor<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> {
  /** Non-mutating function to generate output graph from input graph */
  process: (graph: RequirementGraph<Requirement, Course>) => RequirementGraph<Requirement, Course>;
}

/**
 * Compose zero or more graph processors on a requirement graph.
 */
export function process<Requirement extends string, Course extends CourseForRequirementGraph>(
  graph = new RequirementGraph<Requirement, Course>(),
  ...processors: GraphProcessor<Requirement, Course>[]
) {
  return processors.reduce((newGraph, processor) => processor.process(newGraph), graph);
}
