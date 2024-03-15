/* eslint-disable no-console */

import { usernameCollection, onboardingDataCollection } from '../firebase-config';

/**
 * Perform migration of semester to plans with a list of semesters
 */
async function runOnUser(userEmail: string) {
  await onboardingDataCollection.doc(userEmail).update({ sawNewFeature: false });
}

async function main() {
  const userEmail = process.argv[2];
  if (userEmail != null) {
    await runOnUser(userEmail);
    return;
  }
  const collection = await usernameCollection.get();
  for (const { id } of collection.docs) {
    console.group(`Running on ${id}...`);
    // Intentionally await in a loop to have no interleaved console logs.
    // eslint-disable-next-line no-await-in-loop
    await runOnUser(id);
    console.groupEnd();
  }
}

main();
