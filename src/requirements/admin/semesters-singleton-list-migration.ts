/* eslint-disable no-console */

import { usernameCollection, semestersCollection } from '../../firebase-admin-config';

/**
 * Perform migration of semester to plans with a list of semesters
 */
async function runOnUser(userEmail: string) {
  const semestersDoc = await semestersCollection.doc(userEmail).get();

  const semesters = semestersDoc.data()?.semesters ?? [];

  await semestersCollection.doc(userEmail).update({
    plans: [{ semesters }],
  });
}

async function main() {
  let userEmail = process.argv[2];
  if (userEmail != null) {
    await runOnUser(userEmail);
    return;
  }
  const collection = await usernameCollection.get();
  const userEmails = collection.docs.map(it => it.id);
  for (userEmail of userEmails) {
    console.group(`Running on ${userEmail}...`);
    // Intentionally await in a loop to have no interleaved console logs.
    // eslint-disable-next-line no-await-in-loop
    await runOnUser(userEmail);
    console.groupEnd();
  }
}

main();
