# Operations Research and Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/operations-research-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/orie.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ORIE data file covers the required ORIE core courses correctly. It is out of date against the 2026-2027 catalog in several ways. The new 'Focused Elective Courses in Data, Decisions, and AI' block is missing. So are the major-specific math requirements (MATH 2940 plus one of MATH 2930/CS 2800/MATH 3040). ENGRD/CS 2110 is treated as only 'recommended' when the catalog requires it. The ORIE Electives checker ignores the catalog's exclusions, its inclusions (ORIE 3320, ORIE 3741, CS 4999) and its credit caps. The Major Approved Electives entry does not reflect the Category A, outside-ORIE or research-cap rules, and its name contradicts its checker.

## Findings

### 1. Focused Elective Courses in Data, Decisions, and AI (high, missing-requirement)

- **Catalog:** Select three of ORIE 3320, ORIE 3741, ORIE 4570, ORIE 4740, ORIE 4750. Also take CS 3700, at least one AI Minor elective that is an ORIE course or has CS 2800 as a prerequisite, and CS 1340. These courses are recommended to also be used as ORIE Electives, Major Approved Electives and Liberal Studies.
- **CoursePlan:** No such requirement exists in the file.
- **Suggested change:** Add a requirement for this block: a 'select three' slot for ORIE 3320/3741/4570/4740/4750 and slots for CS 3700 and CS 1340. Make the AI Minor elective a self-check slot or give it a checkerWarning. Set allowCourseDoubleCounting so these courses can also count toward ORIE Electives, Major Approved Electives or Liberal Studies, as the catalog recommends.

### 2. Mathematics (major-specific) (high, missing-requirement)

- **Catalog:** MATH 2940 is required, plus one of MATH 2930, CS 2800 or MATH 3040.
- **CoursePlan:** The major file has no math requirement. MATH 2940 and the MATH 2930/CS 2800/MATH 3040 choice are not encoded.
- **Suggested change:** Add a major requirement (or a specialization of the college math requirement) with a MATH 2940 slot and a slot accepting MATH 2930, CS 2800 or MATH 3040.

### 3. Engineering Distribution: ENGRD/CS 2110 (high, missing-requirement)

- **Catalog:** Both ENGRD 2700 and ENGRD/CS 2110 are required major courses.
- **CoursePlan:** The checker includes only ENGRD 2700. The description says ENGRD 2110 'is recommended as the second Engineering Distribution course'.
- **Suggested change:** Add a second slot accepting ENGRD 2110 (cross-listed with CS 2110). Update the description to say both courses are required.

### 4. ORIE Electives (medium, course-list)

- **Catalog:** The following do not count: ORIE 4152, ORIE 5142, ORIE 5920 and ORIE 9000. ORIE 3320 and ORIE 3741 may be used. CS 4999 may count, within the research cap. Courses listed as Required Major Courses (e.g. ORIE 4580) do not count.
- **CoursePlan:** The checker accepts any ORIE course at 4000+, including ORIE 4152, 5142, 5920, 9000 and the required ORIE 4580. It rejects ORIE 3320 and CS 4999, and rejects ORIE 3741 under its own code.
- **Suggested change:** Exclude ORIE 4152, ORIE 5142, ORIE 5920, ORIE 9000 and ORIE 4580 (and the other required ORIE courses). Explicitly accept ORIE 3320, ORIE 3741 and CS 4999.

### 5. ORIE Electives credit caps (medium, rule)

- **Catalog:** At most 3 credits of ORIE 4990 count. At most 3 credits in total count from ORIE 4900, ORIE 4999 and CS 4999.
- **CoursePlan:** No caps are enforced or mentioned.
- **Suggested change:** Add a checkerWarning or description noting the 3-credit caps on ORIE 4990 and on ORIE 4900/4999/CS 4999 combined.

### 6. Major Approved Electives (Non–ORIE) (medium, rule)

- **Catalog:** 12 credits from the approved list. At least 6 credits must be from Category A and at least 6 from outside ORIE. At most 3 credits in total from research, team projects and CAships.
- **CoursePlan:** Any course numbered 2000+ counts toward 12 credits. The checkerWarning only says technical status is not checked. The Category A minimum and the research/project/CAship cap are not mentioned. The name says 'Non–ORIE' but ORIE courses are accepted.
- **Suggested change:** Rename to 'Major Approved Electives'. Extend the description or checkerWarning to state the Category A minimum of 6 credits, the outside-ORIE minimum of 6 credits and the 3-credit research/project/CAship cap. Note that courses must come from the approved list.

### 7. Major Required Classes – ORIE 3150 replacement slot (low, course-list)

- **Catalog:** Any ORIE course at the 6000 level or higher can replace ORIE 3150.
- **CoursePlan:** Only 'ORIE 6\*\*\*' is accepted, so 7000+ ORIE courses are rejected.
- **Suggested change:** Add 'ORIE 7**_', 'ORIE 8_**' and 'ORIE 9\*\*\*', or use a numeric-level check.

### 8. ORIE Electives description (low, description)

- **Catalog:** 9 credits of ORIE courses at the 4000 level or higher that are not Required Major Courses, with listed exclusions and inclusions.
- **CoursePlan:** 'At least 9 credits of ORIE electives at the 4000 level or above' with no exclusions mentioned.
- **Suggested change:** Mention the excluded courses, the allowed ORIE 3320/ORIE 3741 and the credit caps.

## Could not verify

- Whether the Engineering college requirements file encodes the ORE-specific fourth physics alternatives: CHEM 2080 & CHEM 2081, CHEM 2150, MATH 2930/CS 2800/MATH 3040 if not used for math, MATH 3110 and MATH 3360 in place of PHYS 2214.
- Whether the 6-credit Advisor Approved Electives, Computing (CS 1110/CS 1112), Chemistry (CHEM 2090 & CHEM 2091 or CHEM 2150), ENGRI and Engineering Communications requirements are handled in the college file, which was not provided.
- The contents of the approved Major Approved Electives list and its Category A/B membership, which are published on a department page not included.
- Which courses are AI Minor electives that are ORIE courses or have CS 2800 as a prerequisite.
- Whether the cross-listing match lets ORIE 3741 (same course as ORIE 4741) pass the custom subject/catalogNbr checker in ORIE Electives.
- ORIE 4750 is not in the roster data, so students cannot currently add it for the focused-elective requirement.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
