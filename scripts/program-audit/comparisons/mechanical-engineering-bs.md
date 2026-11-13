# Mechanical Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/mechanical-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/me.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ME data file is out of date in most major-specific lists. ENGRD 2210 is missing from the required courses, and the Probability and Statistics requirement is missing entirely. The major-approved elective, senior design and math elective lists all accept courses the 2026-2027 catalog does not list, and all omit currently offered courses the catalog does list. The technical elective does not enforce the 3-credit minimum and does not include the 1000-level biology courses the catalog accepts. Only the Required Major Courses list and the ENGRD 2020 requirement match the catalog.

## Findings

### 1. Required Major Courses (high, missing-requirement)

- **Catalog:** ENGRD 2210 (also MAE 2210) Thermodynamics is required for the major. It is listed first in the Required Major Courses table.
- **CoursePlan:** Required Major Courses has 9 slots (MAE 2250, MAE 2030, MAE 3230, MAE 3240, MAE 3260, MAE 3270, MAE 3780/ENGRD 2100/PHYS 3360, MAE 4272, MAE 4300). No requirement in the file needs ENGRD 2210.
- **Suggested change:** Add an ['ENGRD 2210'] slot to Required Major Courses, or make it a separate requirement with allowCourseDoubleCounting so it can also count as a college ENGRD distribution. Update the description and slotNames to match.

### 2. Probability and Statistics Requirement (high, missing-requirement)

- **Catalog:** Students must take 1 course from ENGRD 2700, ENGRD 2720, CEE 3040, ECE 3100, ECON 3110 or CS 2800. That course may also count as the math elective, the technical elective or an advisor-approved elective. AP Statistics with a score of 4 or 5 also satisfies it.
- **CoursePlan:** The file has no probability and statistics requirement.
- **Suggested change:** Add a 1-course requirement that accepts ENGRD 2700, ENGRD 2720, CEE 3040, ECE 3100, ECON 3110 and CS 2800, with allowCourseDoubleCounting: true. Mention the AP Statistics option in the description.

### 3. M.E. Major Electives (high, course-list)

- **Catalog:** The approved areas list MAE 4070, MAE 4440, MAE 4540, MAE 4480 (BME 4490), MAE 3200, MAE 4240 (MSE 4510), MAE 4450, MAE 4670, MAE 4080, MAE 4100, MAE 4110, MAE 4190 (ECE 4160), MAE 4220, MAE 4341, MAE 4351, MAE 4630, MAE 4810 (CEE 4810/ECE 4240), MAE 5350 (SYSEN 5350), MAE 4360, MAE 5310 and MAE 4870 (MAE 3870). MAE 3780 is also listed, for students who did not use it as the required course.
- **CoursePlan:** The checker accepts none of these courses or their cross-listings.
- **Suggested change:** Add all of these codes to the checker. MAE 3780 can be added because the no-double-counting rule already stops a MAE 3780 used in Required Major Courses from counting again.

### 4. M.E. Major Electives (high, course-list)

- **Catalog:** MAE 5770 is not in any major-approved elective area.
- **CoursePlan:** The checker accepts MAE 5770, which was offered SP26.
- **Suggested change:** Remove MAE 5770.

### 5. Design Requirement (high, course-list)

- **Catalog:** The 4-credit senior design electives are MAE 4021, 4131, 4161, 4221, 4231, 4341, 4351, 4441, 4631, 4641, 4671, 4861 and 4871, or a 3+ credit section of MAE 4291.
- **CoursePlan:** The checker does not accept MAE 4221, MAE 4351, MAE 4441, MAE 4631, MAE 4671 or MAE 4871.
- **Suggested change:** Add MAE 4221, MAE 4351, MAE 4441, MAE 4631, MAE 4671 and MAE 4871.

### 6. Mathematics Elective (high, course-list)

- **Catalog:** The approved math electives are ENGRD 2700, CEE 3040, ENGRD 2720, ENGRD 3200, CS 2800, ECON 3110 and ECE 3100.
- **CoursePlan:** The checker does not accept ENGRD 2720 (ECE 2720) or ECON 3110 (ILRST 3110/STSCI 3110).
- **Suggested change:** Add 'ENGRD 2720' and 'ECON 3110'.

### 7. Mathematics Elective (high, course-list)

- **Catalog:** BTRY 3010/STSCI 2200 and CS 4750/MAE 4760/ECE 4770 are not approved math electives. MAE 4760 is a major-approved elective.
- **CoursePlan:** The checker accepts 'BTRY 3010' (STSCI 2200, offered FA25) and 'CS 4750' (same course as MAE 4760 and ECE 4770, offered FA26). It also accepts 'MAE 3100', which is not in the roster.
- **Suggested change:** Remove 'BTRY 3010', 'CS 4750' and 'MAE 3100'. Use 'ECE 3100' or keep 'ENGRD 3100', since they are cross-listed.

### 8. M.E. Major Electives (medium, course-list)

- **Catalog:** MAE 4120, MAE 5130, MAE 4340, MAE 4710, MAE 5120, MAE 5200 and MAE 4250 are not on the current major-approved elective list.
- **CoursePlan:** The checker accepts all of them, along with their cross-listings EAS 4120, MSE 5120 and CEE 6725. These were last offered between SP18 and FA22.
- **Suggested change:** Remove these codes, or keep them only through an entry-year migration for older cohorts.

