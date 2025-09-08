// Convention:
// - all the types describing data in Firestore is prefixed with Firestore.
// - all the data describing data converted from Firestore to be used by the app is prefixed with App.

type FirestoreUserName = {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
};
// create a new version caleld FirestoreSemesterBlankCourse

// or maybe the paradigm:
//                                 FirestoreSemesterCourseBase
//                                 &                   &
// FirestoreSemesterBlankCourseCard                    FirestoreSemesterCornellCourseCard
//

// FireStoreSemesterCourse = FireStoreSemesterBlankCourseCard or FireStoreSemesterCornellCourseCard

// then all the other files that use FireStoreSemesterCourse can be used. With
// some conditional type checking to determine if it is a blank course or not

type FirestoreSemesterCourseBase = {
  readonly uniqueID: number;
  readonly code: string;
  readonly name: string;
  readonly credits: number;
  readonly creditRange: readonly [number, number];
  readonly semesters: readonly string[]; // TODO: figure out if this is needed
  readonly requirementsFulfilled: readonly string[];
  readonly color: string;
  readonly note?: string | null;
  readonly lastUpdated?: Timestamp | null;
};

type FirestoreSemesterCornellCourse = FirestoreSemesterCourseBase & {
  readonly type: 'CornellCourse'; // Discrminator for the type of course; Default type
  readonly lastRoster: string;
  // readonly uniqueID: number;
  // readonly code: string;
  // readonly name: string;
  // readonly credits: number;
  // readonly creditRange: readonly [number, number];
  // readonly semesters: readonly string[]; // TODO: figure out if this is needed
  // readonly color: string;
  // readonly note?: string | null;
  // readonly lastUpdated?: Timestamp | null; // NB: the Timestamp here is deliberately left untyped — importing from Firestore causes all sorts of namespace issues.
};

type FirestoreSemesterBlankCourse = FirestoreSemesterBase & {
  readonly type: 'BlankCourse'; // Discriminator for the type of course;
  readonly userID: string; // to associate with the specific user
  readonly courseType: Enumerator; // Transfer, Study Abroad, etc.
};

type FirestoreSemesterCourse = FirestoreSemesterCornellCourse | FirestoreSemesterBlankCourse;

type FirestoreSemesterPlaceholder = {
  readonly name: string;
  readonly uniqueID: number;
  readonly reqGroup: string;
  readonly slot: number;
  readonly startingSemester: number;
};

type FirestoreSemesterSeason = 'Fall' | 'Spring' | 'Summer' | 'Winter';
type FirestoreSemester = {
  readonly year: number;
  readonly season: FirestoreSemesterSeason;
  readonly courses: readonly (FirestoreSemesterCourse | FirestoreSemesterPlaceholder)[];
};

type FirestoreSemestersData = {
  readonly savedCourses: readonly Collection[]; // confirmed works:
  readonly plans: readonly Plan[];
  readonly semesters: readonly FirestoreSemester[];
  readonly orderByNewest: boolean;
};

type FirestoreCollegeOrMajorOrMinor = { readonly acronym: string };

/** Represents the name of an exam a student can take for transfer credit */
type TransferExamType = 'AP' | 'IB' | 'CASE';

type FirestoreTransferExam = {
  readonly examType: TransferExamType;
  readonly subject: string;
  readonly score: number | string;
  readonly type?: TransferExamType; // TODO @bshen migrate away
};

type FirestoreCollegeMajorMinorOrGrad = { readonly acronym: string };

type FirestoreOnboardingUserData = {
  readonly gradYear: string;
  readonly gradSem: FirestoreSemesterSeason | '';
  readonly entranceYear: string;
  readonly entranceSem: FirestoreSemesterSeason | '';
  readonly colleges: readonly FirestoreCollegeMajorMinorOrGrad[];
  readonly majors: readonly FirestoreCollegeMajorMinorOrGrad[];
  readonly minors: readonly FirestoreCollegeMajorMinorOrGrad[];
  readonly gradPrograms: readonly FirestoreCollegeMajorMinorOrGrad[];
  readonly exam: readonly FirestoreTransferExam[];
  readonly tookSwim: 'yes' | 'no';
  sawNewFeature: boolean;
  sawGiveaway: boolean;
  sawScheduleGenerator: boolean;
  fa25giveaway: {
    saw: boolean;
    step1: boolean;
    step2: boolean;
    step3: boolean;
    entered: boolean;
  };
};

type FirestoreCourseOptInOptOutChoices = {
  /** A list of requirements to opt-out */
  readonly optOut: readonly string[];
  /** It is for opting-in requirements that has a checker warning. */
  readonly acknowledgedCheckerWarningOptIn: readonly string[];
  /**
   * A list of requirement and their slots to opt-in arbitrarily.
   * It's for attaching completely unknown courses to a requirement
   * (e.g. opt-in CS 2112 for history requirement).
   */
  readonly arbitraryOptIn: { readonly [requirement: string]: readonly string[] };
};
type FirestoreOverriddenFulfillmentChoices = {
  readonly [courseUniqueId: string]: FirestoreCourseOptInOptOutChoices;
};

