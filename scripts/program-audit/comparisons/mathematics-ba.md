# Mathematics (major)

- Catalog: https://catalog.cornell.edu/programs/mathematics-ba/ (2026-2027 edition)
- Data file: `src/data/majors/math.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Mathematics BA file is out of date against the 2026-2027 catalog. The Algebra and Analysis lists are close, but MATH 3270 is missing from Analysis, and the requirement that at least two of the nine courses be 4000-level MATH is not encoded. Several concentration options are out of date. Mathematics and Applied Mathematics reject most non-MATH 'mathematical models' courses. Applied Mathematics leaves out the Group A–D distribution rule and the second-models-course alternative. The Computer Science, Economics, Biology, Operations Research and Statistics course lists each miss current catalog courses and accept retired or unlisted ones. The Statistics 'at most one' limits are not enforced. The Physics concentration matches.

## Findings

### 1. Analysis (high, course-list)

- **Catalog:** Select two of: MATH 3110, 3210, 3270, 4130, 4140, 4180, 4200, 4210, 4220, 4250, 4260, 4280.
- **CoursePlan:** Checker accepts MATH 3110, 3210, 3230, 4130, 4140, 4180, 4200, 4210, 4220, 4250, 4260, 4280. MATH 3270 is not accepted.
- **Suggested change:** Add 'MATH 3270' to the Analysis checker.

### 2. At least two 4000-level MATH courses (high, missing-requirement)

- **Catalog:** Students must complete nine courses, including at least two MATH courses at the 4000-level (or above).
- **CoursePlan:** No requirement checks for two MATH courses at 4000+. A student using only 3000-level MATH courses would see the major as complete.
- **Suggested change:** Add a requirement (or a self-check with checkerWarning) for two MATH courses numbered 4000+, with allowCourseDoubleCounting.

### 3. Concentration – Mathematics: Mathematical Models Course (high, course-list)

- **Catalog:** Accepts MATH 3610, any course from another department that would satisfy a requirement for one of the concentrations (e.g. the CS, ECON, ORIE and PHYS concentration courses), advisor-approved courses with serious mathematical content, CS 2110, PHYS 1116, 2208, 2213, 2217.
- **CoursePlan:** Slot accepts only MATH 3610, CS 2110, PHYS 1116, PHYS 2208, PHYS 2213, PHYS 2217.
- **Suggested change:** Add the other-department courses from the concentration lists (CS, ECON, ORIE, PHYS/AEP, biology, statistics) to the models slot.

### 4. Concentration – Applied Mathematics: Groups A–D distribution (high, missing-requirement)

- **Catalog:** Of the nine courses used for the major, at least one course must come from three of the four groups A (Differential Equations), B (Discrete/Combinatorics), C (Numerical/Computational), D (Probability/Statistics).
- **CoursePlan:** The rule is commented out and is not checked.
- **Suggested change:** Encode the group rule as a self-check (checkerWarning) or as an additional requirement listing the group courses.

### 5. Concentration – Applied Mathematics: Mathematical Models Course (high, course-list)

- **Catalog:** Accepts MATH 3610, any other-department course from Group B, C or D, any other-department course satisfying a concentration requirement, advisor-approved courses, CS 2110, PHYS 1116, 2208, 2213, 2217. Group B/C/D other-department courses: CS 4820, ECON 4020, ORIE 3300, ORIE 4350, CS 4620, CS 4670, MAE 4700, ECON 3130, ECON 4130, ORIE 3500, STSCI 3080, STSCI 3100, STSCI 4030.
- **CoursePlan:** Slot accepts only MATH 3610, CS 2110, PHYS 1116, PHYS 2208, PHYS 2213, PHYS 2217.
- **Suggested change:** Add the Group B/C/D other-department courses and the concentration courses to the models slot.

### 6. Concentration – Computer Science: Mathematical CS Course (high, course-list)

- **Catalog:** The list includes CS 4756, CS 4782, CS 4783, CS 4789 (along with CS 3220, 3700, 3780, 4110, 4160, 4210, 4220, 4620, 4670, 4740, 4744, 4775, 4787, 4810, 4814, 4820, 4830, 4850, 4852, 4860).
- **CoursePlan:** CS 4756, CS 4782, CS 4783 and CS 4789 are not accepted in either CS slot.
- **Suggested change:** Add 'CS 4756', 'CS 4782', 'CS 4783', 'CS 4789' to both CS slots.

### 7. Concentration – Economics: Mathematical ECON Course (high, course-list)

- **Catalog:** The list includes ECON 4130, ECON 4140, ECON 4410, ECON 4620.
- **CoursePlan:** ECON 4130, 4140, 4410 and 4620 are not accepted.
- **Suggested change:** Add 'ECON 4130', 'ECON 4140', 'ECON 4410', 'ECON 4620' to the ECON slots.

### 8. Concentration – Biology: Mathematical Biology Course (high, course-list)

- **Catalog:** Select three of: BIOCB 3620, BIOCB 4381, BIOCB 4810, BIOCB 4830, BIOCB 4840, BIOCB 4910, BIOEE 3550, BIONB 4220, BME 3110, BME 3300, NTRES 4120.
- **CoursePlan:** BIOCB 3620 (not cross-listed with BIOEE 3620), BIOCB 4381, BIOCB 4810, BIOCB 4830, BIOCB 4910, BIOEE 3550 and BME 3300 (and their cross-listings) are not accepted.
- **Suggested change:** Replace the biology list with the catalog list.

### 9. Concentration – Biology: Mathematical Biology Course (high, course-list)

- **Catalog:** BTRY 3080/STSCI 3080/ILRST 3080, BTRY 4090/STSCI 4090 (same course as MATH 4720), BIOEE 3620/MATH 3620, NTRES 4110, NTRES 6110, NTRES 6120, BTRY 6830, BTRY 6840, BTRY 4820 and BTRY 6820 are not on the list.
- **CoursePlan:** Checker accepts all of these. STSCI 3080, MATH 4720 (via BTRY 4090) and NTRES 6120 are currently offered and would count as biology courses.
- **Suggested change:** Remove these codes from the biology slot.

### 10. Concentration – Operations Research: ORIE Course (high, course-list)

- **Catalog:** The list includes ORIE 3741, ORIE 4330, ORIE 4580, ORIE 4742.
- **CoursePlan:** ORIE 3741 (and ORIE 4741), ORIE 4330, ORIE 4580 and ORIE 4742 are not accepted.
- **Suggested change:** Add 'ORIE 3741', 'ORIE 4330', 'ORIE 4580', 'ORIE 4742' to both ORIE slots.

### 11. Concentration – Statistics: Statistics Course (high, course-list)

- **Catalog:** The list includes BIOCB 4381, BIOCB 4830, CS 4740, CS 4789, STSCI 3900, STSCI 4270.
- **CoursePlan:** None of these (or their cross-listings) are accepted.
- **Suggested change:** Add 'BIOCB 4381', 'BIOCB 4830', 'CS 4740', 'CS 4789', 'STSCI 3900', 'STSCI 4270'.

### 12. Concentration – Applied Mathematics: Further High-Level Mathematical Course (medium, rule)

- **Catalog:** Three MATH 3000+ courses, one models course, and one more that is either a fourth MATH 3000+ course or a second models course (excluding CS 2110, PHYS 1116, 2208, 2213, 2217).
- **CoursePlan:** perSlotMinCount [4, 1]: four MATH 3000+ courses are required. A second models course cannot fill the fifth course.
- **Suggested change:** Change to three MATH slots plus one models slot, and add a fifth slot accepting MATH 3000+ or a models course other than CS 2110, PHYS 1116, 2208, 2213, 2217.

### 13. Concentration – Computer Science: Mathematical CS Course (medium, course-list)

- **Catalog:** CS 4812 (same course as PHYS 4481/AEP 4812) and CS 4786 are not on the CS list.
- **CoursePlan:** Both CS slots accept CS 4812 (so PHYS 4481 counts as a CS course) and CS 4786 (last offered SP20).
- **Suggested change:** Remove 'CS 4812' and 'CS 4786' from the CS slots.

### 14. Concentration – Economics: Mathematical ECON Course (medium, course-list)

- **Catalog:** ECON 4110 and INFO 6220 are not on the list. ECON 3825 is listed, and CS 4852/INFO 4220 are its cross-listings.
- **CoursePlan:** Checker accepts ECON 4110 (last offered SP22) and INFO 6220 (offered SP26, not cross-listed with ECON 3825).
- **Suggested change:** Remove 'ECON 4110' and 'INFO 6220'. The duplicate 'ECON 3810' entry can also be removed.

### 15. Concentration – Economics: ECON alternatives (medium, rule)

- **Catalog:** 'ECON 3130 OR ECON 6190' and 'ECON 3140 OR ECON 6200' are each a single list item.
- **CoursePlan:** ECON 3130 and ECON 6190 (or ECON 3140 and ECON 6200) can be counted as two separate ECON courses.
- **Suggested change:** Prevent both members of a pair from counting, or add a checkerWarning.

### 16. Concentration – Economics: Further course (ORIE option) (medium, course-list)

- **Catalog:** ORIE options: 3300, 3310, 3741, 4350, 4580, 4600, 4740, 5600, 5610.
- **CoursePlan:** ORIE 3741 (same course as ORIE 4741) and ORIE 4580 are not accepted.
- **Suggested change:** Add 'ORIE 3741' and 'ORIE 4580' to the third slot.

### 17. Concentration – Statistics: at-most-one limits (medium, rule)

- **Catalog:** At most one stochastic processes course (STSCI 3510/ORIE 3510 or MATH 4740), at most one data mining/ML course (CS 3780, ORIE 4740, or STSCI 3740), and at most one regression course (ECON 3140 or STSCI 4030).
- **CoursePlan:** None of these limits are enforced or warned about. For example, ECON 3140 and STSCI 4030 together fill both statistics slots, and MATH 4740 plus STSCI 3510 both count.
- **Suggested change:** Add a checkerWarning describing the limits, or split the checkers so each group can count only once.

### 18. Analysis (low, course-list)

- **Catalog:** MATH 3230 is not on the Analysis list.
- **CoursePlan:** Checker accepts MATH 3230 (last offered FA22).
- **Suggested change:** Remove 'MATH 3230' from the Analysis checker.

### 19. Algebra (low, course-list)

- **Catalog:** Select two of: MATH 3320, 3340, 3360, 4310, 4330, 4340, 4370, 4500.
- **CoursePlan:** Checker also accepts MATH 4560 and MATH 4315 (both last offered FA22).
- **Suggested change:** Remove 'MATH 4560' and 'MATH 4315' from the Algebra checker.

### 20. Concentration – Mathematics: Geometry/Topology Course (low, course-list)

- **Catalog:** Topology/geometry course from MATH 3210, 4500, 4520, 4530, 4540.
- **CoursePlan:** Slot also accepts MATH 4550 (last offered SP21) and MATH 4560 (last offered FA22). The description also mentions MATH 4560.
- **Suggested change:** Remove 'MATH 4550' and 'MATH 4560' from the slot and from the description.

### 21. Concentration – Applied Mathematics (low, description)

- **Catalog:** Three MATH 3000+ courses, one models course, and a fourth MATH course or a second models course.
- **CoursePlan:** Description says 'At least 3 MATH courses numbered 3000 or above', but the checker requires 4.
- **Suggested change:** Align the description with the corrected checker.

### 22. Concentration – Economics (low, description)

- **Catalog:** The fifth course is a second MATH 3000+ course, a fourth ECON course, or one of the listed ORIE courses.
- **CoursePlan:** Description lists '(iii) A course in ORIE', which reads as if an ORIE course is required.
- **Suggested change:** Reword (iii) as one of: a second MATH course, a fourth ECON course, or a listed ORIE course.

### 23. Concentration – Operations Research: ORIE Course (low, course-list)

- **Catalog:** ORIE 4150 and ORIE 4520 are not listed.
- **CoursePlan:** Checker accepts ORIE 4150 (last offered SP18) and ORIE 4520 (not in roster data).
- **Suggested change:** Remove 'ORIE 4150' and 'ORIE 4520'.

### 24. Concentration – Statistics: Statistics Course (low, course-list)

- **Catalog:** CS 4786, ECON 4110 and BTRY 4820 are not listed.
- **CoursePlan:** Checker accepts CS 4786 (SP20), ECON 4110 (SP22) and BTRY 4820 (not in roster data).
- **Suggested change:** Remove 'CS 4786', 'ECON 4110', 'BTRY 4820'.

## Could not verify

- Linear Algebra, Multivariable Calculus and Programming Course requirements are admission prerequisites taken from the department site. The catalog page does not list them, so their course lists cannot be checked.
- Use of core graduate algebra/analysis courses with director approval, advisor-approved models courses, CS graduate courses, and other advisor-approved group options depend on approvals not shown.
- Whether the toggleable slot allocation lets one course fill more than one slot within a concentration option (e.g. MATH 3210 in both the 3000+ slot and the geometry slot) depends on solver behavior not shown.
- CS 3220 and CS 4810 appear in the catalog without titles. CS 3220 was last offered FA21, so whether they are still intended options is unclear.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
