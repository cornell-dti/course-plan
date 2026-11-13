# Data Science (minor)

- Catalog: https://catalog.cornell.edu/programs/data-science-minor/ (2026-2027 edition)
- Data file: `src/data/minors/ds.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan Data Science minor file is substantially out of date compared with the 2026-2027 catalog. The overall structure matches the catalog: one Core Statistics course, one Core Computing course, and four category courses covering at least three categories. The course lists do not match. Every requirement is missing current catalog courses, including ECON 3130 for Core Statistics, AEM 2820, AEM 2850 and HADM 3710 for Core Computing, and many Data Analysis, Ethics, Data Communication and Domain Expertise courses. Every requirement also accepts courses the catalog no longer lists, several of them still offered (AEM 2010, AEM 2011, HADM 4760, ECE 4520, INFO 4270, COMM 3189, EAS 3540). Some courses sit in the wrong category, courses the catalog lists in two categories are only usable in one, and the 18-credit minimum is not encoded. The category breakdown is inferred from the order of the parsed table, which merged all four category tables under 'Core Computing'.

## Findings

### 1. Core Statistics (high, course-list)

- **Catalog:** Core Statistics options include ECON 3130: Probability and Statistics.
- **CoursePlan:** ECON 3130 is not in the Core Statistics checker. It is listed in the Domain Expertise sub-list of 'Categories' instead.
- **Suggested change:** Add 'ECON 3130' to the Core Statistics checker. Remove it from both 'Categories' lists.

### 2. Core Computing (high, course-list)

- **Catalog:** Core Computing options include AEM 2820, AEM 2850 and HADM 3710.
- **CoursePlan:** The Core Computing checker does not include AEM 2820, AEM 2850 or HADM 3710. AEM 2820 appears in the Data Analysis category list instead.
- **Suggested change:** Add 'AEM 2820', 'AEM 2850' and 'HADM 3710' to Core Computing. Remove 'AEM 2820' from both Data Analysis lists in 'Categories'.

### 3. Core Computing (high, course-list)

- **Catalog:** Core Computing does not list HADM 4760 or STSCI 3040.
- **CoursePlan:** The checker accepts 'HADM 4760' (last offered FA26) and 'STSCI 3040' (last offered FA23).
- **Suggested change:** Remove 'HADM 4760' and 'STSCI 3040' from Core Computing.

### 4. Categories – Data Analysis (high, course-list)

- **Catalog:** Data Analysis includes AEM 3275, CHEME 4660/CHEME 5660, ECE 3200, ECE 4200, ECE 4250, ECON 3120, ECON 4140, HADM 3275, HADM 4750, INFO 2951, INFO 3370, MATH 2310 (not accepted if taken before FA24), ORIE 4740, PUBPOL 3100, STSCI 4060, STSCI 4100 and STSCI 4110.
- **CoursePlan:** None of these is accepted by 'Categories' except ECON 3120, which is only in the Domain Expertise list. STSCI 4060 is only in Core Computing. CHEME 4660/5660 and INFO 3370 are not accepted anywhere.
- **Suggested change:** Add 'AEM 3275', 'CHEME 4660', 'CHEME 5660', 'ECE 3200', 'ECE 4200', 'ECE 4250', 'ECON 3120', 'ECON 4140', 'HADM 3275', 'HADM 4750', 'INFO 2951', 'INFO 3370', 'MATH 2310', 'ORIE 4740', 'PUBPOL 3100', 'STSCI 4060', 'STSCI 4100' and 'STSCI 4110' to both the main 'Categories' checker and its Data Analysis sub-list. Add a warning that MATH 2310 counts only if taken in FA24 or later.

### 5. Categories – Data Analysis (high, course-list)

- **Catalog:** Data Analysis does not list AEM 2010, AEM 2011, AEM 2820, AEM 4120, HD 4760/PSYCH 4760, ECE 4520, HADM 4010 or PSYCH 4750. AEM 2820 is a Core Computing course.
- **CoursePlan:** The Data Analysis list accepts all of these. AEM 2010, AEM 2011 and AEM 2820 were last offered FA26 and ECE 4520 SP25, so current students can still add them.
- **Suggested change:** Remove 'AEM 2010', 'AEM 2011', 'AEM 2820', 'AEM 4120', 'HD 4760', 'PSYCH 4760', 'ECE 4520', 'HADM 4010' and 'PSYCH 4750' from both 'Categories' lists.

### 6. Categories – Big Data Ethics, Policy and Society (high, course-list)

- **Catalog:** This category includes ALS 1210, COMM 4300, ENGRG 3605, INFO 3370, INFO 4145, INFO 4505, NBA 4920, PUBPOL 2130, PUBPOL 3520, PUBPOL 3725, STSCI 3600 and STSCI 4850.
- **CoursePlan:** None of these courses, nor any cross-listing of them, is accepted.
- **Suggested change:** Add 'ALS 1210', 'COMM 4300', 'ENGRG 3605', 'INFO 3370', 'INFO 4145', 'INFO 4505', 'NBA 4920', 'PUBPOL 2130', 'PUBPOL 3520', 'PUBPOL 3725', 'STSCI 3600' and 'STSCI 4850' to the main checker and to the Ethics sub-list.

### 7. Categories – Big Data Ethics, Policy and Society (high, course-list)

- **Catalog:** This category does not list INFO 4270, COMM 4242, DSOC 2120, DSOC 4060, PAM 4060, PAM 4230, PAM 4540, STS 3440 or STS 3561.
- **CoursePlan:** All of these are accepted. INFO 4270 was last offered FA26.
- **Suggested change:** Remove 'INFO 4270', 'COMM 4242', 'DSOC 2120', 'DSOC 4060', 'PAM 4060', 'PAM 4230', 'PAM 4540', 'STS 3440' and 'STS 3561'.

### 8. Categories – Data Communication (high, course-list)

- **Catalog:** Data Communication includes COGST 3420, COMM 2450, COMM 3010, INFO 3312, INFO 3950 and SOC 3580.
- **CoursePlan:** The Data Communication sub-list contains none of these. INFO 3950 is only in the Data Analysis list and SOC 3580 is only in the Domain Expertise list. COGST 3420, COMM 2450, COMM 3010 and INFO 3312 are not accepted at all.
- **Suggested change:** Add 'COGST 3420', 'COMM 2450', 'COMM 3010', 'INFO 3312', 'INFO 3950' and 'SOC 3580' to the Data Communication sub-list and to the main checker. Remove 'SOC 3580' from the Domain Expertise sub-list.

### 9. Categories – Data Communication (high, course-list)

- **Catalog:** Data Communication does not list COMM 3189, COMM 3350 or COMM 4200.
- **CoursePlan:** The checker accepts 'COMM 3189' (last offered FA26), 'COMM 3350' and 'COMM 4200'.
- **Suggested change:** Remove 'COMM 3189', 'COMM 3350' and 'COMM 4200'.

### 10. Categories – Domain Expertise (high, course-list)

- **Catalog:** Domain Expertise includes BEE 4850, BIOCB 3620, BIOEE 3550, BME 4790, CHEME 4660/CHEME 5660, COGST 3140/INFO 3140, CRP 4080, CS 4300/INFO 4300, EAS 3450, EAS 5555, ECON 3720, ECON 3860, ECON 4660, GOVT 3282, ILRGL 3330, INFO 4555, NTRES 4120, ORIE 4126, ORIE 4154, ORIE 4656, PLSCI 4000, PLSCI 4290, PUBPOL 2155, PUBPOL 3120, PUBPOL 3130/ECON 3670 and PUBPOL 3550.
- **CoursePlan:** None of these courses, nor any cross-listing of them, is accepted.
- **Suggested change:** Add all of these codes to the main checker and to the Domain Expertise sub-list.

### 11. Categories – Domain Expertise (high, course-list)

- **Catalog:** Domain Expertise does not list EAS 3540, BIOEE 3620, ECON 3130, ECON 4110, DSOC 3140, NTRES 3500, ORIE 2380, PAM 3850, PLSCS 4110, PLSCS 4650, BTRY 4820 or ORIE 4132. ECON 3130 is a Core Statistics course.
- **CoursePlan:** All of these are accepted. EAS 3540 (SP26), ECON 3130 (FA26) and BIOEE 3620 (SP24) are recently offered. BTRY 4820 and ORIE 4132 are not in the roster data.
- **Suggested change:** Remove 'EAS 3540', 'BIOEE 3620', 'ECON 3130', 'ECON 4110', 'DSOC 3140', 'NTRES 3500', 'ORIE 2380', 'PAM 3850', 'PLSCS 4110', 'PLSCS 4650', 'BTRY 4820' and 'ORIE 4132'.

### 12. Categories – At least three different categories (medium, rule)

- **Catalog:** Several courses are listed in two categories: INFO 3370 (Data Analysis and Ethics), INFO 3950 (Data Analysis and Data Communication), ECON 3120 and CHEME 4660/5660 (Data Analysis and Domain Expertise), and STSCI 4060 (Core Computing and Data Analysis).
- **CoursePlan:** Each of these is in at most one category sub-list, or none, so a student cannot use it toward the other category in the three-category rule.
- **Suggested change:** List each dual-category course in every category sub-list the catalog places it in. Add STSCI 4060 to the Data Analysis lists.

### 13. Minimum credits (medium, missing-requirement)

- **Catalog:** Minimum Credits for Minor: 18.
- **CoursePlan:** Only six courses are counted, with no credit minimum. Several accepted courses carry 1.5–2 credits (e.g. AEM 4435, AEM 4660, HADM 4770), so six courses can total fewer than 18 credits.
- **Suggested change:** Add an 18-credit self-check or a credit-based check, or add a checkerWarning stating the 18-credit minimum.

### 14. Core Statistics (low, course-list)

- **Catalog:** Core Statistics lists ECE 3100, ENGRD 2700, MATH 4710, MATH 4720, ORIE 3500, STSCI 3080, STSCI 3110/ECON 3110, ECON 3130 and STSCI 2200. GOVT 4019 is not listed.
- **CoursePlan:** The checker also accepts 'GOVT 4019' (last offered FA20).
- **Suggested change:** Remove 'GOVT 4019'.

### 15. All requirements (low, description)

- **Catalog:** The catalog page is https://catalog.cornell.edu/programs/data-science-minor/.
- **CoursePlan:** The source points to a stat.cornell.edu page. The Categories description contains the typo 'couses'. It also does not mention that one course must come from each of three different categories, or that the minor cannot be combined with the Information Science minor's Data Science concentration.
- **Suggested change:** Update the source URL and fix the typo. Describe the three-category rule and the Information Science minor restriction.

## Could not verify

- The parsed catalog table merged the Data Analysis, Ethics, Data Communication and Domain Expertise tables under 'Core Computing'. Which category each course belongs to was inferred from table order and the prose's category sequence.
- PUBPOL 2070 and PUBPOL 4110 are not in the roster data. The file uses PAM 2070 and PAM 4110, which are likely the earlier numbers but are not shown as cross-listed. Whether students should be able to add these courses cannot be confirmed.
- BIOCB 3620 (catalog) and BIOEE 3620 (file), and EAS 3450 (catalog) and EAS 3540 (file), may be renumberings or typos. The cross-listing table does not link either pair.
- CS 3220 appears in the catalog without a title and was last offered FA21. The catalog may be stale for this course.
- The rule that at most two minor courses may also count toward the major's core, and the requirement that students whose major requires intro programming take a more advanced Core Computing course, depend on the student's major. They cannot be checked from these inputs.
- Whether any BIOEE 4940 topic counts, or only specific data-related topics, cannot be determined from the catalog.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
