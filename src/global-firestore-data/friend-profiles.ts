import { doc, getDoc } from 'firebase/firestore';

import {
  onboardingDataCollection,
  semestersCollection,
  usernameCollection,
} from '../firebase-config';
import { getMajorFullName } from '../utilities';
import {
  displayName,
  emailToNetId,
  initials,
  majorAndYear,
  sharedPlanOf,
} from '../components/Friends/friends-utils';

export type FriendProfile = {
  readonly email: string;
  readonly netId: string;
  readonly name: string;
  readonly initials: string;
  /** 'Computer Science ’29', or '' when their onboarding data can't be read. */
  readonly majorLine: string;
  /** The plan they share with friends, or null when it can't be read (e.g. rules not deployed). */
  readonly plan: Plan | null;
};

/**
 * Reads a user's name. Any signed-in user may read names, so this works before you are friends.
 * Resolves to null when the user has no account.
 */
export const loadUserName = async (email: string): Promise<FirestoreUserName | null> => {
  const snapshot = await getDoc(doc(usernameCollection, email));
  return snapshot.exists() ? snapshot.data() : null;
};

const settledValue = <T>(result: PromiseSettledResult<T>): T | undefined =>
  result.status === 'fulfilled' ? result.value : undefined;

/**
 * Reads what a friend shares: their name, major and class year, and their shared plan. Each part
 * is read separately so one denied read (for example, before the Firestore rules are deployed)
 * still shows the rest.
 */
export const loadFriendProfile = async (email: string): Promise<FriendProfile> => {
  const [nameResult, semestersResult, onboardingResult] = await Promise.allSettled([
    getDoc(doc(usernameCollection, email)),
    getDoc(doc(semestersCollection, email)),
    getDoc(doc(onboardingDataCollection, email)),
  ]);
  [semestersResult, onboardingResult].forEach(result => {
    if (result.status === 'rejected') {
      // eslint-disable-next-line no-console
      console.warn(`Friends: could not read shared data for ${email}`, result.reason);
    }
  });

  const name = displayName(settledValue(nameResult)?.data(), email);
  const semesters = settledValue(semestersResult)?.data();
  const onboarding = settledValue(onboardingResult)?.data();
  const majorNames = (onboarding?.majors ?? []).map(major => getMajorFullName(major.acronym));

  return {
    email,
    netId: emailToNetId(email),
    name,
    initials: initials(name),
    majorLine: majorAndYear(majorNames, onboarding?.gradYear),
    plan: semesters ? sharedPlanOf(semesters) : null,
  };
};
