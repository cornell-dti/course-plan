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
  readonly lastRoster: string;
  readonly uniqueID: number;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly credits: number;
  readonly creditRange: readonly [number, number];
  readonly semesters: readonly string[];
  readonly prereqs: string;
  readonly enrollment: readonly string[];
  readonly lectureTimes: readonly string[];
  readonly instructors: readonly string[];
  readonly distributions: readonly string[];
  readonly color: string;
};

export type FirestoreSemesterType = 'Fall' | 'Spring' | 'Summer' | 'Winter';
export type FirestoreSemester = {
  readonly year: number;
  readonly type: FirestoreSemesterType;
  readonly courses: readonly FirestoreSemesterCourse[];
};

export type FirestoreCollege = { readonly acronym: string; readonly fullName: string };
export type FirestoreMajorOrMinor = { readonly acronym: string; readonly fullName: string };
export type FirestoreAPIBExam = {
  readonly type: 'AP' | 'IB';
  readonly score: number;
  readonly subject: string;
};
export type FirestoreTransferClass = {
  readonly class: string;
  readonly course: CornellCourseRosterCourse;
  readonly credits: number;
};
export type FirestoreOnboardingUserData = {
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
  readonly toggleableRequirementChoices: AppToggleableRequirementChoices;
  readonly subjectColors: { readonly [subject: string]: string };
  readonly uniqueIncrementer: number;
  readonly userData: FirestoreOnboardingUserData;
};

export type CornellCourseRosterCourse = {
  readonly crseId: number;
  readonly subject: string;
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
  readonly catalogDistr?: string;
  readonly roster: string;
};

export type AppUser = {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
  readonly college: string;
  // FN === Full Name
  readonly collegeFN: string;
  readonly major: readonly string[];
  readonly majorFN: readonly string[];
  readonly minor: readonly string[];
  readonly minorFN: readonly string[];
  readonly exam: readonly FirestoreAPIBExam[];
  readonly transferCourse: readonly FirestoreTransferClass[];
  readonly tookSwim: 'yes' | 'no';
};

export type AppMajor = {
  readonly major: string;
  readonly majorFN: string;
};

export type AppMinor = {
  readonly minor: string;
  readonly minorFN: string;
};

export type AppCourse = {
  readonly crseId: number;
  readonly subject: string;
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly credits: number;
  readonly creditRange: readonly [number, number];
  readonly semesters: readonly string[];
  readonly prereqs: string;
  readonly enrollment: readonly string[];
  readonly lectureTimes: readonly string[];
  readonly instructors: readonly string[];
  readonly distributions: readonly string[];
  readonly lastRoster: string;
  readonly color: string;
  readonly check: boolean;
  uniqueID: number;
  isReqCourse: boolean;
};

export type AppSemester = {
  readonly courses: readonly AppCourse[];
  readonly type: FirestoreSemesterType;
  readonly year: number;
};

export type AppBottomBarCourse = {
  readonly subject: string;
  readonly number: string;
  readonly name: string;
  readonly credits: number;
  readonly semesters: string;
  color: string;
  readonly latestSem: string;
  readonly instructors: string;
  readonly distributionCategories: readonly string[];
  readonly enrollmentInfo: string;
  readonly latestLecInfo: readonly string[];
  overallRating: number;
  difficulty: number;
  workload: number;
  readonly prerequisites: string;
  readonly description: string;
  readonly uniqueID: number;
};

// map from requirement ID to option chosen
export type AppToggleableRequirementChoices = Readonly<Record<string, string>>;

/**
 * Creates credit range based on course
 * Example: [1, 4] is the credit range for the given course
 */
const createCourseCreditRange = (course: CornellCourseRosterCourse): readonly [number, number] => {
  const courseCreditRange: number[] = [];
  course.enrollGroups.forEach(enrollGroup => {
    courseCreditRange.push(enrollGroup.unitsMinimum);
    courseCreditRange.push(enrollGroup.unitsMaximum);
  });
  return [Math.min(...courseCreditRange), Math.max(...courseCreditRange)];
};

