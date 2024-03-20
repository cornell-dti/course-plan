/* eslint-disable no-console */

import { semestersCollection } from '../firebase-config';

/**
 * Perform migration of semester to plans with a list of semesters
 */
async function runOnUser(userEmail: string) {
  const semestersDoc = await semestersCollection.doc(userEmail).get();
  const semesters = semestersDoc.data()?.semesters ?? [];
  const currplans = semestersDoc.data()?.plans ?? [];
  const newplans =
    currplans.length >= 1
      ? currplans.map(p => (!('name' in p) ? { name: 'Plan 1', semesters } : p))
      : [{ name: 'Plan 1', semesters }];
  await semestersCollection.doc(userEmail).update({
    plans: newplans,
  });
}

async function main() {
  const userEmail = process.argv[2];
  if (userEmail != null) {
    await runOnUser(userEmail);
    return;
  }
  const collection = await semestersCollection.get();
  for (const { id } of collection.docs) {
    console.group(`Running on ${id}...`);
    // Intentionally await in a loop to have no interleaved console logs.
    // eslint-disable-next-line no-await-in-loop
    await runOnUser(id);
    console.groupEnd();
  }
}

main();
