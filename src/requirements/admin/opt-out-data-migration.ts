/* eslint-disable no-console */

import { usernameCollection } from '../../firebase-admin-config';
import { getFirestoreCourseOptInOptOutChoicesBuilder } from '../requirement-graph-builder-from-user-data';
import { getUserDataOnAdmin } from './requirement-graph-admin-utils';

/** Compute opt-out choices for given user using their existing choices. */
async function runOnUser(userEmail: string) {
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
  courses.forEach(course => {
    const choices = builder(course);

    console.log(`${course.code} (${course.uniqueId}):`);
    console.log(
      `- selected requirement: ${selectableRequirementChoices[course.uniqueId] || 'None'}`
    );
    console.log(`- optOut = [${choices.optOut.join(', ')}]`);
    console.log(
      `- acknowledgedCheckerWarningOptIn = [${choices.acknowledgedCheckerWarningOptIn.join(', ')}]`
    );
  });

  console.log('\n');
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
    try {
      // Intentionally await in a loop to have no interleaved console logs.
      // eslint-disable-next-line no-await-in-loop
      await runOnUser(userEmail);
    } catch (e) {
      console.log(e);
    }
    console.groupEnd();
  }
}

main();
