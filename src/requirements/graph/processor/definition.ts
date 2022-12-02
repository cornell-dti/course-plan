import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

/**
 * A pipelining interface for moving requirement graphs through different stages.
 */
export default interface GraphProcessor<
  Requirement extends string,
  Course extends CourseWithUniqueId
> {
  /** Non-mutating function to generate output graph from input graph */
  process: (
    graph: RequirementFulfillmentGraph<Requirement, Course>
  ) => RequirementFulfillmentGraph<Requirement, Course>;
}
