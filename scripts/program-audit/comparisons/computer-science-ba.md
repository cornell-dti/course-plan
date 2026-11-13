# Computer Science (major)

- Catalog: https://catalog.cornell.edu/programs/computer-science-ba/ (2026-2027 edition)
- Data file: `src/data/majors/cs.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CS core and the two-course CS elective rule match the 2026-2027 catalog for current students. The file still disagrees with the catalog in several places. The A&S Math requirement (Calc I, Calc II, linear algebra) is missing entirely. The practicum checker rejects five courses the catalog lists (CS 5121, 5321, 5411, 5621, 5740) and accepts unlisted ones (CS 4154, CS 5431, any CS 4\*\*1). The CS Electives checker does not exclude CS 4997 or enforce the 3-credit minimum. The Technical Electives checker rejects the one allowed 2000-level course and does not exclude CS 4090/4997/4998. The Major-approved Elective accepts AP/IB credit and ROTC courses the catalog bars.

## Findings

### 1. Math Courses (high, missing-requirement)

- **Catalog:** Three math courses: MATH 1110 or MATH 1910 (or AP/CASE credit); MATH 1120 or MATH 1920 (or AP/CASE credit); and MATH 2210, MATH 2310, or MATH 2940.
- **CoursePlan:** No math requirement exists in cs.ts.
- **Suggested change:** Add a 'Math Courses' requirement with three slots: ['MATH 1110','MATH 1910'], ['MATH 1120','MATH 1920'], ['MATH 2210','MATH 2310','MATH 2940']. Allow AP/CASE equivalents for the first two slots, and set allowCourseDoubleCounting if it overlaps with college requirements.

### 2. CS Practicum or Project (high, course-list)

- **Catalog:** The list includes CS 5121, CS 5321, CS 5411, CS 5621 and CS 5740, alongside CS 3152, 4121, 4152, 4321, 4411, 4621, 4701, 4740, 5150, 5152, 5412, 5414, 5625 and 5643.
- **CoursePlan:** The checker has CS 4\*\*1, CS 3152, 4152, 4154, 4740, 4752, 5150, 5152, 5412, 5414, 5431, 5625 and 5643. CS 5121, 5321, 5411, 5621 and 5740 are rejected; CS 5740 is not cross-listed with CS 4740.
- **Suggested change:** Add CS 5121, CS 5321, CS 5411, CS 5621 and CS 5740 to the checker and the description.

### 3. CS Electives (high, rule)

- **Catalog:** CS 4090, CS 4997, CS 4998 and CS 4999 are not allowed, and major electives must be at least 3 credits each (6 cr total for two courses).
- **CoursePlan:** The checker excludes CS 4090, 4998, 4999, 4410 and 4820 but not CS 4997. It applies no credit minimum, so a 1- or 2-credit CS 4000+ course counts. The description also omits CS 4997.
- **Suggested change:** Add 'CS 4997' to the exclusion list and to the description. Enforce a minimum of 3 credits per course, for example with courseMeetsCreditMinimum(course, 3).

### 4. CS Practicum or Project (medium, course-list)

- **Catalog:** Only the listed practicum/project courses count. CS 4154 and CS 5431 are not listed, and only specific CS 4xx1 courses (4121, 4321, 4411, 4621, 4701) are listed.
- **CoursePlan:** The checker accepts CS 4154 (offered FA18) and CS 5431 (offered SP19). The wildcard 'CS 4\*\*1' accepts any CS 4000-level course ending in 1, whether or not it is a practicum. CS 4752 is also listed but is not in the roster data.
- **Suggested change:** Replace 'CS 4\*\*1' with the explicit list CS 4121, CS 4321, CS 4411, CS 4621, CS 4701. Remove CS 4154, CS 4752 and CS 5431, and update the description to match.

### 5. Technical Electives (medium, rule)

- **Catalog:** Three 3-credit 3000+ level courses with a qualifying prerequisite. One 2000+ level course is allowed. CS 4090, CS 4997 and CS 4998 are not allowed. Up to two research courses may count. Each course must be at least 3 credits.
- **CoursePlan:** The checker rejects every 1xxx and 2xxx course, so the allowed single 2000-level course cannot count. It accepts CS 4090, CS 4997 and CS 4998, and checks no credit minimum. The warning only says technical content is not checked.
- **Suggested change:** Exclude CS 4090, CS 4997 and CS 4998. Allow 2xxx courses with a warning that at most one may be used. Require at least 3 credits per course. Extend the checkerWarning to cover the qualifying-prerequisite rule and the two-research-course limit.

### 6. Major-approved Elective(s) (medium, rule)

- **Catalog:** No AP/IB credits are allowed. ROTC courses under the 3000-level do not count toward CS degree requirements.
- **CoursePlan:** disallowTransferCredit is not set, so AP/IB credit can fill the 3 credits. ROTC courses below 3000 are not excluded (the file has a TODO for this), even though the description says they are.
- **Suggested change:** Set disallowTransferCredit: true and exclude ROTC subjects below the 3000 level, or at least mention both rules in a checkerWarning.

### 7. External Specialization (low, rule)

- **Catalog:** Courses must be at least 3 credits and share a departmental prefix or an advisor-approved topic. At most 1 course cross-listed with CS may be used. Research, independent study, project team, PE and teaching credits are not accepted.
- **CoursePlan:** The checker only requires 3000+ level and a non-CS subject, with no credit minimum. The warning mentions only relatedness. The description says the courses are 'frequently from the same department' instead of stating the prefix/advisor-approved-topic rule.
- **Suggested change:** Enforce the 3-credit minimum. Expand the checkerWarning and description to cover the prefix/advisor-approved-topic rule, the one-CS-cross-listed limit, and the excluded course types.

### 8. Computer Science Core (low, description)

- **Catalog:** CS 4410 OR CS 4414.
- **CoursePlan:** The description says 'CS 4410' only, while the checker and slot name accept CS 4414.
- **Suggested change:** Change the description to 'CS 4410 or CS 4414'.

### 9. Introductory Programming (low, description)

- **Catalog:** CS 1110 or CS 1112 (or AP Computer Science A, IB Computer Science, or CS CASE exam credit); then CS 2110 or CS 2112.
- **CoursePlan:** The description and checker also list CS 1114 and CS 1115, which are not in the roster data.
- **Suggested change:** Remove CS 1114 and CS 1115 and mention the AP/IB/CASE alternatives.

## Could not verify

- Whether the Introductory Programming checker accepts AP Computer Science A, IB Computer Science, or CS CASE credit; this depends on CoursePlan's exam-equivalency data, which is not shown.
- Whether CS 4410 should be barred from CS Electives when CS 4414 is used for the core; the catalog does not say, but the file excludes CS 4410 unconditionally.
- Whether a practicum course may also count as a CS elective; the catalog is silent, and the file does not allow double counting between the two requirements.
- How cross-listing matching interacts with the External Specialization subject check. If cross-listed codes are evaluated, every course cross-listed with CS (e.g. INFO 3300 = CS 3300) may be rejected, although the catalog allows one.
- Whether the qualifying-prerequisite rule for Technical Electives is satisfied for any particular course; this depends on the course's catalog listing in the term it was taken.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
