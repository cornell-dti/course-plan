# Biomedical Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/biomedical-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/bme.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The BME data file is out of date against the 2026-2027 catalog. In the core, the checker drops BME 2210 and BME 2080 and still requires BME 2310, which has not been offered since SP21. The statistics option rejects STSCI 2150 and accepts CEE 3040, which the catalog does not list. In the concentrations, every option requires 6 elective courses where the catalog requires 6 credits. MCSE checks BME 3020 instead of BME 3110. BMMB rejects the CHEM 1570 alternative to PHYS 2214. Every elective list is missing many catalog courses and some accept courses the catalog no longer lists. Several descriptions, the 13-credit figure and the 'Engineering Distriubtions' requirement also disagree with the catalog.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** BME 2210 (Biomaterials: Foundations and Application in Medicine) is a required core course.
- **CoursePlan:** The description lists BME 2210, but the checker has no BME 2210 slot, so it is never required or counted.
- **Suggested change:** Add a ['BME 2210'] sub-requirement and slot.

### 2. Core Courses (high, course-list)

- **Catalog:** The core list does not include BME 2310.
- **CoursePlan:** A slot requires BME 2310, which was last offered SP21, so current students can never fulfil the requirement.
- **Suggested change:** Remove the BME 2310 slot.

### 3. Core Courses (high, missing-requirement)

- **Catalog:** BME 2080 Experiential Learning Seminar (1 cr) is a required core course.
- **CoursePlan:** BME 2080 is not required or accepted anywhere.
- **Suggested change:** Add a ['BME 2080'] slot to Core Courses.

### 4. Core Courses – statistics slot (high, course-list)

- **Catalog:** STSCI 2200 or STSCI 2150 or ENGRD 2700.
- **CoursePlan:** Accepts 'BTRY 3010' (same course as STSCI 2200), 'CEE 3040' and 'ENGRD 2700'. STSCI 2150 is rejected and CEE 3040 is accepted although the catalog does not list it.
- **Suggested change:** Change the slot to ['STSCI 2200', 'STSCI 2150', 'ENGRD 2700'] and update its slot name.

### 5. Biomedical Engineering Concentrations – elective slot (all four options) (high, count-or-credits)

- **Catalog:** Select six credits of electives in each concentration.
- **CoursePlan:** Each option counts 'courses' with perSlotMinCount 6 on the elective slot, so 6 elective courses are required (roughly 18+ credits). The descriptions also say '6 elective courses'.
- **Suggested change:** Count the elective slot in credits (6). This may require splitting the required concentration courses and the electives into separate requirements, or using credit counting for the elective part.

### 6. Concentrations – MCSE second slot (high, course-list)

- **Catalog:** MCSE requires BME 3110 Cellular Systems Biology.
- **CoursePlan:** The checker slot accepts BME 3020 (already a core course; without double counting it cannot fill both), while the description says BME 3110. BME 3110 is rejected.
- **Suggested change:** Replace ['BME 3020'] with ['BME 3110'] and update the slot name.

### 7. Concentrations – MCSE electives (high, course-list)

- **Catalog:** The list includes BIOAP/ANSC 4270, BIOCB 4381, BIOCB 4830, BIOCB 4840/CS 4775, BIOMG 4380, BIOMG 4390, BIOMS/BIOMI 4090, BIONB/BME/ECE 4910 or BME 5320/BIONB 5910/ECE 5090, BIONB 3950, BME 4790, BME 5110, BME 5830, BME 5850, BME 6410, CHEM 4810 and CHEME 5430. It also allows one of CS 3780, ECE 3200, ECE 4200 or INFO 3950, or one 3xxx/4xxx course from another BME concentration.
- **CoursePlan:** Accepts only BME 5830, BME 5850, BTRY 4381, BTRY 4840, CHEM 4810, CHEME 5430 and CS 4780.
- **Suggested change:** Add ANSC 4270, BIOCB 4830, BIOMG 4380, BIOMG 4390, BIOMI 4090, BME 4910, BME 5320, BIONB 3950, BME 4790, BME 5110, BME 6410, ECE 3200, ECE 4200 and INFO 3950. Add a warning for the other-concentration option.

### 8. Concentrations – BMMB fourth science slot (high, rule)

- **Catalog:** PHYS 2214 OR CHEM 1570 (CHEM 3570 may substitute for CHEM 1570).
- **CoursePlan:** Accepts only PHYS 2214.
- **Suggested change:** Change the slot to ['PHYS 2214', 'CHEM 1570', 'CHEM 3570'].

### 9. Concentrations – BMDD electives (high, course-list)

- **Catalog:** The list includes BIOAP/BIOMS 4140, BME 5750, BME 5760, MAE 4670, MSE 5210 and MAE 6670 (as an alternative to BME 5810/MAE 4640/MSE 4020), among others.
- **CoursePlan:** These are missing: BIOMS 4140 (BIOAP 4140, BIONB 4140), BME 5750, BME 5760, MAE 4670, MSE 5210 and MAE 6670.
- **Suggested change:** Add BIOMS 4140, BME 5750, BME 5760, MAE 4670, MSE 5210 and MAE 6670.

### 10. Concentrations – BMII electives (high, course-list)

