import { incrementUniqueID, incrementUniqueIDBy } from '../user-unique-incrementer';
import store from '../../store';

jest.mock('firebase/firestore', () => ({ doc: () => ({}), setDoc: () => Promise.resolve() }));
jest.mock('../../firebase-config', () => ({ uniqueIncrementerCollection: {} }));
jest.mock('../../store', () => {
  const state = { uniqueIncrementer: 10, uniqueBlankCourseIncrementer: 0, currentFirebaseUser: {} };
  return {
    __esModule: true,
    default: {
      state,
      commit: (mutation: string, value: number) => {
        if (mutation === 'setUniqueIncrementer') state.uniqueIncrementer = value;
      },
    },
  };
});

it('never hands out the same id twice across back-to-back batches', () => {
  const first = incrementUniqueIDBy(3);
  const second = incrementUniqueIDBy(2);
  const single = incrementUniqueID();
  expect([...first, ...second, single]).toEqual([11, 12, 13, 14, 15, 16]);
  expect(store.state.uniqueIncrementer).toBe(16);
});
