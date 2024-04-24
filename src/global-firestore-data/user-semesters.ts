import { doc, updateDoc } from 'firebase/firestore';

import { VueGtag } from 'vue-gtag-next';
import { semestersCollection } from '../firebase-config';
import store from '../store';
import { GTagEvent } from '../gtag';
import { sortedSemesters } from '../utilities';

import {
  updateRequirementChoice,
  deleteCourseFromRequirementChoices,
  deleteCoursesFromRequirementChoices,
} from './user-overridden-fulfillment-choices';

export const editCollections = async (
  updater: (oldCollections: readonly Collection[]) => readonly Collection[]
): Promise<void> => {
  // TODO: finish implementing function
  console.log('edit Collections');
  const collections = updater(store.state.collections);
  store.commit('setCollections', collections);
  await updateDoc(doc(semestersCollection, store.state.currentFirebaseUser.email), {
    collections,
  });
  store.commit('setOrderByNewest', store.state.orderByNewest);
};

export const editSemesters = (
  plan: Plan,
  updater: (oldSemesters: readonly FirestoreSemester[]) => readonly FirestoreSemester[]
): void => {
  const editedPlan = (p: Plan): Plan => ({ name: p.name, semesters: updater(p.semesters) });
  editPlan(plan.name, editedPlan);
};

export const editPlans = async (
  updater: (oldPlans: readonly Plan[]) => readonly Plan[]
): Promise<void> => {
  const plans = updater(store.state.plans);
  store.commit('setPlans', plans);
  await updateDoc(doc(semestersCollection, store.state.currentFirebaseUser.email), {
    plans,
  });
  store.commit('setOrderByNewest', store.state.orderByNewest);
};
/**
 * Sets whether semesters are ordered by newest/oldest
 */
export const setOrderByNewest = (orderByNewest: boolean): void => {
  if (orderByNewest === store.state.orderByNewest) return;
  store.commit('setOrderByNewest', orderByNewest);
  updateDoc(doc(semestersCollection, store.state.currentFirebaseUser.email), {
    orderByNewest,
  });
};

export const editSemester = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  updater: (oldSemester: FirestoreSemester) => FirestoreSemester
): void => {
  editSemesters(plan, oldSemesters =>
    oldSemesters.map(sem => (semesterEquals(sem, year, season) ? updater(sem) : sem))
  );
};

// TODO: check if need editCollection

export const editPlan = (name: string, updater: (oldPlan: Plan) => Plan): void => {
  editPlans(oldPlan => oldPlan.map(plan => (plan.name === name ? updater(plan) : plan)));
};

const createCollection = (
  name: string,
  semesters: readonly FirestoreSemester[]
): {
  name: string;
  semesters: readonly FirestoreSemester[];
} => ({
  name,
  semesters,
});

const createSemester = (
  year: number,
  season: FirestoreSemesterSeason,
  courses: readonly FirestoreSemesterCourse[]
): {
  year: number;
  season: FirestoreSemesterSeason;
  courses: readonly FirestoreSemesterCourse[];
} => ({
  courses,
  season,
  year,
});

const createPlan = (
  name: string,
  semesters: FirestoreSemester[]
): {
  name: string;
  semesters: FirestoreSemester[];
} => ({
  name,
  semesters,
});

// exposed for testing
export const semesterEquals = (
  semester: FirestoreSemester,
  year: number,
  season: FirestoreSemesterSeason
): boolean => semester.year === year && semester.season === season;

export const addCollection = async (
  name: string,
  semesters: readonly FirestoreSemester[],
  gtag?: VueGtag
): Promise<void> => {
  GTagEvent(gtag, 'add-collection');
  // TODO: finish implementing function
  console.log('add Collection');
  await editCollections(oldCollections => [...oldCollections, createCollection(name, semesters)]);
  store.commit(
    'setCurrentCollection',
    store.state.collections.find(collection => collection.name === name)
  );
};

export const addSemester = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: VueGtag,
  courses: readonly FirestoreSemesterCourse[] = []
): void => {
  GTagEvent(gtag, 'add-semester');
  editSemesters(plan, oldSemesters => [...oldSemesters, createSemester(year, season, courses)]);
};

