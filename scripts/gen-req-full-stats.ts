import {
  onboardingDataCollection,
  semestersCollection,
  toggleableRequirementChoicesCollection,
  overriddenFulfillmentChoicesCollection,
  courseFulfillmentStats,
} from './firebase-config';

import computeGroupedRequirementFulfillmentReports from '../src/requirements/requirement-frontend-computation';
import { computeFulfillmentStats } from '../src/requirements/fulfillment-stats';
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
      const toggleableRequirementChoices = (await toggleableRequirementChoicesCollection.doc(doc.id).get()).data() ?? {};
      const overriddenFulfillmentChoices = (await overriddenFulfillmentChoicesCollection.doc(doc.id).get()).data() ?? {};

        
      if (onboardingData !== undefined && 
        semestersAndPlans.semesters !== undefined &&
        toggleableRequirementChoices !== undefined &&
        overriddenFulfillmentChoices !== undefined) { // if the user has onboarding data
        try {
          const newOnboardingData = await createAppOnboardingData(onboardingData); // convert to new format
          const res = await computeGroupedRequirementFulfillmentReports( // compute fulfillment stats
            semestersAndPlans.semesters,
            newOnboardingData,
            toggleableRequirementChoices,
            overriddenFulfillmentChoices
            );
            idRequirementFrequency = await computeFulfillmentStats(res.groupedRequirementFulfillmentReport, idRequirementFrequency); // compute fulfillment stats
        } catch {
          console.log(counter, " : Error in computing fulfillment stats for user: " + doc.id);
          counter++;
        }
      }      
    });

  setTimeout (_callback, 3600*1000); // wait for all the data to be processed
}

async function storeComputedRequirementFullfillmentStatistics() {
  console.log("Keeping only the top fifty courses for each slot");
  // iterate through all the keys in the idRequirementFrequency hashmap
  for (let [reqID, slots] of idRequirementFrequency) {
    let newSlots : Map<number,number>[] = [];
    for (let slot of slots) {
      let newSlot = new Map<number, number>();
      let sorted = [...slot.entries()].sort((a, b) => b[1] - a[1]);
      let count = 0;
      for (let [course, freq] of sorted) {
        if (count === 50) {
          break;
        }
        newSlot.set(course, freq);
        count++;
      }
      newSlots.push(newSlot);
    }
    idRequirementFrequency.set(reqID, newSlots);
  }

  console.log("Storing fulfillment stats in firestore");
  // iterate through all the keys in the idRequirementFrequency hashmap
  for (let [reqID, slots] of idRequirementFrequency) {
    let json = {};
    
    let i = 0;
    for (let slot of slots) {
      let tempJson = {};
      for (let [course, freq] of slot) {
        tempJson[course] = freq;
      }
      json[i] = [tempJson];
      i++;
    }
    
    const data = {
      reqID: reqID,
      slots: json,
    }
    await courseFulfillmentStats.doc().set(data);
  }
   
}

computeRequirementFullfillmentStatistics(storeComputedRequirementFullfillmentStatistics);
