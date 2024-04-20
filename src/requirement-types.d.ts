type RequirementCommon = {
  /** Full name of the requirement. */
  readonly name: string;
  /** Description of the requirement. */
  readonly description: string;
  /** The source with more information on the requirement. (This should be a URL string.) */
  readonly source: string;
  /** If this is set to true, then an edge to the course doesn't count towards double counting. */
  readonly allowCourseDoubleCounting?: true;
  /** If this is set to true, then AP/IB credits cannot be applied towards this requirement. */
  readonly disallowTransferCredit?: true;

  /**
   * If this field exists with string,
   * then a warning will show in sidebar and it will be treated mostly as a self-check.
   */
  readonly checkerWarning?: string;
};

type RequirementFulfillmentInformationCourseBase<T> = {
  readonly fulfilledBy: 'courses';
  /** The minimum number of courses/credits required to fulfill each sub-requirement. */
  readonly perSlotMinCount: readonly number[];
  /** The name of each slot, used for display only. */
  readonly slotNames: readonly string[];
  /** When we care more about how many slots are filled with some courses */
  readonly minNumberOfSlots?: number;
} & T;

type RequirementFulfillmentInformationCreditBase<T> = {
  readonly fulfilledBy: 'credits';
  /** The minimum number of courses/credits required to fulfill each sub-requirement. */
  readonly perSlotMinCount: readonly number[];
  /** When we care more about how many slots are filled with some courses */
  readonly minNumberOfSlots?: number;
} & T;

type RequirementFulfillmentInformationCourseOrCreditBase<T> =
  | RequirementFulfillmentInformationCourseBase<T>
  | RequirementFulfillmentInformationCreditBase<T>;

type ToggleableRequirementFulfillmentInformation<T = Record<string, unknown>> = {
  readonly fulfilledBy: 'toggleable';
  readonly fulfillmentOptions: {
    readonly [optionName: string]: {
      readonly perSlotMinCount: readonly number[];
      readonly minNumberOfSlots?: number;
      readonly description: string;
    } & T &
      (
        | { readonly counting: 'courses'; readonly slotNames: readonly string[] }
        | { readonly counting: 'credits' }
      );
  };
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
  | (RequirementFulfillmentInformationCourseBase<T> & {
      /**
       * Compound requirements only.
       * It is a map from additional requirement name and corresponding courses/checkers.
       */
      readonly additionalRequirements?: {
        readonly [name: string]: RequirementFulfillmentInformationCourseOrCreditBase<T>;
      };
    } & T)
  | (RequirementFulfillmentInformationCreditBase<T> & {
      readonly additionalRequirements?: {
        readonly [name: string]: RequirementFulfillmentInformationCourseOrCreditBase<T>;
      };
    } & T)
  | ToggleableRequirementFulfillmentInformation<T>;

/** Requirements may have conditions associated with certain course ids, eg. for AP/IB exams. */
type RequirementCourseConditions = Record<
  number,
  {
    /** If the user IS NOT in one of these colleges, the course id cannot fulfill the requirement. */
    readonly colleges: string[];
    /** If the user IS in one of these majors, the course id cannot fulfill the requirement. */
    readonly majorsExcluded?: string[];
  }
>;

type DecoratedCollegeOrMajorRequirement = RequirementCommon &
  RequirementFulfillmentInformation<{
    readonly courses: readonly (readonly number[])[];
    readonly conditions?: Readonly<RequirementCourseConditions>;
  }>;

type MigrationWithDecoratedRequirement = RequirementMigration & {
  newValue?: DecoratedCollegeOrMajorRequirement;
};

/**
 * CourseTaken is the data type used in requirement computation.
 * It's a significantly simplified version of FirestoreSemesterCourse to make it easy to mock for
 * the purpose of requirement computation.
 */
type CourseTaken = {
  /** The course ID from course roster, or our dummy id to denote special courses like FWS equiv. */
  readonly courseId: number;
  /** Using the unique ID of firestore course for real course, string for swim test and AP/IB. */
  readonly uniqueId: string | number;
  /**
   * Course code like 'CS 2112', 'AP CS'.
   * It's mostly unused except for displaying completed courses, or calculating total credits.
   */
  readonly code: string;
  /** The number of credits taken, which is used to calculate fulfillment progress. */
  readonly credits: number;
};

type RequirementGroupType = 'College' | 'Major' | 'Minor' | 'Grad';

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

type RequirementFulfillmentStatisticsWithCourses = RequirementFulfillmentStatistics & {
  readonly courses: readonly (readonly CourseTaken[])[];
};

type RequirementFulfillmentStatisticsWithCoursesWithAdditionalRequirements = RequirementFulfillmentStatisticsWithCourses & {
  readonly additionalRequirements?: {
    readonly [name: string]: RequirementFulfillmentStatisticsWithCourses;
  };
};
type MixedRequirementFulfillmentStatistics = {
  readonly fulfilledBy: 'courses' | 'credits' | 'self-check';
  readonly safeCourses: readonly (readonly CourseTaken[])[];
  readonly dangerousCourses: readonly (readonly CourseTaken[])[];
  readonly safeMinCountFulfilled: number;
  readonly dangerousMinCountFulfilled: number;
  readonly safeMinCountFulfilled: number;
  readonly dangerousMinCountFulfilled: number;
  readonly minCountRequired: number;
};
type MixedRequirementFulfillmentStatisticsWithAdditionalRequirements = MixedRequirementFulfillmentStatistics & {
  readonly additionalRequirements?: {
    readonly [name: string]: MixedRequirementFulfillmentStatistics;
  };
};

type RequirementFulfillment = {
  /** The original requirement object. */
  readonly requirement: RequirementWithIDSourceType;
  readonly fulfillment: MixedRequirementFulfillmentStatisticsWithAdditionalRequirements;
};

type GroupedRequirementFulfillmentReport = {
  readonly groupName: 'College' | 'Major' | 'Minor' | 'Grad';
  readonly specific: string;
  readonly reqs: readonly RequirementFulfillment[];
};

type GroupedRequirementFulfillmentReportWithProgress = GroupedRequirementFulfillmentReport &
  Readonly<{
    dangerouslyFulfilled: number;
    totalRequired: number;
    safeProgress: number;
    dangerousProgress: number;
  }>;
