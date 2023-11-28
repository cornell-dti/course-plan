/**
 * @brief This function computes the frequency of courses taken to fulfill a requirement
 *
 * @param groups A list of requirement groups containing the courses taken to fulfill the requirements
 * @param idRequirementFrequency A hashmap of requirement id to a list of frequency maps
 *
 * @details
 * This function computes the frequency of courses taken to fulfill a requirement.
 * The hashmap is of the form: requirement id -> list of frequency maps
 * The list of frequency maps is of the form: slot number -> course id -> frequency
 *
 * @note
 * The hashmap is passed in as a parameter to avoid creating a new hashmap every time this function is called.
 * This function is called multiple times in the main algorithm.
 */
export default function computeFulfillmentStats(
  groups: readonly GroupedRequirementFulfillmentReport[],
  idRequirementFrequency: Map<string, Map<number, number>[]>
) {
  // Iterate over all groups
  groups.forEach(currentGroup => {
    // Iterate over all requirements in the group
    const { reqs } = currentGroup;
    reqs.forEach(reqFulfillment => {
      // Obtain the requirement ID and the list of courses taken to fulfill the requirement
      const key: string = reqFulfillment.requirement.id;
      const { safeCourses } = reqFulfillment.fulfillment;

      // Obtain the frequency list for this particular group's requirements
      const freqList = idRequirementFrequency.get(key) ?? [];

      // Iterate over all slots in the requirement group
      // console.log(safeCourses.length);
      for (let slotNumber = 0; slotNumber < safeCourses.length; slotNumber += 1) {
        if (freqList.length === slotNumber) {
          freqList.push(new Map());
        }
        const currentCourseSlot = safeCourses[slotNumber];
        const currentRequirementSlotFreq = freqList[slotNumber];

        // Iterate over all courses taken to fulfill the req-slot
        for (let j = 0; j < currentCourseSlot.length; j += 1) {
          const currentCourseId = currentCourseSlot[j].courseId;
          const pastFreq = currentRequirementSlotFreq.get(currentCourseId) ?? 0;
          currentRequirementSlotFreq.set(currentCourseId, pastFreq + 1);
        }
        freqList[slotNumber] = currentRequirementSlotFreq; // Update the frequency list
      }
      idRequirementFrequency.set(key, freqList); // Update the hashmap with the new frequency list
    });
  });
}
