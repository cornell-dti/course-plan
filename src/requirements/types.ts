export type Course = {
  readonly subject: string;
  readonly catalogNbr: string;
  readonly titleLong: string;
  readonly description: string;
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
  readonly code: string;
  readonly subject: string;
  readonly number: string;
  readonly credits: number;
};

export interface BaseRequirement {
  /** Full name of the requirement. */
  readonly name: string;
  /** Description of the requirement. */
  readonly description: string;
  /** The source with more information on the requirement. (This should be a URL string.) */
  readonly source: string;
  readonly fulfilledBy: 'credits' | 'courses' | 'self-check';
  readonly applies?: string;
  /**
   * The minimum count required to fulfill this requirement.
   *
   * - When fulfilledBy === 'credits', this field stores the min number of credits.
   * - When fulfilledBy === 'courses', this field stores the min number of courses.
   * - When fulfilledBy === 'self-check', this field should not exist.
   */
  readonly minCount?: number;
  /**
   * Some requirements have sub-requirements.
   *
   * - `minCount` specifies how many types of sub-requirements needs to be satisfied.
   * - `totalCount` specifies how many courses/credits need to be earned in total.
   */
  readonly totalCount?: number;
  readonly progressBar?: boolean;
}

export type UniversityRequirements = {
  readonly value: string;
  readonly name: string;
  readonly requirements: readonly BaseRequirement[];
};

export interface CollegeOrMajorRequirement extends BaseRequirement {
  readonly checkerName: string | null;
}

export type EligibleCourses = {
  readonly [semester: string]: {
    // Subjects to course numbers
    readonly [subject: string]: readonly string[];
  };
};

export interface DecoratedCollegeOrMajorRequirement extends BaseRequirement {
  readonly courses: readonly EligibleCourses[];
}

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
  readonly university: UniversityRequirements;
  readonly college: CollegeRequirements<R>;
  readonly major: MajorRequirements<R>;
};

export type RequirementsJson = GenericRequirementsJson<CollegeOrMajorRequirement>;

export type DecoratedRequirementsJson = {
  readonly university: UniversityRequirements;
  readonly college: CollegeRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly major: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
};

export type RequirementFulfillment<M extends {}> = {
  /** The original requirement object. */
  readonly requirement: BaseRequirement;
  /** A list of courses that satisfy this requirement. */
  readonly courses: readonly CourseTaken[][];
} & M;

export type RequirementFulfillmentStatistics = {
  /**
   * Current fulfillment progress.
   * When it's a number, it's either number of courses or number of credits.
   * When it's undefined, it means that the requirement is self-check.
   */
  readonly minCountFulfilled?: number;
  readonly totalCountFulfilled?: number;
};

export type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'University' | 'College' | 'Major';
  readonly specific: string | null;
  readonly reqs: readonly RequirementFulfillment<RequirementFulfillmentStatistics>[];
};

export type DisplayableRequirementFulfillment = RequirementFulfillment<
  RequirementFulfillmentStatistics & { displayDescription: boolean }
>;

export type SingleMenuRequirement = {
  readonly ongoing: DisplayableRequirementFulfillment[];
  readonly completed: DisplayableRequirementFulfillment[];
  readonly name: string;
  readonly group: string;
  readonly specific: string | null;
  readonly color: string;
  displayDetails: boolean;
  displayCompleted: boolean;
  type?: string;
  fulfilled?: number;
  required?: number;
};
