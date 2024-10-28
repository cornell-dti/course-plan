/* eslint-disable no-console */

import { usernameCollection, semestersCollection } from '../firebase-config';

/**
 * Perform migration of a default The 'All' Collection for All Courses saved
 */
async function runOnUser(userEmail: string) {
  const emptyCourses = [];
  await semestersCollection.doc(userEmail).update({
    savedCourses: [{ name: 'All', emptyCourses }],
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
