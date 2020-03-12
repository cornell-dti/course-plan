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
  readonly name: string;
  readonly description: string;
  readonly source: string;
  readonly fulfilledBy: 'credits' | 'courses' | 'self-check';
  readonly applies?: string;
  readonly minCount?: number;
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

export type RequirementFulfillment = {
  /** The original requirement object. */
  readonly requirement: BaseRequirement;
  /** A list of course codes that satisfy this requirement. */
  readonly courses: readonly string[];
  /**
   * Current fulfillment progress.
   * When it's a number, it's either number of courses or number of credits.
   * When it's undefined, it means that the requirement is self-check.
   */
  readonly fulfilled?: number;
};

export type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'University' | 'College' | 'Major';
  readonly specific: string | null;
  readonly reqs: readonly RequirementFulfillment[];
};

export type DisplayableRequirementFulfillment = RequirementFulfillment & {
  displayDescription: boolean;
}

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
