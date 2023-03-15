import GraphVisitor from './definition';
import { RequirementFulfillmentGraph, ReadonlyRequirementFulfillmentGraph } from '..';
import { CourseForRequirementGraph } from '../types';

export type AddToggleableChoicesParameters<Requirement extends string> = {
  /**
   * Some requirements might have several different ways to fulfill them. This is a map from
   * toggleable requirements to a list of course IDs that could be applied to the requirement under
   * the user's choice.
   * (Note: it has to be course id because we want to match course id against eligible course id list.)
   */
  readonly userChoiceOnFulfillmentStrategy: Readonly<Record<Requirement, readonly number[]>>;
};

/**
 * Add basic user fulfillment choices, aka toggleable choices.
 */
export default class AddToggleableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> extends GraphVisitor<Requirement, Course> {
  private addToggleableChoicesParameters: AddToggleableChoicesParameters<Requirement>;

  constructor(addToggleableChoicesParameters: AddToggleableChoicesParameters<Requirement>) {
    super();
    this.addToggleableChoicesParameters = addToggleableChoicesParameters;
  }

  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return addToggleableChoices(graph, this.addToggleableChoicesParameters);
  }
}

export function addToggleableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnFulfillmentStrategy }: AddToggleableChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  Object.entries<readonly number[]>(userChoiceOnFulfillmentStrategy).forEach(
    ([key, coursesOfChosenFulfillmentStrategy]) => {
      const correspondingRequirement = key as Requirement;
      const coursesToKeepSet = new Set(coursesOfChosenFulfillmentStrategy);

      newGraph
        .getConnectedCoursesFromRequirement(correspondingRequirement)
        .forEach(connectedCourse => {
          if (!coursesToKeepSet.has(connectedCourse.courseId)) {
            newGraph.removeEdge(correspondingRequirement, connectedCourse);
          }
        });
    }
  );

  return newGraph;
}
