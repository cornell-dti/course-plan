# Biological Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/biological-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/be.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The be.ts file has several serious errors against the 2026-2027 catalog. The 'Biochemistry' requirement checks CHEM 2070/2080 or CHEM 2150 instead of the BIOMG biochemistry options. BIOSM 1610 and CHEME 3230 are missing as alternatives. CHEM 3530 is accepted for Organic Chemistry. The capstone (BEE 4590 or BEE 4530) has no slot of its own. The 15-credit Biological Sciences elective, Major-Approved Electives and ENGRG 1050 are absent. The focus-area requirements count 4 courses instead of credits and describe 7 outdated focus areas instead of the catalog's 5.

## Findings

### 1. Biochemistry (high, course-list)

- **Catalog:** Select one of: BIOMG 3300; BIOMG 3310 & BIOMG 3320; or BIOMG 3350 (4-5 cr).
- **CoursePlan:** Toggleable options check 'CHEM 2070 AND CHEM 2080' or 'CHEM 2150'. The description lists 'BIOMG 3300, BIOMG 3330, BIOMG 3350, or BIOMG 3310 and BIOMG 3320', which contradicts the checker. BIOMG 3330 is not in the catalog and was last offered SU21.
- **Suggested change:** Replace the options with: Option 1, BIOMG 3300; Option 2, BIOMG 3310 and BIOMG 3320 (two slots); Option 3, BIOMG 3350. Remove BIOMG 3330 from the description.

### 2. Intro Bio (high, course-list)

- **Catalog:** Select two of BIOMG 1350, BIOG 1440, BIOG 1445, BIOEE 1610 OR BIOSM 1610.
- **CoursePlan:** The checker includes only 'BIOMG 1350', 'BIOG 1440', 'BIOG 1445', 'BIOEE 1610'. BIOSM 1610 is not accepted, even though the description says 'BIOEE/BIOSM 1610'.
- **Suggested change:** Add 'BIOSM 1610' to the Intro Bio checker.

### 3. Required Major Courses (BEE 3310 slot) (high, course-list)

- **Catalog:** BEE 3310: Bio-Fluid Mechanics OR CHEME 3230: Fluid Mechanics.
- **CoursePlan:** The slot accepts only ['BEE 3310'].
- **Suggested change:** Change the slot to ['BEE 3310', 'CHEME 3230'] and rename it 'BEE 3310 or CHEME 3230'.

### 4. Capstone: BEE 4590 or BEE 4530 (Major-Required Courses) (high, missing-requirement)

- **Catalog:** Major-Required Courses include BEE 4590: Physical Design in Biological Engineering OR BEE 4530: Computer-Aided Engineering.
- **CoursePlan:** There is no dedicated slot. BEE 4590 and BEE 4530 only appear in the 'BE Focus Area Elective' checker among many other courses, so that requirement can be met without a capstone. Its description says focus area electives 'must include a BEE capstone design course'.
- **Suggested change:** Add a slot ['BEE 4590', 'BEE 4530'] to Required Major Courses (MAE 4530 is cross-listed). Remove those two codes from the focus-area checker or exclude them there, and update the focus-area description.

### 5. Biological Science Electives (high, missing-requirement)

- **Catalog:** A 2000-level or higher biological science course that requires a biological science prerequisite, to bring biological science credits to at least 15 (3-4 cr).
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a requirement for this elective. A self-check is acceptable, describing the 2000+ level, biology-prerequisite rule and the 15-credit biological sciences total.

### 6. Organic Chemistry (medium, course-list)

- **Catalog:** CHEM 1570 OR CHEM 3570.
- **CoursePlan:** The checker also accepts 'CHEM 3530' (last offered FA22), and the description lists it.
- **Suggested change:** Remove 'CHEM 3530' from the checker and the description.

### 7. BE Focus Area Elective / Focus Area (medium, count-or-credits)

- **Catalog:** 15 credit hours of focus-area courses, with at least 6 credit hours from a single focus area. The table header says 12 cr.
- **CoursePlan:** 'BE Focus Area Elective' counts 4 courses (fulfilledBy 'courses', perSlotMinCount [4]) with no credit minimum and no single-area rule. A separate 'Focus Area' self-check says fifteen or more credits.
- **Suggested change:** Count credits instead (fulfilledBy 'credits' with the catalog total). Describe the at-least-6-credits-from-one-area rule, and merge the redundant self-check into this requirement or clarify it.

### 8. Focus Area (medium, description)

- **Catalog:** Five focus areas: Ecological and Agricultural Systems; Biomechanics and Biotransport; Biomaterials Engineering; Cellular and Molecular Biotechnology; Modeling and Computation in Bioengineering.
- **CoursePlan:** Lists 7 focus areas: Molecular and Cellular Systems, Ecological and Microbial Systems, Nanobiotechnology, Computational Biological Engineering, Synthetic Biology, Biomaterials, Sustainability.
- **Suggested change:** Update the description to the five current focus areas and the 6-credits-from-one-area rule.

### 9. Major Approved Electives (medium, missing-requirement)

- **Catalog:** 2000-level or higher engineering course(s) to bring engineering credits to at least 48. The Engineering table lists major-approved electives as ≥9 credits.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a self-check or credit-based requirement for major-approved engineering electives.

### 10. Orientation seminar ENGRG 1050 (medium, missing-requirement)

- **Catalog:** All students take ENGRG 1050 Engineering Seminar.
- **CoursePlan:** Not present.
- **Suggested change:** Add a requirement for ENGRG 1050.

### 11. EHS Lab Safety training (low, missing-requirement)

- **Catalog:** EHS Lab Safety online training #2555 is required for graduation.
- **CoursePlan:** Not present.
- **Suggested change:** Add a self-check requirement for the EHS lab safety training.

### 12. BE Focus Area Elective (low, course-list)

- **Catalog:** See the BEE department advising website for the current list of approved courses.
- **CoursePlan:** The checker includes codes not in the roster data (no student can add them): 'BEE 7540', 'BME 5200', 'BME 5400', 'CHEME 5940', 'ECE 3530', 'MSE 5130', 'MSE 5890'. It also repeats several codes (e.g. 'BEE 4550', 'BEE 4590', 'CHEME 5940').
- **Suggested change:** Refresh the list from the BEE advising website and remove dead and duplicate codes.

### 13. All requirements (source) (low, description)

- **Catalog:** Catalog page: https://catalog.cornell.edu/programs/biological-engineering-bs/
- **CoursePlan:** Sources point to the old courses.cornell.edu catoid=41 page.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether Math (MATH 1910/1920/2930/2940), Physics (PHYS 1112/1110/2213), General Chemistry (CHEM 2090 & 2091 or CHEM 2070 & 2071), Computing (CS 1112/CS 1110), ENGRI and Engineering Communications are covered for this major by college-level requirements. This matters especially for students enrolled through CALS, whose college requirements may not include them.
- The catalog gives both 12 cr (table header) and 15 credits (prose) for the focus-area courses.
- The approved focus-area course list and the research/project-team substitution rule are published on the BEE advising website, which is not included.
- Whether BIOG 1440 and BIOG 1445 may both count as two of the required intro bio sequences.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
