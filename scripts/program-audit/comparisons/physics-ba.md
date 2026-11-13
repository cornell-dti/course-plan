# Physics (major)

- Catalog: https://catalog.cornell.edu/programs/physics-ba/ (2026-2027 edition)
- Data file: `src/data/majors/phys.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Physics major data file has the overall structure right: the intro sequence, the 3316/3317 and 3318/3327 pairs, a 3-credit lab, and an inside/outside concentration toggle. Several of its course lists and counts no longer match the 2026-2027 catalog. The Mathematics checker is missing MATH 3270 and MATH 2310 and accepts MATH 3230 and MATH 1220, which the catalog does not list. The Physics Lab list is missing most catalog options and accepts two that are no longer listed. The required intro labs PHYS 1110 and PHYS 2210, and the conditional PHYS 2216, are not checked. The inside concentration asks for 15 PHYS credits instead of 21 credits, rejects the AEP math courses, and enforces none of its required parts. The outside concentration does not enforce the 8-credit 3000+ rule.

## Findings

### 1. Physics Core (high, missing-requirement)

- **Catalog:** Two introductory lab courses are required: PHYS 1110 (co-requisite with PHYS 1112 or PHYS 1116) and PHYS 2210. Students who do not take PHYS 1116 must also complete PHYS 2216.
- **CoursePlan:** The checker has only three slots (Physics I, II, III). PHYS 1110, PHYS 2210 and PHYS 2216 are not required anywhere, and a code comment wrongly describes the last as 'PHYS 2216 or PHYS 2210'.
- **Suggested change:** Add slots or additional requirements for PHYS 1110 and PHYS 2210. Add a PHYS 2216 requirement, or at least a checkerWarning, for students who did not take PHYS 1116.

### 2. Mathematics – Differential Equations (high, course-list)

- **Catalog:** MATH 2930 or MATH 3270.
- **CoursePlan:** Accepts 'MATH 3230' and 'MATH 2930'. MATH 3270 is rejected, and MATH 3230 (last offered FA22) is accepted although the catalog does not list it.
- **Suggested change:** Replace 'MATH 3230' with 'MATH 3270'.

### 3. Mathematics – Linear Algebra (high, course-list)

- **Catalog:** MATH 2210, MATH 2230, MATH 2310, or MATH 2940.
- **CoursePlan:** Accepts 'MATH 2210', 'MATH 2230', 'MATH 2940'. MATH 2310 is rejected.
- **Suggested change:** Add 'MATH 2310' to the Linear Algebra slot.

### 4. Physics Lab (high, course-list)

- **Catalog:** Approved laboratory work includes PHYS 3310, PHYS 3360, PHYS 4410, AEP 3640, ASTRO 4410, BEE 4500, BME 3030, BME 4390, CHEM 3020, EAS 4370, MAE 3260, MAE 3783, MAE 4150, MAE 4272, MAE 4480 and MSE 5410.
- **CoursePlan:** Accepts only 'PHYS 3310', 'PHYS 3330', 'PHYS 3360', 'PHYS 4410', 'AEP 2640', 'ASTRO 4410', 'BEE 4500'. AEP 3640, BME 3030, BME 4390, CHEM 3020, EAS 4370, MAE 3260, MAE 3783, MAE 4150 (EAS/ECE 4150), MAE 4272, MAE 4480 (BME 4490) and MSE 5410 (ECE 5365) are rejected.
- **Suggested change:** Add the missing catalog lab courses, including 'AEP 3640'.

### 5. Concentration – inside (high, count-or-credits)

- **Catalog:** A minimum of 21 credits beyond the core, consisting of: two 3000+ level math classes (typically AEP 3200 and AEP 4200), PHYS 4230, PHYS 4410 plus one of PHYS 3310/PHYS 3360, and 7 additional credits of physics courses numbered above 3000 or other approved courses. A minimum of 7 credits of lab work is required.
- **CoursePlan:** Requires 15 credits of any PHYS course not at the 1000 or 2000 level (perSlotMinCount [15]). It does not require PHYS 4230, PHYS 4410, the math courses or 7 lab credits.
- **Suggested change:** Raise the total to 21 credits. Implement sub-requirements for the two 3000+ math courses, PHYS 4230, and PHYS 4410 plus PHYS 3310/3360. Alternatively, add a checkerWarning describing the unchecked parts.

### 6. Concentration – inside (high, course-list)

- **Catalog:** The two additional 3000+ level math classes (typically AEP 3200 and AEP 4200) count toward the 21 concentration credits, as do approved non-PHYS courses such as ASTRO 4431, ASTRO 4432 and AEP 4340.
- **CoursePlan:** The checker accepts only PHYS-subject courses, so AEP 3200, AEP 4200, AEP 4340, ASTRO 4431 and ASTRO 4432 cannot count without a manual override.
- **Suggested change:** Accept 3000+ MATH/AEP math courses and the listed approved courses (AEP 3200, AEP 4200, AEP 4340, ASTRO 4431, ASTRO 4432) in the inside option.

### 7. Physics Lab (medium, course-list)

- **Catalog:** PHYS 3330 and AEP 2640 are not on the approved laboratory list.
- **CoursePlan:** Accepts 'PHYS 3330' (AEP 3300, last offered FA19) and 'AEP 2640' (ENGRD 2640, last offered FA20).
- **Suggested change:** Remove 'PHYS 3330' and 'AEP 2640'. AEP 2640 appears to have been superseded by AEP 3640.

### 8. Concentration – inside (medium, rule)

- **Catalog:** If research is done as an independent project, up to 4 credits of PHYS 4490 can be applied toward the concentration.
- **CoursePlan:** The PHYS 3000+ wildcard accepts PHYS 4490 with no credit cap, although a code comment claims it must be manually overwritten.
- **Suggested change:** Cap PHYS 4490 at 4 credits, or exclude it and add a warning about the 4-credit limit.

### 9. Concentration – outside (medium, rule)

- **Catalog:** A minimum of 15 credit hours beyond the core, at least 8 of which must be in courses numbered above 3000.
- **CoursePlan:** Accepts any 15 credits of non-PHYS courses at any level. The 8-credit 3000+ rule is only a TODO comment and is not mentioned in the description or checkerWarning.
- **Suggested change:** Add a sub-requirement of 8 credits at the 3000+ level, or state it in the description or checkerWarning.

### 10. Mathematics – Single-Variable Calculus (low, course-list)

- **Catalog:** MATH 1120 or MATH 1910.
- **CoursePlan:** Also accepts 'MATH 1220' (last offered FA18), which the catalog does not list.
- **Suggested change:** Remove 'MATH 1220'.

### 11. Concentration – inside (low, description)

- **Catalog:** The inside concentration includes 3000+ math courses (e.g. AEP 3200 and AEP 4200) and other courses approved by the DUS.
- **CoursePlan:** The description says it 'consists of the core physics courses plus electives taken within the Physics Department'.
- **Suggested change:** Update the description to list the 21-credit composition.

### 12. All requirements (source) (low, other)

- **Catalog:** The catalog page is https://catalog.cornell.edu/programs/physics-ba/.
- **CoursePlan:** source points to https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990, an older catalog edition.
- **Suggested change:** Update every source URL to the current catalog page.

## Could not verify

- The parsed lab table mixes the core lab list, the inside-concentration 'one of the following' list (PHYS 3310/3360) and the outside-concentration intermediate lab list. It is unclear whether the long list (BME, MAE, CHEM, etc.) satisfies the core 3-credit lab for inside concentrators or only for outside concentrators.
- The catalog says PHYS 2210 is 'required as a co-requisite with PHYS 2218'. It is unclear whether students taking PHYS 2214 must also take PHYS 2210, although the 'two introductory lab courses' wording and the plan grid suggest all majors do.
- The plan grid labels PHYS 3327 '( alternative )', which could imply an alternative to another course. The requirement table lists PHYS 3318 and PHYS 3327 as both required.
- Whether the core lab course (e.g. PHYS 3360 or PHYS 4410) may also count toward the inside concentration's 7 lab credits and 21 credits. The file's TODO comment suggests double counting, but the catalog says 'beyond the core'.
- Which 'other courses approved by the director of undergraduate studies' count for the inside concentration, and which courses an advisor approves for an outside concentration.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
