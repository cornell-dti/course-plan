import { Store } from 'vuex';

import * as fb from './firebaseConfig';
import computeGroupedRequirementFulfillmentReports from './requirements/requirement-frontend-computation';
import RequirementFulfillmentGraph from './requirements/requirement-graph';
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

export type VuexStoreState = {
  currentFirebaseUser: SimplifiedFirebaseUser;
  userName: FirestoreUserName;
  onboardingData: AppOnboardingData;
  semesters: readonly FirestoreSemester[];
  derivedCoursesData: DerivedCoursesData;
  derivedSelectableRequirementData: DerivedSelectableRequirementData;
  toggleableRequirementChoices: AppToggleableRequirementChoices;
  selectableRequirementChoices: AppSelectableRequirementChoices;
  userRequirementsMap: Readonly<Record<string, RequirementWithIDSourceType>>;
  requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
  groupedRequirementFulfillmentReport: readonly GroupedRequirementFulfillmentReport[];
  subjectColors: Readonly<Record<string, string>>;
  uniqueIncrementer: number;
};

export class TypedVuexStore extends Store<VuexStoreState> { }

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
      grad: [],
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
    toggleableRequirementChoices: {},
    selectableRequirementChoices: {},
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
    // Recompute requirements
    if (
      payload.type === 'setOnboardingData' ||
      payload.type === 'setSemesters' ||
      payload.type === 'setToggleableRequirementChoices' ||
      payload.type === 'setSelectableRequirementChoices'
    ) {
      if (state.onboardingData.college !== '') {
        store.commit(
          'setRequirementData',
          computeGroupedRequirementFulfillmentReports(
            state.semesters,
            state.onboardingData,
            state.toggleableRequirementChoices,
            state.selectableRequirementChoices
          )
        );
      }
    }
  });

const createAppOnboardingData = (data: FirestoreOnboardingUserData): AppOnboardingData => ({
  // TODO: take into account multiple colleges
  gradYear: data.gradYear ? data.gradYear : '',
  entranceYear: data.entranceYear ? data.entranceYear : '',
  college: data.colleges[0].acronym,
  major: data.majors.map(({ acronym }) => acronym),
  minor: data.minors.map(({ acronym }) => acronym),
  grad: data.grad.map(({ acronym }) => acronym),
  exam: 'exam' in data ? [...data.exam] : [],
  transferCourse: 'class' in data ? [...data.class] : [],
  tookSwim: 'tookSwim' in data ? data.tookSwim : 'no',
});

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
