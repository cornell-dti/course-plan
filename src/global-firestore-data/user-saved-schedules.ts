import { doc, getDoc, runTransaction } from 'firebase/firestore';

import { db, savedSchedulesCollection, usernameCollection } from '../firebase-config';
import type { GeneratedScheduleOutput } from '../schedule-generator/algorithm';
import store from '../store';
import { generatedScheduleToFirestore } from './user-saved-schedules-utils';

const currentUserEmail = (): string => store.state.currentFirebaseUser.email;

const generateScheduleId = (): string =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

/** Read-modify-writes the current user's saved schedules in a transaction. */
const updateOwnSchedules = (
  update: (schedules: readonly FirestoreSavedSchedule[]) => readonly FirestoreSavedSchedule[]
): Promise<void> => {
  const ref = doc(savedSchedulesCollection, currentUserEmail());
  return runTransaction(db, async transaction => {
    const schedules = (await transaction.get(ref)).data()?.schedules ?? [];
    transaction.set(ref, { schedules: update(schedules) });
  });
};

export type SaveScheduleInput = {
  readonly name: string;
  readonly year: number;
  readonly season: FirestoreSemesterSeason;
  readonly output: GeneratedScheduleOutput;
  /** Looks up course titles, which generator output does not carry. */
  readonly titleByCode: (code: string) => string | undefined;
};

/** Saves a generated schedule for the current user. Resolves to the new schedule's id. */
export const saveSchedule = async ({
  name,
  year,
  season,
  output,
  titleByCode,
}: SaveScheduleInput): Promise<string> => {
  const id = generateScheduleId();
  const schedule = generatedScheduleToFirestore(
    output,
    { id, name, year, season },
    titleByCode,
    Date.now()
  );
  await updateOwnSchedules(schedules => [...schedules, schedule]);
  return id;
};

export const renameSchedule = (id: string, name: string): Promise<void> => {
  const now = Date.now();
  return updateOwnSchedules(schedules =>
    schedules.map(schedule =>
      schedule.id === id ? { ...schedule, name, updatedAt: now } : schedule
    )
  );
};

export const deleteSchedule = (id: string): Promise<void> =>
  updateOwnSchedules(schedules => schedules.filter(schedule => schedule.id !== id));

/**
 * Loads a friend's saved schedules once. Firestore rules only allow this for accepted friends, so
 * this rejects with `permission-denied` otherwise.
 */
export const getFriendSchedules = async (
  friendEmail: string
): Promise<readonly FirestoreSavedSchedule[]> =>
  (await getDoc(doc(savedSchedulesCollection, friendEmail))).data()?.schedules ?? [];

/** Loads display names for the given friends. Friends without a name doc are left out. */
export const getFriendNames = async (
  emails: readonly string[]
): Promise<Record<string, FirestoreUserName>> => {
  const snapshots = await Promise.all(emails.map(email => getDoc(doc(usernameCollection, email))));
  const names: Record<string, FirestoreUserName> = {};
  snapshots.forEach((snapshot, i) => {
    const name = snapshot.data();
    if (name != null) names[emails[i]] = name;
  });
  return names;
};
