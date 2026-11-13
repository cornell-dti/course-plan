# Government (major)

- Catalog: https://catalog.cornell.edu/programs/government-ba/ (2026-2027 edition)
- Data file: `src/data/majors/govt.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Government major file is out of date with the 2026-2027 catalog. The catalog requires one course in 3 of the 4 subfields (AM, CP, PT, IR), and the file has no such requirement. The file encodes 28 credits at the 2000+ level plus a separate 3-credit 'Tenth Government Course', which the catalog no longer describes; the catalog asks for 30 additional GOVT credits with at most one 1000-level course. The seminar requirement accepts any GOVT course numbered 4000 or above instead of the published GOVT-SEM list. The rule allowing GOVT 1615 or GOVT 1616 but not both is not enforced. The intro requirement's five accepted courses (GOVT 1111, 1313, 1615, 1616, 1817) and its count of two match the catalog.

## Findings

### 1. Subfield distribution (GOVT-AM / GOVT-CP / GOVT-PT / GOVT-IR) (high, missing-requirement)

- **Catalog:** The additional 30 credits must include at least 1 course in 3 of the 4 subfields: American Government (GOVT-AM), Comparative Politics (GOVT-CP), Political Theory (GOVT-PT) and International Relations (GOVT-IR), each with a published course list.
- **CoursePlan:** No requirement checks subfield coverage. A student whose upper-level GOVT courses fall in one or two subfields is shown as complete.
- **Suggested change:** Add a requirement with four slots (AM, CP, PT, IR), each slot's checker built from the catalog subfield list, with minNumberOfSlots: 3. Set allowCourseDoubleCounting so these courses can also count toward the 30 credits.

### 2. Government Coursework / Tenth Government Course (medium, count-or-credits)

- **Catalog:** Accumulate an additional 30 credits of GOVT coursework. Only one 1000-level course may count toward these credits, and First-Year Writing Seminars cannot be used. The catalog has no separate 'tenth course' or 3-credit minimum rule.
- **CoursePlan:** 'Government Coursework' requires 28 credits of GOVT courses not at the 1000 level. A separate 'Tenth Government Course' requires 3 more credits from any GOVT course ('GOVT \*\*\*\*'), and the two cannot share courses. This effectively demands at least 31 credits. For example, 30 credits made of six 4-credit and two 3-credit 2000+ courses fails in CoursePlan but satisfies the catalog. The tenth-course credits can also be met by more than one 1000-level course.
- **Suggested change:** Replace both requirements with a single 30-credit GOVT requirement. Accept 2000-level and above, plus at most one 1000-level course (enforce by checker or a checkerWarning), and exclude FWS. Update the description to say 30 credits.

### 3. Introductory Government Courses (medium, rule)

- **Catalog:** Students may receive major credit for either GOVT 1615 or GOVT 1616, not both.
- **CoursePlan:** The checker accepts both 'GOVT 1615' and 'GOVT 1616', so a student taking both is shown as having completed the two introductory courses. The 'Tenth Government Course' checker 'GOVT \*\*\*\*' would also let the second of the pair count.
- **Suggested change:** Treat GOVT 1615 and GOVT 1616 as one alternative, for example with separate slots or a checkerWarning stating only one may count. Exclude the second of the pair from the additional-credit requirement.

### 4. Government Seminar (medium, course-list)

- **Catalog:** One course from the GOVT-SEM list: GOVT 4000, GOVT 4011, GOVT 4021, GOVT 4037, GOVT 4194, GOVT 4503, GOVT 4827, GOVT 4949, GOVT 4959 (and their cross-listings).
- **CoursePlan:** Accepts any GOVT course not at the 1000, 2000 or 3000 level. That includes non-seminar 4000-level courses and all 5000-7000-level graduate courses (e.g. GOVT 6019, GOVT 7073). Only a checkerWarning says seminar style is not checked.
- **Suggested change:** Use includesWithSingleRequirement with the explicit GOVT-SEM course list and remove the checkerWarning.

### 5. Tenth Government Course (medium, rule)

- **Catalog:** First-Year Writing Seminars cannot be used towards the major.
- **CoursePlan:** The description says FWS cannot be used, but the checker 'GOVT \*\*\*\*' accepts any GOVT course, including any GOVT-subject FWS.
- **Suggested change:** Exclude FWS courses (e.g. using courseIsFWS) in any checker that accepts 1000-level GOVT courses.

### 6. Government Seminar (low, description)

- **Catalog:** The seminar is chosen from the GOVT-SEM list and counts within the additional 30 credits.
- **CoursePlan:** Description says 'seminar-style course at the 4000 level ... which can be applied toward the 28-credit requirement above'.
- **Suggested change:** Reword to reference the GOVT-SEM list and the 30-credit requirement.

### 7. Major-wide grading rule (low, rule)

- **Catalog:** All courses used for the major must be passed with a C- or above. S-U courses cannot be used. No more than half the total credits can be taken outside Cornell.
- **CoursePlan:** No requirement description or checkerWarning mentions these rules.
- **Suggested change:** Add a note (e.g. a checkerWarning or description text) stating the C- minimum, the no S-U rule and the outside-Cornell credit limit.

### 8. All requirements (source URL) (low, other)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/government-ba/.
- **CoursePlan:** Source is https://courses.cornell.edu/preview_program.php?catoid=41&poid=19897, an older catalog edition.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether the two introductory courses may also count toward the 3-of-4 subfield requirement. The catalog lists GOVT 1111, 1313, 1615/1616 and 1817 in the subfield lists, but places the subfield rule under the additional 30 credits.
- Whether CoursePlan's automatic cross-listing matching lets a course taken under a non-GOVT code (e.g. AMST 2669, ASIAN 4448) satisfy the subject-based function checkers. The catalog requires the GOVT subject code.
- Whether any GOVT-subject First-Year Writing Seminars exist in the roster. This determines whether the 'GOVT \*\*\*\*' checker actually admits FWS courses.
- How the parsed course-list table's boundaries map to each subfield. The lists are concatenated; the order is assumed to follow the prose (AM, CP, IR, PT, SEM).

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
