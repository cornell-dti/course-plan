export type StrictFulfilledByType = 'credits' | 'courses' | 'self-check';

// Q: Why do we need to paramerize `fulfilledBy` field and default the type argument to string?
// A:
//    This is a hack.
//    Unfortunately, typescript gives json a more general type when typechecking it.
//    In our example, instead of recognizing that `fulfilledBy` can be all enums above, it generalizes
//    it to string.
//    Without using string as a parameter, type checking the json file against the type definition
//    will fail. Therefore, the hack is added to ensure we get some type safety when type checking
//    json.

// Q: Still, why do we need to paramerize `fulfilledBy` field?
// A: While we need `fulfilledBy` to be `string` when type checking json alone, we can have some
//    stricter guarantee elsewhere. Therefore, we parameterize it, so it can strict if we want.

export interface BaseRequirement<F = string> {
  readonly name: string;
  readonly description: string;
  readonly source: string;
  readonly search?: readonly string[];
  readonly includes?: readonly string[][];
  readonly excludes?: readonly string[][];
  readonly fulfilledBy: F;
  readonly applies?: string;
  readonly minCount?: number;
  readonly progressBar?: boolean;
}

export interface UniversityRequirement<F = string> extends BaseRequirement<F> {
  readonly includes: readonly string[][];
  readonly minCount: number;
}

export type UniversityRequirements<F = string> = {
  readonly value: string;
  readonly name: string;
  readonly requirements: readonly UniversityRequirement<F>[];
};

export interface CollegeRequirement<F = string> extends BaseRequirement<F> {
  readonly includes: readonly string[][];
}

export type CollegeRequirements<F = string> = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly requirements: readonly CollegeRequirement<F>[];
  };
};

export interface MajorRequirement<F = string> extends BaseRequirement<F> {
  readonly includes: readonly string[][];
}

export type MajorRequirements<F = string> = {
  readonly [collegeCode: string]: {
    readonly name: string;
    readonly schools: readonly string[];
    readonly requirements: readonly MajorRequirement<F>[];
  };
};

export type RequirementsJson<F = string> = {
  readonly university: UniversityRequirements<F>;
  readonly college: CollegeRequirements<F>;
  readonly major: MajorRequirements<F>;
};

export type StrictRequirementsJson = RequirementsJson<StrictFulfilledByType>;
