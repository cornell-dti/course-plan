/* eslint-disable no-console */

import {
  usernameCollection,
  overriddenFulfillmentChoicesCollection,
} from '../../firebase-admin-config';
import { getFirestoreCourseOptInOptOutChoicesBuilder } from '../requirement-graph-builder-from-user-data';
import { getUserDataOnAdmin } from './requirement-graph-admin-utils';

/** Compute opt-out choices for given user using their existing choices. */
async function runOnUser(userEmail: string, runOnDB: boolean) {
  const {
    courses,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
  } = await getUserDataOnAdmin(userEmail);

  const builder = getFirestoreCourseOptInOptOutChoicesBuilder(
    courses,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    {}
  );

  console.log(userEmail);
  const allChoices = Object.fromEntries(
    courses.map(course => {
      const choices = builder(course);

      console.log(`${course.code} (${course.uniqueId}):`);
      console.log(
        `- selected requirement: ${selectableRequirementChoices[course.uniqueId] || 'None'}`
      );
      console.log(`- optOut = [${choices.optOut.join(', ')}]`);
      console.log(
        `- acknowledgedCheckerWarningOptIn = [${choices.acknowledgedCheckerWarningOptIn.join(
          ', '
        )}]`
      );
      return [course.uniqueId, choices];
    })
  );

  console.log('\n');
  if (runOnDB) {
    await overriddenFulfillmentChoicesCollection.doc(userEmail).set(allChoices);
  }
}

async function main() {
  const userEmailFromArgument = process.argv[2];
  const runOnDB = process.argv.includes('--run-on-db');
  if (userEmailFromArgument != null && userEmailFromArgument !== '--run-on-db') {
    await runOnUser(userEmailFromArgument, runOnDB);
    return;
  }
  const collection = await usernameCollection.get();
  const userEmails = collection.docs.map(it => it.id);
  for (const userEmail of userEmails) {
    console.group(`Running on ${userEmail}...`);
    try {
      // Intentionally await in a loop to have no interleaved console logs.
      // eslint-disable-next-line no-await-in-loop
      await runOnUser(userEmail, runOnDB);
    } catch (e) {
      console.log(e);
    }
    console.groupEnd();
  }
}

main();