export const addPlan = async (
  name: string,
  semesters: FirestoreSemester[],
  gtag?: VueGtag
): Promise<void> => {
  GTagEvent(gtag, 'add-plan');
  await editPlans(oldPlans => [...oldPlans, createPlan(name, semesters)]);
  store.commit(
    'setCurrentPlan',
    store.state.plans.find(plan => plan.name === name)
  );
};

export const deleteCollection = async (name: string, gtag?: VueGtag): Promise<void> => {
  GTagEvent(gtag, 'delete-collection');
  // implement function
  console.log('delete Collection');
  if (store.state.collections.some(p => p.name === name)) {
    await editCollections(oldCollections => oldCollections.filter(p => p.name !== name));
  }
  store.commit('setCurrentCollection', store.state.collections[0]);
};

export const deleteSemester = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'delete-semester');
  const semester: FirestoreSemester = store.getters.getCurrentPlanSemesters.find(
    (sem: FirestoreSemester) => semesterEquals(sem, year, season)
  );
  if (semester) {
    deleteCoursesFromRequirementChoices(semester.courses.map(course => course.uniqueID));
    editSemesters(plan, oldSemesters =>
      oldSemesters.filter(sem => !semesterEquals(sem, year, season))
    );
  }
};

export const deletePlan = async (name: string, gtag?: VueGtag): Promise<void> => {
  GTagEvent(gtag, 'delete-plan');
  if (store.state.plans.some(p => p.name === name)) {
    await editPlans(oldPlans => oldPlans.filter(p => p.name !== name));
  }
  store.commit('setCurrentPlan', store.state.plans[0]);
};

// collection specific functions

// TODO: can add one course to multiple collections
export const addCourseToCollections = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  newCourse: FirestoreSemesterCourse,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'add-course-collections');
  // TODO: implement function
  console.log('add Course to Collections');
};

export const deleteCourseFromCollection = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  name: string,
  courseUniqueID: number,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'delete-course-collection');
  // TODO: implement function
  console.log('delete Course from Collection');
};

export const addCourseToSemester = (
  // TODO: need to add collection aswell?
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  newCourse: FirestoreSemesterCourse,
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'add-course');
  editSemesters(plan, oldSemesters => {
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
  updateRequirementChoice(newCourse.uniqueID, choiceUpdater);
};

export const deleteCourseFromSemester = (
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  courseUniqueID: number,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'delete-course');
  const semester: FirestoreSemester = store.getters.getCurrentPlanSemesters.find(
    (sem: FirestoreSemester) => semesterEquals(sem, year, season)
  );
  if (semester) {
    deleteCourseFromRequirementChoices(courseUniqueID);
    editSemesters(plan, oldSemesters =>
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
  plan: Plan,
  year: number,
  season: FirestoreSemesterSeason,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'delete-semester-courses');
  const semester: FirestoreSemester = store.getters.getCurrentPlanSemesters.find(
    (sem: FirestoreSemester) => semesterEquals(sem, year, season)
  );
  if (semester) {
    deleteCoursesFromRequirementChoices(semester.courses.map(course => course.uniqueID));
    editSemesters(plan, oldSemesters =>
      oldSemesters.map(sem => ({
        ...sem,
        courses: semesterEquals(sem, year, season) ? [] : sem.courses,
      }))
    );
  }
};

export const deleteCourseFromSemesters = (
  plan: Plan,
  courseUniqueID: number,
  gtag?: VueGtag
): void => {
  GTagEvent(gtag, 'delete-course');
  editSemesters(plan, oldSemesters =>
    oldSemesters.map(semester => {
      const coursesWithoutDeleted = semester.courses.filter(
        course => course.uniqueID !== courseUniqueID
      );
      return { ...semester, courses: coursesWithoutDeleted };
    })
  );
  deleteCourseFromRequirementChoices(courseUniqueID);
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
export const populateSemesters = (plan: Plan, onboarding: AppOnboardingData): void => {
  const entranceYear = parseInt(onboarding.entranceYear, 10);
  const gradYear = parseInt(onboarding.gradYear, 10);

  const entranceSem: FirestoreSemesterSeason = onboarding.entranceSem
    ? onboarding.entranceSem
    : 'Fall';
  const gradSem: FirestoreSemesterSeason = onboarding.gradSem ? onboarding.gradSem : 'Spring';

  editSemesters(plan, () => getActiveSemesters(entranceYear, entranceSem, gradYear, gradSem));
};
