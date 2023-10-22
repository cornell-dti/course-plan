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

let idRequirementFrequency = new Map<string, Map<number, number>[]>();
let counter = 0;
/**
 * Prints to console.out the json string of frequencies each course take to
 * fulfill a given requirement
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

    if (
      onboardingData !== undefined &&
      semestersAndPlans.semesters !== undefined &&
      toggleableRequirementChoices !== undefined &&
      overriddenFulfillmentChoices !== undefined
    ) {
      // if the user has onboarding data
      try {
        const newOnboardingData = await createAppOnboardingData(onboardingData); // convert to new format
        const res = await computeGroupedRequirementFulfillmentReports(
          // compute fulfillment stats
          semestersAndPlans.semesters,
          newOnboardingData,
          toggleableRequirementChoices,
          overriddenFulfillmentChoices
        );
        idRequirementFrequency = await computeFulfillmentStats(
          res.groupedRequirementFulfillmentReport,
          idRequirementFrequency
        ); // compute fulfillment stats
      } catch {
        console.log(counter, ' : Error in computing fulfillment stats for user: ', doc.id);
        counter += 1;
      }
    }
  });

  setTimeout(_callback, 3600 * 1000); // wait for all the data to be processed
}

/**
 * Stores the computed requirement fulfillment statistics in firestore
 */
async function storeComputedRequirementFullfillmentStatistics() {
  console.log('Keeping only the top fifty courses for each slot');
  // iterate through all the keys in the idRequirementFrequency hashmap
  for (const [reqID, slots] of idRequirementFrequency) {
    const newSlots: Map<number, number>[] = [];
    for (const slot of slots) {
      const newSlot = new Map<number, number>();
      const sorted = [...slot.entries()].sort((a, b) => b[1] - a[1]);
      let count = 0;
      for (const [course, freq] of sorted) {
        if (count === 50) {
          break;
        }
        newSlot.set(course, freq);
        count += 1;
      }
      newSlots.push(newSlot);
    }
    idRequirementFrequency.set(reqID, newSlots);
  }

  console.log('Storing fulfillment stats in firestore');
  // iterate through all the keys in the idRequirementFrequency hashmap
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
    courseFulfillmentStats.doc().set(data);
  }
}

computeRequirementFullfillmentStatistics(storeComputedRequirementFullfillmentStatistics);