### 9. Design Requirement (medium, course-list)

- **Catalog:** MAE 4121, MAE 4141, MAE 4651 and MAE 4701 are not senior design electives.
- **CoursePlan:** The checker and the description include MAE 4121 (last offered SP20), MAE 4141 (not in the roster), MAE 4651 (SP20) and MAE 4701 (FA22).
- **Suggested change:** Remove these codes from the checker and the description. Use a migration if older cohorts need them.

### 10. Design Requirement (medium, rule)

- **Catalog:** MAE 4291 counts only when taken for 3 or more credits.
- **CoursePlan:** Any MAE 4291 enrollment counts, whatever its credits. perSlotMinCount is [1] course and there is no credit check or warning.
- **Suggested change:** Add a checkerWarning saying MAE 4291 must be taken for at least 3 credits, or handle MAE 4291 in a credit-based slot.

### 11. Technical Elective (medium, rule)

- **Catalog:** The course must be at least three credits. ENGRG 3400 counts only when taken for 3 credits.
- **CoursePlan:** The checker accepts any course not numbered 1\*\*\*, with no credit minimum. The checkerWarning only says technical content is not checked.
- **Suggested change:** Add courseMeetsCreditMinimum(course, 3) to the checker, and mention the 3-credit minimum and letter-grade rule in the checkerWarning.

### 12. Technical Elective (medium, course-list)

- **Catalog:** These 1000-level biology courses are accepted: BIOG 1440, BIOG 1445, BIOMG 1350, BIOEE 1610 and BIOSM 1610.
- **CoursePlan:** The checker rejects every 1\*\*\* course, so these five are rejected.
- **Suggested change:** Accept these five codes as an exception to the 1\*\*\* exclusion.

### 13. Technical Elective (medium, rule)

- **Catalog:** MAE 4980 and MAE 4610 may not be used as M.E. major program electives. AP biology cannot be used for the technical elective. BSOC, economics, business and organizational behavior courses are not accepted.
- **CoursePlan:** The checker accepts MAE 4980 and MAE 4610 (ENGRG 4610/ORIE 4152), has no disallowTransferCredit, and does not exclude BSOC or ECON courses.
- **Suggested change:** Explicitly reject MAE 4980, MAE 4610 and BSOC/ECON subjects, and set disallowTransferCredit or warn about AP biology. Also exclude MAE 4980 and MAE 4610 from the other ME elective checkers if they are ever added there.

### 14. M.E. Major Electives (low, count-or-credits)

- **Catalog:** Any three upper-level major-approved electives totaling at least 9 credits.
- **CoursePlan:** fulfilledBy 'credits' with perSlotMinCount [9]. The three-course count is not enforced.
- **Suggested change:** Note the three-course rule in the description, or add a course-count additional requirement. In practice nearly every listed course is 3–4 credits, so 9 credits already needs three courses.

### 15. M.E. Major Electives (low, description)

- **Catalog:** The approved electives are listed in the catalog by area. MAE 4900, ENGRG 3400, MAE 4980 and MAE 4610 may not be used.
- **CoursePlan:** 'A list of approved Major-approved Electives is available online at www.mae.cornell.edu'
- **Suggested change:** Update the description to state the 3-course/9-credit rule, point to the catalog list, and name the exclusions.

### 16. Mathematics Elective (low, description)

- **Catalog:** The approved courses are listed in the catalog.
- **CoursePlan:** The description points students to www.mae.cornell.edu for the list.
- **Suggested change:** List the 7 approved courses in the description.

### 17. Engineering Distriubtions (low, description)

- **Catalog:** Students in the major must take ENGRD 2020 (also MAE 2020) as an engineering distribution course.
- **CoursePlan:** The requirement name is misspelled 'Engineering Distriubtions' and the description only reads 'ENGRD 2020'.
- **Suggested change:** Rename it (e.g. 'ENGRD 2020 Statics and Mechanics of Solids') and fix the spelling.

### 18. All requirements (source) (low, other)

- **Catalog:** The current catalog is https://catalog.cornell.edu/programs/mechanical-engineering-bs/ (2026-2027 edition).
- **CoursePlan:** Every source URL points to courses.cornell.edu catoid=41.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Advisor-Approved Electives (≥6 credits), Courses outside the major (≥9 credits) and Major-required courses (≥30 credits) are not in this file. They may be encoded in the Engineering college requirements file, which was not provided.
- Whether a course used for the college ENGRD distribution (e.g. ENGRD 2700 or ENGRD 2720) may also count toward the new Probability and Statistics requirement. The catalog only names MathE, TechE and AAE as allowed overlaps.
- The AP Statistics (4 or 5) option for the Probability and Statistics requirement depends on how CoursePlan represents AP exam credit, which the inputs do not show.
- MAE 5350 has no title in the parsed catalog table, so its inclusion as a major-approved elective could not be confirmed beyond the course code.
- Whether a course used toward a minor, or 2000+ liberal studies courses, may count as advisor-approved electives under the 'automatically approved' rule. This depends on other files and on advisor approval.
- The technical elective's 'appropriate level' and letter-grade-only rules depend on advisor judgment and grade data the checker cannot see.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
