import GraphProcessor from './interface';
import RequirementFulfillmentGraph from '..';
import { CourseForRequirementGraph } from '../types';

export type AddSelectableChoicesParameters<Requirement extends string> = {
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
> implements GraphProcessor<Requirement, Course> {
  private addSelectableChoicesParameters: AddSelectableChoicesParameters<Requirement>;

  constructor(addSelectableChoicesParameters: AddSelectableChoicesParameters<Requirement>) {
    this.addSelectableChoicesParameters = addSelectableChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addSelectableChoices(graph.copy(), this.addSelectableChoicesParameters);
  }
}

export function addSelectableChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddSelectableChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  graph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.acknowledgedCheckerWarningOptIn?.forEach(
      requirement => {
        graph.addEdge(requirement, course);
      }
    );
  });

  return graph;
}
