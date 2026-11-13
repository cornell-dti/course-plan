# Economics (major)

- Catalog: https://catalog.cornell.edu/programs/economics-ba/ (2026-2027 edition)
- Data file: `src/data/majors/econ.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

Core courses and the 12-course total match the catalog. Several problems remain. The 4000-level and 12-course checkers accept ECON 4997, ECON 4998 and ECON 4999, which the catalog excludes from the twelve courses. The 4000-level checker also counts every graduate ECON course. The 12-course checker accepts every 5000- and 6000-level ECON course, even though the catalog limits graduate courses to a department list. Neither checker accepts the one ECON 2400–2999 course the catalog allows. Finally, an 'Admission to the Major' requirement adds MATH 1110, which the catalog does not mention.

## Findings

### 1. 4000-level Courses (high, rule)

- **Catalog:** At least 3 ECON courses at the 4000-level. ECON 4999 Independent Study in Economics, ECON 4997 Cross-Cultural Work Experiences, and ECON 4998 Cross-Cultural Work Experiences all do not count toward the twelve-course requirement.
- **CoursePlan:** The checker accepts any ECON course whose number does not start with 1, 2 or 3, so ECON 4997, ECON 4998 and ECON 4999 all count toward the three 4000-level courses.
- **Suggested change:** Exclude ECON 4997, ECON 4998 and ECON 4999 from the 4000-level checker.

### 2. Basic Requirements (high, rule)

- **Catalog:** ECON 4999, ECON 4997, and ECON 4998 all do not count toward the twelve-course requirement.
- **CoursePlan:** The checker includes 'ECON 4\*\*\*', so ECON 4997, ECON 4998 and ECON 4999 count toward the 12 courses.
- **Suggested change:** Exclude ECON 4997, ECON 4998 and ECON 4999 from the Basic Requirements checker.

### 3. 4000-level Courses (medium, course-list)

- **Catalog:** At least 3 ECON courses at the 4000-level. Graduate ECON courses from the department's acceptable list fall only under 'Remaining ECON courses'.
- **CoursePlan:** The checker accepts all ECON courses numbered 4000 and above, including any 5000-, 6000- or 7000-level graduate course. The description says '4000-level or higher'.
- **Suggested change:** Restrict the checker to 'ECON 4\*\*\*' (minus the excluded 4997/4998/4999). Change the description to '4000-level'.

### 4. Basic Requirements (medium, course-list)

- **Catalog:** Up to 1 ECON course numbered 2400-2999 may count toward the 12 courses.
- **CoursePlan:** The checker accepts only ECON 1110, ECON 1120, ECON 3**_, ECON 4_**, ECON 5**_ and ECON 6_**. No 2000-level ECON course can count.
- **Suggested change:** Allow at most one ECON course numbered 2400–2999 toward the 12. Add a slot or checker for it, or a checkerWarning about the one-course cap.

### 5. Basic Requirements (medium, course-list)

- **Catalog:** Remaining courses may come from among the list of acceptable graduate ECON courses maintained on the Economics Department website.
- **CoursePlan:** The checker accepts every ECON 5**_ and ECON 6_** course without restriction.
- **Suggested change:** Limit the graduate courses to the department's approved list, or add a checkerWarning telling students to confirm a graduate course is on that list.

### 6. Admission to the Major (medium, extra-requirement)

- **Catalog:** The catalog lists ECON 1110 and ECON 1120 as Introductory Courses within the major. It gives no admission prerequisites and does not mention MATH 1110.
- **CoursePlan:** A separate requirement asks for ECON 1110, ECON 1120 and MATH 1110 as admission prerequisites.
- **Suggested change:** Remove the MATH 1110 slot, or confirm it against current department policy. Consider renaming the requirement 'Introductory Courses' to match the catalog.

### 7. Basic Requirements (low, description)

- **Catalog:** Complete 12 courses listed by the Department of Economics, all with grades of C– or better (S–U not allowed). Introductory courses count only with B- or better.
- **CoursePlan:** Description: "Twelve courses listed by the Department of Economics, or approved by the student's major advisor". It gives no grade rule and mentions advisor approval, which the catalog does not.
- **Suggested change:** Update the description to the catalog wording. Mention the C– minimum, no S–U, and the B- minimum for ECON 1110/1120. Note that ECON 4997/4998/4999 are excluded.

### 8. Core Economics (low, description)

- **Catalog:** The 4 required core courses must be taken at Cornell.
- **CoursePlan:** Neither the description nor a checkerWarning says the core courses must be taken at Cornell.
- **Suggested change:** Add a note or checkerWarning that the core courses must be taken at Cornell.

## Could not verify

- Whether the Economics Department website still lists MATH 1110 (or equivalents) as an admission prerequisite. The catalog does not mention it.
- Which graduate ECON courses are on the department's list of acceptable courses.
- How AP/IB/A-Level credit is mapped to ECON 1110/ECON 1120 elsewhere in CoursePlan. The catalog requires both a qualifying score and a passing department placement exam, except for students who matriculated before May 1, 2026.
- The transfer-student rule that at least 6 of the 12 courses be taken at Cornell cannot be checked from these inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
