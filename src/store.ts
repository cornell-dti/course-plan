import { Store } from 'vuex';

import * as fb from './firebase-frontend-config';
import computeGroupedRequirementFulfillmentReports from './requirements/requirement-frontend-computation';
import RequirementFulfillmentGraph from './requirements/requirement-graph';
import { createAppOnboardingData } from './user-data-converter';
import {
  allocateAllSubjectColor,
  updateSubjectColor,
  checkNotNull,
  getCurrentSeason,
  getCurrentYear,
  sortedSemesters,
  isPlaceholderCourse,
} from './utilities';

type SimplifiedFirebaseUser = { readonly displayName: string; readonly email: string };

/**
 * Some course data that can be derived from semesters, but added to the global store for efficiency
 * and ease of access.
 */
type DerivedCoursesData = {
  readonly duplicatedCourseCodeSet: ReadonlySet<string>;
  // Mapping from course's unique ID to the full course object.
  readonly courseMap: Readonly<Record<number, FirestoreSemesterCourse>>;
  // Mapping from course's unique ID to the semester object.
  readonly courseToSemesterMap: Readonly<Record<number, FirestoreSemester>>;
};

/**
 * Some AP/IB equivalent course data that can be derived from onboarding data, but added to the global store
 * for efficiency and ease of access.
 * @deprecated old infra
 */
type DerivedAPIBEquivalentCourseData = {
  // Mapping from exam name to unique ids (there can be multiple)
  readonly examToUniqueIdsMap: Readonly<Record<string, Set<string | number>>>;
  // Mapping from unique id to exam name
  readonly uniqueIdToExamMap: Readonly<Record<string | number, string>>;
};

export type VuexStoreState = {
  currentFirebaseUser: SimplifiedFirebaseUser;
  userName: FirestoreUserName;
  onboardingData: AppOnboardingData;
  semesters: readonly FirestoreSemester[];
  orderByNewest: boolean;
  derivedCoursesData: DerivedCoursesData;
  derivedAPIBEquivalentCourseData: DerivedAPIBEquivalentCourseData;
  toggleableRequirementChoices: AppToggleableRequirementChoices;
  overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices;
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  dangerousRequirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  safeRequirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  requirementsThatDoNotAllowDoubleCounting: ReadonlyMap<string | number, Set<string[]>>;
  doubleCountedCourseUniqueIDSet: ReadonlySet<string | number>;
  groupedRequirementFulfillmentReport: readonly GroupedRequirementFulfillmentReport[];
  subjectColors: Readonly<Record<string, string>>;
  uniqueIncrementer: number;
  isTeleportModalOpen: boolean;
};

export class TypedVuexStore extends Store<VuexStoreState> {}

const store: TypedVuexStore = new TypedVuexStore({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // We allow the initial value to be null, so that the value can be read non-null elsewhere.
    // It is only null when the application has not authenticated the user yet, which is a scanario
    // only need to be considered in Login component.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentFirebaseUser: null!,
    userName: { firstName: '', middleName: '', lastName: '' },
    onboardingData: {
      gradYear: '',
      entranceYear: '',
      college: '',
      major: [],
      minor: [],
      grad: '',
      exam: [],
      tookSwim: 'no',
    },
    orderByNewest: true,
    semesters: [],
    derivedCoursesData: {
      duplicatedCourseCodeSet: new Set(),
      courseMap: {},
      courseToSemesterMap: {},
    },
    derivedAPIBEquivalentCourseData: {
      examToUniqueIdsMap: {},
      uniqueIdToExamMap: {},
    },
    toggleableRequirementChoices: {},
    overriddenFulfillmentChoices: {},
    userRequirementsMap: {},
    // It won't be null once the app loads.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dangerousRequirementFulfillmentGraph: null!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    safeRequirementFulfillmentGraph: null!,
    requirementsThatDoNotAllowDoubleCounting: new Map(),
    doubleCountedCourseUniqueIDSet: new Set(),
    groupedRequirementFulfillmentReport: [],
    subjectColors: {},
    uniqueIncrementer: 0,
    isTeleportModalOpen: false,
  },
  actions: {},
  mutations: {
    setCurrentFirebaseUser(state: VuexStoreState, user: SimplifiedFirebaseUser) {
      state.currentFirebaseUser = user;
    },
    setUserName(state: VuexStoreState, userName: FirestoreUserName) {
      state.userName = userName;
    },
    setOnboardingData(state: VuexStoreState, onboardingData: AppOnboardingData) {
      state.onboardingData = onboardingData;
    },
    setOrderByNewest(state: VuexStoreState, orderByNewest: boolean) {
      state.orderByNewest = orderByNewest;
    },
    setSemesters(state: VuexStoreState, semesters: readonly FirestoreSemester[]) {
      state.semesters = sortedSemesters(semesters, state.orderByNewest);
    },
    setDerivedCourseData(state: VuexStoreState, data: DerivedCoursesData) {
      state.derivedCoursesData = data;
    },
    setDerivedAPIBEquivalentCourseData(
      state: VuexStoreState,
      data: DerivedAPIBEquivalentCourseData
    ) {
      state.derivedAPIBEquivalentCourseData = data;
    },
    setToggleableRequirementChoices(
      state: VuexStoreState,
      toggleableRequirementChoices: AppToggleableRequirementChoices
    ) {
      state.toggleableRequirementChoices = toggleableRequirementChoices;
    },
    setOverriddenFulfillmentChoices(
      state: VuexStoreState,
      overriddenFulfillmentChoices: FirestoreOverriddenFulfillmentChoices
    ) {
      state.overriddenFulfillmentChoices = overriddenFulfillmentChoices;
    },
    setRequirementData(
      state: VuexStoreState,
      data: Pick<
        VuexStoreState,
        | 'userRequirementsMap'
        | 'dangerousRequirementFulfillmentGraph'
        | 'safeRequirementFulfillmentGraph'
        | 'requirementsThatDoNotAllowDoubleCounting'
        | 'doubleCountedCourseUniqueIDSet'
        | 'groupedRequirementFulfillmentReport'
      >
    ) {
      state.userRequirementsMap = data.userRequirementsMap;
      state.dangerousRequirementFulfillmentGraph = data.dangerousRequirementFulfillmentGraph;
      state.safeRequirementFulfillmentGraph = data.safeRequirementFulfillmentGraph;
      state.requirementsThatDoNotAllowDoubleCounting =
        data.requirementsThatDoNotAllowDoubleCounting;
      state.doubleCountedCourseUniqueIDSet = data.doubleCountedCourseUniqueIDSet;
      state.groupedRequirementFulfillmentReport = data.groupedRequirementFulfillmentReport;
    },
    setSubjectColors(state: VuexStoreState, colors: Readonly<Record<string, string>>) {
      state.subjectColors = colors;
    },
    setUniqueIncrementer(state: VuexStoreState, newIncrementerValue: number) {
      state.uniqueIncrementer = newIncrementerValue;
    },
    setIsTeleportModalOpen(state: VuexStoreState, newTeleportModalValue: boolean) {
      state.isTeleportModalOpen = newTeleportModalValue;
    },
  },
});

