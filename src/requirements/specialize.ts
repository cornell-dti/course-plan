import { Major } from './types';

/**
 * Many majors often "specialize" the requirements of their respective college(s)
 * `specialized(collegeReqs, majors)` is an array of `collegeReqs` having been
 * specialized according to `majors`
 *
 * @param collegeReqs the base set of requirements for the college
 * @param majors the set of majors to specialize `collegeReqs` for
 * @returns An array of `collegeReqs` having been specialized for `majors`
 */
export function specialized<R extends RequirementCommon>(
  collegeReqs: readonly R[],
  majors: readonly Major<R>[]
) {
  const specializations = majors.flatMap(({ specializations }) => specializations ?? []);
  const excluded = new Set(specializations.map(({ name }) => name));
  const filteredReqs = collegeReqs.filter(({ name }) => !excluded.has(name));
  return [...filteredReqs, ...specializations];
}
