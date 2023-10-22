export default function computeFulfillmentStats(
  groups: readonly GroupedRequirementFulfillmentReport[],
  idRequirementFrequency: Map<string, Map<number, number>[]>
) {
  const res = idRequirementFrequency;
  groups.forEach(currentGroup => {
    const { reqs } = currentGroup;
    reqs.forEach(reqFulfillment => {
      const key: string = reqFulfillment.requirement.id;
      const { safeCourses } = reqFulfillment.fulfillment;

      // Obtain the frequency list for this particular group's requirements
      const freqList = res.get(key) ?? [];

      // Iterate over all slots in the requirement group
      // console.log(safeCourses.length);
      for (let slotNumber = 0; slotNumber < safeCourses.length; slotNumber += 1) {
        if (freqList.length === slotNumber) {
          freqList.push(new Map<number, number>());
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
      res.set(key, freqList); // Update the hashmap with the new frequency list
    });
  });

  return res; // return the hashmap
}
