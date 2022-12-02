import GraphVisitor from './definition';
import RequirementFulfillmentGraph from '..';
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

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addToggleableChoices(graph.copy(), this.addToggleableChoicesParameters);
  }
}

export function addToggleableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnFulfillmentStrategy }: AddToggleableChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  Object.entries<readonly number[]>(userChoiceOnFulfillmentStrategy).forEach(
    ([key, coursesOfChosenFulfillmentStrategy]) => {
      const correspondingRequirement = key as Requirement;
      const coursesToKeepSet = new Set(coursesOfChosenFulfillmentStrategy);
      graph
        .getConnectedCoursesFromRequirement(correspondingRequirement)
        .forEach(connectedCourse => {
          if (!coursesToKeepSet.has(connectedCourse.courseId)) {
            graph.removeEdge(correspondingRequirement, connectedCourse);
          }
        });
    }
  );
  return graph;
}
