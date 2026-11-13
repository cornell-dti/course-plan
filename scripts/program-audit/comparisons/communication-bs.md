# Communication (major)

- Catalog: https://catalog.cornell.edu/programs/communication-bs/ (2026-2027 edition)
- Data file: `src/data/majors/comm.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan file follows an older Communication curriculum and is out of date. Main problems: COMM 1111 is missing from Foundations. Only 2 of the 4 core courses are required instead of 3. The upper-level requirement is split into concentration credits (6) plus a fixed elective list (9 credits) instead of 4 COMM courses at 3100+. The file does not exclude COMM 4960/4980, does not cap COMM 4970/4990, and accepts non-COMM and 2000-level codes as electives. It also keeps two requirements the catalog does not have: a broad separate statistics requirement and an FWS requirement.

## Findings

### 1. Core Courses (Foundations) (high, missing-requirement)

- **Catalog:** Foundations Courses (5 courses): COMM 1111, COMM 1101, COMM 1300, COMM 2010, COMM 2310. COMM 1111 is not required for transfer students.
- **CoursePlan:** Four slots only: COMM 1101, COMM 1300, COMM 2010, COMM 2310. COMM 1111 is not required.
- **Suggested change:** Add a COMM 1111 slot, with a checkerWarning or description noting that transfer students are exempt. Rename the requirement to 'Foundations Courses'.

### 2. Introduction to Concentration Courses (Core in Communication) (high, count-or-credits)

- **Catalog:** Select three of COMM 2200, COMM 2450, COMM 2760, COMM 2850.
- **CoursePlan:** perSlotMinCount [2]; description says '2 courses in COMM 2200, COMM 2450, COMM 2760, or COMM 2850'.
- **Suggested change:** Set perSlotMinCount to [3], rename to 'Core in Communication Courses' and update the description to say three courses.

### 3. Upper-Level Concentration Courses / Upper-Level COMM Electives (high, rule)

- **Catalog:** Upper-Level Electives: four courses with the COMM prefix at the 3100 level or above. There are no concentrations.
- **CoursePlan:** Two requirements: 6 credits 'within their declared Concentration' at 3100+ (wildcard), plus 9 credits from a fixed list. That is 15 credits total, and both descriptions refer to Concentrations.
- **Suggested change:** Replace both with one 'Upper-Level Electives' requirement: 4 courses, checker accepting COMM 31**–39** and COMM 4\*\*\*, with descriptions that match the catalog.

### 4. Upper-Level Concentration Courses (medium, course-list)

- **Catalog:** Footnote: COMM 4980 Communication Teaching Experience and COMM 4960 Communication Internship will NOT count toward the upper-level elective courses.
- **CoursePlan:** The wildcard 'COMM 4\*\*\*' accepts COMM 4960 and COMM 4980.
- **Suggested change:** Exclude COMM 4960 and COMM 4980 from the upper-level checker.

### 5. Upper-Level Concentration Courses / Upper-Level COMM Electives (medium, rule)

- **Catalog:** A minimum and maximum of 3 credits in COMM 4970 or COMM 4990 (combined) can be counted toward the upper-level requirements.
- **CoursePlan:** COMM 4970 and COMM 4990 are accepted with no cap: COMM 4\*\*\* in the concentration requirement, and listed explicitly in the electives requirement.
- **Suggested change:** Add a checkerWarning saying that at most 3 combined credits of COMM 4970/4990 may count, or otherwise enforce the cap.

### 6. Upper-Level COMM Electives (medium, course-list)

- **Catalog:** Courses must carry the COMM prefix at the 3100 level or above.
- **CoursePlan:** Accepts COMM 2179 (2000-level; also GOVT 2169), COGST 4330 (also ANTHR 4330, STS 4330; no COMM cross-listing) and COML 2703 (also ENGL/GERST/MUSIC/PMA/SHUM 2703; no COMM cross-listing). COMM 2179 is listed twice.
- **Suggested change:** Remove COMM 2179, COGST 4330 and COML 2703.

### 7. Upper-Level COMM Electives (medium, course-list)

- **Catalog:** Any COMM course at the 3100 level or above counts.
- **CoursePlan:** A fixed list of specific COMM codes, so any COMM 3100+ course not on the list is rejected. The list also includes codes not in the roster data: COMM 3300, COMM 3460, COMM 4410, COMM 4560.
- **Suggested change:** Use the COMM 3100+ wildcards (minus COMM 4960/4980) instead of a fixed list.

### 8. Upper-Level Electives (medium, rule)

- **Catalog:** A fourth Core class (COMM 2200/2450/2760/2850) may be used to fulfill one of the four upper-level courses. A communication-related study abroad course may count with faculty advisor approval.
- **CoursePlan:** No upper-level requirement accepts a fourth Core course, and study abroad is not mentioned.
- **Suggested change:** Allow at most one extra course from COMM 2200, COMM 2450, COMM 2760 or COMM 2850 to count as an upper-level elective, for example through a checkerWarning. Mention advisor-approved study abroad in the description.

### 9. Data Literacy Courses (medium, course-list)

- **Catalog:** COMM 2820 plus one of AEM 2100, ILRST 2100, STSCI 2100. A transfer credit or an AP Statistics score of 5 is also acceptable.
- **CoursePlan:** The statistics slot accepts PAM 2100, AEM 2100, ILRST 2100 (STSCI 2100 via cross-listing). PAM 2100 (also PUBPOL 2100) is not in the catalog list. AP Statistics and transfer credit are not accepted and not mentioned.
- **Suggested change:** Change the statistics slot to AEM 2100, ILRST 2100, STSCI 2100 and remove PAM 2100. Note in the description that an AP Statistics score of 5 or transfer credit is acceptable.

### 10. Introductory Statistics Class (medium, extra-requirement)

- **Catalog:** There is no separate statistics requirement. Statistics is the second course of Data Literacy and is limited to AEM 2100, ILRST 2100, STSCI 2100 (or AP 5 / transfer).
- **CoursePlan:** A separate requirement (double counting allowed) accepting PAM 2100, STSCI 2150, STSCI 2200/BTRY 3010, BTRY 6010, ENGRD 2700, MATH 1710, PAM 2101, PSYCH 2500, SOC 3010, HADDM 2010, HADDM 6110 and others.
- **Suggested change:** Remove this requirement. It duplicates the Data Literacy statistics slot and suggests that non-catalog statistics courses satisfy the major.

### 11. First-Year Writing Seminars (FWS) (medium, extra-requirement)

- **Catalog:** The Communication major requirements contain no FWS requirement. Writing is handled by the CALS Written Expression distribution.
- **CoursePlan:** A major requirement for 3 credits of FWS. It is sourced from the Arts & Sciences degree requirements page and the description says 'First-Year Writing Workshop'.
- **Suggested change:** Remove the FWS requirement from the major file.

### 12. Communication Practica (low, count-or-credits)

- **Catalog:** One Communication course numbered 3000-3099.
- **CoursePlan:** 3 credits from COMM 30\*\*; description says 'Three credits in the COMM 30XX range courses'.
- **Suggested change:** Change to fulfilledBy 'courses' with perSlotMinCount [1], and describe it as one COMM course numbered 3000-3099.

## Could not verify

- Credit values of COMM 3000-3099 practica courses, which determine whether the 3-credit Practica threshold would ever wrongly reject a single practica course.
- Whether graduate-level COMM courses (5000/6000 level) are intended to count as 'COMM courses at the 3100-level or above' for upper-level electives.
- Whether any COMM 3100+ courses currently offered are missing from the fixed elective list; the inputs do not list all current COMM course numbers.
- Which communication-related study abroad courses a faculty advisor would approve as upper-level electives.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
