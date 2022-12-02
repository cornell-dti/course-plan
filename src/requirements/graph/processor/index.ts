import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';
import GraphProcessor from './interface';

export { default as AddArbitraryOptInChoices } from './add-arbitrary-opt-in-choices';
export { default as AddOptOutChoices } from './add-opt-out-choices';
export { default as AddSelectableChoices } from './add-selectable-choices';
export { default as AddToggleableChoices } from './add-toggleable-choices';
export { default as BuildInitialGraph } from './build-initial-graph';
export { default as CopyGraph } from './copy-graph';
export { default as RemoveConstraintViolationEdges } from './remove-constraint-violation-edges';

/**
 * Compose zero or more graph processors on a requirement graph.
 */
export function process<Requirement extends string, Course extends CourseWithUniqueId>(
  graph = new RequirementFulfillmentGraph<Requirement, Course>(),
  ...processors: readonly GraphProcessor<Requirement, Course>[]
) {
  return processors.reduce((newGraph, processor) => processor.process(newGraph), graph);
}
