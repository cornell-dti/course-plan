import { semestersCollection } from '../firebase-frontend-config';
import store from '../store';
import { GTag, GTagEvent } from '../gtag';
import { sortedSemesters } from '../utilities';

import {
  addCourseToSelectableRequirements,
  deleteCourseFromSelectableRequirements,
  deleteCoursesFromSelectableRequirements,
} from './selectable-requirement-choices';

export const editSemesters = (
  updater: (oldSemesters: readonly FirestoreSemester[]) => readonly FirestoreSemester[]
): void => {
  const newSemesters = updater(store.state.semesters);
  store.commit('setSemesters', newSemesters);
  semestersCollection.doc(store.state.currentFirebaseUser.email).update({
    semesters: newSemesters,
  });
};

/**
 * Sets whether semesters are ordered by newest/oldest
 */
export const setOrderByNewest = (orderByNewest: boolean): void => {
  if (orderByNewest === store.state.orderByNewest) return;
  store.commit('setOrderByNewest', orderByNewest);
  semestersCollection.doc(store.state.currentFirebaseUser.email).update({
    orderByNewest,
  });
};

export const editSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  updater: (oldSemester: FirestoreSemester) => FirestoreSemester
): void => {
  editSemesters(oldSemesters =>
    oldSemesters.map(sem => (semesterEquals(sem, year, season) ? updater(sem) : sem))
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

// exposed for testing
export const semesterEquals = (
  semester: FirestoreSemester,
  year: number,
  season: FirestoreSemesterSeason
): boolean => semester.year === year && semester.season === season;

export const addSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: GTag,
  courses: readonly FirestoreSemesterCourse[] = []
): void => {
  GTagEvent(gtag, 'add-semester');
  editSemesters(oldSemesters => [...oldSemesters, createSemester(year, season, courses)]);
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
    return [...oldSemesters, createSemester(year, season, [newCourse])];
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

// exposed for testing
export const getActiveSemesters = (
  entranceYear: number,
  entranceSem: FirestoreSemesterSeason,
  gradYear: number,
  gradSem: FirestoreSemesterSeason
): readonly FirestoreSemester[] => {
  const sems = [createSemester(entranceYear, 'Fall', []), createSemester(gradYear, 'Spring', [])];
  if (entranceYear !== gradYear && entranceSem === 'Spring')
    sems.push(createSemester(entranceYear, 'Spring', []));
  if (entranceYear !== gradYear && gradSem === 'Fall')
    sems.push(createSemester(gradYear, 'Fall', []));

  for (let yr = entranceYear + 1; yr < gradYear; yr += 1) {
    sems.push(createSemester(yr, 'Spring', []));
    sems.push(createSemester(yr, 'Fall', []));
  }
  return sortedSemesters(sems);
};

// add empty semesters based on entrance and graduation time
export const populateSemesters = (onboarding: AppOnboardingData): void => {
  const entranceYear = parseInt(onboarding.entranceYear, 10);
  const gradYear = parseInt(onboarding.gradYear, 10);

  const entranceSem: FirestoreSemesterSeason = onboarding.entranceSem
    ? onboarding.entranceSem
    : 'Fall';
  const gradSem: FirestoreSemesterSeason = onboarding.gradSem ? onboarding.gradSem : 'Spring';

  editSemesters(() => getActiveSemesters(entranceYear, entranceSem, gradYear, gradSem));
};
