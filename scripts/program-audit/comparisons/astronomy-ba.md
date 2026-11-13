# Astronomy (major)

- Catalog: https://catalog.cornell.edu/programs/astronomy-ba/ (2026-2027 edition)
- Data file: `src/data/majors/astro.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan file has the right overall structure: introductory physics, introductory math, an experimental course, and a toggleable Astrophysics or General Astronomy concentration. It differs from the 2026-2027 catalog in several places that change what counts. In the core, the PHYS 2218 option does not require PHYS 2210, and the math slot accepts MATH 1120 and MATH 1220, which the catalog does not list. In the Astrophysics concentration, ASTRO 4434 is missing and the required ASTRO 4410 is not enforced. The math slot also accepts any MATH course instead of the required AEP 3200 and AEP 4200. In the General Astronomy concentration, ASTRO 4523 is missing from the elective group, and the 15-credit External Complementary Area is not represented at all.

## Findings

### 1. Introductory Physics Sequence (high, rule)

- **Catalog:** Third physics course: PHYS 2214, OR PHYS 2218 & PHYS 2210 (Physics III: Waves and Thermal Physics together with Exploring Experimental Physics).
- **CoursePlan:** Third slot accepts 'PHYS 2214' or 'PHYS 2218' alone; PHYS 2210 is never required. The description and slot name say 'PHYS 2214 or PHYS 2218'.
- **Suggested change:** Require PHYS 2210 alongside PHYS 2218 for the third slot. For example, add a separate PHYS 2210 slot or check, or use a checkerWarning that PHYS 2218 must be paired with PHYS 2210. Update the description and slot name to say 'PHYS 2214 or PHYS 2218 & PHYS 2210'.

### 2. Introductory Mathematics Sequence (high, course-list)

- **Catalog:** The first math course is MATH 1910 only.
- **CoursePlan:** The first slot accepts 'MATH 1910', 'MATH 1120' or 'MATH 1220', and the description lists all three.
- **Suggested change:** Remove MATH 1120 and MATH 1220 from the first slot, the slot name and the description, so the slot accepts only MATH 1910.

### 3. Concentration (Astrophysics) – Advanced Astrophysics (high, course-list)

- **Catalog:** Select two of ASTRO 4431, ASTRO 4432, ASTRO 4433, ASTRO 4434.
- **CoursePlan:** The slot accepts only 'ASTRO 4431', 'ASTRO 4432', 'ASTRO 4433'.
- **Suggested change:** Add 'ASTRO 4434' to the Advanced Astrophysics slot.

### 4. Concentration (Astrophysics) – Additional Math (high, course-list)

- **Catalog:** Additional Math has three parts: MATH 2940/MATH 2210/MATH 2230, plus AEP 3200 (Introductory Mathematical Physics), plus AEP 4200 (Intermediate Mathematical Physics). Substitutions require DUS approval.
- **CoursePlan:** The 'Mathematics Course' slot accepts any two 'MATH \*\*\*\*' courses. AEP 3200 and AEP 4200 are not accepted, and any MATH course, including lower-level ones, lets the slot be met.
- **Suggested change:** Replace the 'MATH \*\*\*\*' slot with two required slots, one for 'AEP 3200' and one for 'AEP 4200'. If needed, use a checkerWarning to cover DUS-approved substitutions.

### 5. Concentration (General Astronomy) – Group C (high, course-list)

- **Catalog:** Select one of ASTRO 2290, ASTRO 2299, ASTRO 4445, ASTRO 4523.
- **CoursePlan:** Group C accepts only 'ASTRO 2290', 'ASTRO 2299', 'ASTRO 4445'.
- **Suggested change:** Add 'ASTRO 4523' to Group C.

### 6. Concentration (General Astronomy) – External Complementary Area (high, missing-requirement)

- **Catalog:** 15 credits designed in consultation with the faculty advisor. These should include 4–5 courses in a related field, with at least 8 credits at 3000-level or higher.
- **CoursePlan:** The description mentions 15 complementary credits, but the checker only requires Groups A, B and C. A TODO comment notes the 15 credits are missing, so the concentration shows as complete without them.
- **Suggested change:** Represent the External Complementary Area so the concentration cannot be marked complete without it. For example, add a self-check or checkerWarning describing the 15 credits, the 4–5 related-field courses and the 8 credits at 3000-level or above.

### 7. Concentration (Astrophysics) – ASTRO 4410 (medium, missing-requirement)

- **Catalog:** Footnote 1: 'For those pursuing an Astrophysics Concentration, ASTRO 4410 is required.'
- **CoursePlan:** The Experimental or Data Analysis requirement accepts ASTRO 4410, ASTRO 3310 or ASTRO 3334 for everyone. Nothing in the Astrophysics option requires ASTRO 4410.
- **Suggested change:** Add an ASTRO 4410 requirement to the Astrophysics option, or add a checkerWarning noting the rule. Mention in the description that Astrophysics students must take ASTRO 4410.

### 8. All requirements (source) (low, description)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/astronomy-ba/ (2026-2027 edition).
- **CoursePlan:** The source is 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19789'.
- **Suggested change:** Update the source URLs to https://catalog.cornell.edu/programs/astronomy-ba/.

## Could not verify

- Footnotes 2 and 3 allow substitutions with DUS approval in Additional Math (Astrophysics) and the Group C elective (General Astronomy). Which substitutions are approved is not shown in the inputs.
- The External Complementary Area is advisor-designed, so the inputs do not show which related-field courses qualify.
- The prose recommends a 3.2 GPA in core courses for Astrophysics and strongly encourages research such as ASTRO 4940. Both are recommendations, not requirements, and are not checked.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
