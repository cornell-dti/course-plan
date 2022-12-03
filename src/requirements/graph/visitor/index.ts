import { ReadonlyRequirementFulfillmentGraph } from '..';
import { CourseWithUniqueId } from '../types';
import GraphVisitor from './definition';

export { default as AddArbitraryOptInChoices } from './add-arbitrary-opt-in-choices';
export { default as AddOptOutChoices } from './add-opt-out-choices';
export { default as AddSelectableChoices } from './add-selectable-choices';
export { default as AddToggleableChoices } from './add-toggleable-choices';
export { default as BuildInitialGraph } from './build-initial-graph';
export { default as RemoveConstraintViolationEdges } from './remove-constraint-violation-edges';

/**
 * Compose zero or more graph visitors on a requirement graph.
 */
export function process<Requirement extends string, Course extends CourseWithUniqueId>(
  graph = new ReadonlyRequirementFulfillmentGraph<Requirement, Course>(),
  ...visitors: readonly GraphVisitor<Requirement, Course>[]
) {
  return visitors.reduce((newGraph, visitor) => visitor.process(newGraph), graph);
}
