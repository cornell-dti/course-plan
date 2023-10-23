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
let idRequirementFrequency = new Map<string, Map<number, number>[]>();
/**
 * Computes the requirement fulfillment statistics for all users. This is done by iterating through
 * all the users and computing the computeGroupedRequirementFulfillmentReports for each user.
 * This returns groupedRequirementFulfillmentReport which is then passed to computeFulfillmentStats.
 * GroupedRequirementFulfillmentReport is a list of RequirementFulfillmentReport where each
 * RequirementFulfillmentReport represents a requirement and a list of courses that fulfill the
 * requirement. computeFulfillmentStats then computes the frequency of each course in each slot
 * of the requirement and stores it in idRequirementFrequency.
 * @param _callback
 * @throws Error when computeGroupedRequirementFulfillmentReports fails to compute the fulfillment stats 
 */
async function computeRequirementFullfillmentStatistics(_callback) {
  const semQuerySnapshot = await semestersCollection.get();
  semQuerySnapshot.forEach(async doc => {
    // obtain the user's semesters, onboarding data, etc...
    const semestersAndPlans = await doc.data();
    const onboardingData = (await onboardingDataCollection.doc(doc.id).get()).data();
    const toggleableRequirementChoices =
      (await toggleableRequirementChoicesCollection.doc(doc.id).get()).data() ?? {};
    const overriddenFulfillmentChoices =
      (await overriddenFulfillmentChoicesCollection.doc(doc.id).get()).data() ?? {};

    // if the user has obboarding data, semesters, etc...
    if (
      onboardingData !== undefined &&
      semestersAndPlans.semesters !== undefined &&
      toggleableRequirementChoices !== undefined &&
      overriddenFulfillmentChoices !== undefined
    ) {
      // Attempt to compute the fulfillment stats for the user
      try {
        // use createAppOnboardingData to convert the onboarding data to the format used by the frontend
        const newOnboardingData = await createAppOnboardingData(onboardingData);
        
        // compute the fulfillment stats
        const res = await computeGroupedRequirementFulfillmentReports(
          semestersAndPlans.semesters,
          newOnboardingData,
          toggleableRequirementChoices,
          overriddenFulfillmentChoices
        );

        idRequirementFrequency = await computeFulfillmentStats(
          res.groupedRequirementFulfillmentReport,
          idRequirementFrequency
        );
      } catch {
        // There was an error computing the fulfillment stats for the user
      }
    }
  });

  setTimeout(_callback, 120 * 1000); // wait 2 minutes before storing the computed stats
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
      
      for (let i = 0; i < 50; i += 1) {
        const [course, freq] = sorted[i];
        newSlot.set(course, freq);
      }
      
      newSlots.push(newSlot);
    }
    idRequirementFrequency.set(reqID, newSlots);
  }

  // Storing fulfillment stats in firestore by iterating through the hashmap
  for (const [reqID, slots] of idRequirementFrequency) {
    const json = {};

    let i = 0;
    for (const slot of slots) {
      const tempJson = {};
      for (const [course, freq] of slot) {
        tempJson[course] = freq;
      }
      json[i] = tempJson;
      i += 1;
    }

    const data = {
      reqID,
      slots: json,
    };
    courseFulfillmentStats.doc().set(data); // store the data in firestore
  }
}

// Run the script
computeRequirementFullfillmentStatistics(storeComputedRequirementFullfillmentStatistics);
