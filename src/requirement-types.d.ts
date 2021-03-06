type RequirementCommon = {
  /** Full name of the requirement. */
  readonly name: string;
  /** Description of the requirement. */
  readonly description: string;
  /** The source with more information on the requirement. (This should be a URL string.) */
  readonly source: string;
  /** If this is set to true, then an edge to the course doesn't count towards double counting. */
  readonly allowCourseDoubleCounting?: true;
  /**
   * If this field exists with string,
   * then a warning will show in sidebar and it will be treated mostly as a self-check.
   */
  readonly checkerWarning?: string;
};

/**
 * @param T additional information only attached to credits and courses type.
 */
type RequirementFulfillmentInformation<T = Record<string, unknown>> =
  | {
      readonly fulfilledBy: 'self-check';
      // Currently unused.
      readonly minCount?: number;
    }
  | ({
      readonly fulfilledBy: 'courses' | 'credits';
      /** The minimum number of courses/credits required to fulfill each sub-requirement. */
      readonly perSlotMinCount: readonly number[];
      /** When we care more about how many slots are filled with some courses */
      readonly minNumberOfSlots?: number;
    } & T)
  | {
      readonly fulfilledBy: 'toggleable';
      readonly fulfillmentOptions: {
        readonly [optionName: string]: {
          readonly counting: 'courses' | 'credits';
          readonly perSlotMinCount: readonly number[];
          readonly minNumberOfSlots?: number;
          readonly description: string;
        } & T;
      };
    };

type DecoratedCollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{ readonly courses: readonly (readonly number[])[] }>;

/**
 * CourseTaken is the data type used in requirement computation.
 * It's a significantly simplified version of FirestoreSemesterCourse to make it easy to mock for
 * the purpose of requirement computation.
 */
type CourseTaken = {
  /** The course ID from course roster, or our dummy id to denote special courses like FWS equiv. */
  readonly courseId: number;
  /** Using the unique ID of firestore course for real course, and -1 for AP/IB/Swim */
  readonly uniqueId: number;
  /**
   * Course code like 'CS 2112', 'AP CS'.
   * It's mostly unused except for displaying completed courses, or calculating total credits.
   */
  readonly code: string;
  /** The number of credits taken, which is used to calculate fulfillment progress. */
  readonly credits: number;
};

type RequirementGroupType = 'College' | 'Major' | 'Minor';

type RequirementWithIDSourceType = DecoratedCollegeOrMajorRequirement & {
  readonly id: string;
  readonly sourceType: RequirementGroupType;
  readonly sourceSpecificName: string;
};

type RequirementFulfillmentStatistics = {
  readonly fulfilledBy: 'courses' | 'credits' | 'self-check';
  readonly minCountFulfilled: number;
  readonly minCountRequired: number;
};

type RequirementFulfillment = {
  /** The original requirement object. */
  readonly requirement: RequirementWithIDSourceType;
  /** A list of courses that satisfy this requirement. */
  readonly courses: readonly (readonly CourseTaken[])[];
} & RequirementFulfillmentStatistics;

type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'College' | 'Major' | 'Minor';
  readonly specific: string;
  readonly reqs: readonly RequirementFulfillment[];
};
