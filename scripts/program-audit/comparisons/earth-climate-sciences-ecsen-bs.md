# Earth and Climate Sciences (major)

- Catalog: https://catalog.cornell.edu/programs/earth-climate-sciences-ecsen-bs/ (2026-2027 edition)
- Data file: `src/data/majors/eas.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The eas.ts file is out of date against the 2026-2027 catalog for the Engineering Earth and Climate Sciences BS. The biggest problems are in the concentrations: the Environmental Science and Ocean Sciences cores list the wrong courses, and all four elective lists differ substantially from the catalog. The Chemistry options let CHEM 1570 or PHYS 2214 alone satisfy the whole requirement. Biology rejects BIOG 1440 because of a duplicated BIOG 1140. Mathematics accepts MATH 1110/1120 and omits MATH 2930/2940. Physics does not accept mixed pairs, and the Field Work requirement does not reflect the per-concentration field course rules.

## Findings

### 1. Mathematics (high, course-list)

- **Catalog:** MATH 1910 & MATH 1920 are required; the catalog gives no MATH 1110/1120 alternative. The college prose says MATH 1110 cannot count toward the Engineering degree.
- **CoursePlan:** Toggleable. 'Option 1' accepts MATH 1110 and MATH 1120; 'Option 2' accepts MATH 1910 and MATH 1920.
- **Suggested change:** Remove Option 1 (MATH 1110/MATH 1120). Make the requirement MATH 1910 and MATH 1920.

### 2. Mathematics (MATH 2930 & MATH 2940) (high, missing-requirement)

- **Catalog:** Students in the College of Engineering are additionally required to take MATH 2930 & MATH 2940 (8 cr).
- **CoursePlan:** No requirement accepts MATH 2930 or MATH 2940.
- **Suggested change:** Add slots for MATH 2930 and MATH 2940, unless the Engineering college requirements already enforce them for this major.

### 3. Chemistry (high, rule)

- **Catalog:** Students take one of CHEM 2070&2071 or CHEM 2090&2091, and also one of CHEM 2080&2081, CHEM 1570, or PHYS 2214.
- **CoursePlan:** Option 2 (CHEM 1570 alone) and Option 3 (PHYS 2214 alone) each fulfill the whole requirement. Neither requires the first-semester CHEM 2070/2090.
- **Suggested change:** Make it two slots: ['CHEM 2070','CHEM 2090'] and ['CHEM 2080','CHEM 1570','PHYS 2214'].

### 4. Biology (high, course-list)

- **Catalog:** The list includes BIOG 1440.
- **CoursePlan:** The checker lists 'BIOG 1140' twice and omits BIOG 1440. The description does list BIOG 1440, so it contradicts the checker.
- **Suggested change:** Replace the duplicate 'BIOG 1140' with 'BIOG 1440'.

### 5. Concentration – Environmental Science core (high, course-list)

- **Catalog:** The core courses are EAS 2250, EAS 3090, EAS 3030 and EAS 4710.
- **CoursePlan:** The core slots are EAS 3090, EAS 3030 and EAS 3450 (same course as EAS 4340). EAS 4710 appears only in the elective list.
- **Suggested change:** Replace the 'EAS 3450' core slot with 'EAS 4710'.

### 6. Concentration – Ocean Sciences core (high, course-list)

- **Catalog:** The core courses are EAS 2250, EAS 3050, EAS 3530 and EAS 3030. EAS 3010 is a focused elective.
- **CoursePlan:** The core slots are EAS 3050, EAS 3530 and EAS 3010. EAS 3030 is not accepted anywhere.
- **Suggested change:** Replace the 'EAS 3010' core slot with 'EAS 3030'. Move EAS 3010 to the elective list.

### 7. Concentration – Ocean Sciences electives (high, course-list)

- **Catalog:** The focused electives (5 courses) are EAS 3010, EAS 3420, EAS 3540, EAS 3555 and EAS 4720.
- **CoursePlan:** The electives are BIOEE 4570, BIOEE 4780, BIOEE 4920, BIOEE 4930, BIOEE 6680, BIOSM 3650, EAS 3420, EAS 3530, EAS 3540, EAS 3555, EAS 4620, BIOSM 3210 and BIOSM 3830. EAS 3010 and EAS 4720 are missing. EAS 3530 is a core course duplicated in the elective list.
- **Suggested change:** Set the elective list to EAS 3010, EAS 3420, EAS 3540, EAS 3555 and EAS 4720.

### 8. Concentration – Climate Science electives (high, course-list)

- **Catalog:** The electives are EAS 1400, EAS 2400, EAS 3010, EAS 3030, EAS 3340, EAS 3530, EAS 4350, EAS 4470, EAS 4720, EAS 4800, EAS 4860, EAS 5555, BEE 2000 and BEE 4850.
- **CoursePlan:** The list lacks EAS 1400, EAS 2400, EAS 4720, EAS 4860 and BEE 4850. It accepts EAS 3421, EAS 4443, EAS 4444 and BEE 4110, none of which the catalog lists.
- **Suggested change:** Add EAS 1400, EAS 2400, EAS 4720, EAS 4860 and BEE 4850. Remove EAS 3421, EAS 4443, EAS 4444 and BEE 4110.

### 9. Concentration – Environmental Science electives (high, course-list)

- **Catalog:** The electives are BEE 4270, BEE 4730, BEE 4750, EAS 3010, EAS 3050, EAS 3530, EAS 3540, PLSCI 3650, EAS 4190, EAS 4710, EAS 4720, EAS 4740 and EAS 4870.
- **CoursePlan:** The list lacks EAS 3050, EAS 4190 and EAS 4720. It accepts PLSCS 4110, which the catalog does not list.
- **Suggested change:** Add EAS 3050, EAS 4190 and EAS 4720, and remove PLSCS 4110. PLSCS 3650 may stay, since it is cross-listed with PLSCI 3650.

### 10. Concentration – Geological Sciences electives (high, course-list)

- **Catalog:** The electives are EAS 4010, EAS 4040, EAS 4050, EAS 4060, EAS 4550, EAS 4561, EAS 4580, EAS 4720, EAS 4740, EAS 4790, EAS 4840 and EAS 5770.
- **CoursePlan:** The list lacks EAS 4060, EAS 4720 and EAS 4840; it has 'BEE 4840' instead, which is not in the roster data. It accepts EAS 4540, EAS 4760, EAS 4780, EAS 4820 and EAS 5780, none of which the catalog lists.
- **Suggested change:** Add EAS 4060, EAS 4720 and EAS 4840. Remove BEE 4840, EAS 4540, EAS 4760, EAS 4780, EAS 4820 and EAS 5780.

### 11. Physics (medium, rule)

- **Catalog:** Course 1 is PHYS 2207 OR PHYS 1112. Course 2 is PHYS 2208 OR PHYS 2213. Each slot has its own alternatives.
- **CoursePlan:** Toggleable with fixed pairs only: PHYS 2207+PHYS 2208, or PHYS 1112+PHYS 2213. A student with PHYS 1112+PHYS 2208 or PHYS 2207+PHYS 2213 cannot complete either option.
- **Suggested change:** Use a single 'courses' requirement with includesWithSubRequirements(['PHYS 2207','PHYS 1112'], ['PHYS 2208','PHYS 2213']).

### 12. Chemistry (PHYS 2214 substitution) (medium, rule)

- **Catalog:** PHYS 2214 may substitute for the second semester of chemistry only if the student has taken PHYS 1112 and PHYS 2213.
- **CoursePlan:** Option 3 accepts PHYS 2214 with no condition and no warning.
- **Suggested change:** Add a checkerWarning or description noting that PHYS 2214 counts only after PHYS 1112 and PHYS 2213.

### 13. Field Work (medium, rule)

- **Catalog:** The field course depends on the concentration. Climate Science: EAS 2500. Environmental and Geological Sciences: EAS 4370. Ocean Sciences: at least 3 credits from Shoals Marine Lab, SEA or Woods Hole courses. Other options for all concentrations: approved outside field courses, field research/REU, or EAS 4910/EAS 4920 research totaling at least three credits. A non-credit research option requires an additional EAS concentration course.
- **CoursePlan:** Requires 3 credits of any 'EAS \*\*\*\*' course, with a warning. Shoals (BIOSM) or other non-EAS field courses cannot count. Because double counting is not allowed, this requirement can take EAS courses away from the Concentration requirement.
- **Suggested change:** Make Field Work a self-check, or list EAS 2500, EAS 4370, EAS 4910 and EAS 4920 with a warning. Describe the per-concentration options, and avoid an EAS wildcard that competes with concentration courses.

### 14. Chemistry (labs) (low, course-list)

- **Catalog:** Each chemistry option is a lecture & lab pair: CHEM 2070 & CHEM 2071, CHEM 2090 & CHEM 2091, CHEM 2080 & CHEM 2081.
- **CoursePlan:** Only the lectures CHEM 2070/CHEM 2090 and CHEM 2080 are checked. CHEM 2071, CHEM 2081 and CHEM 2091 are never required.
- **Suggested change:** Add the lab courses to the slots, or note the lab requirement in the description.

### 15. Concentration descriptions (low, description)

- **Catalog:** Each focused elective has four core courses, including EAS 2250, plus 5 focused elective courses. The lists include 1000/2000-level courses such as EAS 1400, EAS 2400 and BEE 2000.
- **CoursePlan:** Every option says 'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.'
- **Suggested change:** Drop the '3000-level or above' wording. Note that EAS 2250 is the fourth core course and is tracked under 'Introductory Course'.

### 16. Introductory Course (low, description)

- **Catalog:** EAS 2250 is listed as a required core course in every focused elective. There is no 'Additional Required Courses' section and no stated rule about taking an extra elective if EAS 2250 is used as an ENGRD.
- **CoursePlan:** The description refers to an 'Additional Required Courses' section below and requires an extra major-approved elective if EAS 2250 counts as an ENGRD.
- **Suggested change:** Update the description to say EAS 2250 is the shared core course required for all focused electives. Remove the reference to the nonexistent section.

### 17. All requirements (source) (low, other)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/earth-climate-sciences-ecsen-bs/.
- **CoursePlan:** Every requirement uses source https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether CoursePlan's Duffield Engineering college requirements already enforce MATH 2930/MATH 2940 for this major. If they do, the missing math courses in eas.ts matter less.
- The college table lists 'Major-approved electives ≥9' and 'Courses outside the major ≥9'. The catalog does not say which courses EAS accepts for these, so I cannot tell whether eas.ts should model them.
- Which Shoals Marine Lab, Sea Education Association or Woods Hole courses count toward the Ocean Sciences field requirement. The catalog names the programs but not the course codes.
- Whether a course that appears both as a core course and in the same concentration's elective list (for example EAS 4710 for Environmental Science) is meant to count only once. The catalog lists it in both places.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
