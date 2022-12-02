import GraphProcessor from './definition';
import RequirementFulfillmentGraph from '..';
import { CourseForRequirementGraph } from '../types';

export type BasicUserFulfillmentChoicesParameters<Requirement extends string> = {
  /**
   * Some requirements might have several different ways to fulfill them. This is a map from
   * toggleable requirements to a list of course IDs that could be applied to the requirement under
   * the user's choice.
   * (Note: it has to be course id because we want to match course id against eligible course id list.)
   */
  readonly userChoiceOnFulfillmentStrategy: Readonly<Record<Requirement, readonly number[]>>;
  /**
   * The mapping from course's unique ID to selectable requirement and opt out choices.
   */
  readonly userChoiceOnRequirementOverrides: {
    readonly [uniqueId: string]: {
      readonly acknowledgedCheckerWarningOptIn: readonly Requirement[];
      readonly optOut: readonly Requirement[];
    };
  };
};

export default class AddBasicUserFulfillmentChoices<
  Requirement extends string,
  Course extends CourseForRequirementGraph
> implements GraphProcessor<Requirement, Course> {
  private basicUserFulfillmentChoicesParameters: BasicUserFulfillmentChoicesParameters<Requirement>;

  constructor(
    basicUserFulfillmentChoicesParameters: BasicUserFulfillmentChoicesParameters<Requirement>
  ) {
    this.basicUserFulfillmentChoicesParameters = basicUserFulfillmentChoicesParameters;
  }

  public process(graph: RequirementFulfillmentGraph<Requirement, Course>) {
    return addBasicUserFulfillmentChoices(graph, this.basicUserFulfillmentChoicesParameters);
  }
}

export const addBasicUserFulfillmentChoices = <
  Requirement extends string,
  Course extends CourseForRequirementGraph
>(
  graph: RequirementFulfillmentGraph<Requirement, Course>,
  {
    userChoiceOnFulfillmentStrategy,
    userChoiceOnRequirementOverrides,
  }: BasicUserFulfillmentChoicesParameters<Requirement>
): RequirementFulfillmentGraph<Requirement, Course> => {
  const newGraph = graph.copy();

  // Respect user's choices on fulfillment strategies.
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

  // Respect user's choices on selectable and opt-out choices.
  newGraph.getAllCourses().forEach(course => {
    const userChoiceOnOptInOptOutCourse = userChoiceOnRequirementOverrides[course.uniqueId];
    if (userChoiceOnOptInOptOutCourse == null) return;
    userChoiceOnOptInOptOutCourse.acknowledgedCheckerWarningOptIn.forEach(requirement => {
      newGraph.addEdge(requirement, course);
    });
    userChoiceOnOptInOptOutCourse.optOut.forEach(requirement => {
      newGraph.removeEdge(requirement, course);
    });
  });

  return newGraph;
};
