import { AdvisorGroup } from '@/requirements/tools-types';

export type Course = Omit<CornellCourseRosterCourse, 'roster'>;

export type BaseRequirement = RequirementCommon & RequirementFulfillmentInformation;

export type RequirementChecker = (course: Course) => boolean;
export type CollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{
    readonly checker: readonly RequirementChecker[];
  }>;

/** A group of requirements, such as a college */
type RequirementGroup<R> = Readonly<{
  name: string;
  requirements: readonly R[];
  advisors?: AdvisorGroup;
}>;

/**
 * A collection of common requirement groups, such as those corresponding
 * to colleges
 */
type RequirementGroups<G extends string, R> = Readonly<Record<G, RequirementGroup<R>>>;

/** Valid colleges */
export const colleges = ['AG', 'AR', 'AS1', 'AS2', 'EN', 'HE', 'IL', 'BU'] as const;

/** College codes */
export type College = typeof colleges[number];

/** Equality witness */
export const isCollege = (code: string): code is College =>
  colleges.some(college => college === code);

export type CollegeRequirements<R> = RequirementGroups<College, R>;

export type Major<R> = Readonly<{
  name: string;
  schools: readonly string[];
  requirements: readonly R[];
  /** College requirements that have been "specialized" for this major */
  specializations?: readonly R[];
  advisors?: AdvisorGroup;
}>;

export type MutableMajorRequirements<R> = {
  [majorCode: string]: Major<R>;
};

export type MajorRequirements<R> = Readonly<MutableMajorRequirements<R>>;

type UniversityRequirements<R> = RequirementGroups<'UNI', R>;

type GenericRequirementsJson<R> = {
  readonly university: UniversityRequirements<R>;
  readonly college: CollegeRequirements<R>;
  readonly major: MajorRequirements<R>;
  readonly minor: MajorRequirements<R>;
  // We are treating grad programs at the same level as a major/minor.
  readonly grad: MajorRequirements<R>;
};

export type RequirementsJson = GenericRequirementsJson<CollegeOrMajorRequirement>;

export type DecoratedRequirementsJson = {
  readonly university: UniversityRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly college: CollegeRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly major: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
  readonly minor: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
  // We are treating grad programs at the same level as a major/minor.
  readonly grad: MajorRequirements<DecoratedCollegeOrMajorRequirement>;
};

/* Type that represents a set of placeholders for a given requirement */
type PlaceholdersForRequirement = {
  /**
   * Acronym representing the university/college/major the requirement is located in.
   * Should be the same acronym used in RequirementsJson.
   */
  readonly reqGroup: string;
  /** Name of the requirement to generate placeholders for within the file with acronym reqGroup */
  readonly name: string;
  /**
   * Semesters for which placeholders representing req name should be placed in, indexed starting at 1.
   * Each element in placeholderSemesters corresponds to the element with the same index in perSlotMinCount.
   */
  readonly placeholderSemesters: number[];
};

export type Template = readonly PlaceholdersForRequirement[];
