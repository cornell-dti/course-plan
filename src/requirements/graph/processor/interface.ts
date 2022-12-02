import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

/**
 * A pipelining interface for processing items through different stages.
 */
interface Processor<T> {
  /** Non-mutating function to generate output item from input item */
  process: (item: T) => T;
}

/**
 * A pipelining interface for processing requirement fulfillment graphs through different stages.
 */
type GraphProcessor<Requirement extends string, Course extends CourseWithUniqueId> = Processor<
  RequirementFulfillmentGraph<Requirement, Course>
>;

export default GraphProcessor;
