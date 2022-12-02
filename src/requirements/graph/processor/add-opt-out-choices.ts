import GraphProcessor from './interface';
import RequirementFulfillmentGraph from '..';
import { CourseForRequirementGraph } from '../types';

export type AddOptOutChoicesParameters<Requirement extends string> = {
  /**
   * The mapping from course's unique ID to opt out choices.
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      readonly optOut: readonly Requirement[];
    };
  };
};

/**
 * Add opt out choices.
 */
export default class AddOptOutChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> implements GraphProcessor<Requirement, Course> {
  private addOptOutChoicesParameters: AddOptOutChoicesParameters<Requirement>;

  constructor(addOptOutChoicesParameters: AddOptOutChoicesParameters<Requirement>) {
    this.addOptOutChoicesParameters = addOptOutChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addOptOutChoices(graph.copy(), this.addOptOutChoicesParameters);
  }
}

export function addOptOutChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddOptOutChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  graph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.optOut?.forEach(requirement => {
      graph.removeEdge(requirement, course);
    });
  });

  return graph;
}
