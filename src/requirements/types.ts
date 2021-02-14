export type Course = {
  readonly subject: string;
  readonly crseId: number;
  readonly catalogNbr: string;
  readonly titleLong: string;
  readonly description: string;
  readonly enrollGroups: readonly {
    readonly unitsMinimum: number;
    readonly unitsMaximum: number;
    readonly classSections: readonly {
      readonly ssrComponent: string;
      readonly meetings: readonly {
        readonly pattern: unknown;
        readonly timeStart: unknown;
        readonly timeEnd: unknown;
        readonly instructors: readonly {
          readonly netid: string;
          readonly firstName: string;
          readonly lastName: string;
        }[];
      }[];
    }[];
  }[];
  readonly catalogWhenOffered?: string;
  readonly catalogPrereqCoreq?: string;
  readonly catalogBreadth?: string;
  readonly catalogDistr?: string;
  readonly catalogAttribute: string;
  readonly catalogComments?: string;
  readonly catalogSatisfiesReq?: string;
  readonly catalogCourseSubfield?: string;
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

export type RequirementFulfillmentStatistics = {
  readonly fulfilledBy: 'courses' | 'credits' | 'self-check';
  readonly minCountFulfilled: number;
  readonly minCountRequired: number;
};

export type RequirementFulfillment = {
  /** The original requirement object. */
  readonly requirement: RequirementWithIDSourceType;
  /** A list of courses that satisfy this requirement. */
  readonly courses: readonly (readonly CourseTaken[])[];
} & RequirementFulfillmentStatistics;

export type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'College' | 'Major' | 'Minor';
  readonly specific: string;
  readonly reqs: readonly RequirementFulfillment[];
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
