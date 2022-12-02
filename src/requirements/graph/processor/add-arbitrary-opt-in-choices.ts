import GraphProcessor from './definition';
import RequirementFulfillmentGraph from '..';
import { CourseWithUniqueId } from '../types';

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

/**
 * Add the user's arbitrary opt in choices to the graph.
 */
export default class AddArbitraryOptInChoices<
  Requirement extends string,
  Course extends CourseWithUniqueId
> implements GraphProcessor<Requirement, Course> {
  private arbitraryOptInChoicesParameters: ArbitraryOptInChoicesParameters<Requirement>;

  constructor(arbitraryOptInChoicesParameters: ArbitraryOptInChoicesParameters<Requirement>) {
    this.arbitraryOptInChoicesParameters = arbitraryOptInChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addArbitraryOptInChoicesParameters(graph.copy(), this.arbitraryOptInChoicesParameters);
  }
}

export const addArbitraryOptInChoicesParameters = <
  Requirement extends string,
  Course extends CourseWithUniqueId
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: ArbitraryOptInChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> => {
  graph.getAllCourses().forEach(course => {
    const userChoiceOnOptInOptOutCourse = userChoiceOnRequirementOverrides[course.uniqueId];
    if (userChoiceOnOptInOptOutCourse == null) return;
    userChoiceOnOptInOptOutCourse.arbitraryOptIn.forEach(requirement => {
      graph.addEdge(requirement, course);
    });
  });
  return graph;
};
