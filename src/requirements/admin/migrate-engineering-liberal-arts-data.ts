/* eslint-disable no-console */

import {
  usernameCollection,
  selectableRequirementChoicesCollection,
} from '../../firebase-admin-config';
import { requirementAllowDoubleCounting } from '../requirement-frontend-utils';
import getUserRequirementDataOnAdmin from './requirement-graph-admin-utils';

const REQUIREMENT_ID = 'College-EN-Liberal Studies: 6 courses';

/**
 * Perform migration of user's engineering liberal studies data.
 *
 * 1. Find all courses that are connected to this engineering liberal studies requirement.
 * 2. For each course, find requirements that connects to it
 *    a. Check if there all requirements connected to it are either
 *      - liberal study requirement
 *      - allow double counting
 *    b. If the above check returns true, it means that user has not chosen other requirement,
 *       then we can bind it to liberal study requirement (sort of)
 * 3. For all such courses found above, select liberal study as requirement, except that
 *    - The user might already made a choice on it. It happens maybe when the old requirement data is
 *      not the same as the new one, or maybe due to override.
 *    - In those cases, we skip and print a warning.
 */
async function runOnUser(userEmail: string, runOnDB: boolean) {
  const {
    selectableRequirementChoices,
    onboardingData,
    userRequirements,
    requirementFulfillmentGraph,
  } = await getUserRequirementDataOnAdmin(userEmail);
  const userRequirementMap = Object.fromEntries(userRequirements.map(it => [it.id, it]));

  const connectedCourses = requirementFulfillmentGraph.getConnectedCoursesFromRequirement(
    REQUIREMENT_ID
  );
  const connectedCoursesOnlyConnectedToDoubleCountedReqs = connectedCourses.filter(course => {
    const connectedRequirementIDs = requirementFulfillmentGraph.getConnectedRequirementsFromCourse(
      course
    );
    return connectedRequirementIDs.every(
      id =>
        id === REQUIREMENT_ID ||
        requirementAllowDoubleCounting(userRequirementMap[id], onboardingData.major)
    );
  });
  console.group('coursesNotConnectedToOtherRequirementThatDoesNotAllowDoubleCounting');
  connectedCoursesOnlyConnectedToDoubleCountedReqs.forEach(it => console.log(it));
  console.groupEnd();

  const choicesOld: Record<string, string> = {};
  const choicesUpdates: Record<string, string> = {};
  connectedCoursesOnlyConnectedToDoubleCountedReqs.forEach(course => {
    const stringId = String(course.uniqueId);
    const choice = selectableRequirementChoices[stringId];
    if (choice === REQUIREMENT_ID) {
      console.log(
        `[INFO] Course with unique ID ${course.uniqueId} (${course.code}) is already bind to ${REQUIREMENT_ID}. Skip.`
      );
      return;
    }
    if (choice) {
      const requirementOfChoice = userRequirementMap[choice];
      if (requirementOfChoice == null) {
        // Happens when
        // - user switch college/major
        // - leftover like other old liberal studies requirement (18 credits, 3 category stuff)
        console.log(`[INFO] Non-existing requirement: ${choice}.`);
      } else if (requirementAllowDoubleCounting(requirementOfChoice, onboardingData.major)) {
        // Not sure how it happens, but it's mostly harmless.
        // We can still make the requirement choose the liberal studies one.
        console.log(
          `[INFO] Somehow a requirement allow double counting is recorded as choice: ${choice}`
        );
      } else {
        // Seen in staging but not in prod: probably some corrupted data during dev.
        console.log(
          `[INFO] Connected to ${choice} that can no longer be satisfied by course: ${course.uniqueId}.`
        );
      }
    }
    console.log(
      `Now binding course with unique ID ${course.uniqueId} (${course.code}) to ${REQUIREMENT_ID}.`
    );
    if (choicesUpdates[stringId]) choicesOld[stringId] = choicesUpdates[stringId];
    choicesUpdates[stringId] = REQUIREMENT_ID;
  });

  console.log('Relevant Choices Old:');
  console.log(choicesOld);

  console.log('Choices Updates:');
  console.log(choicesUpdates);

  if (runOnDB && Object.keys(choicesUpdates).length > 0) {
    await selectableRequirementChoicesCollection
      .doc(userEmail)
      .set({ ...selectableRequirementChoices, ...choicesUpdates });
  }
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
