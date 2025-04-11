/* eslint-disable no-console */

import { usernameCollection, onboardingDataCollection } from '../firebase-config';

/**
 * Perform migration for FA25 giveaway information
 */
async function runOnUser(userEmail: string) {
  await onboardingDataCollection.doc(userEmail).update({
    fa25giveaway: {
      saw: false,
      step1: false,
      step2: false,
      step3: false,
      entered: false,
    },
  });
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
