# Computer Science (major)

- Catalog: https://catalog.cornell.edu/programs/computer-science-bs/ (2026-2027 edition)
- Data file: `src/data/majors/cs.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CS major file broadly follows the 2026-2027 catalog: the core, two 4000+ CS electives, technical electives, external specialization and the major-approved elective are all present. Several differences remain. The most serious is the practicum/project list, which rejects five courses the catalog now accepts (CS 5121, CS 5321, CS 5411, CS 5621, CS 5740) and still accepts retired or dropped courses. The major-approved elective does not block AP/IB credit, which the catalog forbids. Other gaps: CS 4997 is not excluded from CS electives, the technical electives ignore the one-2000-level allowance and the CS 4090/4997/4998 exclusions, the 3-credit minimum per elective is never checked, the external specialization's limit on CS cross-listed courses is not mentioned, and there is no CS-specific MATH 2940 requirement.

## Findings

### 1. CS Practicum or Project (high, course-list)

- **Catalog:** Select one of: CS 3152, CS 4121, CS 4152, CS 4321, CS 4411, CS 4621, CS 4701, CS 4740, CS 5121, CS 5150, CS 5152, CS 5321, CS 5411, CS 5412, CS 5414, CS 5621, CS 5625, CS 5643, CS 5740.
- **CoursePlan:** Accepts 'CS 4\*\*1', CS 3152, CS 4152, CS 4154, CS 4740, CS 4752, CS 5150, CS 5152, CS 5412, CS 5414, CS 5431, CS 5625, CS 5643. CS 5121, CS 5321, CS 5411, CS 5621 and CS 5740 are not accepted; all five were offered in SP26 or FA26 and none is cross-listed.
- **Suggested change:** Add CS 5121, CS 5321, CS 5411, CS 5621 and CS 5740 to the checker and to the description.

### 2. Major-approved Elective(s) (high, rule)

- **Catalog:** [fn4] No AP/IB credits are allowed for this requirement.
- **CoursePlan:** `disallowTransferCredit` is not set, so AP/IB credit can fill the 3 credits.
- **Suggested change:** Add `disallowTransferCredit: true` and mention the AP/IB exclusion in the description.

### 3. CS Practicum or Project (medium, course-list)

- **Catalog:** CS 4154 and CS 5431 are not on the practicum/project list.
- **CoursePlan:** Accepts CS 4154 (last offered FA18) and CS 5431 (last offered SP19), so students can still add them. Also accepts CS 4752 (not in the roster data). The 'CS 4\*\*1' wildcard admits any CS 4xx1 course, not only the five 4xx1 practicums the catalog lists (CS 4121, CS 4321, CS 4411, CS 4621, CS 4701).
- **Suggested change:** Remove CS 4154, CS 4752 and CS 5431. Replace 'CS 4\*\*1' with the explicit codes CS 4121, CS 4321, CS 4411, CS 4621 and CS 4701, and update the description to match.

### 4. CS Electives (medium, course-list)

- **Catalog:** [fn1] CS 4090, CS 4997, CS 4998, CS 4999 are not allowed.
- **CoursePlan:** The checker excludes CS 4090, CS 4998 and CS 4999 but not CS 4997 (offered FA26), so CS 4997 counts as a CS elective. The description also omits CS 4997.
- **Suggested change:** Add 'CS 4997' to the exclusion list and to the description.

### 5. CS Electives / Technical Electives / External Specialization (medium, count-or-credits)

- **Catalog:** All electives must be courses of at least 3 credits (CS electives 2 courses = 6 cr; technical electives three 3-credit courses; external specialization three 3-credit courses). The only exception is the project course, which needs at least 2 credits.
- **CoursePlan:** None of these checkers tests credits, even though the descriptions say '3 credits'. For example, a 2-credit CS 4xx1 practicum would be accepted as a CS elective or a technical elective.
- **Suggested change:** Add `courseMeetsCreditMinimum(course, 3)` to the CS Electives, Technical Electives and External Specialization checkers, or state the 3-credit minimum in a checkerWarning.

### 6. Technical Electives (medium, rule)

- **Catalog:** [fn2] One 2000+ level course is allowed. CS 4090, CS 4997 and CS 4998 are not allowed. Up to two research courses may count (letter grade, at least 3 credits).
- **CoursePlan:** The checker rejects every 2000-level course, so a qualifying 2000-level course cannot count. It accepts CS 4090, CS 4997 and CS 4998. The research-course limit is not mentioned.
- **Suggested change:** Let one 2000-level course count (or explain it in a checkerWarning), exclude CS 4090, CS 4997 and CS 4998, and note the two-research-course limit and the qualifying-prerequisite rule in the warning and description.

### 7. External Specialization (medium, rule)

- **Catalog:** [fn3] Courses must share a departmental prefix or a common topic approved by a CS advisor. At most 1 course cross-listed with CS may be used. Research, independent study, project team, PE and teaching credits are not accepted.
- **CoursePlan:** The checker rejects only courses whose subject is CS. A non-CS listing of a CS cross-listed course (e.g. INFO 3300) is accepted with no limit. The one-course cap and the research/independent study/project team/teaching exclusions are neither enforced nor mentioned. The description says 'Frequently, the three courses are from the same department.'
- **Suggested change:** Mention the one-CS-cross-listed-course cap and the excluded course types in the checkerWarning, and reword the description to match the catalog's prefix-or-approved-topic rule.

### 8. Math (MATH 2940) (medium, missing-requirement)

- **Catalog:** The CS major's Math requirement is MATH 1910, MATH 1920 and MATH 2940 (Course Three: MATH 2940 Linear Algebra for Engineers). The Engineering common curriculum accepts MATH 2930 or MATH 2940 depending on the major.
- **CoursePlan:** The CS file has no math requirement. A student who takes MATH 2930 instead of MATH 2940 is not flagged at the major level.
- **Suggested change:** Add a CS major requirement (or specialization of the college math requirement) for MATH 2940, unless the Engineering college file already enforces MATH 2940 for CS majors.

### 9. Major-approved Elective(s) (low, rule)

- **Catalog:** ROTC courses under the 3000 level do not count toward CS degree requirements, including Major and Advisor Approved Electives.
- **CoursePlan:** The checker excludes only PE and 10xx courses. Sub-3000 ROTC courses are accepted; the description mentions the rule and a TODO notes the gap, but there is no checkerWarning.
- **Suggested change:** Exclude ROTC subjects below 3000 in the checker, or add a checkerWarning.

### 10. Introductory Programming (low, description)

- **Catalog:** CS 1110 or CS 1112 (or AP/IB/CASE credit), then CS 2110 or CS 2112.
- **CoursePlan:** The description and checker also list CS 1114 and CS 1115. Neither is in the roster data, so this changes nothing in practice.
- **Suggested change:** Remove CS 1114 and CS 1115 from the description and checker.

### 11. Computer Science Core (low, description)

- **Catalog:** CS 4410 or CS 4414.
- **CoursePlan:** The description says 'CS 4410', but the checker and slot name accept CS 4410 or CS 4414.
- **Suggested change:** Change the description to 'CS 4410 or CS 4414'.

## Could not verify

- Whether the Engineering college requirements file already enforces MATH 2940 (rather than MATH 2930 or MATH 2940) for CS majors; that file is not included.
- Whether AP CS, IB CS and CS CASE exam credit is mapped to CS 111x so that it satisfies the 'CS 111x' slot of Introductory Programming.
- Which CS 4xx1 courses besides the listed practicums exist in the roster and would be admitted by the 'CS 4\*\*1' wildcard.
- Whether CS 4410 or CS 4414 may count as a CS elective when the other one is used in the core; the file hard-excludes CS 4410 (and CS 4820) but not CS 4414, and the catalog is silent.
- Whether the 'Probability' requirement and the three-elective, five-course-core rules for entryYear ≤ 2023 match the catalogs for those years; only the 2026-2027 catalog is provided.
- Qualifying-prerequisite status of individual technical electives, and whether a research course meets the letter-grade and 3-credit conditions; both depend on per-course catalog listings and grading not shown here.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
