import GraphProcessor from './definition';
import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

/**
 * Essentially a noop, but copies the graph. This can be useful for debugging.
 */
export default class CopyGraph<Requirement extends string, Course extends CourseWithUniqueId>
  implements GraphProcessor<Requirement, Course> {
  // eslint-disable-next-line class-methods-use-this
  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return graph.copy();
  }
}