export const cornellCourseRosterCourseToAppCourse = (
  course: CornellCourseRosterCourse,
  isRequirementsCourse: boolean,
  incrementID: () => number,
  addColor: (subject: string) => string
): AppCourse => {
  const uniqueID = incrementID();

  const { subject, catalogNbr: number, titleLong: name, description, roster: lastRoster } = course;

  // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
  const credits = course.enrollGroups[0].unitsMaximum;
  const creditRange = createCourseCreditRange(course);
  // Semesters: remove periods and split on ', '
  // alternateSemesters option in case catalogWhenOffered for the course is null, undef, or ''
  const alternateSemesters =
    !course.catalogWhenOffered || course.catalogWhenOffered === ''
      ? []
      : course.catalogWhenOffered.replace(/\./g, '').split(', ');
  const semesters = alternateSemesters;

  // Get prereqs of course as string (). '' if neither available because '' is interpreted as false
  const prereqs = course.catalogPrereqCoreq || '';

  // If new course, iterate through enrollment groups to retrieve enrollment info, lecture times, and instructors

  // Hash maps used to remove redundancies
  const enrollmentMap: Record<string, boolean> = {};
  const lectureTimesMap: Record<string, boolean> = {};
  const instructorsMap: Record<string, string> = {};
  course.enrollGroups.forEach(group => {
    group.classSections.forEach(section => {
      // Add section
      const enroll = section.ssrComponent;
      enrollmentMap[enroll] = true;

      section.meetings.forEach(meeting => {
        const { pattern, timeStart, timeEnd } = meeting;
        // Only add the time if it is a lecture
        if (enroll === 'LEC') lectureTimesMap[`${pattern} ${timeStart} - ${timeEnd}`] = true;

        meeting.instructors.forEach(instructor => {
          const { netid, firstName, lastName } = instructor;
          instructorsMap[netid] = `${firstName} ${lastName}`;
        });
      });
    });
  });

  const enrollment = Object.keys(enrollmentMap);
  const lectureTimes = Object.keys(lectureTimesMap);
  const instructors = Object.keys(instructorsMap).map(
    netid => `${instructorsMap[netid]} (${netid})`
  );

  // Distribution of course (e.g. MQR-AS)
  // alternateDistributions option in case catalogDistr for the course is null, undef, ''
  const alternateDistributions =
    !course.catalogDistr || course.catalogDistr === ''
      ? ['']
      : (/\(([^)]+)\)/.exec(course.catalogDistr) || [])[1].split(', ');
  const distributions = alternateDistributions;

  // Create course from saved color. Otherwise, create course from subject color group
  const color = addColor(subject);

  const isReqCourse = isRequirementsCourse;

  return {
    crseId: course.crseId,
    subject,
    number,
    name,
    description,
    credits,
    creditRange,
    semesters,
    prereqs,
    enrollment,
    lectureTimes,
    instructors,
    distributions,
    lastRoster,
    color,
    check: true,
    uniqueID,
    isReqCourse,
  };
};

export const firestoreCourseToAppCourse = (
  course: FirestoreSemesterCourse,
  isRequirementsCourse: boolean
): AppCourse => {
  const {
    uniqueID,
    code,
    name,
    description,
    credits,
    creditRange,
    semesters,
    prereqs,
    enrollment,
    lectureTimes,
    instructors,
    distributions,
    lastRoster,
    color,
  } = course;

  const [subject, number] = code.split(' ');

  return {
    crseId: course.crseId,
    subject,
    number,
    name,
    description,
    credits,
    creditRange,
    semesters,
    prereqs,
    enrollment,
    lectureTimes,
    instructors,
    distributions,
    lastRoster,
    color,
    check: true,
    uniqueID,
    isReqCourse: isRequirementsCourse,
  };
};

const firestoreSemesterToAppSemester = ({
  courses,
  type,
  year,
}: FirestoreSemester): AppSemester => ({
  courses: courses.map(course => firestoreCourseToAppCourse(course, false)),
  type,
  year,
});

export const firestoreSemestersToAppSemesters = (
  firestoreSemesters: readonly FirestoreSemester[]
): AppSemester[] => firestoreSemesters.map(firestoreSemesterToAppSemester);

export const createAppUser = (
  data: FirestoreOnboardingUserData,
  name: FirestoreUserName
): AppUser => {
  const major: string[] = [];
  const majorFN: string[] = [];
  const minor: string[] = [];
  const minorFN: string[] = [];
  if ('majors' in data) {
    data.majors.forEach(({ acronym, fullName }) => {
      major.push(acronym);
      majorFN.push(fullName);
    });
  }
  if ('minors' in data) {
    data.minors.forEach(({ acronym, fullName }) => {
      minor.push(acronym);
      minorFN.push(fullName);
    });
  }

  const user: AppUser = {
    // TODO: take into account multiple colleges
    college: data.colleges[0].acronym,
    collegeFN: data.colleges[0].fullName,
    firstName: name.firstName,
    middleName: name.middleName,
    lastName: name.lastName,
    major,
    majorFN,
    minor,
    minorFN,
    exam: 'exam' in data && data.exam.length > 0 ? [...data.exam] : [],
    transferCourse: 'class' in data && data.class.length > 0 ? [...data.class] : [],
    tookSwim: data.tookSwim,
  };
  return user;
};
