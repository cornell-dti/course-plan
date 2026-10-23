import { doc, setDoc } from 'firebase/firestore';

import { overriddenFulfillmentChoicesCollection } from '../firebase-config';
import store from '../store';
import computeGroupedRequirementFulfillmentReports from '../requirements/requirement-frontend-computation';
import {
  getRelatedRequirementIdsForCourseOptOut,
  getRelatedUnfulfilledRequirements,
} from '../requirements/requirement-frontend-utils';

export const updateRequirementChoice = (
  courseUniqueID: string | number,
  choiceUpdater: (choice: FirestoreCourseOptInOptOutChoices) => FirestoreCourseOptInOptOutChoices
): void => {
  setDoc(doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email), {
    ...store.state.overriddenFulfillmentChoices,
    [courseUniqueID]: choiceUpdater(
      store.state.overriddenFulfillmentChoices[courseUniqueID] || {
        arbitraryOptIn: {},
        acknowledgedCheckerWarningOptIn: [],
        optOut: [],
      }
    ),
  });
};

export const toggleRequirementChoice = (
  courseUniqueID: string | number,
  requirementID: string,
  relevantRequirementChoiceType: keyof FirestoreCourseOptInOptOutChoices
): void =>
  updateRequirementChoice(courseUniqueID, choice => {
    switch (relevantRequirementChoiceType) {
      case 'optOut':
      case 'acknowledgedCheckerWarningOptIn': {
        const oldList = choice[relevantRequirementChoiceType];
        return {
          ...choice,
          [relevantRequirementChoiceType]: oldList.includes(requirementID)
            ? oldList.filter(it => it !== requirementID)
            : [...oldList, requirementID],
        };
      }
      default:
        return choice;
    }
  });

export const updateRequirementChoices = (
  updater: (
    oldChoices: FirestoreOverriddenFulfillmentChoices
  ) => FirestoreOverriddenFulfillmentChoices
): void => {
  setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    updater(store.state.overriddenFulfillmentChoices)
  );
};

export const deleteCourseFromRequirementChoices = (courseUniqueID: string | number): void =>
  deleteCoursesFromRequirementChoices([courseUniqueID]);

export const deleteCoursesFromRequirementChoices = (
  courseUniqueIds: readonly (string | number)[]
): void => {
  const courseUniqueIdStrings = new Set(courseUniqueIds.map(uniqueId => uniqueId.toString()));
  setDoc(
    doc(overriddenFulfillmentChoicesCollection, store.state.currentFirebaseUser.email),
    Object.fromEntries(
      Object.entries(store.state.overriddenFulfillmentChoices).filter(
        ([uniqueId]) => !courseUniqueIdStrings.has(uniqueId)
      )
    )
  );
};

export const getDefaultRequirementChoices = (
  entries: readonly {
    readonly year: number;
    readonly season: FirestoreSemesterSeason;
    readonly course: FirestoreSemesterCourse;
    readonly data: CornellCourseRosterCourse;
  }[],
  removedUniqueIDs: readonly number[] = []
): Record<string, FirestoreCourseOptInOptOutChoices> => {
  const { onboardingData, toggleableRequirementChoices, plans, currentPlan } = store.state;
  const choices: Record<string, FirestoreCourseOptInOptOutChoices> = {};
  let semesters = (
    plans.find(p => p.name === currentPlan.name)?.semesters ?? currentPlan.semesters
  ).map(s => ({ ...s, courses: s.courses.filter(c => !removedUniqueIDs.includes(c.uniqueID)) }));
  entries.forEach(({ year, season, course, data }) => {
    const overridden = { ...store.state.overriddenFulfillmentChoices, ...choices };
    const {
      groupedRequirementFulfillmentReport: report,
      userRequirementsMap,
    } = computeGroupedRequirementFulfillmentReports(
      semesters,
      onboardingData,
      toggleableRequirementChoices,
      overridden
    );
    const {
      relatedRequirements,
      selfCheckRequirements,
      automaticallyFulfilledRequirements,
    } = getRelatedUnfulfilledRequirements(
      data,
      report,
      onboardingData,
      toggleableRequirementChoices,
      overridden,
      userRequirementsMap
    );
    const autoIds = new Set(automaticallyFulfilledRequirements.map(({ id }) => id));
    const selected = relatedRequirements.find(req => !autoIds.has(req.id))?.id ?? '';
    choices[course.uniqueID] = {
      optOut: getRelatedRequirementIdsForCourseOptOut(
        data.crseId,
        selected,
        report,
        toggleableRequirementChoices,
        userRequirementsMap
      ),
      acknowledgedCheckerWarningOptIn: selfCheckRequirements
        .filter(req => req.id === selected && !autoIds.has(req.id))
        .map(req => req.id),
      arbitraryOptIn: {},
    };
    const isSemester = (s: FirestoreSemester) => s.year === year && s.season === season;
    semesters = semesters.some(isSemester)
      ? semesters.map(s => (isSemester(s) ? { ...s, courses: [...s.courses, course] } : s))
      : [...semesters, { year, season, courses: [course] }];
  });
  return choices;
};
