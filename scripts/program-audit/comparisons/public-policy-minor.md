# Public Policy (minor)

- Catalog: https://catalog.cornell.edu/programs/public-policy-minor/ (2026-2027 edition)
- Data file: `src/data/minors/policy.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file is out of date. The gateway requirement accepts only GOVT 3032 and omits GOVT 3583. The methods requirement still uses an old list: it accepts GOVT 3990, which the catalog does not list, and omits GOVT 3282 and GOVT 2309. The elective checker accepts any course. Neither it nor its description reflects the rule that at least four of the five courses must be in Government, with at most one outside course allowed with advisor approval.

## Findings

### 1. Gateway Course (high, course-list)

- **Catalog:** Students must complete at least one gateway course: GOVT 3032 Politics of Public Policy in the U.S. or GOVT 3583 Comparative Public Policy: Political Pathways to Equality.
- **CoursePlan:** Checker is includesWithSingleRequirement('GOVT 3032') and the description reads 'GOVT 3032'. GOVT 3583 (cross-listed PAM 3583, PUBPOL 3583, last offered SP26) is not accepted.
- **Suggested change:** Change the checker to includesWithSingleRequirement('GOVT 3032', 'GOVT 3583') and the description to 'GOVT 3032 or GOVT 3583'.

### 2. Methods Course (high, course-list)

- **Catalog:** One methods course from GOVT 2309 Data Science for Political Science I, GOVT 3282 Data Science Applications in Political and Social Research, or GOVT 3999 How Do You Know That?
- **CoursePlan:** Checker accepts 'GOVT 3990' and 'GOVT 3999' only. GOVT 3282 (last offered SP24) is rejected.
- **Suggested change:** Add GOVT 3282 to the checker so a student who took it can satisfy the methods requirement without a manual override.

### 3. Methods Course (medium, course-list)

- **Catalog:** The methods list is GOVT 2309, GOVT 3282, and GOVT 3999. GOVT 3990 is not listed.
- **CoursePlan:** Checker and description accept 'GOVT 3990' (last offered SP20).
- **Suggested change:** Remove GOVT 3990 from the methods checker and description. If older cohorts may still use it, keep it only through a migration for earlier entry years.

### 4. 3 Electives (medium, rule)

- **Catalog:** At least four of the five courses must be taken within the Government Department. Students may count at most one public policy course from another department or school, subject to advisor approval.
- **CoursePlan:** Elective checker accepts any course except GOVT 3032/AMST 3033/GOVT 3990/GOVT 3999. The checkerWarning only says eligibility is not checked. Neither the description nor the warning mentions the four-of-five-in-Government rule or the one-outside-course limit, so three non-GOVT electives would show as complete.
- **Suggested change:** State in the description or checkerWarning that at least two of the three electives must be GOVT courses and that at most one may come from another department, with advisor approval. Alternatively, restrict the checker to GOVT courses and note the single outside-course exception.

### 5. 3 Electives (medium, course-list)

- **Catalog:** The gateway courses are GOVT 3032 and GOVT 3583. The methods courses are GOVT 2309, GOVT 3282, and GOVT 3999.
- **CoursePlan:** The elective exclusion list is ['GOVT 3032', 'AMST 3033', 'GOVT 3990', 'GOVT 3999']. It is based on the old gateway and methods lists: it excludes GOVT 3990 but not GOVT 3583, GOVT 3282, or GOVT 2309.
- **Suggested change:** Align the elective exclusion list with the updated gateway and methods lists, for example by adding GOVT 3583, GOVT 3282 and GOVT 2309 and dropping GOVT 3990, or decide whether extra gateway/methods courses may count as electives (see cannotVerify).

### 6. Methods Course (low, course-list)

- **Catalog:** GOVT 2309 is listed as a methods course.
- **CoursePlan:** GOVT 2309 is not accepted. The cross-listing table shows it is not in the roster data, so no student can currently add it.
- **Suggested change:** Add GOVT 2309 to the checker and description so it counts once it appears in the roster.

### 7. Methods Course (low, description)

- **Catalog:** Methods courses: GOVT 2309, GOVT 3282, GOVT 3999.
- **CoursePlan:** Description reads 'GOVT 3990 or GOVT 3999'.
- **Suggested change:** Update the description to 'GOVT 2309, GOVT 3282, or GOVT 3999'.

## Could not verify

- Whether a second gateway or methods course may count as one of the three electives. The catalog only says 'at least one' gateway and 'one methods course' plus 'three electives, from a list of eligible courses', and the eligible elective list is not in the inputs.
- Whether 'The gateway course must be taken in the Government Department' excludes students enrolled under the cross-listed codes AMST 3033, PUBPOL 3032, PAM 3583, or PUBPOL 3583. CoursePlan accepts cross-listed codes automatically.
- The rule that Government majors may count at most one course toward both the major and the minor spans programs, and its encoding cannot be checked from this file alone.
- The catalog's 15-credit minimum is not encoded. Whether five courses always reach 15 credits depends on the credit values of the elective courses, which are not shown.
- The list of eligible electives and the optional US domestic, foreign, and comparative policy pathways are published elsewhere and are not in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
