import { getCourse } from './global-firestore-data/courses';
import {
  cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation,
  cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor,
  firestoreSemesterCourseToBottomBarCourse,
  rosterIdentifierToSeasonAndYear,
} from './user-data-converter';

// Preview courses never enter a plan or consume the persisted course counter.
export const COURSE_PREVIEW_ID = -2;

export const courseToSearchPreview = (
  course: CornellCourseRosterCourse,
  color: string
): AppBottomBarCourse => {
  const { season, year } = rosterIdentifierToSeasonAndYear(course.roster);
  const preview = firestoreSemesterCourseToBottomBarCourse(
    cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
      {
        ...course,
        enrollGroups: course.enrollGroups.length
          ? course.enrollGroups
          : [{ unitsMinimum: 0, unitsMaximum: 0 }],
      },
      COURSE_PREVIEW_ID,
      color
    ),
    season,
    year
  );
  Object.assign(
    preview,
    cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation({
      ...course,
      description: '',
      enrollGroups: [],
    })
  );
  return preview;
};

export const loadCourseDetails = async (roster: string, subject: string, number: string) => {
  const course = await getCourse(roster, subject, number);
  if (!course) throw new Error('Course information is unavailable.');
  return {
    roster: course.roster,
    information: cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation({
      ...course,
      description: course.description || '',
      enrollGroups: (course.enrollGroups || []).map(group => ({
        ...group,
        classSections: (group.classSections || []).map(section => ({
          ...section,
          meetings: (section.meetings || []).map(meeting => ({
            ...meeting,
            instructors: meeting.instructors || [],
          })),
        })),
      })),
    }),
  };
};

type CourseReviews = Pick<AppBottomBarCourse, 'overallRating' | 'difficulty' | 'workload'>;

export const loadCourseReviews = async (
  subject: string,
  number: string
): Promise<CourseReviews> => {
  const response = await fetch('https://www.cureviews.org/api/courses/get-by-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: subject.toLowerCase(), number }),
  });
  if (!response.ok && response.status !== 404) throw new Error('Reviews are unavailable.');
  const reviews = response.ok ? (await response.json())?.result : null;
  return {
    overallRating: reviews?.classRating ?? 0,
    difficulty: reviews?.classDifficulty ?? 0,
    workload: reviews?.classWorkload ?? 0,
  };
};
