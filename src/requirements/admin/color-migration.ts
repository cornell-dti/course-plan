/* eslint-disable no-console */
import { usernameCollection, subjectColorsCollection } from '../../firebase-admin-config';

function migrateSubjectColor(subjectColors: Record<string, string>): Record<string, string> {
  const subjectsColorsCopy = { ...subjectColors };
  for (const subject in subjectsColorsCopy) {
    const color = subjectsColorsCopy[subject];
    if (color === 'C4C4C4') {
      // Gray -> Ithaca Winter
      subjectsColorsCopy[subject] = '88B9F2';
    } else if (color === 'DA4A4A') {
      // Red
      subjectsColorsCopy[subject] = 'FF3B30';
    } else if (color === 'FFA53C') {
      // Orange
      subjectsColorsCopy[subject] = 'FF9500';
    } else if (color === '58C913') {
      // Green
      subjectsColorsCopy[subject] = '34C759';
    } else if (color === '139DC9') {
      // Blue
      subjectsColorsCopy[subject] = '007AFF';
    } else if (color === 'C478FF') {
      // Purple
      subjectsColorsCopy[subject] = 'AF52DE';
    }
  }
  return subjectsColorsCopy;
}

/**
 * Perform color migration
 */
async function runOnUser(userEmail: string, runOnDB: boolean) {
  await subjectColorsCollection
    .doc(userEmail)
    .get()
    .then(it => {
      const subjectColors = it.data() || {};
      console.log(subjectColors);
      const newSubjectColors = migrateSubjectColor(subjectColors);
      console.log(newSubjectColors);
      if (runOnDB) {
        subjectColorsCollection.doc(userEmail).set(newSubjectColors);
      }
    });
}

async function main() {
  let userEmail = process.argv[2];
  const runOnDB = process.argv.includes('--run-on-db');
  if (userEmail != null && userEmail !== '--run-on-db') {
    await runOnUser(userEmail, runOnDB);
    return;
  }
  const collection = await usernameCollection.get();
  const userEmails = collection.docs.map(it => it.id);
  for (userEmail of userEmails) {
    console.group(`Running on ${userEmail}...`);
    // Intentionally await in a loop to have no interleaved console logs.
    // eslint-disable-next-line no-await-in-loop
    await runOnUser(userEmail, runOnDB);
    console.groupEnd();
  }
}

main();
