/* eslint-disable no-console */
import { subjectColorsCollection } from '../firebase-config';

function migrateSubjectColor(subjectColors: Record<string, string>): Record<string, string> {
  const subjectsColorsCopy = { ...subjectColors };
  for (const subject in subjectsColorsCopy) {
    if (Object.prototype.hasOwnProperty.call(subjectsColorsCopy, subject)) {
      switch (subjectsColorsCopy[subject]) {
        // Gray -> Ithaca Winter
        case 'C4C4C4':
          subjectsColorsCopy[subject] = '88B9F2';
          break;
        // Red
        case 'DA4A4A':
          subjectsColorsCopy[subject] = 'FF3B30';
          break;
        // Orange
        case 'FFA53C':
          subjectsColorsCopy[subject] = 'FF9500';
          break;
        // Green
        case '58C913':
          subjectsColorsCopy[subject] = '34C759';
          break;
        // Blue
        case '139DC9':
          subjectsColorsCopy[subject] = '007AFF';
          break;
        // Purple
        case 'C478FF':
          subjectsColorsCopy[subject] = 'AF52DE';
          break;
        default:
          break;
      }
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
    .then(async it => {
      const subjectColors = it.data() || {};
      const newSubjectColors = migrateSubjectColor(subjectColors);
      if (runOnDB) {
        await subjectColorsCollection.doc(userEmail).set(newSubjectColors);
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
  const collection = await subjectColorsCollection.get();
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
