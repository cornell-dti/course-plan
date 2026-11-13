# Business Minor for Engineers (minor)

- Catalog: https://catalog.cornell.edu/programs/dyson-business-minor-engineers/ (2026-2027 edition)
- Data file: `src/data/minors/dbme.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file has the right six-part structure and credit totals (3+3+3+3+1.5+3 = 16.5), but it is out of date with the 2026-2027 catalog in several places. Introduction to Basic Business Concepts is missing NCC 5540 and accepts courses the catalog no longer lists (ENGRI 1270/MAE 1270 and ORIE 4152/ENGRG 4610/MAE 4610). Career Goals uses a fixed, outdated list of courses. The catalog instead accepts any AEM, HADM, NBA or NCC course at 3000+ taken for a letter grade. As a result the file wrongly accepts BEE 4890 and rejects every HADM, NBA and NCC upper-level course and many AEM ones. The ORIE-only restriction on ORIE 3150 and the ban on ORIE majors using AEM 3100 are not encoded, and the 9-credits-at-Cornell rule is missing.

## Findings

### 1. Introduction to basic business concepts (high, course-list)

- **Catalog:** Select one of: AEM 1200, AEM 2400, HADM 1810, HADM 2410, ILRID 1700, NCC 4530, NCC 5530, NCC 5540, NCC 5580.
- **CoursePlan:** The checker does not include NCC 5540, so a student who takes it cannot get it to count.
- **Suggested change:** Add 'NCC 5540' to the checker and the description.

### 2. Introduction to basic business concepts (high, course-list)

- **Catalog:** The list does not include ENGRI 1270, ORIE 4152, ENGRG 4610 or MAE 4610.
- **CoursePlan:** The checker and description accept ENGRI 1270 (and its cross-listing MAE 1270) and ORIE 4152/ENGRG 4610/MAE 4610.
- **Suggested change:** Remove 'ENGRI 1270', 'ORIE 4152', 'ENGRG 4610' and 'MAE 4610' from the checker and the description.

### 3. Career goals (high, course-list)

- **Catalog:** Any SC Johnson College of Business (AEM, HADM, NBA, NCC) upper-level course (3000+), taken for a letter grade.
- **CoursePlan:** The checker is a fixed list of specific AEM courses plus BEE 4890. It rejects all HADM, NBA and NCC 3000+ courses and AEM 3000+ courses not on the list (e.g. AEM 3000-level electives absent from the list).
- **Suggested change:** Replace the list with wildcards covering JCB courses at 3000+ (e.g. 'AEM 3**_', 'AEM 4_**', 'HADM 3**_', 'HADM 4_**', 'NBA 3**_', 'NBA 4_**', 'NCC 3**_', 'NCC 4_**', plus higher levels if intended). Add a checkerWarning or description note about the letter-grade requirement.

### 4. Career goals (high, course-list)

- **Catalog:** Only AEM, HADM, NBA or NCC courses count.
- **CoursePlan:** The checker accepts BEE 4890, which is not a JCB course.
- **Suggested change:** Remove 'BEE 4890'.

### 5. Career goals (medium, rule)

- **Catalog:** ORIE majors may not use AEM 3100 Business Statistics to fulfill this requirement.
- **CoursePlan:** AEM 3100 is accepted for all students with no exclusion.
- **Suggested change:** Exclude AEM 3100 for ORIE majors (e.g. via conditions/majorsExcluded or a checkerWarning). At minimum, note the restriction in the description.

### 6. Accounting principles (medium, rule)

- **Catalog:** ORIE 3150 counts for ORIE students only.
- **CoursePlan:** ORIE 3150 is accepted for every student (a TODO comment notes the missing restriction).
- **Suggested change:** Restrict ORIE 3150 to ORIE majors, or add a checkerWarning and description note that only ORIE students may use ORIE 3150.

### 7. Minor-wide credit location rules (medium, missing-requirement)

- **Catalog:** Of the 16.5 credits, 9 must be taken at Cornell University and 7.5 must be JCB (AEM, HADM, NBA, NCC) courses.
- **CoursePlan:** No requirement or warning encodes the 9-Cornell-credit rule. The JCB rule is only implicitly satisfied once Career Goals is restricted to JCB courses.
- **Suggested change:** Add a self-check requirement or checkerWarning for the 9 Cornell credits and the 7.5 JCB credits.

### 8. Career goals (low, description)

- **Catalog:** Any JCB (AEM, HADM, NBA, NCC) 3000+ course aligned with career goals, letter grade only.
- **CoursePlan:** Description reads 'Choose a course ... from the following', implying a fixed list.
- **Suggested change:** Rewrite the description to match the catalog rule, including the letter-grade requirement and the ORIE/AEM 3100 exclusion.

### 9. Introductory Microeconomics (low, description)

- **Catalog:** ECON 1110, ECON 3030, or PUBPOL 2000.
- **CoursePlan:** Description and checker use 'PAM 2000'. It is cross-listed with PUBPOL 2000, so the checker still accepts it, but the old code is shown to students.
- **Suggested change:** Change 'PAM 2000' to 'PUBPOL 2000' in the checker and description. Optionally note that it must be completed by the sixth semester.

### 10. All requirements (source) (low, other)

- **Catalog:** Catalog page https://catalog.cornell.edu/programs/dyson-business-minor-engineers/
- **CoursePlan:** source points to https://business.cornell.edu/programs/undergraduate/minors/business-engineers/
- **Suggested change:** Consider pointing source to the catalog page.

## Could not verify

- Whether 'upper level course (3000+)' for Career Goals is meant to include 5000- and 6000-level JCB courses (e.g. AEM 6720 in the current list, which is not in the roster data).
- Whether any courses in the current Career Goals list are intentionally excluded by a department page rule not shown in the catalog.
- The requirement that the microeconomics foundation course be completed by the sixth semester is a timing rule that cannot be checked from the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
