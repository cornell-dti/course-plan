import { includesWithSubRequirements } from './data/checkers-common';
import { CollegeOrMajorRequirement, Major } from './types';

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
  const allSpecializations = majors.flatMap(({ specializations }) => specializations ?? []);
  const excluded = new Set(allSpecializations.map(({ name }) => name));
  const filteredReqs = collegeReqs.filter(({ name }) => !excluded.has(name));
  return [...filteredReqs, ...allSpecializations];
}

/**
 * Here, we export an object containing common requirement specializations
 * (e.g. requiring that MATH 2940 must be taken for engineering)
 */
export default {
  EN: {
    MATH2940: {
      name: 'Mathematics',
      description: 'MATH 1910, 1920, 2940, and a mathematics course chosen by the Major.',
      source:
        'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
      checker: includesWithSubRequirements(['MATH 1910'], ['MATH 1920'], ['MATH 2940']),
      fulfilledBy: 'courses',
      perSlotMinCount: [1, 1, 1],
      slotNames: ['MATH 1910', 'MATH 1920', 'MATH 2940'],
    } as CollegeOrMajorRequirement,
  },
};
