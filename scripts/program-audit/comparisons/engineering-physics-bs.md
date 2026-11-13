# Engineering Physics (major)

- Catalog: https://catalog.cornell.edu/programs/engineering-physics-bs/ (2026-2027 edition)
- Data file: `src/data/majors/ep.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The core AEP list and the 2-of-3 choice (AEP 3560/3620/4340) match the catalog. Four things do not. The circuits requirement accepts an ECE 2100 + ECE 2300 alternative the catalog does not offer. The PHYS 4410 substitute accepts AEP 3300, which the catalog names only in its overlap caveat. The elective checker rejects the one any-level elective the catalog allows. The independent-study cap and the 9-credits-outside-AEP rule are not enforced. Sources and some labels are also outdated.

## Findings

### 1. Electronic Circuits Lab (high, extra-requirement)

- **Catalog:** AEP 3630: Electronic Circuits (4 cr) is listed as a required major course, with no alternative.
- **CoursePlan:** Toggleable requirement: either AEP 3630 or the pair ECE 2100 and ECE 2300 ('Students can either take AEP 3630 or take ECE 2100 and ECE 2300.').
- **Suggested change:** Remove the 'ECE 2100 and ECE 2300' option, leaving AEP 3630 (cross-listed as PHYS 3360) as the only way to fulfil it. Alternatively, fold AEP 3630 into 'Required Courses'.

### 2. Major-approved Elective(s) (high, rule)

- **Catalog:** There are 6 major-approved electives. One may be at any level (3-4 cr). Five must be at the 3000 level or above (15-20 cr).
- **CoursePlan:** The checker rejects every 1000- and 2000-level course for all 6 slots. The code comment says the user must override to apply a non-upper-level course.
- **Suggested change:** Split this into a compound requirement. One slot should accept any technical course at any level. The other five should require 3000+ level. Alternatively, accept any level for one slot with a minNumberOfSlots-style structure.

### 3. Major-approved Elective(s) (medium, rule)

- **Catalog:** Nine credits of major-approved electives must be outside of AEP. Up to three independent study/research courses (e.g., AEP 4900) may be used as major-approved electives, and they must be taken in the last four semesters.
- **CoursePlan:** The checker accepts any course at 3000+ level, including any number of AEP courses and AEP 4900 independent study. The description mentions the 9 credits outside AEP but nothing enforces it. The independent-study cap is neither stated nor enforced.
- **Suggested change:** Add an additional requirement of at least 9 credits from non-AEP subjects. Mention the three-course independent study/research cap in the description or checkerWarning.

### 4. Experimental Physics Lab – Alternate Option (medium, course-list)

- **Catalog:** Two of the 4 credits of PHYS 4410 can be satisfied by completing ASTRO 4410 or PHYS 3310. The remaining 2 credits can be satisfied by PHYS 4400 for 2 credits, provided its experiments do not overlap with AEP 3300 / PHYS 3300, ASTRO 4410 or PHYS 3310. AEP 3300 is named only in the overlap condition.
- **CoursePlan:** The first slot accepts 'AEP 3300', 'ASTRO 4410' and 'PHYS 3310'. Through cross-listing it therefore also accepts PHYS 3330. The description says AEP 3300/PHYS 3330 can satisfy two credits.
- **Suggested change:** Limit the first slot to ASTRO 4410 and PHYS 3310. Reword the description so AEP 3300 appears only in the no-overlap caveat.

### 5. Experimental Physics Lab – Alternate Option (low, description)

- **Catalog:** PHYS 4400 must be taken for 2 credits. If this option is chosen, the remaining major-approved electives must provide enough credits for the EP minimum of 58 credits.
- **CoursePlan:** The description omits the 58-credit EP minimum caveat. The checker does not check the PHYS 4400 credit amount.
- **Suggested change:** Add the 58-credit minimum note to the description or a checkerWarning.

### 6. Required Courses (low, description)

- **Catalog:** Choose 2 of: AEP 3620 Intermediate Quantum Mechanics, AEP 3560 Intermediate Electrodynamics, AEP 4340 Fluid and Continuum Mechanics. If all three are taken, the third can count as a Major-approved Elective.
- **CoursePlan:** The slot is named 'Intermediate Mechanics Course'. The description says only 'The major requirements are as follows.'
- **Suggested change:** Rename the slot, e.g. to 'Two of AEP 3560, AEP 3620, AEP 4340'. Note in the description that a third may count as a major-approved elective.

### 7. All requirements (source) (low, other)

- **Catalog:** The current requirements are published at https://catalog.cornell.edu/programs/engineering-physics-bs/ (2026-2027 edition).
- **CoursePlan:** Sources point to the fall 2021 Engineering Handbook (freeflowdp.com).
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether CoursePlan lets a third course from AEP 3560/3620/4340 move from 'Required Courses' to 'Major-approved Elective(s)' when all three are taken. This depends on the course-assignment logic, which is not shown.
- Whether major-specific math (e.g., MATH 2930/MATH 2940) and physics requirements are encoded in the Engineering college file rather than this major file.
- Whether the EP-specific ENGRD substitutions (AEP 3330 for the Mechanics category, MATH 4710 for ENGRD 2700) are handled in college-level specializations.
- Which courses count as 'technical' for major-approved electives. This is advisor-determined and covered by the checkerWarning.
- Whether the ECE 2100 + ECE 2300 substitution for AEP 3630 is still allowed by a departmental handbook policy not shown in the catalog.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
