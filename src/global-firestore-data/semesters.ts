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
      .map(sem => (sem.year === year && sem.season === season ? updater(sem) : sem))
      .sort(compareFirestoreSemesters)
  );
};

const createSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  courses: readonly FirestoreSemesterCourse[]
): {
  season: FirestoreSemesterSeason;
  year: number;
  courses: readonly FirestoreSemesterCourse[];
} => ({
  courses,
  season,
  year,
});

export const addSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  gtag?: GTag,
  courses: readonly FirestoreSemesterCourse[] = []
): void => {
  GTagEvent(gtag, 'add-semester');
  editSemesters(oldSemesters =>
    [...oldSemesters, createSemester(season, year, courses)].sort(compareFirestoreSemesters)
  );
};

export const deleteSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-semester');
  const semester = store.state.semesters.find(sem => sem.season === season && sem.year === year);
  if (semester) {
    deleteCoursesFromSelectableRequirements(semester.courses.map(course => course.uniqueID));
  }
  editSemesters(oldSemesters =>
    oldSemesters.filter(sem => sem.season !== season || sem.year !== year)
  );
};

export const addCourseToSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  newCourse: FirestoreSemesterCourse,
  requirementID?: string,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'add-course');
  editSemesters(oldSemesters => {
    let semesterFound = false;
    const newSemestersWithCourse = oldSemesters.map(sem => {
      if (sem.season === season && sem.year === year) {
        semesterFound = true;
        return { ...sem, courses: [...sem.courses, newCourse] };
      }
      return sem;
    });
    if (semesterFound) return newSemestersWithCourse;
    return [...oldSemesters, createSemester(season, year, [newCourse])].sort(
      compareFirestoreSemesters
    );
  });
  if (requirementID) {
    addCourseToSelectableRequirements(newCourse.uniqueID, requirementID);
  }
};

export const deleteCourseFromSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  courseUniqueID: number,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-course');
  editSemesters(oldSemesters => {
    let semesterFound = false;
    const newSemestersWithoutCourse = oldSemesters.map(sem => {
      if (sem.season === season && sem.year === year) {
        semesterFound = true;
        return {
          ...sem,
          courses: sem.courses.filter(course => course.uniqueID !== courseUniqueID),
        };
      }
      return sem;
    });
    if (semesterFound) return newSemestersWithoutCourse;
    return oldSemesters;
  });
  deleteCourseFromSelectableRequirements(courseUniqueID);
};

export const deleteAllCoursesFromSemester = (
  season: FirestoreSemesterSeason,
  year: number,
  gtag?: GTag
): void => {
  GTagEvent(gtag, 'delete-semester-courses');
  const semester = store.state.semesters.find(sem => sem.season === season && sem.year === year);
  if (semester) {
    deleteCoursesFromSelectableRequirements(semester.courses.map(course => course.uniqueID));
  }
  editSemesters(oldSemesters => {
    let semesterFound = false;
    const newSemestersWithEmptiedSemester = oldSemesters.map(sem => {
      if (sem.season === season && sem.year === year) {
        semesterFound = true;
        return {
          ...sem,
          courses: [],
        };
      }
      return sem;
    });
    if (semesterFound) return newSemestersWithEmptiedSemester;
    return oldSemesters;
  });
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
