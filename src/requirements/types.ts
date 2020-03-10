export type Course = {
  readonly subject: string;
  readonly catalogNbr: string;
  readonly titleLong: string;
  readonly description: string;
  readonly catalogBreadth: string;
  readonly catalogDistr: string;
  readonly catalogLang: string;
  readonly catalogAttribute: string;
  readonly catalogWhenOffered: string;
  readonly catalogComments: string;
  readonly catalogSatisfiesReq: string;
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

export type RequirementSearch = keyof Course | 'all' | 'self-check' | 'all-eligible' | 'code';

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

export type EligibleCourses = {
  readonly [semester: string]: {
    // Subjects to course numbers
    readonly [subject: string]: readonly string[];
  };
};

export interface CollegeOrMajorRequirement extends BaseRequirement {
  readonly courses: EligibleCourses;
}

export type CollegeRequirements = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly requirements: readonly CollegeOrMajorRequirement[];
  };
};

export type MajorRequirements = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly schools: readonly string[];
    readonly requirements: readonly CollegeOrMajorRequirement[];
  };
};

export type RequirementsJson = {
  readonly university: UniversityRequirements;
  readonly college: CollegeRequirements;
  readonly major: MajorRequirements;
};
