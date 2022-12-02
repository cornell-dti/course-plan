import GraphVisitor from './interface';
import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

/**
 * Essentially a noop, but copies the graph. This can be useful for debugging.
 */
export default class CopyGraph<Requirement extends string, Course extends CourseWithUniqueId>
  implements GraphVisitor<Requirement, Course> {
  // eslint-disable-next-line class-methods-use-this
  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return graph.copy();
  }
}
