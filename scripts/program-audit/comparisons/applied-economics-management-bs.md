# Applied Economics and Management (major)

- Catalog: https://catalog.cornell.edu/programs/applied-economics-management-bs/ (2026-2027 edition)
- Data file: `src/data/majors/aem.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The AEM data file is substantially out of date against the 2026-2027 catalog. Several things are missing: AEM 2700, AEM 3205 and AEM 1101 from the core, and the full calculus list. The quantitative-methods and applied-economics category lists are stale. The Grand Challenges sequence still uses the old three-part structure. The concentration set no longer matches the catalog: Agribusiness Management is retired, the EERE, Food and International concentrations are renamed and restructured, the Business Analytics electives match nothing, and the Strategy counts are swapped. The CALS-credit minimum is 55 instead of 75. Many course lists add retired courses and omit current ones.

## Findings

### 1. Management Requirements / Economics and Management core (high, missing-requirement)

- **Catalog:** Core includes AEM 2700 (Management Communication) and AEM 3205 (Ethics in Business and Organizations) in addition to AEM 2200, 2225, 2240, 2420, 2600, 2601, 3200, 3230, ECON 1110, ECON 1120.
- **CoursePlan:** Management Requirements slots: AEM 2200, 2225, 2240, 2420, 2601, 3200, 3230. AEM 2700 and AEM 3205 are not required anywhere.
- **Suggested change:** Add slots for AEM 2700 and AEM 3205 to the core requirements.

### 2. Quantitative Methods Requirements – Calculus (high, course-list)

- **Catalog:** Calculus may be fulfilled by MATH 1110, MATH 1120, MATH 1910, MATH 1920, MATH 2210, MATH 2220, MATH 2230, MATH 2310, MATH 2930, MATH 2940.
- **CoursePlan:** Only MATH 1110 or MATH 1120 accepted.
- **Suggested change:** Add MATH 1910, 1920, 2210, 2220, 2230, 2310, 2930 and 2940 to the calculus slot.

### 3. Quantitative Methods Elective Requirements (high, course-list)

- **Catalog:** 3 credits from AEM 2830, 2840, 2850, 3100, 3105, 4060, 4110, 4190, 4600, ECON 3120, 3130, 3140, 4020, STSCI 3080.
- **CoursePlan:** Accepts AEM 2770, 2830, 2840, 3100, 3390, 4060, 4110, 4120, 4190, BTRY/ILRST/STSCI 3080, ECON 3130, 3140, 4020, ILRST 2110, ILRST 3110. AEM 2850, AEM 3105, AEM 4600 and ECON 3120 are missing.
- **Suggested change:** Add AEM 2850, AEM 3105, AEM 4600 and ECON 3120. Remove AEM 2770, AEM 3390, AEM 4120, ILRST 2110 and ILRST 3110.

### 4. Applied Economics Requirements (high, course-list)

- **Catalog:** At least six credits from two different categories. Sustainable Business and Economic Policy: AEM 2500, 4500, 4510. Economic Analysis: AEM 3105, 3310, 4100, 4140, 4160, 4550. International Markets and Development: AEM 2300, 2350, 4300, 4315, 4350, 4420, 4450, 4485, 4545. Food and Agricultural Economics: AEM 2310, 4150, 4210.
- **CoursePlan:** Category 1 adds AEM 4515. Category 2 lacks AEM 3105. Category 3 lacks AEM 4315. Category 4 lacks AEM 2310 and adds AEM 4310. Categories use the old names (Environmental, Energy, and Resource Economics; International Trade and Development).
- **Suggested change:** Add AEM 3105, AEM 4315 and AEM 2310. Remove AEM 4515 and AEM 4310. Rename the slots to the current category names.

### 5. Grand Challenges Introduction (high, missing-requirement)

- **Catalog:** Grand Challenges Introduction: AEM 1101, waived for transfer students.
- **CoursePlan:** No requirement for AEM 1101.
- **Suggested change:** Add a Grand Challenges Introduction requirement for AEM 1101, with a note that transfer students are waived.

### 6. Grand Challenges Reqiurement Part 1: Written expression course (high, extra-requirement)

- **Catalog:** Grand Challenges is AEM 1101, then Project Preparation, then Project. There is no written expression course step.
- **CoursePlan:** Requires one of AEM 2000, 2555, 2800, 2805, 4940.
- **Suggested change:** Remove this requirement and replace it with the AEM 1101 Introduction.

### 7. Grand Challenges Reqiurement Part 2: Pre-Project Weekend Immersion (high, course-list)

- **Catalog:** Grand Challenges Project Preparation: complete 1.5 credits from AEM 3000 or AEM 4401.
- **CoursePlan:** Only AEM 3000 accepted.
- **Suggested change:** Add AEM 4401 and rename the requirement to Grand Challenges Project Preparation.

### 8. Grand Challenges Reqiurement Part 3: Project Course (high, course-list)

- **Catalog:** Complete 3 credits from AEM 3260, 3385, 4000, 4001, 4002, 4003, 4004, 4006, 4375, 4875, 4876.
- **CoursePlan:** One course, AEM 4000 only.
- **Suggested change:** Accept the full list and count by credits (3) so that the 0.5- and 2-credit Grand Challenges Abroad courses combine correctly.

### 9. CALS Credits (high, count-or-credits)

- **Catalog:** 75 CALS credits required (55 for transfer students) under the 2025+ curriculum. AEM counts only for accepted AEM majors. BSOC counts only for students entering Fall 2025 or earlier. Up to two FWS courses count, and courses cross-listed with a CALS prefix count.
- **CoursePlan:** 55 CALS credits required. The checker accepts AG acadGroup plus AEM, BIOEE, BIOMG, BIOMI, BIONB, BSOC, EAS, INFO, NS, STSCI. FWS courses are not handled.
- **Suggested change:** Raise the minimum to 75, with a transfer note or toggle for 55. Align the accepted prefixes with the catalog list (add ALS, COMM, ENVS, GDEV, STSCI, etc. if not covered by acadGroup AG). Handle the two-course FWS allowance.

### 10. AEM Concentration – Agribusiness Management (high, extra-requirement)

- **Catalog:** The concentrations are Accounting, Applied Economics, Business Analytics, Entrepreneurship, Finance, Food Business Management, International Markets and Development, Marketing, Strategy, and Sustainable Business and Economic Policy (ten).
- **CoursePlan:** Offers an Agribusiness Management option (AEM 3020, HADM 2810 or ILRHR 2600, 3 courses from a list), and the description says there are eleven concentrations.
- **Suggested change:** Remove the Agribusiness Management option and update the description to ten concentrations.

### 11. Concentration – Applied Economics (high, course-list)

- **Catalog:** ECON 3040. At least 12 credits from AEM 2300, 2310, 2350, 2500, 3310, 3350, 4100, 4140, 4150, 4160, 4210, 4300, 4315, 4350, 4420, 4450, 4485, 4500, 4510, 4545, 4550. At least 3 credits from AEM 2830, 2840, 2850, 3100, 3105, 4060, 4110, 4190, ECON 3120, 3130, 3140, 4020, STSCI 3080.
- **CoursePlan:** Applied econ list lacks AEM 2310, 3350, 4315 and adds AEM 4515, 4310. The QM list lacks AEM 2850, 3105, ECON 3120. It adds AEM 2100, AEM 2010, AEM 2770, 3390, 4120, ILRST 2110, ILRST 3110, plus a malformed code 'AEM MATH 1110'. The option is named 'Applied Economics and Management'.
- **Suggested change:** Replace both lists with the catalog lists, remove the core courses AEM 2100 and AEM 2010 and the malformed code, and rename the option to 'Applied Economics'.

### 12. Concentration – Business Analytics (high, course-list)

- **Catalog:** AEM 3100 or AEM 4110. AEM 2830, 2840 or 2850. AEM 2820. Six credits from AEM 3105, 3275, 4015, 4060, 4225, 4435, 4600, HADM 3275, NBA 4920, STSCI 4060.
- **CoursePlan:** Slot 2 accepts CS 1112 and lacks AEM 2850. Slot 3 also accepts CSS 4200. The elective slot lists AEM 2770, AEM 3460, AEM 3561 and eight blank 'AEM ' codes, which match no course, so only AEM 2770 can count and no catalog elective is accepted.
- **Suggested change:** Add AEM 2850 to slot 2 and remove CS 1112. Make slot 3 AEM 2820 only. Replace the elective slot with the catalog list of ten courses.

### 13. Concentration – Entrepreneurship (high, rule)

- **Catalog:** AEM 2220 required. Ideation min 3 cr: AEM 2180, 3110, 3255, COGST 1111, DEA 2730, INFO 3450, HADM 4144, NBA 5380, NBA 6029. Entrepreneurial Strategy min 3 cr: AEM 3249, 3251, 4650, HADM 4145, NBA 3000. Industries & Topics min 4.5 cr: AEM 3220, 3330, 3385, 4080, 4421, 4572, 4615, 4620, 4650, FSAD 4444, FSAD 4660, HADM 3610, 4130, 4315, 4800, NBA 5070. Practicum min 1.5 cr: AEM 3251, 3255, 3385, 4421, 4975, HADM 4315, NBA 6029, 6230, 6330. Min 6 of 15 credits from AEM.
- **CoursePlan:** Any 5 courses from a single flat list. That list includes retired or non-catalog codes (AEM 1220, 3245, 3250, 3340, 3380, 4370, 4371, 4380, 4390, 4420, HADM 4211). It omits most current options, e.g. AEM 3255, 3330, 3385, 4421, 4572, 4620, 4650, 4975, COGST 1111, DEA 2730, INFO 3450, HADM 4144, 4145, 3610, 4315, 4800, FSAD 4444, 4660, NBA 5070, 5380, 6029, 6330. AEM 2220 is not required.
- **Suggested change:** Restructure into the required AEM 2220 plus the four category slots with the catalog lists, counted by credits.

### 14. Concentration – Environmental, Energy, and Resource Economics (catalog: Sustainable Business and Economic Policy) (high, rule)

- **Catalog:** AEM 2500. Business and Management electives min 3 cr: AEM 2555, 4090, 4490, 4585, NBA 6030. Analytical electives min 6 cr: AEM 4500, 4510, 4516. Quantitative electives min 3 cr: AEM 2770, 2830, 2840, 2850, 3100, 4110, 6850, ECON 3120, 3140, ILRST 2110, STSCI 4060.
- **CoursePlan:** Requires ECON 3030 and ECON 3040, which the catalog does not require. The Business and Management elective category is missing. The analytical slot accepts AEM 4515 but not AEM 4516. The quant slot lacks AEM 2770, 2830, 2840, 2850, 6850 and adds HADM 3740, PLSCS 4200, HADM 4010.
- **Suggested change:** Rename to Sustainable Business and Economic Policy and drop ECON 3030 and ECON 3040. Add the Business and Management elective slot. Replace AEM 4515 with AEM 4516 and update the quant list.

### 15. Concentration – Finance (high, rule)

- **Catalog:** AEM 4570, AEM 4670, and 9 credits of electives from AEM 3520, 3360, 4060, 4210, 4230, 4231, 4232, 4260, 4280, 4290, 4545, 4572, 4590, 4681, HADM 4232. Only 3 credits from AEM 3520/AEM 3360 count toward the 9.
- **CoursePlan:** Requires AEM 3520 or AEM 3360 as a mandatory slot plus 2 courses from a list. That list lacks AEM 4231, 4232, 4545, 4572 and HADM 4232, and includes AEM 4620, 4630, 4680.
- **Suggested change:** Make AEM 3520/3360 optional within a 9-credit elective pool capped at 3 credits. Add the missing courses and remove AEM 4620, 4630, 4680.

### 16. Concentration – Food Industry Management (catalog: Food Business Management) (high, rule)

- **Catalog:** AEM 2310 and AEM 2480 required, plus electives from AEM 2050, 3020, 3260, 3270, 3440, 3610, 4015, 4150, 4210, 4400, 4450, 4460, 4470, 4600, HADM 3470.
- **CoursePlan:** Requires AEM 2480, AEM 3340 or HADM 3470, AEM 4400, and 2 of AEM 3270, 4150, 4460. AEM 2310 is not required.
- **Suggested change:** Rename to Food Business Management. Require AEM 2310 and AEM 2480. Replace the other slots with a single elective pool using the catalog list.

### 17. Concentration – International Trade and Development (catalog: International Markets and Development) (high, rule)

- **Catalog:** AEM 2300 or AEM 2350, plus 12 credits from categories A-D. A, minimum 6 cr: AEM 4005, 4300, 4315, 4350, 4415, 4420, 4421, 4450, 4485, 4545. B, maximum 3 cr: AEM 4110, 4415, ECON 3120, 3140, STSCI 3740, STSCI 4060. C, maximum 3 cr: AEM 4421, ILRGL 2300, PUBPOL 5345, CRP 6720. D, maximum 3 cr: foreign language or directed research.
- **CoursePlan:** 4 courses from AEM 2110, 4290, 4300, 4350, 4420, 4421, 4450, 4485, 4545, 4640, with no category minimums or caps.
- **Suggested change:** Rename the option. Replace the list with category A plus capped categories B–D. Remove AEM 2110, 4290 and 4640, and add AEM 4005, 4315 and 4415.

### 18. Concentration – Strategy (high, count-or-credits)

- **Catalog:** 9 credits of upper core from AEM 3220, 4160, 4190, 4600, 4615, 4620. 6 credits of electives from AEM 3010, 3050, 3110, 3245, 3249, 3260, 3270, 3320, 3350, 3610, 4015, 4080, 4421, 4550, 4585, 4650, 4665. Upper-core courses may count toward either category.
- **CoursePlan:** Upper core needs only 2 courses (labelled '6 credits') and electives need 3 (labelled '9 credits'), so the counts are swapped. The upper-core list adds AEM 4371, 4380, 4390 and lacks AEM 4600 and 4620. The elective list adds AEM 4010 and 4580 and lacks AEM 3010, 3050, 3270, 3350, 3610, 4550, 4585, 4650, 4665. Upper-core courses are not accepted as electives.
- **Suggested change:** Set upper core to 3 courses (9 credits) and electives to 2 (6 credits). Update both lists. Add the upper-core courses to the elective checker.

### 19. Management Requirements (medium, description)

- **Catalog:** AEM 3200 and AEM 3230 are listed as core requirements for all AEM majors with no concentration exception.
- **CoursePlan:** Description says AEM 3200 and AEM 3230 are optional for the applied economics, EERE and international trade concentrations.
- **Suggested change:** Remove the exemption text, or verify it against a current department source.

### 20. Economics Requirements (medium, course-list)

- **Catalog:** AEM 2600 Managerial Economics is required, with no ECON 3030 alternative.
- **CoursePlan:** Slot 'AEM 2600 or ECON 3030' accepts ECON 3030 instead, and the description mentions an EERE substitution.
- **Suggested change:** Accept only AEM 2600 and remove the ECON 3030 alternative from the checker and description.

### 21. Concentration – Accounting (medium, course-list)

- **Catalog:** AEM 3360, AEM 3370, and 9 credits from AEM 3520, 4225, 4520, 4521, 4530, 4531, 4532, 4533, 4534, 4560, NBA 5090, 5110, 5350, 5355.
- **CoursePlan:** The elective list omits NBA 5350 and NBA 5355 and includes AEM 4535.
- **Suggested change:** Add NBA 5350 and NBA 5355 and remove AEM 4535. Consider counting electives by credits (9).

### 22. Concentration – Marketing (medium, course-list)

- **Catalog:** 9 credits from AEM 2480, 3249, 3270, 4015, 4080, 4095, 4140, 4150, 4160, 4400, 4435, 4460, 4470, 4480, 4550, HADM 4480, NBA 6090.
- **CoursePlan:** The list includes AEM 3245, 4420, 4495 and omits AEM 2480, 4140, 4460, 4470, 4480, HADM 4480 and NBA 6090.
- **Suggested change:** Replace the elective list with the catalog list.

### 23. AEM Concentration Requirement (low, description)

- **Catalog:** Ten concentrations are listed, with no stated rules about choosing at most two, about electives shared between two concentrations, or about core courses double counting except in EERE.
- **CoursePlan:** The description cites eleven concentrations and rules referencing the retired EERE concentration.
- **Suggested change:** Update the description to the current concentration names and remove rules not supported by current sources.

### 24. Grand Challenges requirement names (low, description)

- **Catalog:** Grand Challenges Introduction, Project Preparation, Project.
- **CoursePlan:** The names say 'Reqiurement' (typo), use the old Part 1/2/3 framing, and the descriptions say 'Taking during'.
- **Suggested change:** Fix the typo and rename the requirements to match the catalog.

## Could not verify

- Food Business Management elective credit amount: the catalog text says 'minimum of 9 credits' but the table shows [6 cr].
- Whether courses used for core Applied Economics or Quantitative Methods can also count toward a concentration (e.g., AEM 2500 in Sustainable Business and Economic Policy, AEM 3100/4110 in Business Analytics). The catalog shown does not state the overlap rule, so the need for allowCourseDoubleCounting cannot be determined.
- Whether the CALS-credit checker's acadGroup 'AG' test covers all catalog CALS prefixes (ALS, COMM, ENVS, GDEV, LEAD, etc.); acadGroup values are not in the inputs.
- The rule limiting concentrations to two and the cross-concentration elective sharing rule, which are not in the catalog text provided.
- Whether the 55-credit CALS minimum still applies to students who entered before Fall 2025; the catalog only describes the 2025+ curriculum.
- The Entrepreneurship rule that at least 6 of 15 credits must be AEM cannot be enforced by the checker; how CoursePlan should encode it is unclear.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
