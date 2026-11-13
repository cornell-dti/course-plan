# Aerospace Engineering (minor)

- Catalog: https://catalog.cornell.edu/programs/aerospace-engineering-minor/ (2026-2027 edition)
- Data file: `src/data/minors/aerospace.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan file has the right overall shape: four core courses with MAE 3050 or MAE 4060 required, and two Group B/C courses. Its course lists are out of date against the 2026-2027 catalog. Group A is missing several catalog core courses: ENGRG 3400, MAE 4070, MAE 4161, MAE 4231, the MAE 4440/4441/5440 family and the MAE 4540/5540 family. Group B is missing MAE 4021, MAE 4131 and MAE 5770, and still accepts MAE 5130 and MAE 6510, which the catalog no longer lists. The B/C requirement demands exactly two B/C courses, but the catalog only caps them at two, so extra core courses should be able to fill those spots. The footnote rules for MAE 4900 (at least 3 credits, advisor form, at most one of MAE 4291/4900) are not mentioned. The ME-major rule requiring two aerospace courses from the ME Major Approved Electives list is absent. The other prose rules (18-credit minimum, no overlap with the ME minor or early M.Eng. courses, one outside course by petition) are not shown to students.

## Findings

### 1. Group A (high, course-list)

- **Catalog:** Core Aerospace Engineering includes ENGRG 3400, MAE 4070 OR MAE 5070, MAE 4160 OR MAE 4161 OR MAE 5160, MAE 4230 OR MAE 4231 OR MAE 5230, MAE 4440 OR MAE 4441 OR MAE 5440, and MAE 4540 OR MAE 5540.
- **CoursePlan:** Group A's second slot lists MAE 5070 but not MAE 4070, MAE 4160/5160 but not MAE 4161, and MAE 4230/5230 but not MAE 4231. It omits ENGRG 3400, MAE 4440, MAE 4441, MAE 5440, MAE 4540 and MAE 5540 entirely, and none of these are cross-listed with an accepted code.
- **Suggested change:** Add 'ENGRG 3400', 'MAE 4070', 'MAE 4161', 'MAE 4231', 'MAE 4440', 'MAE 4441', 'MAE 5440', 'MAE 4540' and 'MAE 5540' to the Group A 'Other Group A Course' list.

### 2. Group B or C (high, course-list)

- **Catalog:** Courses Applicable to Aerospace Engineering include MAE 4020 OR MAE 4021 OR MAE 5020, MAE 4130 OR MAE 4131, and MAE 4770 OR MAE 5770.
- **CoursePlan:** The Group B lists omit MAE 4021, MAE 4131 and MAE 5770. None of them is cross-listed with an accepted code.
- **Suggested change:** Add 'MAE 4021', 'MAE 4131' and 'MAE 5770' to both Group B slot lists.

### 3. Group B or C (high, course-list)

- **Catalog:** Neither MAE 5130 nor MAE 6510 appears on the Applicable to Aerospace Engineering list, or anywhere else in the minor.
- **CoursePlan:** Group B accepts 'MAE 5130' (cross-listed MSE 5120) and 'MAE 6510' (cross-listed MAE 5520, offered SP26).
- **Suggested change:** Remove 'MAE 5130' and 'MAE 6510' from the Group B lists.

### 4. Group B or C (medium, rule)

- **Catalog:** At least six courses in total, at least four of them Core. At most two may come from Applicable to Aerospace Engineering and Fundamentals, so a student may take five or six Core courses instead.
- **CoursePlan:** The checker uses minNumberOfSlots: 2 with four one-course slots, so exactly two B/C courses are required. Extra Core courses cannot fill these spots, because the Group A requirement only counts four, so a student with five or six Core courses sees the minor as incomplete.
- **Suggested change:** Let additional Core courses count toward the remaining two courses. For example, add the Group A course list to the B/C checker, or restructure as a six-course total with at most two from B/C. Update the description so it says 'at most two' from B/C and that the rest may be Core.

### 5. Group A (MAE 4900 / MAE 4291) (medium, rule)

- **Catalog:** Footnote 1: MAE 4291 and MAE 4900 must be worth 3 credits or more. They need a project-advisor form confirming an aerospace focus. A student may count at most one of MAE 4291 or MAE 4900.
- **CoursePlan:** MAE 4900 and MAE 4291 are accepted at any credit amount, with no warning. A student could count both.
- **Suggested change:** Add a checkerWarning or a description note covering the 3-credit minimum, the advisor form and the one-of-MAE 4291/MAE 4900 limit. Optionally add a checker that enforces at least 3 credits via courseMeetsCreditMinimum.

### 6. ME majors: aerospace Major Approved Electives (medium, missing-requirement)

- **Catalog:** ME majors must select two courses from the Aerospace Engineering subject field of the ME Major Approved Electives list. These two courses may not count toward the ME B.S. They may use at most two Applicable courses and no Fundamentals courses.
- **CoursePlan:** No requirement or description mentions the two ME-approved-elective aerospace courses. Group B/C only notes that ME majors may not use group C.
- **Suggested change:** Add a self-check requirement, or a note in the descriptions, explaining the ME-major rule: two aerospace courses from the ME Major Approved Electives list that are not used toward the ME B.S.

### 7. General minor rules (low, rule)

- **Catalog:** Minimum 18 credits. Courses used for early M.Eng. requirements may not be used. No course may count toward both the Mechanical Engineering minor and the Aerospace minor. At most one outside course may be substituted, by petition.
- **CoursePlan:** None of these rules appears in any description or warning, and no credit minimum is checked.
- **Suggested change:** Mention the 18-credit minimum, the M.Eng. and ME-minor exclusions and the petition option in a description or checkerWarning.

### 8. Source URL (low, description)

- **Catalog:** https://catalog.cornell.edu/programs/aerospace-engineering-minor/
- **CoursePlan:** https://courses.cornell.edu/content.php?catoid=41&navoid=11649#aerospace-minor
- **Suggested change:** Update the source to the current catalog page.

## Could not verify

- MAE 4291 (Supervised Senior Design Experience) is accepted in Group A. The catalog footnote treats it as a possible core course, but it is not in the parsed Core table, so it is unclear whether it is still allowed.
- The parsed catalog shows 'MAE 4770: Structural Dynamics and Vibration Analysis OR MAE 5700: Finite Element Analysis' as well as a separate MAE 4770/5770 entry. The first entry is probably meant to be MAE 4700/5700, which would make the file's 'MAE 4700' correct, but the parsed table does not confirm this.
- The contents of the Aerospace Engineering subject field in the ME Major Approved Electives list are published on a department page that is not included in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
