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

export type BaseRequirement = RequirementCommon & RequirementFulfillmentInformation;

export type RequirementChecker = (course: Course) => boolean;
export type CollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{
    readonly checker: RequirementChecker | readonly RequirementChecker[];
  }>;

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

export type CrseInfo = {
  readonly roster: string;
  readonly crseIds: number[];
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
