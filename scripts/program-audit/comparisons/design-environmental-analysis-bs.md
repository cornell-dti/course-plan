# Design and Environmental Analysis (major)

- Catalog: https://catalog.cornell.edu/programs/design-environmental-analysis-bs/ (2026-2027 edition)
- Data file: `src/data/majors/dea.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The DEA data file follows an older catalog and does not match the 2026-2027 requirements. Core courses are wrong in both directions: it asks for DEA 1050 and DEA 5304, and omits DEA 1141, DEA 1501, DEA 2025 and DEA 4800. DEA 3550 sits in a separate requirement that also accepts ILROB 4710 and PAM 3120. The thematic list is outdated: courses are missing, retired codes are extra, and the one-per-area rule is not enforced. The Human Development/Psychology requirement lacks HD 1130. The Humanities checker uses the wrong distribution list. Natural Science II and Additional Distribution use retired distribution codes, so most qualifying courses are rejected. Physics accepts PHYS 1101/1102. Natural Science I tells students AP counts, which the catalog forbids. The 11-credit Outside of Design and Environmental Analysis requirement is missing entirely.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** Core courses: DEA 1101, DEA 1110, DEA 1141, DEA 1150, DEA 1500, DEA 1501, DEA 2025, DEA 2510, DEA 2730, DEA 3550, DEA 4040, DEA 4050, DEA 4590, DEA 4800 (40 total hours).
- **CoursePlan:** Requires DEA 1050, DEA 1101, DEA 1110, DEA 1150, DEA 1500, DEA 2030 (=DEA 4050), DEA 2510, DEA 2730, DEA 3590 (=DEA 4590), DEA 4040, DEA 5304. DEA 1141, DEA 1501, DEA 2025 and DEA 4800 are absent. DEA 1050 (last offered FA23) and DEA 5304 (last offered FA24) are required but are not in the catalog.
- **Suggested change:** Remove DEA 1050 and DEA 5304. Add slots for DEA 1501, DEA 2025 and DEA 4800. Add DEA 3550 as a core slot. Add DEA 1141 (not in roster data, so it needs a self-check or warning). Update the description to the 14 catalog courses.

### 2. Research Methods Course (high, extra-requirement)

- **Catalog:** DEA 3550 is a required core course with no alternatives.
- **CoursePlan:** A separate requirement accepts any one of DEA 3550, ILROB 4710 or PAM 3120.
- **Suggested change:** Delete this requirement and make DEA 3550 a core slot, so ILROB 4710 and PAM 3120 (=SOC 3150) no longer satisfy it.

### 3. DEA Thematic Courses (high, course-list)

- **Catalog:** The three thematic lists contain these courses:
- Design Innovation & Strategy: DEA 2200, 2201, 2203, 2750, 3050, 3301, 3306, 3530, 4402, 4403, 4040, 4375, 4500, 4990, 5210, 5520, 5540.
- Sustainable Futures: DEA 2020, 3030, 3302, 3500, 4025, 4220, 4401, 4990.
- Health & Well-Being: DEA 2700, 3308, 3510, 4700, 4990, 5500, 5700.
- **CoursePlan:** The checker omits DEA 4403, DEA 3302, DEA 4025 (=FSAD 4025), DEA 5500, DEA 5700 and DEA 4375. It accepts DEA 2550 (written as 'DEA 2550,'), DEA 2040, DEA 2422, DEA 5305 (=DEA 3304) and DEA 5560, none of which the catalog lists.
- **Suggested change:** Add DEA 4403, DEA 3302, DEA 4025, DEA 5500 and DEA 5700. DEA 4375 is not in roster data, so note it. Remove DEA 2550, DEA 2040, DEA 2422, DEA 5305 and DEA 5560.

### 4. DEA Thematic Courses (high, rule)

- **Catalog:** Choose nine courses, one course from each thematic area is required. The areas are Design Innovation & Strategy, Sustainable Futures, and Health & Well-Being. DEA 4990 can count towards one Thematic area.
- **CoursePlan:** A single slot needs any 9 courses from a combined list, so nothing checks that each area is covered.
- **Suggested change:** Restructure the requirement, for example with a total of 9 plus additionalRequirements for one course from each area's list. Alternatively, add a checkerWarning about the one-per-area rule.

### 5. Human Development or Psychology (high, course-list)

- **Catalog:** Social Sciences: select one of HD 1130 or PSYCH 1101. Must be taken at Cornell.
- **CoursePlan:** Accepts HD 1150 (last offered FA22), HC 1170 (not in roster data) and PSYCH 1101. HD 1130 (=PSYCH 1131) is not accepted.
- **Suggested change:** Replace HD 1150 and HC 1170 with HD 1130, and update the description.

### 6. Humanities (high, course-list)

- **Catalog:** Choose any course with Historical Analysis (HA-AG, HA-HE, HST-AS), Literature and the Arts (ALC-AAP, ALC-AS, ALC-HA, LA-AG, LAD-HE) or Cultural Analysis (CA-AG, CA-HE). 3-4 credits.
- **CoursePlan:** Accepts any course whose distribution contains PBS, BIOLS, BIONLS, SBA, KCM, MQR, LA, CA, HA or FL, plus any foreign-language course. Science, social-science, quantitative and language courses therefore count. ALC-AS, ALC-AAP and HST-AS courses do not. The description repeats the Additional Distribution list.
- **Suggested change:** Restrict the checker to HA-AG, HA-HE, HST-AS, ALC-AAP, ALC-AS, ALC-HA, LA-AG, LAD-HE, CA-AG and CA-HE. Remove the foreign-language clause and fix the description.

### 7. Natural Science I (Physics) (high, course-list)

- **Catalog:** Physics: PHYS 2207 or PHYS 2208.
- **CoursePlan:** Accepts PHYS 1101, PHYS 2207, PHYS 1102 and PHYS 2208.
- **Suggested change:** Remove PHYS 1101 and PHYS 1102 from the checker and the description.

### 8. Natural Science I (high, description)

- **Catalog:** Must be taken at Cornell; AP credits are not accepted for Natural Science I.
- **CoursePlan:** The description says 'If AP isn't used to satisfy the requirement...'. Each option lists '5 on AP Biology/Chemistry/Physics' as a way to satisfy it. disallowTransferCredit is not set.
- **Suggested change:** Remove the AP wording, state that the course must be taken at Cornell, and set disallowTransferCredit.

### 9. Natural Science II (high, course-list)

- **Catalog:** Any 3-credit course with a PBS-HE, BIO-AS, PHS-AS, BIO-AG or BSC-AG distribution. Must be taken at Cornell; AP not accepted.
- **CoursePlan:** Matches only distributions containing 'PBS', 'BIOLS-AG' or 'BIONLS-AG ' (with a trailing space). BIO-AS, PHS-AS, BIO-AG and BSC-AG courses are rejected. The requirement counts 3 credits, so it allows combining smaller courses. No transfer-credit restriction is set.
- **Suggested change:** Use the codes PBS-HE, BIO-AS, PHS-AS, BIO-AG and BSC-AG. Require a single course of at least 3 credits, for example with fulfilledBy 'courses' and courseMeetsCreditMinimum. Set disallowTransferCredit.

### 10. DEA Additional Requirements (high, course-list)

- **Catalog:** 6 credits of courses with any of these distributions: PBS-HE, ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BIO-AS, BIO-AG, BSC-AG, SBA-AG, SBA-HE, KCM-AG, KCM-HE, MQR-HE, LA-AG, LAD-HE, CA-AG, CA-HE, HA-AG, HA-HE. Language courses may count here.
- **CoursePlan:** Matches substrings PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, HA and FL. It rejects ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BIO-AS, BIO-AG and BSC-AG. Through substrings it also admits unlisted codes such as MQR-AAP and ALC-HA. Language courses are not accepted because courseIsForeignLang is not called.
- **Suggested change:** Replace the list with the catalog's exact distribution codes and add courseIsForeignLang(course) to the checker.

### 11. Outside of Design and Environmental Analysis Requirement (11 Credits) (high, missing-requirement)

- **Catalog:** At least 11 credits from FSAD, HD, HE (1500 level or higher), NS or PUBPOL. FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400 and Special Studies (4000, 4010, 4020, 4030) do not count. These courses may double count with Social Sciences, Humanities, Natural Science II, Additional Distribution Coursework and Free Electives.
- **CoursePlan:** No such requirement.
- **Suggested change:** Add an 11-credit requirement with allowCourseDoubleCounting. The checker should accept FSAD, HD, HE 15\*\*+, NS and PUBPOL courses. It should exclude PUBPOL 2100, PUBPOL 3120, HD 2830, HE 3400, FWS courses and x000-x030 special studies.

### 12. DEA Thematic Courses (medium, description)

- **Catalog:** Students must take at least one studio at their academic level in each of their four academic years. 5000-level studios satisfy the 4th-year studio requirement. Students may not take more than 2 studios in one semester. Letter grade only.
- **CoursePlan:** The description says three of the 9 must be studio courses and at least one must be a 2000-level studio. It also says enrolling in 2 studios at once requires approval from both instructors.
- **Suggested change:** Rewrite the description to match the catalog's one-studio-per-year rule and the letter-grade requirement. Drop the 'three studio' and instructor-approval wording.

### 13. Human Development or Psychology / Introductory Microeconomics (medium, rule)

- **Catalog:** Must be taken at Cornell. AP credits are not accepted for Psychology or Microeconomics.
- **CoursePlan:** Neither requirement sets disallowTransferCredit, unlike Statistics.
- **Suggested change:** Add disallowTransferCredit: true to both requirements and mention the rule in the descriptions.

### 14. Statistics (low, description)

- **Catalog:** PUBPOL 2100, AEM 2100, ILRST 2100, PSYCH 2500.
- **CoursePlan:** Lists PAM 2100, which is cross-listed with PUBPOL 2100, so the accepted courses agree. The description uses the old code.
- **Suggested change:** Use PUBPOL 2100 in the checker and description.

### 15. All requirements (source) (low, other)

- **Catalog:** https://catalog.cornell.edu/programs/design-environmental-analysis-bs/
- **CoursePlan:** http://courses.cornell.edu/preview_program.php?catoid=41&poid=19856#deamajorrequirements
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether CoursePlan's AP equivalency entries for Psychology, Microeconomics, Biology, Chemistry or Physics map to course ids these checkers accept. This determines whether the missing disallowTransferCredit actually lets AP count.
- The catalog lists DEA 4040 both as a core course and in the Design Innovation & Strategy thematic list. It is unclear whether it may count in both, so its omission from the thematic checker is not reported.
- Whether DEA 4990 taken several times can count toward more than one thematic course. The catalog allows it toward one area only, and the file's single 9-course slot does not limit it.
- The optional CIDA Interior Design Pathway (B-or-above grades and 3.0 GPA) is not a graduation requirement. Whether CoursePlan should model it is not determinable from the inputs.
- College-level Human Ecology requirements (HE core, distribution, FWS, 45 HE credits) appear on this page but belong to the college data file, which is not shown.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
