import GraphVisitor from './definition';
import { ReadonlyRequirementFulfillmentGraph, RequirementFulfillmentGraph } from '..';
import { CourseForRequirementGraph } from '../types';

export type AddSelectableChoicesParameters<Requirement> = {
  /**
   * The mapping from course's unique ID to selectable requirement choices.
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      readonly acknowledgedCheckerWarningOptIn: readonly Requirement[];
    };
  };
};

/**
 * Add acknowledged checker warning opt in choices, aka selectable requirement choices.
 */
export default class AddSelectableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> extends GraphVisitor<Requirement, Course> {
  private addSelectableChoicesParameters: AddSelectableChoicesParameters<Requirement>;

  constructor(addSelectableChoicesParameters: AddSelectableChoicesParameters<Requirement>) {
    super();
    this.addSelectableChoicesParameters = addSelectableChoicesParameters;
  }

  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return addSelectableChoices(graph, this.addSelectableChoicesParameters);
  }
}

export function addSelectableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddSelectableChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  newGraph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.acknowledgedCheckerWarningOptIn?.forEach(
      requirement => {
        newGraph.addEdge(requirement, course);
      }
    );
  });

  return newGraph;
}
