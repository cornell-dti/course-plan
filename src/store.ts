import { Store } from 'vuex';

import * as fb from './firebase-frontend-config';
import getCourseEquivalentsFromUserExams from './requirements/data/exams/ExamCredit';
import computeGroupedRequirementFulfillmentReports from './requirements/requirement-frontend-computation';
import RequirementFulfillmentGraph from './requirements/requirement-graph';
import { createAppOnboardingData } from './user-data-converter';
import getCurrentSeason, {
  checkNotNull,
  getCurrentYear,
  allocateAllSubjectColor,
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
 * Some course data that can be derived from selectable requirement choices, but added to the global store
 * for efficiency and ease of access.
 * This should be used for self-check requirements and are not used in the requirement graph.
 */
type DerivedSelectableRequirementData = {
  // Mapping from requirement ID to the user-selected courses that fulfill the requirement.
  readonly requirementToCoursesMap: Readonly<Record<string, readonly FirestoreSemesterCourse[]>>;
};

/**
 * Some AP/IB equivalent course data that can be derived from onboarding data, but added to the global store
 * for efficiency and ease of access.
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
  derivedCoursesData: DerivedCoursesData;
  derivedSelectableRequirementData: DerivedSelectableRequirementData;
  derivedAPIBEquivalentCourseData: DerivedAPIBEquivalentCourseData;
  toggleableRequirementChoices: AppToggleableRequirementChoices;
  selectableRequirementChoices: AppSelectableRequirementChoices;
  overridenRequirementChoices: AppOverridenRequirementChoices;
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  groupedRequirementFulfillmentReport: readonly GroupedRequirementFulfillmentReport[];
  subjectColors: Readonly<Record<string, string>>;
  uniqueIncrementer: number;
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
      transferCourse: [],
      tookSwim: 'no',
    },
    semesters: [],
    derivedCoursesData: {
      duplicatedCourseCodeSet: new Set(),
      courseMap: {},
      courseToSemesterMap: {},
    },
    derivedSelectableRequirementData: {
      requirementToCoursesMap: {},
    },
    derivedAPIBEquivalentCourseData: {
      examToUniqueIdsMap: {},
      uniqueIdToExamMap: {},
    },
    toggleableRequirementChoices: {},
    selectableRequirementChoices: {},
    overridenRequirementChoices: {},
    userRequirementsMap: {},
    // It won't be null once the app loads.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    requirementFulfillmentGraph: null!,
    groupedRequirementFulfillmentReport: [],
    subjectColors: {},
    uniqueIncrementer: 0,
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
    setSemesters(state: VuexStoreState, semesters: readonly FirestoreSemester[]) {
      state.semesters = semesters;
    },
    setDerivedCourseData(state: VuexStoreState, data: DerivedCoursesData) {
      state.derivedCoursesData = data;
    },
    setDerivedSelectableRequirementData(
      state: VuexStoreState,
      data: DerivedSelectableRequirementData
    ) {
      state.derivedSelectableRequirementData = data;
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
    setSelectableRequirementChoices(
      state: VuexStoreState,
      selectableRequirementChoices: AppSelectableRequirementChoices
    ) {
      state.selectableRequirementChoices = selectableRequirementChoices;
    },
    setOverridenRequirementChoices(
      state: VuexStoreState,
      overridenRequirementChoices: AppOverridenRequirementChoices
    ) {
      state.overridenRequirementChoices = {
        ...overridenRequirementChoices,
        ...computeAPIBOverridenRequirements(state), // adds AP/IB data from onboarding collection
      };
    },
    setRequirementData(
      state: VuexStoreState,
      data: Pick<
        VuexStoreState,
        | 'userRequirementsMap'
        | 'requirementFulfillmentGraph'
        | 'groupedRequirementFulfillmentReport'
      >
    ) {
      state.userRequirementsMap = data.userRequirementsMap;
      state.requirementFulfillmentGraph = data.requirementFulfillmentGraph;
      state.groupedRequirementFulfillmentReport = data.groupedRequirementFulfillmentReport;
    },
    setSubjectColors(state: VuexStoreState, colors: Readonly<Record<string, string>>) {
      state.subjectColors = colors;
    },
    setUniqueIncrementer(state: VuexStoreState, newIncrementerValue: number) {
      state.uniqueIncrementer = newIncrementerValue;
    },
  },
});

const autoRecomputeDerivedData = (): (() => void) =>
  store.subscribe((payload, state) => {
    // Recompute courses
    if (payload.type === 'setSemesters') {
      const allCourseSet = new Set<string>();
      const duplicatedCourseCodeSet = new Set<string>();
      const courseMap: Record<number, FirestoreSemesterCourse> = {};
      const courseToSemesterMap: Record<number, FirestoreSemester> = {};
      state.semesters.forEach(semester => {
        semester.courses.forEach(course => {
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
    if (payload.type === 'setSelectableRequirementChoices') {
      const requirementToCoursesMap: Record<string, FirestoreSemesterCourse[]> = {};
      Object.entries(state.selectableRequirementChoices)
        .sort((a, b) => parseInt(a[1], 10) - parseInt(b[1], 10))
        .forEach(([courseUniqueId, reqId]) => {
          const course: FirestoreSemesterCourse =
            state.derivedCoursesData.courseMap[parseInt(courseUniqueId, 10)];
          if (course)
            requirementToCoursesMap[reqId] = [...(requirementToCoursesMap[reqId] || []), course];
        });
      const derivedSelectableRequirementData: DerivedSelectableRequirementData = {
        requirementToCoursesMap,
      };
      store.commit('setDerivedSelectableRequirementData', derivedSelectableRequirementData);
    }
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
      // Recompute overridenRequirementChoices, which is dependent
      // on onboardingData and derivedAPIBEquivalentCourseData
      store.commit('setOverridenRequirementChoices', state.overridenRequirementChoices);
    }
    // Recompute requirements
    if (
      payload.type === 'setOnboardingData' ||
      payload.type === 'setSemesters' ||
      payload.type === 'setToggleableRequirementChoices' ||
      payload.type === 'setSelectableRequirementChoices' ||
      payload.type === 'setOverridenRequirementChoices'
    ) {
      if (state.onboardingData.college !== '') {
        store.commit(
          'setRequirementData',
          computeGroupedRequirementFulfillmentReports(
            state.semesters,
            state.onboardingData,
            state.toggleableRequirementChoices,
            state.selectableRequirementChoices,
            state.overridenRequirementChoices
          )
        );
      }
    }
  });

/**
 * Computes AP/IB Overriden Requirement Choices from
 * onboarding data and derived AP/IB equivalent course data.
 */
const computeAPIBOverridenRequirements = (
  state: VuexStoreState
): AppOverridenRequirementChoices => {
  const APIBOverridenRequirements: Record<
    string,
    {
      readonly optIn: Record<string, Set<string>>;
      readonly optOut: Record<string, Set<string>>;
    }
  > = {};
  state.onboardingData.exam.forEach(exam => {
    const { type, subject } = exam;
    const examName = `${type} ${subject}`;
    const uniqueIds = state.derivedAPIBEquivalentCourseData.examToUniqueIdsMap[examName];
    if (!(uniqueIds && uniqueIds.size)) return;
    const { optIn, optOut } = exam;
    const optInChoices: Record<string, Set<string>> = optIn
      ? Object.fromEntries(
          Object.entries(optIn).map(([requirementName, slotNames]) => [
            requirementName,
            new Set(slotNames),
          ])
        )
      : {};
    const optOutChoices: Record<string, Set<string>> = optOut
      ? Object.fromEntries(
          Object.entries(optOut).map(([requirementName, slotNames]) => [
            requirementName,
            new Set(slotNames),
          ])
        )
      : {};
    uniqueIds.forEach(uniqueId => {
      APIBOverridenRequirements[uniqueId] = {
        optIn: optInChoices,
        optOut: optOutChoices,
      };
    });
  });
  return APIBOverridenRequirements;
};

export const initializeFirestoreListeners = (onLoad: () => void): (() => void) => {
  const simplifiedUser = store.state.currentFirebaseUser;

  let userNameInitialLoadFinished = false;
  let onboardingDataInitialLoadFinished = false;
  let semestersInitialLoadFinished = false;
  let toggleableRequirementChoiceInitialLoadFinished = false;
  let selectableRequirementChoiceInitialLoadFinished = false;
  let subjectColorInitialLoadFinished = false;
  let uniqueIncrementerInitialLoadFinished = false;

  let emitted = false;

  const emitOnLoadWhenLoaded = (): void => {
    if (
      userNameInitialLoadFinished &&
      onboardingDataInitialLoadFinished &&
      semestersInitialLoadFinished &&
      toggleableRequirementChoiceInitialLoadFinished &&
      selectableRequirementChoiceInitialLoadFinished &&
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
      if (data != null) {
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
      if (data != null) {
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
      if (data != null) {
        store.commit('setSemesters', data.semesters);
      } else {
        const newSemeter: FirestoreSemester = {
          type: getCurrentSeason(),
          year: getCurrentYear(),
          courses: [],
        };
        store.commit('setSemesters', [newSemeter]);
        fb.semestersCollection.doc(simplifiedUser.email).set({ semesters: [newSemeter] });
      }
      semestersInitialLoadFinished = true;
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
  const selectableRequirementChoiceUnsubscriber = fb.selectableRequirementChoicesCollection
    .doc(simplifiedUser.email)
    .onSnapshot(snapshot => {
      const selectableRequirementChoices = snapshot.data() || {};
      store.commit('setSelectableRequirementChoices', selectableRequirementChoices);
      selectableRequirementChoiceInitialLoadFinished = true;
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
    selectableRequirementChoiceUnsubscriber();
    uniqueIncrementerUnsubscriber();
    derivedDataComputationUnsubscriber();
  };
  return unsubscriber;
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
