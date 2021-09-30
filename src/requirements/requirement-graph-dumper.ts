/* eslint-disable no-console */

import { createAppOnboardingData } from '../user-data-converter';
import { checkNotNull } from '../utilities';
import {
  semestersCollection,
  toggleableRequirementChoicesCollection,
  selectableRequirementChoicesCollection,
  onboardingDataCollection,
} from '../firebase-admin-config';
import { getCourseCodesArray } from './requirement-frontend-computation';
import buildRequirementFulfillmentGraphFromUserData from './requirement-graph-builder-from-user-data';

async function main() {
  const userEmail = process.argv[2];
  const [
    semesters,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    onboardingData,
  ] = await Promise.all([
    semestersCollection
      .doc(userEmail)
      .get()
      .then(it => checkNotNull(it.data()).semesters),
    toggleableRequirementChoicesCollection
      .doc(userEmail)
      .get()
      .then(it => checkNotNull(it.data())),
    selectableRequirementChoicesCollection
      .doc(userEmail)
      .get()
      .then(it => checkNotNull(it.data())),
    onboardingDataCollection
      .doc(userEmail)
      .get()
      .then(it => createAppOnboardingData(checkNotNull(it.data()))),
  ]);

  const courses = getCourseCodesArray(semesters, onboardingData);
  const {
    userRequirements,
    requirementFulfillmentGraph,
  } = buildRequirementFulfillmentGraphFromUserData(
    courses,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    {}
  );

  console.group('User Requirements:');
  userRequirements.forEach(it => console.log(it.id));
  console.groupEnd();

  console.group('User courses:');
  courses.forEach(({ uniqueId, courseId, code }) => console.log({ uniqueId, courseId, code }));
  console.groupEnd();

  console.group('Edges:');
  requirementFulfillmentGraph
    .getAllEdges()
    .forEach(([requirement, { uniqueId, courseId, code }]) =>
      console.log(requirement, '->', { uniqueId, courseId, code })
    );
  console.groupEnd();
}

main();
