import { ReadonlyRequirementFulfillmentGraph } from '..';
import { CourseWithUniqueId } from '../types';

/**
 * A visitor interface for items.
 */
interface Visitor<T> {
  /** Non-mutating function on the original item */
  process: (item: T) => T;
}

/**
 * A visitor interface for pipelining requirement fulfillment graphs through different stages.
 */
export default class GraphVisitor<Requirement extends string, Course extends CourseWithUniqueId>
  implements Visitor<ReadonlyRequirementFulfillmentGraph<Requirement, Course>> {
  /**
   * The default method is essentially a noop, but copies the graph. This can be useful for debugging.
   */
  // eslint-disable-next-line class-methods-use-this
  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return graph.copy();
  }
}
