import RequirementFulfillmentGraph from '..';
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
type GraphVisitor<Requirement extends string, Course extends CourseWithUniqueId> = Visitor<
  RequirementFulfillmentGraph<Requirement, Course>
>;

export default GraphVisitor;