const autoRecomputeDerivedData = (): (() => void) =>
  store.subscribe((payload, state) => {
    if (payload.type === 'setOrderByNewest') {
      store.commit('setSemesters', sortedSemesters(state.semesters, state.orderByNewest));
    }
    // Recompute courses
    if (payload.type === 'setSemesters') {
      const allCourseSet = new Set<string>();
      const duplicatedCourseCodeSet = new Set<string>();
      const courseMap: Record<number, FirestoreSemesterCourse> = {};
      const courseToSemesterMap: Record<number, FirestoreSemester> = {};
      state.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          if (isPlaceholderCourse(course)) {
            return;
          }

          const { code } = course;
          if (allCourseSet.has(code)) {
            duplicatedCourseCodeSet.add(code);
          } else {
            allCourseSet.add(code);
          }
          courseMap[course.uniqueID] = course;
          courseToSemesterMap[course.uniqueID] = semester;
        });
      });
      const derivedCourseData: DerivedCoursesData = {
        duplicatedCourseCodeSet,
        courseMap,
        courseToSemesterMap,
      };
      store.commit('setDerivedCourseData', derivedCourseData);
    }
    /* TODO @bshen remove old infra
    if (payload.type === 'setOnboardingData') {
      const examToUniqueIdsMap: Record<string, Set<string | number>> = {};
      const uniqueIdToExamMap: Record<string | number, string> = {};
      const equivalentCourses = getCourseEquivalentsFromUserExams(state.onboardingData);
      state.onboardingData.exam.forEach(({ type, subject }) => {
        const examName = `${type} ${subject}`;
        examToUniqueIdsMap[examName] = new Set();
      });
      equivalentCourses.forEach(({ uniqueId, code }) => {
        uniqueIdToExamMap[uniqueId] = code;
        examToUniqueIdsMap[code].add(uniqueId);
      });
      const derivedAPIBEquivalentCourseData: DerivedAPIBEquivalentCourseData = {
        examToUniqueIdsMap,
        uniqueIdToExamMap,
      };
      store.commit('setDerivedAPIBEquivalentCourseData', derivedAPIBEquivalentCourseData);
      // Recompute overriddenFulfillmentChoices, which is dependent
      // on onboardingData and derivedAPIBEquivalentCourseData
      store.commit('setOverriddenFulfillmentChoices', state.overriddenFulfillmentChoices);
    }
    */
    // Recompute requirements
    if (
      payload.type === 'setOnboardingData' ||
      payload.type === 'setSemesters' ||
      payload.type === 'setToggleableRequirementChoices' ||
      payload.type === 'setOverriddenFulfillmentChoices'
    ) {
      if (state.onboardingData.college !== '') {
        store.commit(
          'setRequirementData',
          computeGroupedRequirementFulfillmentReports(
            state.semesters,
            state.onboardingData,
            state.toggleableRequirementChoices,
            state.overriddenFulfillmentChoices
          )
        );
      }
    }
  });

