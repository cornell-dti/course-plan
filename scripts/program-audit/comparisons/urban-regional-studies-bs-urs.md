# Urban and Regional Studies (major)

- Catalog: https://catalog.cornell.edu/programs/urban-regional-studies-bs-urs/ (2026-2027 edition)
- Data file: `src/data/majors/crp.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The file reflects an older version of the URS major. The core list (CRP 1100/1101/2000/2010/3210) has been fully replaced. The Engaged Learning requirement is missing. The Statistics list omits the default CRP 1200 and accepts several intro stats courses the catalog does not list. The distribution checkers use the old A&S categories (CA/HA/KCM/LA/SBA, MQR only) instead of the catalog's ALC/ETM/GLC/HST/SCD/SSC and DLG/DLS/MQL/SDS/SMR/PHS. The Five CRP Classes wildcard ignores the independent-study exclusion, the 3-credit minimum, the CRP 3348/5348 cap, combined-course pairs and the out-of-department list. The Microeconomics list matches, apart from not limiting the higher-level options to students with AP credit.

## Findings

### 1. Core Classes (high, course-list)

- **Catalog:** Required core classes include CRP 1103, CRP 1104, CRP 1106 (1 cr; transfer students who complete a full term at Cornell before entering URS are exempt), CRP 2100 and CRP 2200. Microeconomics, Statistics and an Engaged Learning course complete the eight core classes.
- **CoursePlan:** The checker and description require CRP 1100, CRP 1101, CRP 2000, CRP 2010 and CRP 3210. None of these has been offered since FA22–FA23.
- **Suggested change:** Replace the slots with CRP 1103, CRP 1104, CRP 1106, CRP 2100 and CRP 2200, and update the description. Make CRP 1106 optional or add a checkerWarning about the transfer exemption.

### 2. Engaged Learning Course (high, missing-requirement)

- **Catalog:** Students in their third or fourth year must complete one CRP engaged-learning course of at least 4 credits: CRP 3072, CRP 3074, CRP 3076, CRP 4160 or CRP 5172.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add an Engaged Learning requirement accepting CRP 3072, CRP 3074, CRP 3076, CRP 4160 and CRP 5172 (one course). Note the 4-credit minimum. Make sure the course is not also counted as one of the five additional CRP classes.

### 3. Statistics (high, course-list)

- **Catalog:** The default course is CRP 1200. Students with AP statistics credit may instead take AEM 3100, AEM 4110, ECON 3110, ECON 3130, ECON 3140, MATH 4710 or STSCI 3080.
- **CoursePlan:** Accepts AEM 2100, AEM 3100, AEM 4100, ECON 3130, ECON 3140, ILRST 2100, MATH 1710, MATH 4710, PAM 2100, PAM 2101, STSCI 2100 and STSCI 3080. It does not accept CRP 1200, AEM 4110 or ECON 3110 (nor its cross-listings ILRST 3110 / STSCI 3110).
- **Suggested change:** Set the list to CRP 1200, AEM 3100, AEM 4110, ECON 3110, ECON 3130, ECON 3140, MATH 4710 and STSCI 3080. Remove AEM 2100, AEM 4100, ILRST 2100/STSCI 2100, MATH 1710, PAM 2100 and PAM 2101. Update the description.

### 4. Distribution Requirements: 5 Courses (high, course-list)

- **Catalog:** The five humanities/social science courses must come from ALC, ETM, GLC, HST, SCD or SSC, covering at least four of these six categories.
- **CoursePlan:** The checker accepts only the old CA, HA, KCM, LA and SBA codes (-AAP/-AG/-AS/-HE, LAD-HE). The description says 'four of these five categories (CA, HA, KCM, LA, SBA)'.
- **Suggested change:** Accept the ALC, ETM, GLC, HST, SCD and SSC categories and update the description to 'four of these six'.

### 5. PBS and MQR courses (high, course-list)

- **Catalog:** PBS categories are PBS, PBSS, BIO, OPHLS and PHS. MQR categories are DLG, DLS, MQR, MQL, SDS and SMR.
- **CoursePlan:** The PBS checker lacks PHS. The MQR checker accepts only MQR-AS, MQR-AAP and MQR-HE, so courses tagged DLG, DLS, MQL, SDS or SMR are rejected. The description names only PBS/PBSS-AS and MQR-AS.
- **Suggested change:** Add PHS to the PBS lists and DLG, DLS, MQL, SDS and SMR to the MQR lists. Update the description.

### 6. Five CRP Classes (high, rule)

- **Catalog:** Independent study courses (CRP 4900 - CRP 4970) cannot be applied to this requirement.
- **CoursePlan:** The wildcard 'CRP 4\*\*\*' accepts CRP 4900–4970.
- **Suggested change:** Exclude CRP 4900 through CRP 4970 from the checker.

### 7. Five CRP Classes (high, course-list)

- **Catalog:** These out-of-department classes also count: ARCH 3820, ARCH 3823, CEE 3610, GDEV 2010, PUBPOL 4640 and SOC 3250.
- **CoursePlan:** Only CRP 3**_–6_** is accepted. None of these courses, nor their cross-listings (DSOC 2010, SOC 2202, PAM 4640, PAM 3250, PUBPOL 3250), is accepted.
- **Suggested change:** Add ARCH 3820, ARCH 3823, CEE 3610, GDEV 2010, PUBPOL 4640 and SOC 3250 to the checker.

### 8. Microeconomics / Statistics (medium, rule)

- **Catalog:** The higher-level alternatives to ECON 1110 and CRP 1200 are available only to students with AP credit in microeconomics or statistics.
- **CoursePlan:** The alternatives are accepted for every student without any note.
- **Suggested change:** Add a checkerWarning, or a description note, saying the alternatives require AP credit.

### 9. Distribution Requirements: 5 Courses (medium, rule)

- **Catalog:** The courses must span at least four categories. No more than three may come from one department. Each must be at least 3 credits and outside CRP. ARCH 1801, ARCH 2802 and ARCH 3819 count as ALC.
- **CoursePlan:** Any 5 matching courses are accepted. There is no check for category diversity, department cap, 3-credit minimum or CRP exclusion, and the ARCH exceptions are not encoded.
- **Suggested change:** Exclude CRP courses and add the ARCH 1801/2802/3819 exception. Add a checkerWarning for the four-category, department-cap and 3-credit rules.

### 10. PBS and MQR courses (medium, course-list)

- **Catalog:** These count toward MQR: AEM 2210, AEM 2225, HADM 1210, HADM 2230, NCC 5500, AEM 2240, AEM 2241, AEM 5241, HADM 2220, HADM 2250 and NCC 5560. Courses must be at least 3 credits and outside CRP.
- **CoursePlan:** The finance and accounting exceptions are not accepted. There is no credit minimum or CRP exclusion.
- **Suggested change:** Add the listed codes to the MQR and PBS-or-MQR slots, and exclude CRP courses and courses under 3 credits.

### 11. Five CRP Classes (medium, rule)

- **Catalog:** Each class must be at least 3 credits. CRP 3348 / CRP 5348 can count for at most one class. The combined pairs CRP/REAL 5320 & 5321 and CRP/REAL 5560 & 5561 (3 cr together) count as one class.
- **CoursePlan:** There is no credit minimum. CRP 3348/5348 can fill several slots. Each half of a combined pair counts as a separate class.
- **Suggested change:** Enforce a 3-credit minimum (e.g., courseMeetsCreditMinimum) and limit CRP 3348/5348 to one. Treat each combined pair as one class, or add a checkerWarning explaining the rule.

### 12. All requirements (source) (low, description)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/urban-regional-studies-bs-urs/.
- **CoursePlan:** Every source points to courses.cornell.edu catoid=41.
- **Suggested change:** Update the source URLs.

## Could not verify

- Whether AAP 1100 The Worlds We Make, the 120 credits, and the PE/swim requirements are encoded in the AAP college or university requirement files.
- Whether disallowTransferCredit on the distribution requirements matches policy; the catalog does not say whether AP credit can count toward distribution.
- Whether 'Required CRP courses must be completed at Cornell' should exclude transfer credit beyond AP/IB, which the data model cannot represent.
- Whether CRP courses at the 7000 level or higher should count as '3000-level or higher'; the wildcard stops at CRP 6\*\*\*.
- Which exact catalogDistr suffixes (e.g., PHS-AS, SDS-AS, ALC-AS) the roster uses for the new categories.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
