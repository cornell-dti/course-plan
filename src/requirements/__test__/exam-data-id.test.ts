import { examSubjects } from '../requirement-exam-utils';

const examIds = [
  ...examSubjects.AP.map(subject => `AP ${subject}`),
  ...examSubjects.IB.map(subject => `IB ${subject}`),
  ...examSubjects.CASE.map(subject => `CASE ${subject}`),
].sort((a, b) => a.localeCompare(b));

it('ID of the exams are unchanged.', () => {
  /**
   * What should you do when this test fails:
   * a. Unbreak the test. To update the snapshot, run `npm run test -- -u`.
   * b. Write a migration script for any exam unique ids that changed.
   */

  expect(examIds).toMatchSnapshot();
});

it('No duplicate exam unique ID.', () => {
  const set = new Set<string>();
  examIds.forEach(id => {
    if (set.has(id)) {
      fail(`Detected duplicated exam unique ID: ${id}`);
    } else {
      set.add(id);
    }
  });
});
