# Civil Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/civil-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/ce.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ce.ts file is badly out of date against the 2026-2027 catalog. The nine core courses match. However:

- The Capstone Design Elective list is almost entirely different: only CEE 4740 overlaps.
- The Design Elective list shares only BEE 4730 with the catalog.
- The Major-Approved Elective list is missing 16 catalog courses and accepts about a dozen courses the catalog no longer lists.
- The second engineering-distribution slot is wrongly restricted to a short list. With double counting allowed, BEE 2510 can count as both ENGRD and core without the extra major-approved elective the catalog then requires.
- The core-course substitutions (Smart Cities, Civil Infrastructure), the design-context diversity rule and the major's Technical Communication course are not represented.
- Descriptions and source URLs are stale.

## Findings

### 1. Capstone Design Elective (high, course-list)

- **Catalog:** One course from: CEE 4210, CEE 6210, CEE 4760, CEE 4565, CEE 4740.
- **CoursePlan:** Accepts CEE 4400, CEE 4640, CEE 4730, CEE 4350, CEE 4410, CEE 4590, CEE 4650, CEE 4660, CEE 4740. Only CEE 4740 matches. CEE 4210, CEE 6210, CEE 4760 and CEE 4565 are rejected. CEE 4400, CEE 4730, CEE 4410, CEE 4590 and CEE 4650 are not in the catalog at all. CEE 4640, CEE 4350 and CEE 4660 (= CEE 4665) are catalog design electives, not capstones.
- **Suggested change:** Replace the checker list and description with ['CEE 4210', 'CEE 6210', 'CEE 4760', 'CEE 4565', 'CEE 4740'] and update the source to the current catalog page.

### 2. Two Design Electives (high, course-list)

- **Catalog:** Two courses from: BEE 4730, CEE 4640, CEE 6648, CEE 4745, CEE 5746, CEE 4800, CEE 5740, MAE 4021, CEE 4200, CEE 4350, CEE 4665, CEE 4880/BEE 4880, CEE 4795, CEE 5710.
- **CoursePlan:** Accepts CEE 4210, CEE 4565, BEE 4730, CEE 4110, CEE 4520, BEE 4760, CEE 4750, CEE 6370, MSE 5150. Only BEE 4730 matches. CEE 4210 and CEE 4565 are catalog capstone courses. CEE 4520 is a catalog major-approved elective. CEE 4110, BEE 4760, CEE 4750, CEE 6370 and MSE 5150 are not in the catalog. Every other catalog design elective is rejected.
- **Suggested change:** Replace the list with ['BEE 4730', 'CEE 4640', 'CEE 6648', 'CEE 4745', 'CEE 5746', 'CEE 4800', 'CEE 5740', 'MAE 4021', 'CEE 4200', 'CEE 4350', 'CEE 4665', 'CEE 4880', 'CEE 4795', 'CEE 5710'] and update the description.

### 3. Two Major-Approved Electives (high, course-list)

- **Catalog:** Approved list includes CEE 4520, CEE 4560, CEE 4570, CEE 4930, CEE 5200, CEE 5735, CEE 6300, CEE 6530, CEE 6790, CEE 6930, CEE 5900, MAE 3270, MAE 4020, CEE 5745, CEE 6200 and CEE 6590, along with BEE 4750, CEE 4510, CEE 4620, CEE 4725, CEE 5240, CEE 5950, CEE 5980, CEE 6640, EAS 4570, MAE 4700, ORIE 4330, CEE 4330, CEE 4370, CEE 4530, CEE 4780, ENMGT 5970, CEE 6550 and CEE 6570.
- **CoursePlan:** The checker does not accept CEE 4520, CEE 4560 (or CEE 4555), CEE 4570, CEE 4930, CEE 5200, CEE 5735, CEE 6300, CEE 6530, CEE 6790, CEE 6930, CEE 5900, MAE 3270, MAE 4020, CEE 5745, CEE 6200 or CEE 6590.
- **Suggested change:** Add the missing catalog courses to the Major-Approved Electives checker.

### 4. Two Major-Approved Electives (high, course-list)

- **Catalog:** The catalog list does not include BEE 4110, CEE 4320, CEE 4770, CEE 5720, CEE 5930, CEE 6100, CEE 6560, EAS 6480, BEE 4310, CEE 4450, CHEME 6610 or MSE 5550.
- **CoursePlan:** The checker accepts all of these (plus cross-listings such as BEE 4300, ENMGT 5930, PLSCS 6600 and MAE 6480). It also lists CEE 3720 twice. MSE 5550 is not in the roster data.
- **Suggested change:** Remove BEE 4110, CEE 4320, CEE 4770, CEE 5720, CEE 5930, CEE 6100, CEE 6560, EAS 6480, BEE 4310, CEE 4450, CHEME 6610 and MSE 5550, and remove the duplicate CEE 3720. Keeping CEE 3720 or switching to CEE 4725 is fine, since they are cross-listed.

