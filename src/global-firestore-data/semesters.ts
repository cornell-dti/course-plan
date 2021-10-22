import { semestersCollection } from '../firebase-frontend-config';
import store from '../store';
import { GTag, GTagEvent } from '../gtag';
import { SeasonsEnum } from './utils';
import {
  addCourseToSelectableRequirements,
  deleteCourseFromSelectableRequirements,
  deleteCoursesFromSelectableRequirements,
} from './selectable-requirement-choices';

// compare function for FirestoreSemester to determine which comes first by year and season
export const compareFirestoreSemesters = (a: FirestoreSemester, b: FirestoreSemester): number => {
  if (a.season === b.season && a.year === b.year) {
    return 0;
  }
  if (a.year > b.year) {
    return -1;
  }
  if (a.year < b.year) {
    return 1;
  }
  if (SeasonsEnum[a.season] < SeasonsEnum[b.season]) {
    return 1;
  }
  return -1;
};

const editSemesters = (
  updater: (oldSemesters: readonly FirestoreSemester[]) => readonly FirestoreSemester[]
): void => {
  const newSemesters = updater(store.state.semesters);
  store.commit('setSemesters', newSemesters);
  semestersCollection.doc(store.state.currentFirebaseUser.email).set({ semesters: newSemesters });
};

export const editSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  updater: (oldSemester: FirestoreSemester) => FirestoreSemester
): void => {
  editSemesters(oldSemesters =>
    oldSemesters
      .map(sem => (semesterEquals(sem, year, season) ? updater(sem) : sem))
      .sort(compareFirestoreSemesters)
  );
};

const createSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  courses: readonly FirestoreSemesterCourse[]
): {
  year: number;
  type: FirestoreSemesterSeason;
  season: FirestoreSemesterSeason;
  courses: readonly FirestoreSemesterCourse[];
} => ({
  courses,
  type: season, // TODO @bshen remove & write migration script when every dev pulls from master
  season,
  year,
});

const semesterEquals = (
  semester: FirestoreSemester,
  year: number,
  season: FirestoreSemesterSeason
): boolean =>
  // TODO @bshen remove semester.type & write migration script when every dev pulls from master
  semester.year === year && (semester.season === season || semester.type === season);

export const addSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: GTag,
  courses: readonly FirestoreSemesterCourse[] = []
): void => {
  GTagEvent(gtag, 'add-semester');
  editSemesters(oldSemesters =>
    [...oldSemesters, createSemester(year, season, courses)].sort(compareFirestoreSemesters)
  );
};

export const deleteSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-semester');
  const semester = store.state.semesters.find(sem => semesterEquals(sem, year, season));
  if (semester) {
    deleteCoursesFromSelectableRequirements(semester.courses.map(course => course.uniqueID));
    editSemesters(oldSemesters => oldSemesters.filter(sem => !semesterEquals(sem, year, season)));
  }
};

export const addCourseToSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  newCourse: FirestoreSemesterCourse,
  requirementID?: string,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'add-course');
  editSemesters(oldSemesters => {
    let semesterFound = false;
    const newSemestersWithCourse = oldSemesters.map(sem => {
      if (semesterEquals(sem, year, season)) {
        semesterFound = true;
        return { ...sem, courses: [...sem.courses, newCourse] };
      }
      return sem;
    });
    if (semesterFound) return newSemestersWithCourse;
    return [...oldSemesters, createSemester(year, season, [newCourse])].sort(
      compareFirestoreSemesters
    );
  });
  if (requirementID) {
    addCourseToSelectableRequirements(newCourse.uniqueID, requirementID);
  }
};

export const deleteCourseFromSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  courseUniqueID: number,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-course');
  const semester = store.state.semesters.find(sem => semesterEquals(sem, year, season));
  if (semester) {
    deleteCourseFromSelectableRequirements(courseUniqueID);
    editSemesters(oldSemesters =>
      oldSemesters.map(sem => ({
        ...sem,
        courses: semesterEquals(sem, year, season)
          ? sem.courses.filter(course => course.uniqueID !== courseUniqueID)
          : sem.courses,
      }))
    );
  }
};

export const deleteAllCoursesFromSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-semester-courses');
  const semester = store.state.semesters.find(sem => semesterEquals(sem, year, season));
  if (semester) {
    deleteCoursesFromSelectableRequirements(semester.courses.map(course => course.uniqueID));
    editSemesters(oldSemesters =>
      oldSemesters.map(sem => ({
        ...sem,
        courses: semesterEquals(sem, year, season) ? [] : sem.courses,
      }))
    );
  }
};

export const deleteCourseFromSemesters = (courseUniqueID: number, gtag?: GTag): void => {
  GTagEvent(gtag, 'delete-course');
  editSemesters(oldSemesters =>
    oldSemesters.map(semester => {
      const coursesWithoutDeleted = semester.courses.filter(
        course => course.uniqueID !== courseUniqueID
      );
      return { ...semester, courses: coursesWithoutDeleted };
    })
  );
  deleteCourseFromSelectableRequirements(courseUniqueID);
};

export const getActiveSemesters = (
  entranceSem: FirestoreSemesterType,
  entranceYear: number,
  gradSem: FirestoreSemesterType,
  gradYear: number
): FirestoreSemester[] => {
  const sems = [createSemester('Fall', entranceYear, []), createSemester('Spring', gradYear, [])];
  if (entranceSem === 'Spring' && entranceYear !== gradYear)
    sems.push(createSemester('Spring', entranceYear, []));
  if (gradSem === 'Fall' && entranceYear !== gradYear)
    sems.push(createSemester('Fall', gradYear, []));

  for (let yr = entranceYear + 1; yr < gradYear; yr += 1) {
    sems.push(createSemester('Spring', yr, []));
    sems.push(createSemester('Fall', yr, []));
  }
  return sems.sort(compareFirestoreSemesters);
};

// function to add all the semesters a user will be enrolled in based on entrance and graduation time
export const populateSemesters = (onboarding: AppOnboardingData): void => {
  const entranceYear = parseInt(onboarding.entranceYear, 10);
  const gradYear = parseInt(onboarding.gradYear, 10);

  const entranceSem: FirestoreSemesterType = onboarding.entranceSem
    ? onboarding.entranceSem
    : 'Fall';
  const gradSem: FirestoreSemesterType = onboarding.gradSem ? onboarding.gradSem : 'Spring';

  editSemesters(() => getActiveSemesters(entranceSem, entranceYear, gradSem, gradYear));
};
