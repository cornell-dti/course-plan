import GraphVisitor from './definition';
import { RequirementFulfillmentGraph, ReadonlyRequirementFulfillmentGraph } from '..';
import { CourseWithUniqueId } from '../types';

export type AddArbitraryOptInChoicesParameters<Requirement> = {
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
> extends GraphVisitor<Requirement, Course> {
  private arbitraryOptInChoicesParameters: AddArbitraryOptInChoicesParameters<Requirement>;

  constructor(arbitraryOptInChoicesParameters: AddArbitraryOptInChoicesParameters<Requirement>) {
    super();
    this.arbitraryOptInChoicesParameters = arbitraryOptInChoicesParameters;
  }

  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return addArbitraryOptInChoices(graph, this.arbitraryOptInChoicesParameters);
  }
}

export function addArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseWithUniqueId
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddArbitraryOptInChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  newGraph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.arbitraryOptIn?.forEach(requirement => {
      newGraph.addEdge(requirement, course);
    });
  });

  return newGraph;
}
