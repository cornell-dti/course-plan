import requirementJson from '../typed-requirement-json';

const allRequirementsIDs = [
  ...requirementJson.university.UNI.requirements.map(it => `College-UNI-${it.name}`),
  ...Object.entries(requirementJson.college)
    .map(([college, collegeReqs]) =>
      collegeReqs.requirements.map(it => `College-${college}-${it.name}`)
    )
    .flat(),
  ...Object.entries(requirementJson.major)
    .map(([major, majorRequirement]) =>
      majorRequirement.requirements.map(it => `Major-${major}-${it.name}`)
    )
    .flat(),
  ...Object.entries(requirementJson.minor)
    .map(([major, minorRequirement]) =>
      minorRequirement.requirements.map(it => `Minor-${major}-${it.name}`)
    )
    .flat(),
].sort((a, b) => a.localeCompare(b));

it('ID of the requirements are unchanged.', () => {
  /**
   * What should you do when this test fails:
   *
   * First, you need to unbreak the test. You only need to run `npm run test -- -u`.
   *
   * 1. If course plan has not been launched yet, don't worry.
   * 2. If course plan is launched.
   *   a. If it failed because you added a new requirement, don't worry.
   *   b. Else, you should write migration script!
   */

  expect(allRequirementsIDs).toMatchSnapshot();
});

it('No duplicate requirement ID.', () => {
  const set = new Set<string>();
  allRequirementsIDs.forEach(id => {
    if (set.has(id)) {
      fail(`Detected duplicated requirement ID: ${id}`);
    } else {
      set.add(id);
    }
  });
});
