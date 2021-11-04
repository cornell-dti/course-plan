/* eslint-disable no-console */

import getUserRequirementDataOnAdmin from './requirement-graph-admin-utils';

async function main() {
  const userEmail = process.argv[2];

  const {
    courses,
    userRequirements,
    requirementFulfillmentGraph,
  } = await getUserRequirementDataOnAdmin(userEmail);

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
