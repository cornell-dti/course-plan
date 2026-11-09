import { doc, updateDoc } from 'firebase/firestore';

import store from '../../store';
import { PreEnrollReminderStage } from '../../pre-enroll';
import { dismissPreEnrollBanner } from '../user-onboarding-data';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn((collection, email) => ({ collection, email })),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/data/constants', () => ({ SWIM_TEST_CODE: 'SWIM' }), { virtual: true });
jest.mock('../../firebase-config', () => ({ onboardingDataCollection: 'test-onboarding' }));
jest.mock('../user-name', () => jest.fn());
jest.mock('../../store', () => ({
  state: { currentFirebaseUser: { email: 'student@example.com' } },
  commit: jest.fn(),
}));

const update = updateDoc as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  update.mockResolvedValue(undefined);
  Object.assign(store.state.currentFirebaseUser, { email: 'student@example.com' });
});

it('persists only the selected reminder and commits after the write succeeds', async () => {
  let finishWrite: () => void = () => undefined;
  update.mockImplementationOnce(
    () =>
      new Promise<void>(resolve => {
        finishWrite = resolve;
      })
  );

  const pending = dismissPreEnrollBanner('SP27', '14d');

  expect(doc).toHaveBeenCalledWith('test-onboarding', 'student@example.com');
  expect(update).toHaveBeenCalledWith(
    { collection: 'test-onboarding', email: 'student@example.com' },
    { 'dismissedPreEnrollBanner.SP27_14d': true }
  );
  expect(store.commit).not.toHaveBeenCalled();

  finishWrite();
  await pending;
  expect(store.commit).toHaveBeenCalledWith('setPreEnrollBannerDismissed', 'SP27_14d');
});

it('does not commit dismissal when Firestore rejects the write', async () => {
  update.mockRejectedValueOnce(new Error('offline'));

  await expect(dismissPreEnrollBanner('SP27', '7d')).rejects.toThrow('offline');
  expect(store.commit).not.toHaveBeenCalled();
});

it('requires a signed-in user', async () => {
  Object.assign(store.state.currentFirebaseUser, { email: '' });

  await expect(dismissPreEnrollBanner('SP27', '3d')).rejects.toThrow('signed in');
  expect(update).not.toHaveBeenCalled();
});

it('rejects invalid reminder keys before writing', async () => {
  await expect(dismissPreEnrollBanner('SP27.other', '7d')).rejects.toThrow(
    'Invalid enrollment term'
  );
  await expect(dismissPreEnrollBanner('SP27', 'other' as PreEnrollReminderStage)).rejects.toThrow(
    'Invalid enrollment reminder'
  );
  expect(update).not.toHaveBeenCalled();
});
