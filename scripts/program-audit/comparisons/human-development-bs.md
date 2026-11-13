# Human Development (major)

- Catalog: https://catalog.cornell.edu/programs/human-development-bs/ (2026-2027 edition)
- Data file: `src/data/majors/hd.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file still encodes the 2020-2021 HD curriculum sheet, and most requirements are out of date. Intro now requires HD 1130, not HD 1150/1170. A Developmental Psychology requirement (two of five courses) and the 11-credit Outside of HD requirement are missing. The breadth, depth and elective structure and credit counts differ. The Research Methods, Statistics and Natural Science I course lists are wrong. The distribution-code checkers for Social Science, Humanities, Natural Science II and Additional Distribution omit the A&S and some CALS codes the catalog accepts.

## Findings

### 1. Introductory Courses (high, course-list)

- **Catalog:** HD 1130: Introduction to Human Development (one course).
- **CoursePlan:** Requires both HD 1150 and HD 1170 (last offered FA22 and SP23); HD 1130 is not accepted.
- **Suggested change:** Replace with a single slot accepting HD 1130 (cross-listed PSYCH 1131), and update the description.

### 2. Developmental Psychology (high, missing-requirement)

- **Catalog:** Select two of HD 2090, HD 2150, HD 2170, HD 2180, HD 2510.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a 'Developmental Psychology' requirement: courses, perSlotMinCount [2], accepting HD 2090, HD 2150, HD 2170, HD 2180, HD 2510.

### 3. Breadth Requirement (high, rule)

- **Catalog:** Breadth Requirement (2-4 credits): one course from any one of five areas (Translational Research, Social and Environmental Influences, Cross-Cultural Perspectives, The Person in Context, Engaged Learning). The course lists include DEA 1500, HD 2230, HD 2250, PSYCH 2150, HD 3455, HD 3530, HD 4210, HD 4940, HD 4550, PSYCH 4150, PSYCH 4270, PSYCH 4320, PSYCH 4500, PSYCH 4770, etc.
- **CoursePlan:** Requires two courses, one each from 'Mind, Health & Emotion' and 'Cognition, Brain & Behavior'. Uses old lists that include many retired courses (e.g. HD 2520, HD 2710, HD 4070, HD 4280, HD 4300, HD 4410, HD 4520) and omit most current breadth courses (e.g. DEA 1500, HD 2230, HD 2250, HD 3455, HD 4210, HD 4940, PSYCH 4320, PSYCH 4500, PSYCH 4770).
- **Suggested change:** Replace with a single-course requirement accepting the union of the five current breadth-area lists.

### 4. Depth Coursework (HD 4000 electives / HD 3000/4000 electives) (high, rule)

- **Catalog:** Depth Coursework (6-8 credits): one HD 3000-level course and one HD 4000-level course. HD 4000, HD 4010, HD 4020, HD 4030 and HD 4990 cannot fulfill it.
- **CoursePlan:** 'HD 4000 electives' requires 6 credits at the 4000 level. A separate 'HD 3000/4000 electives' requires 12 more credits at the 3000/4000 level. Only HD 4030 and HD 4980 are excluded, so HD 4000, HD 4010, HD 4020 and HD 4990 count. No 3000-level course is required.
- **Suggested change:** Replace both with one Depth requirement: two slots, one HD 3**_ course and one HD 4_** course. Exclude HD 4000, HD 4010, HD 4020, HD 4030 and HD 4990.

### 5. Additional HD Electives (high, count-or-credits)

- **Catalog:** Additional Coursework: at least 14 HD credits (totaling up to 35 HD credits). Up to 12 credits from HD 4000, HD 4010, HD 4020 and HD 4990 may count.
- **CoursePlan:** Minimum of 6 additional HD credits of any level.
- **Suggested change:** Raise perSlotMinCount to 14 and update the description. Note the 12-credit special-studies cap (e.g. via checkerWarning).

### 6. Scientific Research Methods (high, course-list)

- **Catalog:** Select one of BIOG 1500, COMM 2820, GOVT 3999, HD 2830, HD 2930, HD 4765, INFO 2950, PSYCH 3020, PSYCH 3240, STS 2011.
- **CoursePlan:** Accepts only HD 2830 and BIOG 1500.
- **Suggested change:** Add COMM 2820, GOVT 3999, HD 2930, HD 4765, INFO 2950, PSYCH 3020, PSYCH 3240 and STS 2011, and rename to 'Research Methods/Scientific Literacy'.

### 7. Social Science (high, rule)

- **Catalog:** Any 2 courses with SSC-AS, ETM-AS, SBA-AG, SBA-HE, KCM-AG or KCM-HE; courses cross-listed with Human Development cannot be used.
- **CoursePlan:** Accepts only courses whose distribution contains 'KCM-' or 'SBA-'. SSC-AS and ETM-AS courses are rejected.
- **Suggested change:** Add SSC-AS and ETM-AS to the accepted codes and update the description.

### 8. Humanities (high, rule)

- **Catalog:** HA-AG, HA-HE, HST-AS, ALC-AAP, ALC-AS, ALC-HA, LA-AG, LAD-HE, CA-AG, CA-HE.
- **CoursePlan:** Matches only the substrings 'CA-', 'HA-' and 'LA-'. ALC-AS, ALC-AAP, ALC-HA, HST-AS and LAD-HE courses are rejected ('LAD-HE' does not contain 'LA-').
- **Suggested change:** Match the full catalog code list explicitly.

### 9. Statistics (Quantitative Analysis) (high, course-list)

- **Catalog:** One of AEM 2100, ECON 3110, ECON 3130, ILRST 2100, PUBPOL 2100, PSYCH 2500, ILRST 3110, STSCI 2150, STSCI 2200, SOC 3010.
- **CoursePlan:** Accepts AEM 2100, BTRY 3010 (=STSCI 2200), ILRST 2100/STSCI 2100, MATH 1710, PAM 2100 (=PUBPOL 2100) and PSYCH 2500. It is missing ECON 3110/ILRST 3110/STSCI 3110, ECON 3130, STSCI 2150 and SOC 3010, and it accepts MATH 1710, which the catalog does not list.
- **Suggested change:** Use the catalog list exactly: add ECON 3110, ECON 3130, STSCI 2150 and SOC 3010, and remove MATH 1710.

### 10. Natural Science I (high, course-list)

- **Catalog:** One of BIOG 1140, BIOMG 1350, BIOG 1440, BIOEE 1780, or AP Biology score of 5.
- **CoursePlan:** Accepts BIOG 1140, BIOMG 1350, BIOG 1440 and BIOG 1445. BIOEE 1780 is missing, and BIOG 1445 is accepted although the catalog does not list it.
- **Suggested change:** Add BIOEE 1780 and remove BIOG 1445.

### 11. Natural Science II (high, rule)

- **Catalog:** A 3-4 credit course with PBS-HE, BIO-AS, PHS-AS, BIOLS-AG, BIONLS-AG, BSC-AG or PSC-AG. HD courses with PBS-HE cannot be used.
- **CoursePlan:** Accepts only 'PBS', 'BIOLS-AG' and 'BIONLS-AG', so BIO-AS, PHS-AS, BSC-AG and PSC-AG are rejected. HD courses with PBS-HE are not excluded.
- **Suggested change:** Add BIO-AS, PHS-AS, BSC-AG and PSC-AG, and exclude HD-subject courses that carry PBS-HE.

### 12. Additional Requirements (Additional Distribution Coursework) (high, rule)

- **Catalog:** 12 credits with PBS-HE, ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BIOLS-AG, BIONLS-AG, BSC-AG, PSC-AG, SBA-AG, SBA-HE, KCM-AG, KCM-HE, MQR-HE, LA-AG, LAD-HE, CA-AG, CA-HE, HA-AG or HA-HE. Language courses may count.
- **CoursePlan:** Accepts PBS, BIOLS-AG, BIONLS-AG, SBA, KCM, MQR, LA, CA, HA, FL and foreign-language subjects. It omits ALC-AS, ETM-AS, HST-AS, SCD-AS, SSC-AS, SDS-AS, SMR-AS, BSC-AG and PSC-AG. The loose substrings also let in codes the catalog does not list (e.g. other MQR or HA variants).
- **Suggested change:** Match the catalog code list exactly, keep the foreign-language allowance, and rename to 'Additional Distribution Coursework'.

### 13. Outside of Human Development Requirement (high, missing-requirement)

- **Catalog:** Minimum 11 credits from DEA, FSAD, HE (1500 level or higher), NS or PUBPOL. FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400 and special studies (4000-4030) do not count. These courses may double count with Humanities, Social Sciences, Natural Science II, Additional Distribution Coursework and Free Electives.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add an 11-credit requirement with these subjects and exclusions, and set allowCourseDoubleCounting.

### 14. Additional HD Electives (medium, rule)

- **Catalog:** HD coursework used to fulfill Research Methods/Scientific Literacy cannot be used here. HD 2830 is otherwise allowed.
- **CoursePlan:** Always excludes HD 2830, even when the student satisfied Research Methods with another course.
- **Suggested change:** Drop the hard-coded HD 2830 exclusion. The default no-double-counting already prevents reuse of the course that fills Research Methods.

### 15. Social Science (medium, rule)

- **Catalog:** Courses cross-listed with Human Development cannot be used.
- **CoursePlan:** The checker only rejects courses whose subject is HD. A course taken under a non-HD cross-listed code (e.g. PSYCH 2750 = HD 2600, SOC 2510 = HD 2510) passes the subject test.
- **Suggested change:** Exclude any course with an HD cross-listing, e.g. by checking the course's cross-listed subjects rather than only course.subject.

### 16. Natural Science I (medium, rule)

- **Catalog:** AP Biology score of 5 fulfills Natural Science I.
- **CoursePlan:** The description mentions AP Biology, but the checker lists no AP Biology option.
- **Suggested change:** Add the AP Biology equivalent to the checker, or a checkerWarning so students with a 5 can mark it.

### 17. Scientific Research Methods (low, description)

- **Catalog:** AP Biology score of 5 is listed only for Natural Science I, not for Research Methods.
- **CoursePlan:** Description says 'HD 2830, BIOG 1500, or a 5 on AP Biology.'
- **Suggested change:** Remove the AP Biology mention and list the current course options.

### 18. All requirements (source) (low, description)

- **Catalog:** Catalog edition 2026-2027 at https://catalog.cornell.edu/programs/human-development-bs/.
- **CoursePlan:** Every source points to the 2020-2021 HD curriculum sheet PDF.
- **Suggested change:** Update sources to the current catalog page.

### 19. Natural Science II (low, rule)

- **Catalog:** Any 3-4 credit course.
- **CoursePlan:** Only enforces a 3-credit minimum; no 4-credit maximum.
- **Suggested change:** Optionally note the 3-4 credit range; the impact is minimal.

## Could not verify

- Which breadth courses belong to which of the five breadth areas: the parsed table merges the area lists, and HD 4340 has no title.
- Honors Program requirements (HD 2830, PSYCH 2500) mentioned in the CoursePlan descriptions are not stated in the catalog inputs.
- Whether HD 4030 and HD 4980 may count toward Additional Coursework; the catalog only mentions HD 4000, HD 4010, HD 4020 and HD 4990 with a 12-credit cap.
- How AP Biology credit entries are represented in CoursePlan, i.e. whether any checker could accept them.
- Whether the 11-credit Outside of HD requirement or the 40-credit major minimum is enforced elsewhere (e.g. the college-level file).
- Whether the advisor listed (Vivian Zayas, psych-dus@cornell.edu) is correct for HD.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
