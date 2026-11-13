# Fashion Design and Management (major)

- Catalog: https://catalog.cornell.edu/programs/fashion-design-management-bs/ (2026-2027 edition)
- Data file: `src/data/majors/fsad.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The fsad.ts file is substantially out of date compared with the 2026-2027 catalog. It encodes only an older version of Option I (Fashion Design) and leaves out Option II (Fashion Design Management) entirely. Within Option I, several things are wrong:

- The core list is wrong: it adds FSAD 1111, FSAD 4700 and FSAD 4770 and omits FSAD 3320.
- The Advanced Studios requirement and the 11-credit Outside Fashion Design and Management requirement are missing.
- The upper-level FSAD electives use the wrong levels.
- The Psychology, Statistics, Natural Science I and Ethics/Sustainability course lists accept courses the catalog does not and reject courses it does.
- Natural Science II and Additional Distribution use obsolete distribution codes.
- Social Science omits GDEV.
- The Art History check also accepts ART courses because of how `ifCodeMatch` handles shorter subject codes.

## Findings

### 1. Fashion Design Management (Option II) (high, missing-requirement)

- **Catalog:** The major has two options. Option II has its own requirements:
- Core: FSAD 1140, 1250, 1350, 1360, 1450, 2310, 2370, 2660, 3200, 3320, 3330, 4440, 4660.
- Three additional FSAD courses, one at the 4000-6000 level.
- Introduction to Management, Marketing, a COMM course, Business Strategy, Accounting and Data Analysis.
- Psychology from HD 1130 or PSYCH 1101.
- Social Science, Economics, Humanities, Quantitative Analysis, Natural Science I and II, Ethics, and the 11-credit Outside requirement.
- **CoursePlan:** Only Fashion Design (Option I) requirements are encoded. There is no option toggle and no Option II requirements.
- **Suggested change:** Add Option II as a separate set of requirements, or make the option-specific requirements toggleable, following the catalog lists.

### 2. Fashion Design Core (high, course-list)

- **Catalog:** Core courses are FSAD 1140, 1170, 1250, 1350, 1360, 1450, 2310, 2370, 2640, 2650, 2660, 3320 and 3770 (13 courses, 38 credits).
- **CoursePlan:** Requires 15 slots: FSAD 1111, 1140, 1170, 1250, 1350, 1360, 1450, 2310, 2370, 2640, 2650, 2660, 3770, 4700 and 4770.
- FSAD 1111 (last offered FA23), FSAD 4700 and FSAD 4770 are required although the catalog does not require them.
- FSAD 3320 is missing.
- **Suggested change:** Remove FSAD 1111, FSAD 4700 and FSAD 4770, add FSAD 3320, and update `slotNames` and `perSlotMinCount` to 13 slots.

### 3. Advanced Studios (Option I) (high, missing-requirement)

- **Catalog:** Select three of FSAD 3250, 3370, 3650, 3770, 3990, 4370, 4700 and 4770. These courses cannot double count for FSAD Additional Courses.
- **CoursePlan:** There is no Advanced Studios requirement. FSAD 4700 and 4770 are instead hard-required in the core.
- **Suggested change:** Add a requirement accepting FSAD 3250, 3370, 3650, 3770, 3990, 4370, 4700 and 4770, with a count of 3.

### 4. Fashion Design Additional Courses (high, rule)

- **Catalog:** Any two FSAD courses at the 4000-6000 level, one of which must be at the 6000 level. Advanced Studios coursework cannot count here. FSAD 4000, 4010, 4020, 4030 and 4990 cannot count.
- **CoursePlan:** Accepts any two FSAD courses at the 3**_, 4_** or 6\*\*\* level.
- 3000-level courses are accepted.
- 5000-level courses are rejected.
- There is no rule that one course must be at the 6000 level.
- The description says '3000, 4000, or 6000 level'.
- **Suggested change:** Restrict the checker to FSAD 4**_, 5_** and 6**_, and add a sub-slot or additionalRequirement for one FSAD 6_** course. Update the description to match.

### 5. Outside Fashion Design and Management Requirement (11 credits) (high, missing-requirement)

- **Catalog:** At least 11 credits from DEA, HD, HE (1500 level or higher), NS or PUBPOL.
- FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400 and special studies (4000, 4010, 4020, 4030) do not count.
- These courses may double count with Humanities, Psychology, Social Science, Natural Science II, Ethics, Additional Distribution and electives.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add an 11-credit requirement with the subject and exclusion rules, and set `allowCourseDoubleCounting`.

### 6. Psychology (high, course-list)

- **Catalog:** Option I: one of HD 1130, HD 2310, PSYCH 1101 or DEA 1500.
- **CoursePlan:** Accepts HD 1150, HD 1170 and PSYCH 1101.
- HD 1130 (= PSYCH 1131), HD 2310 (= PSYCH 2300 / COGST 2350) and DEA 1500 (= PSYCH 1500 / COGST 1500) are rejected.
- HD 1150 and HD 1170 are accepted although the catalog does not list them.
- **Suggested change:** Replace the list with ['HD 1130', 'HD 2310', 'PSYCH 1101', 'DEA 1500'].

### 7. Statistics (Quantitative Analysis) (high, course-list)

- **Catalog:** One of PUBPOL 2100, AEM 2100 or ILRST 2100.
- **CoursePlan:** Accepts PAM 2100 (= PUBPOL 2100), AEM 2100 and STSCI 2100 (= ILRST 2100), and also PSYCH 2500 (= PSYCH 3500), which the catalog does not list.
- **Suggested change:** Remove PSYCH 2500. Optionally list the current codes PUBPOL 2100 and ILRST 2100 and rename the requirement Quantitative Analysis.

### 8. Natural Science I (high, course-list)

- **Catalog:** One course from the following lists, or an AP score of 5:
- Biology: BIOG 1140, BIOG 1440/1445, BIOMG 1350, BIOEE 1610.
- Chemistry: CHEM 1560, CHEM 2070 & 2071, CHEM 2080 & 2081.
- Physics: PHYS 2207, PHYS 2208.
- **CoursePlan:** Also accepts PHYS 1101 and PHYS 1102, which the catalog does not list.
- **Suggested change:** Remove PHYS 1101 and PHYS 1102.

### 9. Natural Science II (high, rule)

- **Catalog:** Any course with distribution PBS-HE, BIO-AS, PHS-AS, BIO-AG or BSC-AG. Must be taken at Cornell; AP credits are not accepted.
- **CoursePlan:** Matches only the substrings 'PBS', 'BIOLS-AG' and 'BIONLS-AG'. Courses carrying BIO-AS, PHS-AS, BIO-AG or BSC-AG are rejected. `disallowTransferCredit` is not set.
- **Suggested change:** Change the distribution list to ['PBS-HE', 'BIO-AS', 'PHS-AS', 'BIO-AG', 'BSC-AG'], set `disallowTransferCredit`, and update the description.

### 10. Ethics-Sustainability (high, course-list)

- **Catalog:** One of DEA 4220, FSAD 3200, FSAD 4021 & FSAD 4022, FSAD 4025, FSAD 4682 or FSAD 4800.
- **CoursePlan:** The checker's list differs from the catalog in both directions.
- Accepted although not in the catalog: AEM 3205, BEE 3299, BSOC 2061/PHIL 2960/STS 2061, COMM 4300, CRP 3011, DSOC 3240, INFO 1200, INFO 4270, NTRES 3320.
- Rejected although the catalog lists them: FSAD 4025 (= DEA 4025), FSAD 4682, FSAD 4800 (= DEA 4800).
- FSAD 4021 counts without FSAD 4022.
- **Suggested change:** Replace the list with DEA 4220, FSAD 3200, FSAD 4021 (paired with 4022), FSAD 4025, FSAD 4682 and FSAD 4800.

### 11. Social Science (high, course-list)

- **Catalog:** One course from Anthropology (ANTHR), Sociology (SOC) or Global Development (GDEV).
- **CoursePlan:** Accepts ANTHR, DSOC and SOC. GDEV courses are rejected. The description mentions 'Development Sociology'.
- **Suggested change:** Replace DSOC with GDEV in the checker and update the description.

### 12. Art History (high, rule)

- **Catalog:** One Art History (ARTH) course of at least 3 credits.
- **CoursePlan:** The checker is `ifCodeMatch(subject, 'ARTH')`. `ifCodeMatch` only compares up to the length of the course string, so the subject 'ART' (Art, AAP) also matches. No 3-credit minimum is enforced.
- **Suggested change:** Use `subject === 'ARTH'` and add `courseMeetsCreditMinimum(course, 3)`.

### 13. Fashion Design Additional Requirements (Additional Distribution Coursework) (high, rule)

- **Catalog:** 9 credits from distribution codes PBS-HE, ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BIO-AG, BSC-AG, SBA-AG, SBA-HE, KCM-AG, KCM-HE, MQR-HE, LA-AG, LAD-HE, CA-AG, CA-HE, HA-AG or HA-HE. Language courses may count.
- **CoursePlan:** Matches only the substrings PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA and HA.
- Courses carrying ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BIO-AG or BSC-AG are rejected.
- The short substrings also admit codes the catalog does not list, such as MQR-AAP.
- **Suggested change:** Replace the list with the exact catalog codes and update the description.

### 14. Natural Science I (medium, rule)

- **Catalog:** CHEM 2070 must be taken with CHEM 2071, and CHEM 2080 with CHEM 2081.
- **CoursePlan:** CHEM 2070 or CHEM 2080 alone satisfies the requirement. The labs are not required.
- **Suggested change:** Require the paired lab, for example with a checkerWarning or an additional slot for CHEM 2071/2081.

### 15. Natural Science I (medium, rule)

- **Catalog:** An AP Biology, AP Chemistry or AP Physics score of 5 satisfies the requirement.
- **CoursePlan:** Only listed Cornell courses are accepted. No AP exam option is encoded.
- **Suggested change:** Add AP Biology, AP Chemistry and AP Physics (score 5) equivalents, or a checkerWarning.

### 16. Statistics / Natural Science II (low, rule)

- **Catalog:** Must be taken at Cornell; AP credits are not accepted.
- **CoursePlan:** Neither requirement sets `disallowTransferCredit`.
- **Suggested change:** Add `disallowTransferCredit: true` to both requirements.

### 17. All requirements (source) (low, description)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/fashion-design-management-bs/.
- **CoursePlan:** Every requirement links to https://courses.cornell.edu/preview_program.php?catoid=45&poid=23626.
- **Suggested change:** Update the source URLs.

## Could not verify

- FSAD 3770 appears both in the Option I core list and in the Advanced Studios choices. The catalog does not say whether it can satisfy both or whether its listing in the core is an error.
- Whether Natural Science I in the catalog means one course from any of the biology, chemistry or physics lists (as the file assumes) or one from each. The prose says only 'Natural Science I' followed by three tables.
- Whether AP/IB/A-Level Psychology or Economics scores (accepted in the college exam-credit table) may satisfy the major's Psychology and Introductory Economics requirements.
- How CoursePlan represents AP exam scores, which determines how the AP score of 5 option for Natural Science I should be encoded.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
