// Convention:
// - all the types describing data in Firestore is prefixed with Firestore.
// - all the data describing data converted from Firestore to be used by the app is prefixed with App.

type FirestoreUserName = {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
};

type FirestoreSemesterCourse = {
  readonly crseId: number;
  readonly lastRoster: string;
  readonly uniqueID: number;
  readonly code: string;
  readonly name: string;
  readonly credits: number;
  readonly creditRange: readonly [number, number];
  readonly semesters: readonly string[];
  readonly color: string;
};

type FirestoreSemesterType = 'Fall' | 'Spring' | 'Summer' | 'Winter';
type FirestoreSemester = {
  readonly year: number;
  readonly type: FirestoreSemesterType;
  readonly courses: readonly FirestoreSemesterCourse[];
};

type FirestoreCollegeOrMajorOrMinor = { readonly acronym: string };
type FirestoreAPIBExam = {
  readonly type: 'AP' | 'IB';
  readonly score: number;
  readonly subject: string;
};
type FirestoreTransferClass = {
  readonly class: string;
  readonly course: CornellCourseRosterCourse;
  readonly credits: number;
};
type FirestoreOnboardingUserData = {
  readonly class: readonly FirestoreTransferClass[];
  readonly colleges: readonly FirestoreCollegeOrMajorOrMinor[];
  readonly majors: readonly FirestoreCollegeOrMajorOrMinor[];
  readonly minors: readonly FirestoreCollegeOrMajorOrMinor[];
  readonly exam: readonly FirestoreAPIBExam[];
  readonly tookSwim: 'yes' | 'no';
};

type FirestoreUserData = {
  readonly name: FirestoreUserName;
  readonly semesters: readonly FirestoreSemester[];
  readonly toggleableRequirementChoices: AppToggleableRequirementChoices;
  readonly subjectColors: { readonly [subject: string]: string };
  readonly uniqueIncrementer: number;
  readonly userData: FirestoreOnboardingUserData;
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
  readonly roster: string;
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

type AppOnboardingData = {
  readonly college: string;
  readonly major: readonly string[];
  readonly minor: readonly string[];
  readonly exam: readonly FirestoreAPIBExam[];
  readonly transferCourse: readonly FirestoreTransferClass[];
  readonly tookSwim: 'yes' | 'no';
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
};

/** Map from requirement ID to option chosen */
type AppToggleableRequirementChoices = Readonly<Record<string, string>>;

/** Map from course's unique ID to requirement ID */
type AppSelectableRequirementChoices = Readonly<Record<string, string>>;
