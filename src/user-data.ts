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
  credits: number;
  readonly creditRange: readonly [number, number];
  readonly semesters: readonly string[];
  readonly prereqs: string;
  readonly enrollment: readonly string[];
  readonly lectureTimes: readonly string[];
  readonly instructors: readonly string[];
  readonly distributions: readonly string[];
  readonly lastRoster: string;
  color: string;
  check: boolean;
  uniqueID: number;
  isReqCourse: boolean;
  isCompletedReqCourse: boolean;
};

export type AppSemester = {
  courses: readonly AppCourse[];
  id: number;
  type: FirestoreSemesterType;
  year: number;
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

/**
 * Creates credit range based on course
 * Example: [1, 4] is the credit range for the given course
 */
const createCourseCreditRange = (course: FirestoreSemesterCourse): readonly [number, number] => {
  const courseCreditRange: number[] = [];
  if (typeof course.creditRange !== 'undefined') {
    return course.creditRange;
  }
  if (typeof course.enrollGroups !== 'undefined') {
    course.enrollGroups.forEach(enrollGroup => {
      courseCreditRange.push(enrollGroup.unitsMinimum);
      courseCreditRange.push(enrollGroup.unitsMaximum);
    });
    return [Math.min(...courseCreditRange), Math.max(...courseCreditRange)];
  }
  // @ts-ignore
  return [course.credits, course.credits];
};

export const firestoreCourseToAppCourse = (
  course: FirestoreSemesterCourse,
  isRequirementsCourse: boolean,
  isCompletedRequirementsCourse: boolean,
  incrementID: () => number,
  addColor: (subject: string) => string
): AppCourse => {
  const uniqueID = course.uniqueID || incrementID();

  const subject = (course.code && course.code.split(' ')[0]) || course.subject;
  const number = (course.code && course.code.split(' ')[1]) || course.catalogNbr;

  // TODO: same field?
  const name = course.titleLong || course.name;

  // Description of course. Please leave the redundancy in place as a sanity check.
  const description = course.description || course.description;

  // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
  const credits = course.credits || course.enrollGroups[0].unitsMaximum;
  const creditRange = course.creditRange || createCourseCreditRange(course);
  // Semesters: remove periods and split on ', '
  // alternateSemesters option in case catalogWhenOffered for the course is null, undef, or ''
  const catalogWhenOfferedDoesNotExist =
    !course.catalogWhenOffered || course.catalogWhenOffered === '';
  const alternateSemesters = catalogWhenOfferedDoesNotExist
    ? []
    : course.catalogWhenOffered!.replace(/\./g, '').split(', ');
  const semesters = course.semesters || alternateSemesters;

  // Get prereqs of course as string (). '' if neither available because '' is interpreted as false
  const prereqs = course.prereqs || course.catalogPrereqCoreq || '';

  // To be redefined if does not exist
  // @ts-ignore
  let {
    enrollment,
    lectureTimes,
    instructors,
  }: {
    enrollment: readonly string[];
    lectureTimes: readonly string[];
    instructors: readonly string[];
  } = course;

  if (!(enrollment || lectureTimes || instructors)) {
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

    enrollment = Object.keys(enrollmentMap);
    lectureTimes = Object.keys(lectureTimesMap);
    instructors = Object.keys(instructorsMap).map(netid => `${instructorsMap[netid]} (${netid})`);
  }

  // Distribution of course (e.g. MQR-AS)
  // alternateDistributions option in case catalogDistr for the course is null, undef, ''
  const catalogDistrDoesNotExist = !course.catalogDistr || course.catalogDistr === '';
  const alternateDistributions = catalogDistrDoesNotExist
    ? ['']
    : /\(([^)]+)\)/.exec(course.catalogDistr!)![1].split(', ');
  const distributions = course.distributions || alternateDistributions;

  // Get last semester of available course. TODO: Remove when no longer firebase data dependant
  const lastRoster = course.lastRoster || course.roster;

  // Create course from saved color. Otherwise, create course from subject color group
  const color = course.color || addColor(subject);

  const isReqCourse = isRequirementsCourse;

  const isCompletedReqCourse = isCompletedRequirementsCourse;

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
    isCompletedReqCourse
  };
};

const firestoreSemesterToAppSemester = (
  { courses, type, year }: FirestoreSemester,
  semesterID: number,
  incrementID: () => number,
  addColor: (subject: string) => string
): AppSemester => {
  return {
    id: semesterID,
    courses: courses.map(course =>
      firestoreCourseToAppCourse(course, false, false, incrementID, addColor)
    ),
    type,
    year,
  };
};

export const firestoreSemestersToAppSemesters = (
  firestoreSemesters: readonly FirestoreSemester[],
  subjectColors: { readonly [subject: string]: string }
): AppSemester[] => {
  return firestoreSemesters.map((firebaseSem, index) => {
    return firestoreSemesterToAppSemester(
      firebaseSem,
      index + 1,
      () => {
        throw new Error('Course from firestore should already have uniqueID!');
      },
      subject => {
        const color = subjectColors[subject];
        if (color == null) {
          throw new Error("Course from firestore doesn't have color. Database might be corrupted.");
        }
        return color;
      }
    );
  });
};

export const createAppUser = (data: FirestoreNestedUserData, name: FirestoreUserName): AppUser => {
  const user: AppUser = {
    // TODO: take into account multiple majors and colleges
    college: data.colleges[0].acronym,
    collegeFN: data.colleges[0].fullName,
    firstName: name.firstName,
    middleName: name.middleName,
    lastName: name.lastName,
    major: [],
    majorFN: [],
    minor: [],
    minorFN: [],
    exam: [],
    transferCourse: [],
    tookSwim: data.tookSwim,
  };
  if ('exam' in data && data.exam.length > 0) {
    user.exam = [...data.exam];
  }
  if ('class' in data && data.class.length > 0) {
    user.transferCourse = [...data.class];
  }

  if ('majors' in data && data.majors.length > 0) {
    const majors: string[] = [];
    const majorsFN: string[] = [];
    data.majors.forEach(major => {
      majors.push(major.acronym);
      majorsFN.push(major.fullName);
    });
    user.major = majors;
    user.majorFN = majorsFN;
  }
  if ('minors' in data && data.minors.length > 0) {
    const minors: string[] = [];
    const minorsFN: string[] = [];
    data.minors.forEach(minor => {
      minors.push(minor.acronym);
      minorsFN.push(minor.fullName);
    });
    user.minor = minors;
    user.minorFN = minorsFN;
  }

  return user;
};
