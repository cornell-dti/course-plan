import GraphProcessor from '.';
import RequirementFulfillmentGraph from '..';
import { CourseForRequirementGraph } from '../types';

export type ArbitraryOptInChoicesParameters<Requirement extends string> = {
  /**
   * The mapping from course's unique ID to arbitrary opt-in choices.
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      readonly arbitraryOptIn: readonly Requirement[];
    };
  };
};

export default class AddArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> implements GraphProcessor<Requirement, Course> {
  private arbitraryOptInChoicesParameters: ArbitraryOptInChoicesParameters<Requirement>;

  constructor(arbitraryOptInChoicesParameters: ArbitraryOptInChoicesParameters<Requirement>) {
    this.arbitraryOptInChoicesParameters = arbitraryOptInChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addArbitraryOptInChoicesParameters(graph, this.arbitraryOptInChoicesParameters);
  }
}

export const addArbitraryOptInChoicesParameters = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: ArbitraryOptInChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> => {
  const newGraph = graph.copy();

  newGraph.getAllCourses().forEach(course => {
    const userChoiceOnOptInOptOutCourse = userChoiceOnRequirementOverrides[course.uniqueId];
    if (userChoiceOnOptInOptOutCourse == null) return;
    userChoiceOnOptInOptOutCourse.arbitraryOptIn.forEach(requirement => {
      newGraph.addEdge(requirement, course);
    });
  });

  return newGraph;
};
