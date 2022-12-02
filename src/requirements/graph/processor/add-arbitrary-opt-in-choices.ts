import GraphProcessor from './interface';
import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

export type AddArbitraryOptInChoicesParameters<Requirement extends string> = {
  /**
   * The mapping from course's unique ID to arbitrary opt in choices.
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      readonly arbitraryOptIn: readonly Requirement[];
    };
  };
};

/**
 * Add the user's arbitrary opt in choices to the graph.
 */
export default class AddArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseWithUniqueId
> implements GraphProcessor<Requirement, Course> {
  private arbitraryOptInChoicesParameters: AddArbitraryOptInChoicesParameters<Requirement>;

  constructor(arbitraryOptInChoicesParameters: AddArbitraryOptInChoicesParameters<Requirement>) {
    this.arbitraryOptInChoicesParameters = arbitraryOptInChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addArbitraryOptInChoices(graph.copy(), this.arbitraryOptInChoicesParameters);
  }
}

export function addArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseWithUniqueId
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddArbitraryOptInChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  graph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.arbitraryOptIn?.forEach(requirement => {
      graph.addEdge(requirement, course);
    });
  });
  return graph;
}
