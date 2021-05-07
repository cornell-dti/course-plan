import {
  addOverridenRequirementAPIBUpdater,
  clearOverridenRequirementsAPIBUpdater,
} from '../global-firestore-data';

/**
 * Tests for addOverridenRequirementAPIBUpdater
 */
it('Exam name not found', () => {
  let oldAPIBExams: FirestoreAPIBExam[] = [];
  let newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'examName',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(oldAPIBExams);

  oldAPIBExams = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
    },
  ];
  newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'examName',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(oldAPIBExams);
});

it('Override with missing data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
    },
  ];

  let expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: {},
    },
  ];
  let newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);

  expectedAPIBExams = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: { reqName: ['slotName'] },
    },
  ];
  newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Override with no initial data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
    },
  ];

  let expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: {},
    },
  ];
  let newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);

  expectedAPIBExams = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: { reqName: ['slotName'] },
    },
  ];
  newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Override with duplicate data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: { reqName1: ['slotName1'] },
    },
  ];

  let newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(oldAPIBExams);

  newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName1',
    'slotName1'
  );
  expect(newAPIBExams).toEqual(oldAPIBExams);
});

it('Opt in with new data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName1'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName1', 'slotName'] },
      optOut: {},
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Opt out with new data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optOut: { reqName: ['slotName1'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: { reqName: ['slotName1', 'slotName'] },
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Opt in with opt out data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optOut: { reqName: ['slotName'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: {},
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Opt out with opt in data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: { reqName: ['slotName'] },
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Opt in with opt in data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName1'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName1', 'slotName'] },
      optOut: {},
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Opt out with opt out data', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optOut: { reqName: ['slotName1'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: { reqName: ['slotName1', 'slotName'] },
    },
  ];
  const newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Override with different reqName', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName1: ['slotName1'] },
      optOut: { reqName2: ['slotName2'] },
    },
  ];

  let expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName1: ['slotName1'], reqName: ['slotName'] },
      optOut: { reqName2: ['slotName2'] },
    },
  ];
  let newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    true,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);

  expectedAPIBExams = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName1: ['slotName1'] },
      optOut: { reqName2: ['slotName2'], reqName: ['slotName'] },
    },
  ];
  newAPIBExams = addOverridenRequirementAPIBUpdater(
    oldAPIBExams,
    'AP Biology',
    false,
    'reqName',
    'slotName'
  );
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

/**
 * Tests for clearOverridenRequirementsAPIBUpdater
 */
it('No exams to clear', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [];
  const newAPIBExams = clearOverridenRequirementsAPIBUpdater(oldAPIBExams);
  expect(newAPIBExams).toEqual(oldAPIBExams);
});

it('Exams are already cleared', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: {},
    },
  ];
  const newAPIBExams = clearOverridenRequirementsAPIBUpdater(oldAPIBExams);
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Clear for one exam', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: { reqName: ['slotName'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: {},
    },
  ];
  const newAPIBExams = clearOverridenRequirementsAPIBUpdater(oldAPIBExams);
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});

it('Clear for multiple exams', () => {
  const oldAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: { reqName: ['slotName'] },
      optOut: { reqName: ['slotName'] },
    },
    {
      type: 'AP',
      score: 5,
      subject: 'Computer Science',
      optIn: { reqName1: ['slotName1', 'slotName2'], reqName: ['slotName'] },
      optOut: { reqName1: ['slotName1', 'slotName2'], reqName: ['slotName'] },
    },
  ];
  const expectedAPIBExams: FirestoreAPIBExam[] = [
    {
      type: 'AP',
      score: 5,
      subject: 'Biology',
      optIn: {},
      optOut: {},
    },
    {
      type: 'AP',
      score: 5,
      subject: 'Computer Science',
      optIn: {},
      optOut: {},
    },
  ];
  const newAPIBExams = clearOverridenRequirementsAPIBUpdater(oldAPIBExams);
  expect(newAPIBExams).toEqual(expectedAPIBExams);
});
