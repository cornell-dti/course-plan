# Environmental Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/environmental-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/envE.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The envE.ts file is out of date with the 2026-2027 catalog. The biggest problems: it treats BEE 2220 and ENGRD 3200 as alternatives (and adds ENGRD 2210) when the catalog requires both courses. It requires CEE 4510, which the catalog no longer lists. It asks for two major-approved electives instead of three. It rejects catalog-listed BIOSM 1610, BIOSM 1780 and BEE 3710 while accepting EAS 4800 and CHEM 3530, which the catalog does not list. It also leaves out the capstone rule for design electives, has a malformed lab course code, carries an outdated ENGRD recommendation, and has no item for the EHS Lab Safety Training.

## Findings

### 1. Engineering Statistics (high, rule)

- **Catalog:** ENGRD 3200 (Engineering Computation) and BEE 2220 (Sustainable Engineering Thermodynamics) are each separately required under the major's Additional Requirements. ENGRD 2210 is not listed.
- **CoursePlan:** One course from 'BEE 2220', 'ENGRD 2210', 'ENGRD 3200' fulfils the requirement. Description: 'BEE 2220 or ENGRD 2210 or ENGRD 3200'.
- **Suggested change:** Replace this with required slots for BEE 2220 and ENGRD 3200 (e.g., add them to Core Courses). Remove ENGRD 2210 and drop the 'Engineering Statistics' name.

### 2. Core Courses (high, extra-requirement)

- **Catalog:** Required courses are ENGRD 3200, BEE 2220, CEE 3040, CEE 3310, CEE 3510, BEE 4750, plus CEE 3230 (Engineering Management). CEE 4510 is not required.
- **CoursePlan:** Six required slots: CEE 3040, CEE 3310, CEE 3510, CEE 4510, BEE 4750, CEE 3230.
- **Suggested change:** Remove the CEE 4510 slot, and update the description and slotNames to match.

### 3. Major Approved Electives (high, count-or-credits)

- **Catalog:** Three courses (9 credits) from the major-approved engineering electives or design course list.
- **CoursePlan:** perSlotMinCount [2]; description says 'Two courses'.
- **Suggested change:** Set perSlotMinCount to [3] and change the description to three courses (9 credits).

### 4. Biological Sciences (high, course-list)

- **Catalog:** Select one of BIOEE 1610, BIOEE 1780, BIOG 1440, BIOG 1445, BIOMG 1350, BIOSM 1610, BIOSM 1780.
- **CoursePlan:** Checker accepts only BIOEE 1610, BIOMG 1350, BIOEE 1780, BIOG 1440, BIOG 1445. BIOSM 1610 and BIOSM 1780 are rejected (they are not cross-listed with the BIOEE codes), even though the description names 'BIOEE/BIOSM 1610' and 'BIOEE/BIOSM 1780'.
- **Suggested change:** Add 'BIOSM 1610' and 'BIOSM 1780' to the checker.

### 5. Earth Science (high, course-list)

- **Catalog:** Select one of BEE 3710, EAS 2250, EAS 2680, EAS 3010, EAS 3030, EAS 3050, NTRES 3240, PLSCI 2600, PLSCI 3650.
- **CoursePlan:** Checker omits BEE 3710 (not cross-listed with any accepted code).
- **Suggested change:** Add 'BEE 3710' to the checker.

### 6. Earth Science (high, course-list)

- **Catalog:** EAS 4800 is not on the Earth Science list.
- **CoursePlan:** Checker accepts 'EAS 4800', and therefore its cross-listing BEE 4800.
- **Suggested change:** Remove 'EAS 4800'.

### 7. Organic Chemistry (medium, course-list)

- **Catalog:** CHEM 1570 or CHEM 3570.
- **CoursePlan:** Checker accepts CHEM 1570, CHEM 3530 and CHEM 3570. Description: 'CHEM 1570 (recommended) or 3530, 3570'.
- **Suggested change:** Remove 'CHEM 3530' from the checker and the description.

### 8. Design Electives (medium, rule)

- **Catalog:** Three courses, at least one from the list of capstone design courses and the remainder from the list of design courses.
- **CoursePlan:** A single slot needing 3 courses from one combined list. Nothing checks for a capstone course, and there is no checkerWarning.
- **Suggested change:** Split into a capstone slot (1) and a design slot (2) using the department's lists, or add a checkerWarning that at least one course must be a capstone.

### 9. Laboratory Course (low, other)

- **Catalog:** Select one of BEE 4270, CEE 4370, CEE 4530.
- **CoursePlan:** Checker code list contains the malformed entry 'CEE 4530 3010'. Because ifCodeMatch only compares up to the course code's length, it still matches CEE 4530.
- **Suggested change:** Change 'CEE 4530 3010' to 'CEE 4530'.

### 10. Engineering Distribution (low, description)

- **Catalog:** ENGRD 2510 is required. The second ENGRD is any ENGRD 2xxx, and students can count the required ENGRD 3200 as their second engineering distribution.
- **CoursePlan:** Description: 'ENGRD 2020 is recommended for the second Engineering Distribution course'.
- **Suggested change:** Update the description to say ENGRD 3200 may count as the second engineering distribution.

### 11. EHS Lab Safety Online Training #2555 (low, missing-requirement)

- **Catalog:** Students must complete EHS Lab Safety Online Training #2555 before graduation and email the certificate to the coordinator.
- **CoursePlan:** No such requirement.
- **Suggested change:** Add a self-check requirement for the EHS Lab Safety Training.

### 12. All requirements (source) (low, description)

- **Catalog:** Catalog page is https://catalog.cornell.edu/programs/environmental-engineering-bs/ (2026-2027).
- **CoursePlan:** Source URLs point to courses.cornell.edu catoid=41 (an old catalog).
- **Suggested change:** Update source URLs to the current catalog page.

## Could not verify

- Design Electives and capstone lists are published on the Environmental Engineering website, not in the catalog, so the file's list (CEE 4210, BEE 4350, CEE 4565, BEE 4730, BEE 4760, BEE 4870, CEE 4350, CEE 4640, CEE 6370, MAE 4020, MAE 4021) cannot be checked.
- The major-approved elective list is on the department website. The subject-prefix checker (which also matches e.g. STSCI via 'STS', plus ECON, AEM) is covered by its checkerWarning.
- Whether math, physics, chemistry (CHEM 2090/2091 vs CHEM 2070/2071 for CALS students, CHEM 2150 substitution), CS 111X, ENGRI, FWS, liberal studies, advisor-approved electives, ENGRG 1050 and the technical communications requirement are covered by the Engineering/CALS college requirement files. These are not shown, and this matters especially for CALS-enrolled EnvE students.
- ENGRD 2700 may substitute for CEE 3040 by petition (and students cannot count both). This is a petition rule, so whether a warning should be added cannot be determined from the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
