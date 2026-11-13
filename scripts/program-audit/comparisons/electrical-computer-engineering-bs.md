# Electrical and Computer Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/electrical-computer-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/ece.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ECE data file does not match the 2026-2027 catalog in several places that change what counts. The third foundation course is fixed to ECE 3140, while the catalog allows any of five. The CDE list accepts ECE 4250 and ECE 4370, which the catalog does not list. The ECE elective structure is 3 courses at 4000-level plus 1 at 3000-level with no credit floor, against the catalog's 5 courses and 17 credits (2 at 4000+ and 3 at 3000+). The file also keeps two requirements the catalog no longer has (Advanced Programming and Probability & Statistics). Finally, the Outside-ECE technical elective checker accepts ECE courses and does not enforce the 3-credit 3000-level portion.

## Findings

### 1. Foundation Courses (high, rule)

- **Catalog:** At least 3 foundation courses: ECE 3030 or ECE 3150; ECE 3100 or ECE 3250; plus one additional course selected from ECE 3030, ECE 3100, ECE 3140, ECE 3150, or ECE 3250.
- **CoursePlan:** Third slot accepts only ECE 3140 (slots: ['ECE 3030','ECE 3150'], ['ECE 3100','ECE 3250'], ['ECE 3140']).
- **Suggested change:** Change the third slot to accept any of ECE 3030, ECE 3100, ECE 3140, ECE 3150, ECE 3250 (a course already used in slot 1 or 2 must not fill it again). Update the description and slot name to 'Additional ECE Foundation Course'.

### 2. Culminating Design Experience (CDE) (high, course-list)

- **Catalog:** Select one of ECE 4530, ECE 4740, ECE 4760, ECE 4670, ECE 4750.
- **CoursePlan:** Accepts ECE 4250, ECE 4370, ECE 4530, ECE 4670, ECE 4740, ECE 4750, ECE 4760.
- **Suggested change:** Remove ECE 4250 and ECE 4370 from the checker and the description.

### 3. Upper-Level ECE Electives / Upper-Level ECE Electives: 4000 level (high, count-or-credits)

- **Catalog:** Additional ECE Electives: at least 5 courses totaling 17 credits, made up of 2 courses at 4000 level or above and 3 courses at 3000 level or above. These do not include the CDE course.
- **CoursePlan:** One requirement asks for 1 ECE course at 3000+. A second asks for 3 courses at 4000+. That is 4 courses in total, with no 17-credit minimum.
- **Suggested change:** Restructure to 2 courses at 4000+ plus 3 courses at 3000+ (5 total). Add a 17-credit minimum, for example as an additional credits requirement or a checkerWarning. Update the descriptions to state the counts and that the CDE course does not count here.

### 4. Upper-Level ECE Electives: 4000 level (medium, course-list)

- **Catalog:** The Additional ECE Electives are ECE courses; the catalog lists no non-ECE exceptions.
- **CoursePlan:** The checker also accepts CS 4120 and CS 4410 as 4000-level ECE electives.
- **Suggested change:** Remove CS 4120 and CS 4410 unless a current catalog source supports them.

### 5. Advanced Programming/Computer Engineering (medium, extra-requirement)

- **Catalog:** The 2026-2027 catalog has no advanced programming / computer engineering requirement.
- **CoursePlan:** Requires 3 credits from CS 2110, ENGRD 3200, AEP 4380, ECE 2400, ECE 4740, ECE 4750, ECE 4760, without double counting. It can therefore compete with CDE and the ECE electives for ECE 4740, ECE 4750 and ECE 4760.
- **Suggested change:** Remove this requirement for current students, keeping it only through a migration for earlier entry years if it applied to them.

### 6. Outside ECE Technical Electives (medium, rule)

- **Catalog:** 9 credits of technical courses whose scope lies outside ECE offerings, with at least 3 credits from lecture course work at the 3000-level or above. ECE courses are excluded except ECE 5830 or one advanced ECE course with advisor approval. At most 3 credits may come from project team work or independent study.
- **CoursePlan:** The checker accepts any course not numbered 1\*\*\*, including ECE courses. It does not enforce the 3-credit 3000-level portion. The checkerWarning mentions only the technical-content check.
- **Suggested change:** Exclude ECE courses other than ECE 5830 (cross-listed SYSEN 5840). Add an additional requirement or warning for the 3 credits at 3000+. Extend the checkerWarning to cover the project-team/independent-study cap and the advisor-approved ECE exception.

### 7. Probability and Statistics (low, extra-requirement)

- **Catalog:** The 2026-2027 catalog has no separate probability and statistics requirement; ECE 2720 is a required course.
- **CoursePlan:** Separate requirement satisfied by ECE 2720, ECE 3100, ENGRD 2700, CEE 3040, MSE 5730 (double counting allowed).
- **Suggested change:** Remove this requirement, or move it to a migration for older entry years.

### 8. Engineering Distribution (low, course-list)

- **Catalog:** The two ENGRD courses must come from different categories, and ECE majors must use ECE 2300 / ENGRD 2300 (Electrical sciences) as one of them. ENGRD 2550 appears alongside ENGRD 2100 and ENGRD 2300, apparently in the Electrical sciences category.
- **CoursePlan:** Accepts any ENGRD except ENGRD 2300, ENGRD 2100 and ENGRD 2200, so ENGRD 2550 would be accepted. ENGRD 2200 is not in the roster; the old ECE 2200 is cross-listed as ENGRD 2220, which is still accepted. The description says 'ENGRD/ECE 2200'.
- **Suggested change:** Exclude ENGRD 2550 and ENGRD 2220, which share ECE 2300's Electrical sciences category, and fix the outdated ENGRD/ECE 2200 reference in the description.

## Could not verify

- Whether ENGRD 2550 is actually in the Electrical sciences category: the ENGRD category tables were not parsed, only inferred from list order.
- Whether ENGRD 2720 / ECE 2720 may serve both as the second ENGRD distribution and as a required major course. CoursePlan currently cannot double count it between 'Engineering Distribution' and 'Core Courses'.
- Whether the 2020-and-earlier migration for Core Courses (ECE 2100, ECE 2200, ECE 3400) matches older catalogs.
- Whether ECE independent study (e.g. ECE 4999) or ECE 4920 count as technical ECE electives in the 3000+/4000+ elective categories.
- Major-approved/advisor-approved elective credit categories (≥9, ≥6) and the 1000-level-with-prerequisite exception for outside technical electives, which may be handled in the college-level file.
- Whether the dummy elective checkers' subject-based matching (course.subject === 'ENGRD' / 'ECE') applies cross-listing equivalence for courses added under the non-ENGRD/non-ECE code.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
