import { getOrAllocateSubjectColor, incrementUniqueID } from './global-firestore-data';
import { CornellCourseRosterCourse, FirestoreSemesterCourse } from './user-data';

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

export const cornellCourseRosterCourseToFirebaseSemesterCourse = (
  course: CornellCourseRosterCourse
): FirestoreSemesterCourse => {
  const uniqueID = incrementUniqueID();

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
  const color = getOrAllocateSubjectColor(subject);

  return {
    crseId: course.crseId,
    code: `${subject} ${number}`,
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
    uniqueID,
  };
};

export default cornellCourseRosterCourseToFirebaseSemesterCourse;
