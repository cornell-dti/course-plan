/* eslint-disable no-console */

import { usernameCollection, semestersCollection } from '../firebase-config';

/**
 * Perform migration of for a semester course card to have a default empty notes field
  type FirestoreSemesterCourse = {
  ...
  readonly note?: string | null;
  readonly lastUpdated?: Timestamp | null; // NB: the Timestamp here is deliberately left untyped — importing from Firestore causes all sorts of namespace issues.
};
 */
async function runOnUser(userEmail: string) {
  const semesters = await semestersCollection.doc(userEmail).get();
  if (!semesters.exists) {
    // console.log(`No semesters found for ${userEmail}`);
    return;
  }
  const data = semesters.data();
  if (data == null) {
    // console.log(`No data found for ${userEmail}`);
    return;
  }
  const { semesters: semestersData } = data;
  if (semestersData == null) {
    // console.log(`No semesters data found for ${userEmail}`);
    return;
  }
  for (const semester of semestersData) {
    for (const course of semester.courses) {
      if ('note' in course === false) {
        // console.log(`Adding note to course ${course.name}`);
        course.note = null;
        course.lastUpdated = null;
      }
    }
  }
  await semestersCollection.doc(userEmail).update({ semesters: semestersData });
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
