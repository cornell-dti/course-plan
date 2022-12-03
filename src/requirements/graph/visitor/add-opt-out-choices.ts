import GraphVisitor from './definition';
import { ReadonlyRequirementFulfillmentGraph, RequirementFulfillmentGraph } from '..';
import { CourseForRequirementGraph } from '../types';

export type AddOptOutChoicesParameters<Requirement> = {
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
> extends GraphVisitor<Requirement, Course> {
  private addOptOutChoicesParameters: AddOptOutChoicesParameters<Requirement>;

  constructor(addOptOutChoicesParameters: AddOptOutChoicesParameters<Requirement>) {
    super();
    this.addOptOutChoicesParameters = addOptOutChoicesParameters;
  }

  public process(graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>) {
    return addOptOutChoices(graph, this.addOptOutChoicesParameters);
  }
}

export function addOptOutChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: ReadonlyRequirementFulfillmentGraph<Requirement, Course>,
  { userChoiceOnRequirementOverrides }: AddOptOutChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> {
  const newGraph = graph.copy();

  newGraph.getAllCourses().forEach(course => {
    userChoiceOnRequirementOverrides[course.uniqueId]?.optOut?.forEach(requirement => {
      newGraph.removeEdge(requirement, course);
    });
  });

  return newGraph;
}
