# Artificial Intelligence (minor)

- Catalog: https://catalog.cornell.edu/programs/artificial-intelligence-minor/ (2026-2027 edition)
- Data file: `src/data/minors/artificial-intelligence.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file is badly out of date against the 2026-2027 catalog. Every core slot accepts courses the catalog no longer lists and rejects most of the courses it does list. The Ethics slot accepts none of the catalog options. The elective list overlaps the catalog only partly: it omits about 35 approved electives and accepts core courses and unrelated courses. Both requirements set allowCourseDoubleCounting, so one course can fill a core slot and an elective slot, although the catalog requires six courses and its footnotes forbid that overlap. The catalog's 15-credit minimum and its rule allowing at most two courses to overlap with the major are not encoded anywhere.

## Findings

### 1. Foundations of AI Core Courses – Machine Learning slot (high, course-list)

- **Catalog:** Select one of CS 3780 (formerly CS 4780), ECE 3200, ORIE 3741 (formerly ORIE 4741), STSCI 3740 (formerly STSCI 4740).
- **CoursePlan:** Accepts 'CS 4780', 'CS 4786', 'CS 4740'. CS 4780 also matches CS 3780 through the cross-listing. ECE 3200, ORIE 3741/4741 and STSCI 3740/4740 are rejected. CS 4786 and CS 4740 are accepted although the catalog does not list them for this slot (CS 4740 is an elective).
- **Suggested change:** Set slot 1 to ['CS 3780', 'ECE 3200', 'ORIE 3741', 'STSCI 3740'] and remove CS 4786 and CS 4740.

### 2. Foundations of AI Core Courses – Reasoning slot (high, course-list)

- **Catalog:** CS 3700 (formerly CS 4700) only.
- **CoursePlan:** Accepts 'CS 4700', 'CS 4701', 'CS 4720'. CS 4701 (Practicum, an elective worth 2 credits) and CS 4720 (not in the roster data) are not accepted by the catalog for this slot.
- **Suggested change:** Set slot 2 to ['CS 3700'] only.

### 3. Foundations of AI Core Courses – Human-AI Interaction slot (high, course-list)

- **Catalog:** One of INFO 3160, INFO 4240/STS 4240, INFO 4470, or INFO 4940 (topics Designing AI Products and Services or Human-AI Interaction Design). Per fn1, INFO 3450 is an alternative only for students graduating Dec 2026 or May 2027.
- **CoursePlan:** Accepts 'INFO 3450', 'INFO 4450', 'CS 4450'. INFO 3160, INFO 4240/STS 4240, INFO 4470 and INFO 4940 are rejected. INFO 4450/COMM 4450 and CS 4450 are accepted although the catalog does not list them. INFO 3450 is accepted for every student.
- **Suggested change:** Set slot 3 to ['INFO 3160', 'INFO 4240', 'INFO 4470', 'INFO 4940'] and add a checkerWarning about the required INFO 4940 topics. Remove INFO 4450 and CS 4450. Allow INFO 3450 only for the Dec 2026/May 2027 cohort, through a migration or a warning.

### 4. Foundations of AI Core Courses – Ethics, Governance & Policy slot (high, course-list)

- **Catalog:** Select one of ENGRG 3605/PHIL 2473/STS 3605, INFO 1210, INFO 1260/CS 1340, or INFO 4210/PUBPOL 4210.
- **CoursePlan:** Accepts 'GOVT 2049', 'INFO 2040', 'STS 2040'. GOVT 2049 and STS 2040 are not in the roster data. INFO 2040 (Networks, cross-listed CS 2850/ECON 2040 etc.) is not in the catalog. None of the catalog's courses are accepted.
- **Suggested change:** Set slot 4 to ['ENGRG 3605', 'INFO 1210', 'INFO 1260', 'INFO 4210'].

### 5. AI Elective Courses – courses missing (high, course-list)

- **Catalog:** The approved electives include BIONB 3500, BME 4790, CS 4756, CS 4782, CS 4783, CS 4787, CS 4789, CS 4860/MATH 4860, ECE 4160, ENGRG 3605/PHIL 2473/STS 3605, INFO 1170, INFO 1260/CS 1340, INFO 3160, INFO 3350, INFO 3950, INFO 4120, INFO 4240/STS 4240, INFO 4260/STS 4260, INFO 4300/CS 4300, INFO 4310, INFO 4410, INFO 4470, INFO 4940 (listed topics), ILRGL 4066/AMST 4066, LING 4424/CS 4744/COGST 4240, LING 4434/CS 4745, MAE 4810/ECE 4240, NBA 4920, ORIE 3320, ORIE 4160, ORIE 4742, ORIE 4570, PHIL 2621/COGST 2621, PUBPOL 2120, PUBPOL 3520, PUBPOL 4210/INFO 4210, STSCI 4030, STSCI 4520, STSCI 4750.
- **CoursePlan:** None of these codes, and no code cross-listed with them, is in the elective checker.
- **Suggested change:** Replace the elective list with the catalog's current list.

### 6. AI Elective Courses – courses wrongly accepted (high, course-list)

- **Catalog:** The approved elective list does not include CS 4780, CS 4786, CS 4700, CS 4720, CS 4820, CS 4850, INFO 3450, INFO 4450, INFO 2040, GOVT 2049, STS 2040, MATH 4710 or MATH 4740.
- **CoursePlan:** The elective checker accepts all of these codes. CS 4780 and CS 4700 are the required ML and Reasoning core courses.
- **Suggested change:** Remove these codes from the elective list. Keep CS 4750, CS 4670, CS 4701, CS 4740, CS 4758 and ORIE 4740, which the catalog lists.

### 7. Double counting between core and electives (high, rule)

- **Catalog:** Six courses are required in total: four core courses plus two electives. fn2 and fn3 say the ethics and human-AI courses cannot be used jointly for the Foundations requirement and as an elective.
- **CoursePlan:** Both requirements set allowCourseDoubleCounting: true, so one course (for example CS 4780 or CS 4700) can fill a core slot and an elective slot at the same time.
- **Suggested change:** Remove allowCourseDoubleCounting from both requirements so that each course counts only once within the minor.

### 8. Major/minor overlap limit (medium, missing-requirement)

- **Catalog:** Students may count a maximum of two courses toward both the AI minor and their own major's requirements. The catalog adds specific rules for CS, IS and ISST majors.
- **CoursePlan:** No warning or self-check encodes this limit.
- **Suggested change:** Add a checkerWarning or a self-check requirement stating the two-course overlap limit.

### 9. Minimum credits for the minor (low, count-or-credits)

- **Catalog:** Minimum credits for the minor: 15.
- **CoursePlan:** No credit minimum is encoded. Six courses could total less than 15 credits if they include variable or low-credit courses such as INFO 4940 (1-4 cr), CS 4701 (2 cr) or NBA 4920 (1.5-3 cr).
- **Suggested change:** Add a note or a credit check for the 15-credit minimum.

### 10. Source URLs and descriptions (low, description)

- **Catalog:** The requirements are published at https://catalog.cornell.edu/programs/artificial-intelligence-minor/ and name four Foundations areas: Machine Learning, Reasoning, Human-AI Interaction, and Ethics, Governance & Policy.
- **CoursePlan:** The sources point to the bowers.cornell.edu and cs.cornell.edu pages. The slot names 'AI/Reasoning Course' and 'AI Ethics Course' do not match the catalog's Foundations names.
- **Suggested change:** Point the sources to the catalog page and rename the slots to match the catalog's Foundations names.

## Could not verify

- Which topic of INFO 4940 a student took. Only the listed topics (Designing AI Products and Services, Human-AI Interaction Design, Advanced NLP for Humanities Research, etc.) qualify.
- INFO 1210 has no title in the parsed catalog table, so its content cannot be confirmed.
- INFO 4470 is listed in the catalog but is not in the roster data, so students cannot currently add it.
- Whether the major-specific overlap rules for CS, IS and ISST majors need separate encoding depends on the major files.
- Whether the advisor contact (cs-undergrad@cornell.edu) is current.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
