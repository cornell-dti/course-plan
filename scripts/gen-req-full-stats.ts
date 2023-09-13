import {
  onboardingDataCollection,
  semestersCollection,
  toggleableRequirementChoicesCollection,
  overriddenFulfillmentChoicesCollection,
} from './firebase-config';

import computeGroupedRequirementFulfillmentReports from '../src/requirements/requirement-frontend-computation';

import { RequirementFulfillment, CourseTaken } from '../src/requirement-types';

const idRequirementFrequency = new Map<string, Map<number, number>[]>();

/**
 * Prints to console.out the json string of frequencies each course take to
 * fulfill a given requirement
 */
async function computeRequirementFullfillmentStatistics() {
  await semestersCollection.get().then(semQuerySnapshot => {
    // Query a user's semesters
    semQuerySnapshot.forEach(async doc => {
      // obtain the user's semesters, onboarding data, etc...
      let { semesters, _ } = doc.data();
      let onboardingData = await onboardingDataCollection.doc(doc.id).get();
      let toggleableRequirementChoices = await toggleableRequirementChoicesCollection
        .doc(doc.id)
        .get();
      let overriddenFulfillmentChoices = await overriddenFulfillmentChoicesCollection
        .doc(doc.id)
        .get();

      // For the given users semesters compute the requirements they fulfill
      // and which course it took for them to fulfill them
      let res = computeGroupedRequirementFulfillmentReports(
        semesters,
        onboardingData,
        toggleableRequirementChoices,
        overriddenFulfillmentChoices
      );

      res.groupedRequirementFulfillmentReport.forEach(currentGroup => {
        let currentGroupReqs: RequirementFulfillment[] = currentGroup.reqs;

        // For a given group of requirements, we iterate through all courses
        // that were needed to fulfill each slot
        currentGroupReqs.forEach(reqFulfillment => {
          let key: string = reqFulfillment.requirement.id;

          let fulfillment: readonly CourseTaken[][] = reqFulfillment.fulfillment
            .safeCourses as readonly CourseTaken[][];

          // Obtain the frequency list for this particular group's requirements
          let freqList: Map<number, number>[] = idRequirementFrequency.has(key)
            ? (idRequirementFrequency.get(key) as Map<number, number>[])
            : [];

          // Iterate over all slots in the requirement group
          for (let slotNumber = 0; slotNumber < fulfillment.length; slotNumber++) {
            if (freqList.length == slotNumber) {
              freqList.push(new Map<number, number>());
            }
            let currentCourseSlot: CourseTaken[] = fulfillment[slotNumber];
            let currentRequirementSlotFreq = freqList[slotNumber];

            // Iterate over all courses taken to fulfill the req-slot
            for (let j = 0; j < currentCourseSlot.length; j++) {
              let currentCourseId = currentCourseSlot[j].courseId;

              let pastFreq = currentRequirementSlotFreq.has(currentCourseId)
                ? (currentRequirementSlotFreq.get(currentCourseId) as number)
                : 0;
              // Increase frequency each time a course is used to fulfill
              // a specific requirement slot
              currentRequirementSlotFreq.set(currentCourseId, pastFreq + 1);
            }
          }
        });
      });
    });
  });

  // Serialize the large hashmap into a JSON  object
  let returnObject = {};
  for (const [key, value] of idRequirementFrequency) {
    returnObject[key] = value.map(item => ({ ...item }));
  }

  // Turn the JSON object into a string to output to the console
  let returnString = JSON.stringify(returnObject, null, 2);
  console.log(returnString);
}

computeRequirementFullfillmentStatistics();
