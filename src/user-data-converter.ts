import { getOrAllocateSubjectColor, incrementUniqueID } from './global-firestore-data';

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
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse =>
  cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
    course,
    incrementUniqueID(),
    getOrAllocateSubjectColor(course.subject)
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

export const firestoreSemesterCourseToBottomBarCourse = ({
  code,
  name,
  credits,
  color,
  lastRoster,
  semesters,
  uniqueID,
}: FirestoreSemesterCourse): AppBottomBarCourse => ({
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
});
