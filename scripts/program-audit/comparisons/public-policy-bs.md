# Public Policy (major)

- Catalog: https://catalog.cornell.edu/programs/public-policy-bs/ (2026-2027 edition)
- Data file: `src/data/majors/pam.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file still encodes the 2020-2021 Human Ecology PAM curriculum, not the 2026-2027 Brooks School Public Policy B.S. It is out of date throughout. The core list is wrong and incomplete: PAM 2300 and PAM 3300 are required, and PUBPOL 1111, 2301, 2370 and 2830 are missing, as is the two-of-three global/comparative group. The electives requirement uses the wrong credit total, course levels, subject and exclusions. Engaged Learning is missing. Several retired requirements remain: Additional PAM Electives, HD/PSYCH, a second Natural Science requirement, an Ethics course list, and 6 credits of distribution-area courses. The Government and Mathematics checkers accept the wrong sets of courses.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** Complete each of: PUBPOL 1111, PUBPOL 2000 (or ECON 3030), PUBPOL 2030, PUBPOL 2040, PUBPOL 2101, PUBPOL 2301, PUBPOL 2370, PUBPOL 2830, PUBPOL 3100.
- **CoursePlan:** PAM 2000, PAM 2030, PAM 2040, PAM 2101, PAM 2300, PAM 3100, PAM 3300. PAM 2300 is cross-listed with PUBPOL 2300, not PUBPOL 2301. PAM 3300 was last offered SP21 and is not in the catalog. PUBPOL 1111, PUBPOL 2301, PUBPOL 2370 and PUBPOL 2830 are absent.
- **Suggested change:** Rebuild the core as nine slots: PUBPOL 1111; PUBPOL 2000 or ECON 3030; PUBPOL 2030; PUBPOL 2040; PUBPOL 2101; PUBPOL 2301; PUBPOL 2370; PUBPOL 2830; PUBPOL 3100. Remove PAM 2300 and PAM 3300.

### 2. Core Courses – Intermediate Microeconomics alternative (high, rule)

- **Catalog:** PUBPOL 2000 OR ECON 3030.
- **CoursePlan:** Only PAM 2000 (= PUBPOL 2000) is accepted. ECON 3030 is rejected.
- **Suggested change:** Add ECON 3030 to the PUBPOL 2000 slot.

### 3. Core – select two global/comparative policy courses (high, missing-requirement)

- **Catalog:** Select two of: PUBPOL 2320, PUBPOL 2857, PUBPOL 3583 (6-8 cr).
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a requirement accepting PUBPOL 2320, PUBPOL 2857, PUBPOL 3583, with fulfilledBy 'courses' and perSlotMinCount [2].

### 4. Engaged Learning (high, missing-requirement)

- **Catalog:** At least 3 credits of PUBPOL coursework with the CU-CEL attribute. It may overlap with another major requirement.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a credits requirement (perSlotMinCount [3]). Its checker should accept PUBPOL courses where courseHasAttribute(course, 'CU-CEL'). Set allowCourseDoubleCounting: true.

### 5. Public Policy Electives (file: 'PAM 3000/4000 Electives') (high, count-or-credits)

- **Catalog:** 22 credits of PUBPOL courses at the 2000, 3000, or 4000 level.
- **CoursePlan:** 18 credits of PAM courses at the 3000/4000 level only. 2000-level courses are rejected. The checker matches subject 'PAM', so PUBPOL courses not cross-listed with PAM (e.g. PUBPOL 2320 = GOVT 2323) are rejected.
- **Suggested change:** Change to 22 credits. Match subject PUBPOL with catalogNbr 2**_, 3_** or 4\*\*\*.

### 6. Additional PAM Electives (high, extra-requirement)

- **Catalog:** There is no such requirement.
- **CoursePlan:** Any 3 additional PAM credits (except PAM 1200 and PAM 4030) or ECON 1120.
- **Suggested change:** Remove this requirement.

### 7. Human Development or Psychology (high, extra-requirement)

- **Catalog:** The major has no HD/PSYCH requirement.
- **CoursePlan:** Requires HD 1150 or PSYCH 1101.
- **Suggested change:** Remove this requirement.

### 8. Government (Introductory Government) (high, course-list)

- **Catalog:** One of GOVT 1111, GOVT 1313, GOVT 1817.
- **CoursePlan:** Only GOVT 1111 is accepted.
- **Suggested change:** Add GOVT 1313 and GOVT 1817, and rename the requirement to 'Introductory Government'.

### 9. Ethics (high, extra-requirement)

- **Catalog:** Ethics is satisfied by the required core course PUBPOL 2830.
- **CoursePlan:** A separate requirement accepts any of a list of ethics courses (BSOC 2051, PHIL 1440, INFO 1200, etc.). It does not accept PUBPOL 2830.
- **Suggested change:** Remove this requirement. PUBPOL 2830 belongs in the core.

### 10. Additional Requirements (high, extra-requirement)

- **Catalog:** There is no requirement for 6 credits of PBS/SBA/KCM/MQR/LA/CA/HA or language courses.
- **CoursePlan:** 6 credits of courses in those distribution areas or language courses.
- **Suggested change:** Remove this requirement.

### 11. Natural Science I / Natural Science II (high, extra-requirement)

- **Catalog:** A single Natural Science distribution requirement: at least 3 credits with a BIO, PBS or PHS distribution (or BSC-AG, CHPH-AG, OPHLS-AG, PSC-AG), or the listed AP/IB scores.
- **CoursePlan:** Two requirements. Natural Science I is a fixed list of BIOG/BIOMG/BIOEE/CHEM/PHYS courses. Natural Science II needs a second 3+ credit PBS/BIOLS-AG/BIONLS-AG course with no AP allowed.
- **Suggested change:** Replace both with one 3-credit distribution-based requirement matching the catalog codes, or remove them if Brooks distribution requirements live in a college file.

### 12. Public Policy Electives – special studies and exclusions (medium, rule)

- **Catalog:** A maximum of 3 credits of PUBPOL 4000, PUBPOL 4010 and PUBPOL 4020 may count. PUBPOL 4030, PUBPOL 4980 and PUBPOL 4990 may not count. PUBPOL 4060 is not excluded.
- **CoursePlan:** PAM 4000, 4010 and 4020 are excluded entirely. PAM 4060 (= PUBPOL 4060) is also excluded. The description mentions a 3-credit cap on PAM 4900, a course last offered FA19.
- **Suggested change:** Exclude only PUBPOL 4030, PUBPOL 4980 and PUBPOL 4990. Allow PUBPOL 4000/4010/4020 and state the 3-credit cap in the description or a checkerWarning. Stop excluding PUBPOL 4060 and drop the PAM 4900 text.

### 13. Mathematics (medium, course-list)

- **Catalog:** At least 3 credits of MATH, except FWS courses, MATH 1101 and MATH 1710. AP Calculus BC 4/5, IB HL Math 6/7 or CASE credit may also count.
- **CoursePlan:** The checker excludes 'MATH 1101' and 'PAM 1710' (a code not in the roster data), so MATH 1710 is wrongly accepted. AP/IB/CASE credit is not encoded, though the description mentions AP Calc BC.
- **Suggested change:** Change 'PAM 1710' to 'MATH 1710'. Handle AP Calculus BC, IB HL Math and CASE credit.

### 14. Introductory Microeconomics (medium, course-list)

- **Catalog:** ECON 1110, or a 5 on the AP Microeconomics exam, or a 7 on the IB HL Economics exam.
- **CoursePlan:** Only ECON 1110 is accepted.
- **Suggested change:** Add the AP Microeconomics (5) and IB HL Economics (7) equivalents.

### 15. Introduction to Sociology (low, course-list)

- **Catalog:** SOC 1101 or PUBPOL 2250.
- **CoursePlan:** SOC 1101, DSOC 1101 or PAM 2250. PAM 2250 = PUBPOL 2250, which is fine. DSOC 1101 is extra and was last offered SP22.
- **Suggested change:** Remove DSOC 1101 and list PUBPOL 2250 in the description.

### 16. All requirements (sources and names) (low, description)

- **Catalog:** Brooks School Public Policy B.S., catalog 2026-2027, https://catalog.cornell.edu/programs/public-policy-bs/.
- **CoursePlan:** Every source points to the Human Ecology 2020-2021 PAM curriculum sheet. Descriptions use PAM course codes and PAM-specific rules.
- **Suggested change:** Update sources to the catalog page. Rewrite descriptions with PUBPOL codes and current rules.

## Could not verify

- Whether Brooks School distribution requirements (FWS, Mathematics, Natural Science, Historical Analysis, 9 credits of Human Ecology Electives) are encoded in a separate college file. If not, Historical Analysis and Human Ecology Electives are also missing.
- How cross-listing matching interacts with subject-based checkers such as ifCodeMatch(course.subject, 'PAM'). For example, whether PUBPOL 2830 or PUBPOL 2320 would be matched by a PAM-subject checker.
- The rule that no more than 8 credits of public policy electives may be completed abroad per semester cannot be checked from course data. It would need a checkerWarning or self-check note.
- Which PUBPOL courses currently carry the CU-CEL attribute in the roster.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