type FirestoreUserData = {
  readonly name: FirestoreUserName;
  readonly orderByNewest: boolean;
  readonly toggleableRequirementChoices: AppToggleableRequirementChoices;
  readonly subjectColors: { readonly [subject: string]: string };
  readonly uniqueIncrementer: number;
  readonly userData: FirestoreOnboardingUserData;
  // TODO: add overriddenFulfillmentChoices once we connect new requirement flow to prod.
};

type FirestoreTrackUsersData = {
  nameData: FirestoreTrackUsersNameData;
  semesterData: FirestoreTrackUsersSemesterData;
  onboardingData: FirestoreTrackUsersOnboardingData;
  timestamp: Date;
};

type FirestoreTrackUsersNameData = {
  totalUsers: number;
};

type FirestoreTrackUsersSemesterData = {
  totalSemesters: number;
  averageNumberSemesters: number;
  averageNumberOldSemesters: number;
  averageNumberNewSemesters: number;
};

type FirestoreTrackUsersOnboardingData = {
  undergradUsers: number;
  gradUsers: number;
  undergradAndGradUsers: number;
  majorFrequences: { readonly [group: string]: number };
  minorFrequencies: { readonly [group: string]: number };
  collegeFrequencies: { readonly [group: string]: number };
  graduateProgramFrequencies: { readonly [group: string]: number };
  averageNumberUndergradMajors: number;
  averageNumberUndergradMinors: number;
  averageNumberUndergradAPIBExams: number;
  entranceYearFrequencies: { readonly [group: string]: number };
  gradYearFrequencies: { readonly [group: string]: number };
};

type FirestoreUniqueIncrementer = {
  readonly uniqueIncrementer: number;
  readonly uniqueBlankCourseIncrementer: number;
};

interface CornellCourseRosterCourse {
  readonly crseId: number;
  readonly subject: string;
  readonly catalogNbr: string;
  readonly titleLong: string;
  readonly enrollGroups: readonly {
    readonly unitsMinimum: number;
    readonly unitsMaximum: number;
  }[];
  readonly catalogWhenOffered?: string | null;
  readonly catalogBreadth?: string;
  readonly catalogDistr?: string;
  readonly catalogComments?: string;
  readonly catalogSatisfiesReq?: string;
  readonly catalogCourseSubfield?: string;
  readonly catalogAttribute?: string;
  roster: string;
  readonly acadCareer: string;
  readonly acadGroup: string;
}

interface CornellCourseRosterCourseFullDetail extends CornellCourseRosterCourse {
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
  readonly catalogPrereqCoreq?: string;
  readonly catalogDistr?: string;
}

interface FullClassRosterCourseWithUniqueID extends CornellCourseRosterCourseFullDetail {
  readonly userChosenCredits: number;
  readonly uniqueID: number;
}

// college and grad are optional fields: grad can be undefined if the user hasn't selected a grad program, and college can be undefined if the user has only selected a grad program.
type AppOnboardingData = {
  readonly gradYear: string;
  readonly gradSem: FirestoreSemesterSeason | '';
  readonly entranceYear: string;
  readonly entranceSem: FirestoreSemesterSeason | '';
  readonly college?: string;
  readonly major: readonly string[];
  readonly minor: readonly string[];
  readonly grad?: string;
  readonly exam: readonly FirestoreTransferExam[];
  readonly tookSwim: 'yes' | 'no';
  sawNewFeature: boolean;
  sawGiveaway: boolean;
  sawScheduleGenerator: boolean;
  fa25giveaway: {
    saw: boolean;
    step1: boolean;
    step2: boolean;
    step3: boolean;
    entered: boolean;
  };
};

type AppBottomBarCourse = {
  readonly uniqueID: number;
  readonly code: string;
  readonly name: string;
  readonly credits: number;
  readonly color: string;
  readonly lastRoster: string;
  readonly semesters: readonly string[];
  description: string;
  prereqs: string;
  enrollment: readonly string[];
  lectureTimes: readonly string[];
  distributions: readonly string[];
  instructors: readonly string[];
  overallRating: number;
  difficulty: number;
  workload: number;
  currRoster: string;
};

// This is used for drag&drop between SubRequirement and Semester
type AppFirestoreSemesterCourseWithRequirementID = FirestoreSemesterCourse & {
  readonly requirementID?: string;
};

// Hannah's Note: nened to update this for drag&drop with FirestoreSemesterBlankCourseCard

/** Map from requirement ID to option chosen */
type AppToggleableRequirementChoices = Readonly<Record<string, string>>;

type GiveawayEntry = {
  igUsername: string;
};
type Plan = {
  readonly name: string;
  readonly semesters: readonly FirestoreSemester[];
};

type Collection = {
  readonly name: string;
  readonly courses: readonly FirestoreSemesterCourse[];
};