### 5. Engineering Distribution (medium, rule)

- **Catalog:** ENGRD 2020 is required. For the second ENGRD, ENGRD 2610, ENGRD 2210 or ENGRD 2510 is only recommended; any ENGRD from a different category is allowed. ENGRD 3200 or BEE 2510 can explicitly be used as the second distribution course.
- **CoursePlan:** The second slot only accepts ENGRD 2610, ENGRD 2210, ENGRD 2110 or ENGRD 2510. ENGRD 3200, ENGRD 2700 and other valid ENGRDs never satisfy it. ENGRD 2110 is listed as recommended even though the catalog does not recommend it.
- **Suggested change:** Make the second slot accept any ENGRD course (e.g. 'ENGRD \*\*\*\*') other than ENGRD 2020, or move the recommendation into the description only. Remove ENGRD 2110 from the recommended list.

### 6. Engineering Distribution / Core Courses / Major-Approved Electives (medium, rule)

- **Catalog:** If ENGRD 3200 or BEE 2510 is used as the second distribution course, the student must take an additional major-approved elective to fulfill the core course requirements.
- **CoursePlan:** allowCourseDoubleCounting on Engineering Distribution lets BEE 2510/ENGRD 2510 count as both the ENGRD and the core course. No third major-approved elective is then required.
- **Suggested change:** Add a checkerWarning, or a toggleable option, that requires a third major-approved elective when ENGRD 3200 or BEE 2510 is used as the second ENGRD.

### 7. Core Courses (substitutions) (medium, rule)

- **Catalog:** Smart Cities focus: CEE 4800 may substitute for BEE 2510 or CEE 3410, if the student also completes CEE 4665, CEE 4795 or CEE 5735. Civil Infrastructure focus: CEE 4725 or MAE 3270 may substitute for BEE 2510 or CEE 3610, if the student also completes CEE 4760 or CEE 4740. A course used as a substitute counts as a core course only, not as a design course or elective.
- **CoursePlan:** Core slots accept only the listed courses, so these sanctioned substitutions cannot count. CEE 4725 (via CEE 3720) can count as an elective, but the restriction against it counting as an elective after substituting is not modeled.
- **Suggested change:** Add CEE 4800 to the BEE 2510 and CEE 3410 slots, and CEE 4725/MAE 3270 to the BEE 2510 and CEE 3610 slots. Add a checkerWarning describing the extra-course conditions and the core-only restriction.

### 8. Technical Communication Course (medium, missing-requirement)

- **Catalog:** One technical communication course (3-4 cr) from ENGRC or approved communications courses; ENGRC 3610 is recommended. If it also fulfills another requirement, an additional advisor-approved elective must be taken.
- **CoursePlan:** No such requirement exists in ce.ts.
- **Suggested change:** Add a Technical Communication requirement, or a specialization of the college Engineering Communications requirement, that recommends ENGRC 3610 and warns about needing an extra advisor-approved elective when the course double counts.

### 9. Capstone Design Elective / Two Design Electives (medium, rule)

- **Catalog:** All three design courses cannot address the same engineering context; at least one must address a different context from the others.
- **CoursePlan:** Not mentioned; the design requirements are checked independently.
- **Suggested change:** Add a checkerWarning to the design requirements stating the different-engineering-context rule.

### 10. Core Courses (low, description)

- **Catalog:** Nine courses: CEE 4780 or MAE 2030, ENGRD 3200, CEE 3040, CEE 3230, CEE 3310, CEE 3410, BEE 2510, CEE 3610, CEE 3710.
- **CoursePlan:** The description ends with a stray, unrelated string: '...and CEE 3710.ENGRD 2610, ENGRD 2210, ENGRD 2110, ENGRD 2510'.
- **Suggested change:** Remove the trailing ENGRD list from the Core Courses description.

### 11. All requirements (source) (low, description)

- **Catalog:** Current catalog page: https://catalog.cornell.edu/programs/civil-engineering-bs/
- **CoursePlan:** Sources point to the old courses.cornell.edu catoid=41 page or to the CEE department site.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Major-approved elective count: the catalog table says 'Major-Approved Electives (2 courses) [6-8 cr]', while the common-curriculum table says major-approved electives ≥9 credits. Whether design electives count toward the 9 credits is not stated.
- Whether the college-level Engineering file already enforces Engineering Communications, courses outside the major (≥9 cr), the ENGRI requirement and the advisor-approved electives that the catalog lists for this major.
- The approved course list for the Additional Science Course: the catalog only names a list in Hollister 221/CEE website. Whether the description's 'not physics or chemistry' restriction is current cannot be confirmed from the inputs.
- ENGRD 2700 substitution for CEE 3040 is by petition only, so it is appropriately not encoded; whether a checkerWarning is desired is a design choice.
- The CEE department design-course web page cited in the file may list additional approved design or elective courses not shown in the catalog.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
