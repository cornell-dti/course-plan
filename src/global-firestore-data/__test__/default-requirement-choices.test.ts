import { getDefaultRequirementChoices } from '../user-overridden-fulfillment-choices';
import store from '../../store';

jest.mock('../../firebase-config', () => ({}));
jest.mock('../../store', () => ({
  __esModule: true,
  default: {
    state: {
      onboardingData: {},
      toggleableRequirementChoices: {},
      overriddenFulfillmentChoices: {},
      plans: [],
      currentPlan: { name: 'Plan 1', semesters: [{ year: 2026, season: 'Fall', courses: [] }] },
    },
  },
}));
jest.mock('../../requirements/requirement-frontend-computation', () => ({
  __esModule: true,
  default: (
    semesters: readonly FirestoreSemester[],
    _: unknown,
    __: unknown,
    choices: FirestoreOverriddenFulfillmentChoices
  ) => {
    const ids = semesters.flatMap(s => s.courses.map(c => c.uniqueID));
    const xTaken = ids.some(id => choices[id] && !choices[id].optOut.includes('X'));
    return { groupedRequirementFulfillmentReport: xTaken ? ['Y'] : ['X', 'Y'] };
  },
}));
jest.mock('../../requirements/requirement-frontend-utils', () => ({
  getRelatedUnfulfilledRequirements: (_: unknown, report: string[]) => ({
    relatedRequirements: report.map(id => ({ id })),
    selfCheckRequirements: [],
    automaticallyFulfilledRequirements: [],
  }),
  getRelatedRequirementIdsForCourseOptOut: (_: unknown, selected: string) =>
    ['X', 'Y'].filter(id => id !== selected),
}));

const entry = (uniqueID: number) => ({
  year: 2026,
  season: 'Fall' as const,
  course: ({ uniqueID } as unknown) as FirestoreSemesterCourse,
  data: ({ crseId: uniqueID } as unknown) as CornellCourseRosterCourse,
});

it('picks requirements in order, so a later course sees what earlier ones took', () => {
  const choices = getDefaultRequirementChoices([entry(1), entry(2)]);
  expect(choices[1].optOut).toEqual(['Y']);
  expect(choices[2].optOut).toEqual(['X']);
});

it('ignores the courses being replaced', () => {
  Object.assign(store.state, {
    overriddenFulfillmentChoices: { 9: { optOut: [] } },
    currentPlan: {
      name: 'Plan 1',
      semesters: [{ year: 2026, season: 'Fall', courses: [{ uniqueID: 9 }] }],
    },
  });
  expect(getDefaultRequirementChoices([entry(1)])[1].optOut).toEqual(['X']);
  expect(getDefaultRequirementChoices([entry(1)], [9])[1].optOut).toEqual(['Y']);
});
