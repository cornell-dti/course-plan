// Convention:
// - all the types describing data in Firestore is prefixed with Firestore.
// - all the data describing data converted from Firestore to be used by the app is prefixed with App.

export type FirestoreUserName = {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
};

export type FirestoreSemesterCourse = {
  readonly crseId: number;
  readonly uniqueID?: number;
  readonly code?: string;
  readonly subject: string;
  readonly catalogNbr: string;
  readonly titleLong?: string;
  readonly name: string;
  readonly description: string;
  readonly credits?: number;
  readonly creditRange?: readonly [number, number];
  readonly semesters?: readonly string[];
  readonly prereqs?: string;
  readonly enrollment?: readonly string[];
  readonly lectureTimes?: readonly string[];
  readonly instructors?: readonly string[];
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
  readonly catalogPrereqCoreq?: '';
  readonly catalogDistr?: string;
  readonly distributions?: readonly string[];
  readonly color?: string;
  readonly lastRoster?: string;
  readonly roster: string;
};

export type FirestoreSemesterType = 'Fall' | 'Spring' | 'Summer' | 'Winter';
export type FirestoreSemester = {
  readonly id: number;
  readonly year: number;
  readonly type: FirestoreSemesterType;
  readonly courses: readonly FirestoreSemesterCourse[];
};

export type FirestoreCollege = { readonly acronym: string; readonly fullName: string };
export type FirestoreMajorOrMinor = { readonly acronym: string; readonly fullName: string };
export type FirestoreAPIBExam = {
  readonly equivCourse: readonly string[];
  readonly score: number;
  readonly subject: string;
  readonly type: 'AP' | 'IB';
};
export type FirestoreTransferClass = {
  readonly class: string;
  readonly course: FirestoreSemesterCourse;
  readonly credits: number;
};
export type FirestoreNestedUserData = {
  readonly class: readonly FirestoreTransferClass[];
  readonly colleges: readonly FirestoreCollege[];
  readonly majors: readonly FirestoreMajorOrMinor[];
  readonly minors: readonly FirestoreMajorOrMinor[];
  readonly exam: readonly FirestoreAPIBExam[];
  readonly tookSwim: 'yes' | 'no';
};

export type FirestoreUserData = {
  readonly name: FirestoreUserName;
  readonly semesters: readonly FirestoreSemester[];
  readonly subjectColors: { readonly [subject: string]: string };
  readonly uniqueIncrementer: number;
  readonly userData: FirestoreNestedUserData;
};

export type AppUser = {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
  readonly college: string;
  // FN === Full Name
  readonly collegeFN: string;
  major: readonly string[];
  majorFN: readonly string[];
  minor: readonly string[];
  minorFN: readonly string[];
  exam: readonly FirestoreAPIBExam[];
  transferCourse: FirestoreTransferClass[];
  tookSwim: 'yes' | 'no';
};

export type AppCourse = {
  readonly crseId: number;
  readonly subject: string;
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly credits: number;
  readonly creditRange: readonly number[];
  readonly semesters: readonly string[];
  readonly prereqs: string;
  readonly enrollment: readonly string[];
  readonly lectureTimes: readonly string[];
  readonly instructors: readonly string[];
  readonly distributions: readonly string[];
  readonly lastRoster: string;
  readonly alerts: { requirement: string | null; caution: string | null };
  color: string;
  check: boolean;
  uniqueID: number;
};

export type AppSemester = {
  readonly courses: readonly AppCourse[];
  readonly id: number;
  readonly type: FirestoreSemesterType;
  readonly year: number;
};
