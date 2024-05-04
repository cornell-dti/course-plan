/**
 * A set of pure functions to convert between Firestore data and app data.
 * ===================================================================================================
 * Note:
 * Do not directly or indrectly import and use the global VueX `store`.
 * Instead, pass it as an parameter.
 * It's important to keep these functions pure and avoid cyclic dependencies between modules.
 */

import type { TypedVuexStore } from './store';

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

export const cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor = (
  course: CornellCourseRosterCourse,
  uniqueID: number,
  color: string
): FirestoreSemesterCourse => {
  const { subject, catalogNbr: number, titleLong: name, roster: lastRoster } = course;

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

  return {
    crseId: course.crseId,
    lastRoster,
    code: `${subject} ${number}`,
    name,
    credits,
    creditRange,
    semesters,
    color,
    uniqueID,
  };
};

export const cornellCourseRosterCourseToFirebaseSemesterCourse = (
  course: CornellCourseRosterCourse,
  store: TypedVuexStore,
  incrementUniqueID: () => number
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
    course,
    incrementUniqueID(),
    store.state.subjectColors[course.subject]
  );

export const cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation = (
  course: CornellCourseRosterCourseFullDetail
): Pick<
  AppBottomBarCourse,
  'description' | 'prereqs' | 'enrollment' | 'lectureTimes' | 'instructors' | 'distributions'
> => {
  const { description } = course;

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

  // Get prereqs of course as string (). '' if neither available because '' is interpreted as false
  const prereqs = course.catalogPrereqCoreq || '';
  const enrollment = Object.keys(enrollmentMap);
  const lectureTimes = Object.keys(lectureTimesMap);
  const instructors = Object.keys(instructorsMap).map(
    netid => `${instructorsMap[netid]} (${netid})`
  );

  // Distribution of course (e.g. MQR-AS)
  // alternateDistributions option in case catalogDistr for the course is null, undef, ''
  const distributions =
    !course.catalogDistr || course.catalogDistr === ''
      ? ['']
      : (/\(([^)]+)\)/.exec(course.catalogDistr) || [])[1].split(', ');

  return { description, prereqs, enrollment, lectureTimes, instructors, distributions };
};

/**
 * This function transforms a roster ID to a season and year. EX: SP23 -> Spring 2023
 * */
export const rosterIdentifierToSeasonAndYear = (
  roster: string
): { season: FirestoreSemesterSeason; year: number } => {
  const semester = roster.slice(0, 2);
  const year = roster.slice(2, 4);
  const semesterToSeasonMap = new Map([
    ['FA', 'Fall'],
    ['SP', 'Spring'],
    ['WI', 'Winter'],
    ['SU', 'Summer'],
  ]);

  return {
    season: semesterToSeasonMap.get(semester) as FirestoreSemesterSeason,
    year: parseInt(year, 10) + 2000,
  };
};

/**
 * This function transforms semester and year to a roster ID. EX: Spring 2023 -> SP23
 * */
export const seasonAndYearToRosterIdentifier = (
  season: FirestoreSemesterSeason,
  year: number
): string => {
  const seasonToSemesterMap = {
    Fall: 'FA',
    Spring: 'SP',
    Winter: 'WI',
    Summer: 'SU',
  } as const;

  return `${seasonToSemesterMap[season]}${year - 2000}`;
};

export const firestoreSemesterCourseToBottomBarCourse = (
  { code, name, credits, color, lastRoster, semesters, uniqueID }: FirestoreSemesterCourse,
  season: FirestoreSemesterSeason,
  year: number
): AppBottomBarCourse => ({
  code,
  name,
  credits,
  lastRoster,
  color,
  semesters,
  instructors: [],
  distributions: [],
  enrollment: [],
  lectureTimes: [],
  prereqs: '',
  description: '',
  uniqueID,
  overallRating: 0,
  difficulty: 0,
  workload: 0,
  currRoster: seasonAndYearToRosterIdentifier(season, year), // currRoster = lastRoster when course is not offered in currRoster
});

// set entranceSem to fall and gradSem to spring by default locally, saved to Firestore when Onboarding finished
export const createAppOnboardingData = (data: FirestoreOnboardingUserData): AppOnboardingData => ({
  // TODO: take into account multiple colleges
  gradYear: data.gradYear ?? '',
  gradSem: data.gradSem ?? '',
  entranceYear: data.entranceYear ?? '',
  entranceSem: data.entranceSem ?? '',
  college: data.colleges.length !== 0 ? data.colleges[0].acronym : undefined,
  major: data.majors.map(({ acronym }) => acronym),
  minor: data.minors.map(({ acronym }) => acronym),
  grad:
    'gradPrograms' in data && data.gradPrograms.length !== 0
      ? data.gradPrograms[0].acronym
      : undefined,
  // TODO @bshen migration script from type to examType
  exam:
    'exam' in data
      ? [
          ...data.exam.map(e => ({
            ...e,
            type: e.examType || e.type,
            examType: e.type || e.examType,
          })),
        ]
      : [],
  tookSwim: 'tookSwim' in data ? data.tookSwim : 'no',
  sawNewFeature: data.sawNewFeature,
  sawScheduleGenerator: data.sawScheduleGenerator,
});
