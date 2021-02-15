type RequirementCommon = {
  /** Full name of the requirement. */
  readonly name: string;
  /** Description of the requirement. */
  readonly description: string;
  /** The source with more information on the requirement. (This should be a URL string.) */
  readonly source: string;
  /** If this is set to true, then an edge to the course doesn't count towards double counting. */
  readonly allowCourseDoubleCounting?: true;
};

type EligibleCourses = {
  // "FA20": [123456, 42, 65536, /* and another crseId */]
  readonly [semester: string]: readonly number[];
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
      /** Defines how courses in a sub-requirement can be all counted towards a stat. */
      readonly subRequirementProgress: 'every-course-needed' | 'any-can-count';
      readonly fulfilledBy: 'credits' | 'courses';
      /**
       * The minimum count required to fulfill this requirement.
       *
       * - When fulfilledBy === 'credits', this field stores the min number of credits.
       * - When fulfilledBy === 'courses', this field stores the min number of courses.
       */
      readonly minCount: number;
    } & T)
  | {
      readonly fulfilledBy: 'toggleable';
      readonly fulfillmentOptions: {
        readonly [optionName: string]: {
          readonly minCount: number;
          readonly counting: 'credits' | 'courses';
          readonly subRequirementProgress: 'every-course-needed' | 'any-can-count';
          readonly description: string;
        } & T;
      };
    };

type DecoratedCollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{ readonly courses: readonly EligibleCourses[] }>;

type CourseTaken = {
  readonly roster: string;
  readonly courseId: number;
  readonly code: string;
  readonly subject: string;
  readonly number: string;
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
