import {
  onboardingDataCollection,
  semestersCollection,
  toggleableRequirementChoicesCollection,
  overriddenFulfillmentChoicesCollection,
  courseFulfillmentStats,
} from './firebase-config';

import computeGroupedRequirementFulfillmentReports from '../src/requirements/requirement-frontend-computation';
import computeFulfillmentStats from '../src/requirements/fulfillment-stats';
import { createAppOnboardingData } from '../src/user-data-converter';

import '../src/requirements/decorated-requirements.json';

// idRequirementFrequency is a hashmap where the key is the requirement ID and the value is
// an array of maps. Each element in the array represents a slot in the requirement.
// The map is a hashmap where the key is the course ID and the value is the frequency of the course
// in the slot.
const idRequirementFrequency = new Map<string, Map<number, number>[]>();

/**
 * Computes the requirement fulfillment statistics for all users. This is done by iterating through
 * all the users and computing the computeGroupedRequirementFulfillmentReports for each user.
 * This returns groupedRequirementFulfillmentReport which is then passed to computeFulfillmentStats.
 * GroupedRequirementFulfillmentReport is a list of RequirementFulfillmentReport where each
 * RequirementFulfillmentReport represents a requirement and a list of courses that fulfill the
 * requirement. computeFulfillmentStats then computes the frequency of each course in each slot
 * of the requirement and stores it in idRequirementFrequency.
 * @param _callback is a function that is called after the fulfillment stats have been computed
 * @throws Error when computeGroupedRequirementFulfillmentReports fails to compute the fulfillment stats
 */
async function computeRequirementFullfillmentStatistics(_callback) {
  let numberOfErrors = 0;
  const semQuerySnapshot = await semestersCollection.get();
  const promises = semQuerySnapshot.docs.map(async doc => {
    // obtain the user's semesters, onboarding data, etc...
    const semesters = (await doc.data()).semesters ?? {};
    const onboardingData = (await onboardingDataCollection.doc(doc.id).get()).data() ?? {};
    const toggleableRequirementChoices =
      (await toggleableRequirementChoicesCollection.doc(doc.id).get()).data() ?? {};
    const overriddenFulfillmentChoices =
      (await overriddenFulfillmentChoicesCollection.doc(doc.id).get()).data() ?? {};

    // Attempt to compute the fulfillment stats for the user
    try {
      // use createAppOnboardingData to convert the onboarding data to the format used by the frontend
      const newOnboardingData = await createAppOnboardingData(onboardingData);

      // compute the fulfillment stats
      const res = await computeGroupedRequirementFulfillmentReports(
        semesters,
        newOnboardingData,
        toggleableRequirementChoices,
        overriddenFulfillmentChoices
      );

      await computeFulfillmentStats(
        res.groupedRequirementFulfillmentReport,
        idRequirementFrequency
      );
    } catch {
      // There was an error computing the fulfillment stats for the user
      console.log(`${numberOfErrors} : Error computing fulfillment stats for ${doc.id}`);
      numberOfErrors += 1;
    }
  });

  await Promise.all(promises);
  _callback();
}

/**
 * Stores the computed requirement fulfillment statistics in firestore. This is done by iterating
 * through all the keys in the idRequirementFrequency hashmap and storing the fulfillment stats
 * for each requirement in firestore. We have to keep only the top fifty courses for each slot
 * to reduce the size of the data stored in firestore. This is done by sorting the hashmap by
 * frequency and keeping only the top fifty courses for each slot.
 * @throws Error when courseFulfillmentStats.doc().set(data) fails to store the data in firestore
 */
async function storeComputedRequirementFullfillmentStatistics() {
  // Change the hashmap to only keep the top fifty courses for each slot
  for (const [reqID, slots] of idRequirementFrequency) {
    const newSlots: Map<number, number>[] = [];
    for (const slot of slots) {
      const newSlot = new Map<number, number>();
      const sorted = [...slot.entries()].sort((a, b) => b[1] - a[1]);

      const numberOfCourses = sorted.length > 50 ? 50 : sorted.length;
      for (let i = 0; i < numberOfCourses; i += 1) {
        const [course, freq] = sorted[i];
        newSlot.set(course, freq);
      }

      newSlots.push(newSlot);
    }
    idRequirementFrequency.set(reqID, newSlots);
  }

  // Storing fulfillment stats in firestore by iterating through the hashmap
  for (const [reqID, slots] of idRequirementFrequency) {
    const reqFrequenciesJson = {};
    for (let i = 0; i < slots.length; i += 1) {
      const slot = slots[i];
      const slotFrequenciesJson = {};
      for (const [course, freq] of slot) {
        slotFrequenciesJson[course] = freq;
      }
      reqFrequenciesJson[i] = slotFrequenciesJson;
    }
    const ID = reqID.replace('/', '[FORWARD_SLASH]');
    courseFulfillmentStats.doc(ID).set(reqFrequenciesJson); // store the data in firestore
  }
}

// Run the script
computeRequirementFullfillmentStatistics(storeComputedRequirementFullfillmentStatistics);
