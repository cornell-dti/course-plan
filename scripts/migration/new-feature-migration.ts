/* eslint-disable no-console */

import { usernameCollection, onboardingDataCollection } from '../firebase-config';

/**
 * Perform migration of user data to add sawNewFeature boolean
 * TODO: update sawNewFeature to sawMultiplePlans
 */
async function addSawMultiplePlans(userEmail: string) {
  await onboardingDataCollection.doc(userEmail).update({ sawNewFeature: false });
}

/**
 * Perform migration of user data to add sawScheduleGenerator boolean
 */
async function addSawScheduleGenerator(userEmail: string) {
  await onboardingDataCollection.doc(userEmail).update({ sawScheduleGenerator: false });
}

async function main() {
  const userEmail = process.argv[2];
  if (userEmail != null) {
    await addSawScheduleGenerator(userEmail);
    return;
  }
  const collection = await usernameCollection.get();
  for (const { id } of collection.docs) {
    console.group(`Running on ${id}...`);
    // Intentionally await in a loop to have no interleaved console logs.
    // eslint-disable-next-line no-await-in-loop
    await addSawScheduleGenerator(id);
    console.groupEnd();
  }
}

main();