export const initializeFirestoreListeners = (onLoad: () => void): (() => void) => {
  const simplifiedUser = store.state.currentFirebaseUser;

  let userNameInitialLoadFinished = false;
  let onboardingDataInitialLoadFinished = false;
  let semestersInitialLoadFinished = false;
  let orderByNewestInitialLoadFinished = false;
  let toggleableRequirementChoiceInitialLoadFinished = false;
  let overriddenFulfillmentChoiceInitialLoadFinished = false;
  let subjectColorInitialLoadFinished = false;
  let uniqueIncrementerInitialLoadFinished = false;

  let emitted = false;

  const emitOnLoadWhenLoaded = (): void => {
    if (
      userNameInitialLoadFinished &&
      onboardingDataInitialLoadFinished &&
      semestersInitialLoadFinished &&
      orderByNewestInitialLoadFinished &&
      toggleableRequirementChoiceInitialLoadFinished &&
      overriddenFulfillmentChoiceInitialLoadFinished &&
      subjectColorInitialLoadFinished &&
      uniqueIncrementerInitialLoadFinished &&
      !emitted
    ) {
      emitted = true;
      onLoad();
    }
  };

  const userNameUnsubscriber = fb.usernameCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data) {
        store.commit('setUserName', data);
      } else {
        const [firstName, lastName] = simplifiedUser.displayName.split(' ');
        store.commit('setUserName', { firstName, middleName: '', lastName });
      }
      userNameInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const onboardingDataUnsubscriber = fb.onboardingDataCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data) {
        store.commit('setOnboardingData', createAppOnboardingData(data));
      }
      onboardingDataInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  fb.semestersCollection
    .doc(simplifiedUser.email)
    .get()
    .then(snapshot => {
      const data = snapshot.data();
      if (data) {
        const { orderByNewest, semesters } = data;
        store.commit('setSemesters', semesters);
        // if user hasn't yet chosen an ordering, choose true by default
        store.commit('setOrderByNewest', orderByNewest === undefined ? true : orderByNewest);
      } else {
        const newSemester: FirestoreSemester = {
          year: getCurrentYear(),
          season: getCurrentSeason(),
          courses: [],
        };
        store.commit('setSemesters', [newSemester]);
        fb.semestersCollection.doc(simplifiedUser.email).set({
          orderByNewest: true,
          semesters: [newSemester],
        });
      }
      semestersInitialLoadFinished = true;
      orderByNewestInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const toggleableRequirementChoiceUnsubscriber = fb.toggleableRequirementChoicesCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const toggleableRequirementChoices = snapshot.data() || {};
      store.commit('setToggleableRequirementChoices', toggleableRequirementChoices);
      toggleableRequirementChoiceInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const overriddenFulfillmentChoiceUnsubscriber = fb.overriddenFulfillmentChoicesCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const overriddenFulfillmentChoices = snapshot.data() || {};
      store.commit('setOverriddenFulfillmentChoices', overriddenFulfillmentChoices);
      overriddenFulfillmentChoiceInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  fb.subjectColorsCollection
    .doc(simplifiedUser.email)
    .get()
    .then(snapshot => {
      const subjectColors = snapshot.data() || {};
      // Pre-allocate all subject colors during this initialization step.
      const newSubjectColors = allocateAllSubjectColor(subjectColors);
      store.commit('setSubjectColors', newSubjectColors);
      fb.subjectColorsCollection.doc(simplifiedUser.email).set(newSubjectColors);
      subjectColorInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const uniqueIncrementerUnsubscriber = fb.uniqueIncrementerCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const data = snapshot.data();
      store.commit('setUniqueIncrementer', data == null ? 0 : data.uniqueIncrementer);
      uniqueIncrementerInitialLoadFinished = true;
      emitOnLoadWhenLoaded();
    });
  const derivedDataComputationUnsubscriber = autoRecomputeDerivedData();

  const unsubscriber = () => {
    userNameUnsubscriber();
    onboardingDataUnsubscriber();
    toggleableRequirementChoiceUnsubscriber();
    overriddenFulfillmentChoiceUnsubscriber();
    uniqueIncrementerUnsubscriber();
    derivedDataComputationUnsubscriber();
  };
  return unsubscriber;
};

export const updateSubjectColorData = (color: string, code: string): void => {
  const simplifiedUser = store.state.currentFirebaseUser;
  fb.subjectColorsCollection
    .doc(simplifiedUser.email)
    .get()
    .then(snapshot => {
      const subjectColors = snapshot.data() || {};
      const newSubjectColors = updateSubjectColor(subjectColors, color, code);
      store.commit('setSubjectColors', newSubjectColors);
      fb.subjectColorsCollection.doc(simplifiedUser.email).set(newSubjectColors);
    });
};

fb.auth.onAuthStateChanged(user => {
  if (user) {
    const simplifiedUser = {
      displayName: checkNotNull(user.displayName),
      email: checkNotNull(user.email),
    };
    store.commit('setCurrentFirebaseUser', simplifiedUser);
  }
});

export default store;
