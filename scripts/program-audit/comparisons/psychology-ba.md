# Psychology (major)

- Catalog: https://catalog.cornell.edu/programs/psychology-ba/ (2026-2027 edition)
- Data file: `src/data/majors/psych.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file is out of date with the 2026-2027 catalog. It has no Research Methods/Scientific Literacy requirement and no 3000-level/4000-level depth requirement. Its breadth requirement uses three fixed slots instead of 'one course in three of four areas', and it omits the Development area entirely. The breadth course lists also differ sharply from the catalog tables: many listed courses are missing and many old or unlisted courses are accepted. The 40-credit requirement does not apply the 12-credit cap on PSYCH 4700/4710.

## Findings

### 1. Research Methods/Scientific Literacy (high, missing-requirement)

- **Catalog:** Proficiency in research methods/scientific literacy must be shown before senior year by passing (C- or better) one of BIOG 1500, COMM 2820, GOVT 3999, HD 4765, PSYCH 2830, PSYCH 2930, PSYCH 3020, PSYCH 3420, STS 2011.
- **CoursePlan:** No such requirement exists in psych.ts.
- **Suggested change:** Add a 'Research Methods/Scientific Literacy' requirement using includesWithSingleRequirement('BIOG 1500','COMM 2820','GOVT 3999','HD 4765','PSYCH 2830','PSYCH 2930','PSYCH 3020','PSYCH 3420','STS 2011') with perSlotMinCount [1]. PSYCH 3420 is also a breadth course, so set allowCourseDoubleCounting so it can count in both places.

### 2. Depth (3000- and 4000-level) (high, missing-requirement)

- **Catalog:** To ensure depth, students are required to take at least one course from the 3000 level and one course from the 4000 level.
- **CoursePlan:** No depth requirement exists.
- **Suggested change:** Add a requirement with two slots, e.g. includesWithSubRequirements(['PSYCH 3***'],['PSYCH 4***']) with perSlotMinCount [1,1], and set allowCourseDoubleCounting.

### 3. General Requirements (breadth) (high, rule)

- **Catalog:** Breadth is met by at least one course in three of four areas: Perception and Cognition; Development; Cognitive and Behavioral Neuroscience; Social and Personality Psychology.
- **CoursePlan:** Three fixed slots (PCD, BEN, S&P), each requiring one course (perSlotMinCount [1,1,1]), with no Development slot. The description says students should take 'at least one course in each of the following three areas'.
- **Suggested change:** Use four slots (Perception and Cognition, Development, Cognitive and Behavioral Neuroscience, Social and Personality) with perSlotMinCount [1,1,1,1] and minNumberOfSlots 3. Update the description to say 'three of the following four areas'.

### 4. General Requirements – Development area (high, course-list)

- **Catalog:** The Development area lists HD 2180, HD 3290, PSYCH 1131 (HD 1130), PSYCH 2090 and PSYCH 4550.
- **CoursePlan:** There is no Development slot. PSYCH 2090 is placed in the PCD (perception/cognition) slot, and HD 2180, HD 3290, PSYCH 1131 and PSYCH 4550 are not accepted anywhere.
- **Suggested change:** Create a Development slot containing HD 2180, HD 3290, PSYCH 1131, PSYCH 2090 and PSYCH 4550, and remove PSYCH 2090 from the Perception and Cognition slot.

### 5. General Requirements – Perception and Cognition slot (high, course-list)

- **Catalog:** The Perception and Cognition area lists HD 2200, PSYCH 1102, PSYCH 2050, PSYCH 2150, PSYCH 2580, PSYCH 3140, PSYCH 3190, PSYCH 3420, PSYCH 4150, PSYCH 4270 and PSYCH 4331.
- **CoursePlan:** The PCD slot does not accept HD 2200 (or COGST 2200), PSYCH 2580, PSYCH 3190 or PSYCH 4150.
- **Suggested change:** Add HD 2200, PSYCH 2580, PSYCH 3190 and PSYCH 4150 to the Perception and Cognition slot.

### 6. General Requirements – Cognitive and Behavioral Neuroscience slot (high, course-list)

- **Catalog:** The Cognitive and Behavioral Neuroscience area lists HD 2200, HD 3530, PSYCH 2230, PSYCH 3150, PSYCH 3220 and PSYCH 4230.
- **CoursePlan:** The BEN slot does not accept HD 2200, HD 3530 (or COGST 3530) or PSYCH 3150 (or NS 3150).
- **Suggested change:** Add HD 2200, HD 3530 and PSYCH 3150 to the neuroscience slot. HD 2200 appears in both the Perception and Cognition and the neuroscience tables.

### 7. General Requirements – Social and Personality slot (high, course-list)

- **Catalog:** The Social and Personality Psychology area lists PSYCH 2250, PSYCH 2415, PSYCH 2650, PSYCH 2750, PSYCH 2800, PSYCH 2940, PSYCH 3135, PSYCH 3450, PSYCH 3820 and PSYCH 4940.
- **CoursePlan:** The S&P slot does not accept PSYCH 2415, PSYCH 3135, PSYCH 3450, PSYCH 3820 or PSYCH 4940. PSYCH 2250 is accepted only through its cross-listing with PSYCH 3250.
- **Suggested change:** Add PSYCH 2250, PSYCH 2415, PSYCH 3135, PSYCH 3450, PSYCH 3820 and PSYCH 4940 to the Social and Personality slot.

### 8. General Requirements – courses not in catalog breadth tables (medium, course-list)

- **Catalog:** The breadth tables list only the courses above.
- **CoursePlan:** The slots also accept courses absent from the catalog tables. PCD: PSYCH 3160, 3350, 4120, 4180, 4280, 4320, 4360, 4370, 4650, 4770, 4780. BEN: PSYCH 3240, 3260, 3320, 4200, 4240, 4250, 4260, 4350, 4390, 4400, 4410. S&P: PSYCH 1500, 2820, 3270, 3280, 3800, 3850, 4050, 4300, 4810, 4820, 4840, 4850, 4910.
- **Suggested change:** Limit each slot to the catalog table courses, unless the department confirms that these upper-level courses also count toward breadth.

### 9. Credit Requirements (medium, rule)

- **Catalog:** Up to 12 credits of independent study or field work (PSYCH 4700 and PSYCH 4710) may be counted towards the major.
- **CoursePlan:** The 'PSYCH \*\*\*\*' checker counts all PSYCH 4700/4710 credits toward the 40 credits with no cap.
- **Suggested change:** Enforce the 12-credit cap on PSYCH 4700/4710, or add a checkerWarning stating that only 12 such credits count.

### 10. General Requirements / Statistics Requirements – codes no longer offered (low, course-list)

- **Catalog:** These codes do not appear in the catalog.
- **CoursePlan:** The checkers list codes that are not in the roster data: PSYCH 3850, 4120, 4200, 4240, 4260, 4280, 4300, 4350, 4370, 4400, 4410, 4650, 4780, 4820, NTRES 3130 and SCO 3010.
- **Suggested change:** Remove these codes, since no student can add them.

### 11. Statistics Requirements (low, description)

- **Catalog:** Proficiency can be shown by passing PSYCH 2500, an approved statistics course or sequence in another Cornell department, an approved external course or sequence of at least 6 credits (approved by Professor Cleland), or an exemption exam.
- **CoursePlan:** The requirement is checked only against a fixed course list. The description does not mention the external-course or exemption-exam options, or that proficiency is due before senior year.
- **Suggested change:** Add a checkerWarning describing the exemption exam and external-course approval routes, and the before-senior-year deadline.

## Could not verify

- Which non-PSYCH statistics courses (ILRST 2100, STSCI 2100, BTRY 3010, PAM 2100, ILRST 3100, ECON 3110, ECON 3130, AEM 2100, STSCI 2150, etc.) are department-approved; the catalog only says 'an approved course or course sequence in statistics in some other department at Cornell'.
- Whether courses in the breadth tables that are not cross-listed with PSYCH (HD 2200, HD 2180, HD 3290, HD 3530) count toward the 40 psychology credits; the 'PSYCH \*\*\*\*' checker excludes them.
- Whether upper-level PSYCH courses outside the breadth tables count toward a breadth area; the catalog describes the tables as identifying introductory courses with few or no prerequisites, so the tables may not be exhaustive.
- Whether any PSYCH-numbered First-Year Writing Seminars exist that the 'PSYCH \*\*\*\*' credit checker would wrongly count, since the catalog says FWS cannot count toward the credit requirement.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