- **Catalog:** The list includes AEP 4400, BIONB 4320, BME 3320, BME/BIONB/PSYCH/COGST 3300, BME 6330, BME 6260, BME 6320, BME 6350, CS 3110, ECE 3200 or INFO 3950 (as alternatives to CS 3780/5780), ECE 3100, ECE 3140/CS 3420 or ECE 5725, ECE 3250, ECE 4250, ECE/MAE 4320, CS 4670 (alternative to ECE 5470), HD 4630, PHYS 3316 and BME 6180, plus the courses already accepted.
- **CoursePlan:** Accepts only AEP 3300, CS 4780, ECE 4300, ECE 4370, ECE 4760, ECE 4910, ECE 5470 and ECE 5780.
- **Suggested change:** Add all missing catalog courses.

### 11. Concentrations – BMMB electives (high, course-list)

- **Catalog:** The list includes BME 4410/MAE 4650, BME 6410, MAE 3230, MAE 3783, MAE 4670, MAE 4700, MAE 6670, MAE 4240/MSE 4510 and BME/MAE/MSE 6650, plus the courses already accepted.
- **CoursePlan:** These are missing: BME 4410, BME 6410, MAE 3230, MAE 3783, MAE 4670, MAE 4700, MAE 6670, MAE 4240 and MSE 6650.
- **Suggested change:** Add the missing courses.

### 12. Concentrations – CHEM 1570 slot (MCSE, BMDD) (medium, course-list)

- **Catalog:** Students may substitute CHEM 3570 for CHEM 1570.
- **CoursePlan:** Only CHEM 1570 is accepted.
- **Suggested change:** Add 'CHEM 3570' to the CHEM 1570 slots.

### 13. Concentrations – BMDD and BMMB electives OR-groups (medium, rule)

- **Catalog:** BME 5810/MAE 5680 OR BME/MAE 4640 OR MSE 4020 OR MAE 6670 is a single option in BMDD. BEE 3310 OR BME 4410 OR MAE 4650, and BEE 3500 OR MAE 3240, are single options in BMMB.
- **CoursePlan:** Each alternative is accepted as an independent elective, so several from one OR-group can count together.
- **Suggested change:** Limit each OR-group to one counted course, or add a checkerWarning.

### 14. Concentrations – BMII electives (medium, course-list)

- **Catalog:** AEP 3300 / PHYS 3330 is not listed (AEP 4400 is).
- **CoursePlan:** Accepts 'AEP 3300' (last offered FA19).
- **Suggested change:** Remove 'AEP 3300' and add 'AEP 4400'.

### 15. Concentrations – BMMB electives (medium, course-list)

- **Catalog:** MAE 4651 is not listed.
- **CoursePlan:** Accepts 'MAE 4651' (last offered SP20).
- **Suggested change:** Remove 'MAE 4651'.

### 16. Core Courses (low, description)

- **Catalog:** The core is BIOMG 1350, BME 2010, BME 2080, BME 2000, BME 2210, BME 3010, BME 3020, BME 3030, BME 4010, BME 4020, BME 4080, BME 4090, ENGRD 2020, and STSCI 2200/STSCI 2150/ENGRD 2700.
- **CoursePlan:** The description lists BME 2110, BME 2310 and BTRY 3010, and says 'CEE 3040 or ENGRD 2700 can be taken instead of BTRY 3010'.
- **Suggested change:** Rewrite the description to match the current catalog list.

### 17. Engineering Distriubtions (low, description)

- **Catalog:** The Engineering Distribution courses for BME are ENGRD 2111 and ENGRD 2020. BME 2000 (ENGRD 2202) is a core course.
- **CoursePlan:** The requirement is named 'Engineering Distriubtions' (typo) and says the distribution is ENGRD 2202. ENGRD 2111 is checked as 'BME 2110' inside Core Courses.
- **Suggested change:** Either rename this requirement to an ENGRD 2111/ENGRD 2020 distribution requirement and move BME 2000 into Core Courses, or relabel it as BME 2000/ENGRD 2202. Fix the typo either way.

### 18. Biomedical Engineering Concentrations (low, description)

- **Catalog:** Must choose one concentration: 12 credits minimum.
- **CoursePlan:** 'Choose one concentration. Must take 13 credits minimum'.
- **Suggested change:** Change the description to 12 credits minimum.

### 19. Concentrations – BMDD electives (low, course-list)

- **Catalog:** MSD 5550 is not listed.
- **CoursePlan:** Accepts 'MSD 5550', which is not in the roster data.
- **Suggested change:** Remove 'MSD 5550'.

### 20. All requirements – source (low, other)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/biomedical-engineering-bs/.
- **CoursePlan:** Sources point to old courses.cornell.edu pages (catoid=41 and catoid=36).
- **Suggested change:** Update the source URLs.

## Could not verify

- How to encode the MCSE option 'One 3xxx/4xxx course from another BME concentration', including whether other concentrations' required courses qualify.
- Whether CEE 3040 is still an approved statistics substitute through a BME handbook or department rule not shown in the catalog.
- BME 6180 appears in the BMII list without a title. Whether it and its cross-listings (ECE 5180, ECE 6695, VETCS 6180) are intended as a regular elective cannot be confirmed.
- CS 5780 is listed in BMII but is not in the cross-listing table, so whether it is currently offered cannot be checked.
- Whether OR-groups in the elective lists strictly limit students to one course per group, or are only grouping similar content.
- The prose gives two different reduced credit totals when ENGRD 2020 is the second ENGRD (125 vs 129, and 126 vs 130). Which applies is unclear.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
