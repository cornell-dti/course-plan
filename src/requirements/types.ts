export type Course = {
  readonly subject: string;
  readonly crseId: number;
  readonly catalogNbr: string;
  readonly titleLong: string;
  readonly description: string;
  readonly enrollGroups: unknown[];
  readonly catalogWhenOffered?: string;
  readonly catalogPrereqCoreq?: string;
  readonly catalogBreadth?: string;
  readonly catalogDistr?: string;
  readonly catalogAttribute: string;
  readonly catalogComments?: string;
  readonly catalogSatisfiesReq?: string;
  readonly acadCareer: string;
  readonly acadGroup: string;
};

export type CourseTaken = {
  readonly roster: string;
  readonly courseId: number;
  readonly code: string;
  readonly subject: string;
  readonly number: string;
  readonly credits: number;
};

type RequirementCommon = {
  /** Full name of the requirement. */
  readonly name: string;
  /** Description of the requirement. */
  readonly description: string;
  /** The source with more information on the requirement. (This should be a URL string.) */
  readonly source: string;
  /** If this is set to true, then an edge to the course doesn't count towards double counting. */
  readonly allowCourseDoubleCounting?: true;
  readonly progressBar?: boolean;
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
      /** Defines whether courses are 'double counted': and for no double counting and or for double counting */
      readonly operator: 'and' | 'or';
      readonly fulfilledBy: 'credits' | 'courses';
      /**
       * The minimum count required to fulfill this requirement.
       *
       * - When fulfilledBy === 'credits', this field stores the min number of credits.
       * - When fulfilledBy === 'courses', this field stores the min number of courses.
       */
      readonly minCount: number;
      /**
       * Some requirements have sub-requirements.
       *
       * - `minCount` specifies how many types of sub-requirements needs to be satisfied.
       * - `totalCount` specifies how many courses/credits need to be earned in total.
       */
      readonly totalCount?: number;
    } & T)
  | {
      readonly fulfilledBy: 'toggleable';
      readonly fulfillmentOptions: {
        readonly [optionName: string]: {
          readonly minCount: number;
          readonly totalCount?: number;
          readonly counting: 'credits' | 'courses';
          readonly operator: 'and' | 'or';
          readonly description: string;
        } & T;
      };
    };
export type BaseRequirement = RequirementCommon & RequirementFulfillmentInformation;

export type RequirementChecker = (course: Course) => boolean;
export type CollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{
    readonly checker: RequirementChecker | readonly RequirementChecker[];
  }>;

export type EligibleCourses = {
  // "FA20": [123456, 42, 65536, /* and another crseId */]
  readonly [semester: string]: readonly number[];
};

export type DecoratedCollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{ readonly courses: readonly EligibleCourses[] }>;

export type RequirementWithIDSourceType = DecoratedCollegeOrMajorRequirement & {
  readonly id: string;
  readonly sourceType: 'College' | 'Major' | 'Minor';
  readonly sourceSpecificName: string;
};

export type CollegeRequirements<R> = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly requirements: readonly R[];
  };
};

export type MajorRequirements<R> = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly schools: readonly string[];
    readonly requirements: readonly R[];
  };
};

type GenericRequirementsJson<R> = {
  readonly university: CollegeRequirements<R>;
  readonly college: CollegeRequirements<R>;
  readonly major: MajorRequirements<R>;
  readonly minor: MajorRequirements<R>;
};

export type RequirementsJson = GenericRequirementsJson<CollegeOrMajorRequirement>;

export type DecoratedRequirementsJson = {
  readonly university: CollegeRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly college: CollegeRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly major: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly minor: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
};

export type RequirementFulfillment<M extends Record<string, unknown>> = {
  /** ID of the requirement */
  readonly id: string;
  /** The original requirement object. */
  readonly requirement: DecoratedCollegeOrMajorRequirement;
  /** A list of courses that satisfy this requirement. */
  readonly courses: readonly (readonly CourseTaken[])[];
} & M;

export type RequirementFulfillmentStatistics = {
  readonly fulfilledBy: 'courses' | 'credits' | 'self-check';
  /**
   * Current fulfillment progress.
   * When it's a number, it's either number of courses or number of credits.
   * When it's undefined, it means that the requirement is self-check.
   */
  readonly minCountFulfilled: number;
  readonly minCountRequired: number;
  readonly totalCountFulfilled?: number;
  readonly totalCountRequired?: number;
};

export type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'University' | 'College' | 'Major' | 'Minor';
  readonly specific: string;
  readonly reqs: readonly RequirementFulfillment<RequirementFulfillmentStatistics>[];
};

export type DisplayableRequirementFulfillment = RequirementFulfillment<RequirementFulfillmentStatistics>;

export type SingleMenuRequirement = {
  readonly ongoing: DisplayableRequirementFulfillment[];
  readonly completed: DisplayableRequirementFulfillment[];
  readonly name: string;
  readonly group: 'COLLEGE' | 'MAJOR' | 'MINOR';
  readonly specific: string;
  type?: string;
  fulfilled?: number;
  required?: number;
};

export type CrseInfo = {
  readonly roster: string;
  crseIds: number[];
};

export type CompletedSubReqCourseSlot = {
  readonly isCompleted: true;
  readonly courses: readonly CourseTaken[];
};

export type IncompleteSubReqCourseSlot = {
  readonly isCompleted: false;
  readonly courses: readonly CrseInfo[];
};

export type SubReqCourseSlot = CompletedSubReqCourseSlot | IncompleteSubReqCourseSlot;
