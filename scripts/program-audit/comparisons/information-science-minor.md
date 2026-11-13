# Information Science (minor)

- Catalog: https://catalog.cornell.edu/programs/information-science-minor/ (2026-2027 edition)
- Data file: `src/data/minors/infoEN.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file has the right Engineering structure: one core, three concentration courses and one elective. Its course lists are badly out of date against the 2026-2027 catalog. Every concentration is missing several courses that are currently offered, and most still accept retired courses the catalog no longer lists. The Data Science core omits INFO 2951. The Digital Culture and Production core accepts only INFO 3561, last offered SP21, and omits the six alternatives the catalog now allows. The Information Ethics, Law, and Policy concentration list accepts STS 4040, which the catalog does not list there. The elective checker accepts only INFO-subject courses, so non-INFO concentration courses such as CS 3780 or ECON 4020 are rejected.

## Findings

### 1. Concentration – Data Science (core slot) (high, course-list)

- **Catalog:** Core Requirement: INFO 2950 OR INFO 2951: Introduction to Data Science with R
- **CoursePlan:** Core slot accepts only 'INFO 2950'; description says 'Core - INFO 2950: Introduction to Data Science.'
- **Suggested change:** Add 'INFO 2951' to the core slot and mention it in the description.

### 2. Concentration – Digital Culture and Production (core slot) (high, course-list)

- **Catalog:** Core Requirement: INFO 3561 OR INFO 2921 OR INFO 3200 OR INFO 4140 OR INFO 4260 OR INFO 4270 OR INFO 4940 (approved topics: Clockwork; Law, Policy, and Politics of AI)
- **CoursePlan:** Core slot accepts only 'INFO 3561' (last offered SP21); description says 'Core - INFO 3561: Computing Cultures.'
- **Suggested change:** Add 'INFO 2921', 'INFO 3200', 'INFO 4140', 'INFO 4260', 'INFO 4270', 'INFO 4940' to the core slot, with a warning about the allowed INFO 4940 topics, and update the description.

### 3. Concentration – Behavioral Science (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes COMM 4940 (Human-Algorithm Behavior), INFO 3170, INFO 3950, INFO 4140, INFO 4350, INFO 4505
- **CoursePlan:** None of these codes (or cross-listings) are accepted
- **Suggested change:** Add 'COMM 4940', 'INFO 3170', 'INFO 3950', 'INFO 4140', 'INFO 4350', 'INFO 4505' (and 'INFO 3720' once it appears in the roster).

### 4. Concentration – Data Science (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes COMM 3190, COMM 4010, COMM 4940 (Data and Technology for Organizing), INFO 3130, INFO 3312, INFO 3370, INFO 3900, INFO 4140, INFO 4145, INFO 4260, INFO 4350, INFO 4390, ORIE 3741, PUBPOL 3460, SOC 4390
- **CoursePlan:** None of these codes (or cross-listings) are accepted
- **Suggested change:** Add 'COMM 3190', 'COMM 4010', 'COMM 4940', 'INFO 3130', 'INFO 3312', 'INFO 3370', 'INFO 3900', 'INFO 4140', 'INFO 4145', 'INFO 4260', 'INFO 4350', 'INFO 4390', 'ORIE 3741', 'PUBPOL 3460', 'SOC 4390' (and 'INFO 3720' once in the roster).

### 5. Concentration – Digital Culture and Production (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes COMM 3190, INFO 2310, INFO 4140, INFO 4260, INFO 4270
- **CoursePlan:** None of these codes are accepted
- **Suggested change:** Add 'COMM 3190', 'INFO 2310', 'INFO 4140', 'INFO 4260', 'INFO 4270'.

### 6. Concentration – Information Ethics, Law, and Policy (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes COMM 3190, COMM 4010, COMM 4940 (Human-Algorithm Behavior), ENGRG 3605, INFO 2921, INFO 3170, INFO 3370, INFO 4100, INFO 4140, INFO 4145, INFO 4210, INFO 4260, INFO 4350, INFO 4390, PUBPOL 2301 (as alternative to PUBPOL 2300), PUBPOL 3460
- **CoursePlan:** None of these codes (or cross-listings) are accepted; only PAM 2300 (= PUBPOL 2300) is accepted
- **Suggested change:** Add 'COMM 3190', 'COMM 4010', 'COMM 4940', 'ENGRG 3605', 'INFO 2921', 'INFO 3170', 'INFO 3370', 'INFO 4100', 'INFO 4140', 'INFO 4145', 'INFO 4210', 'INFO 4260', 'INFO 4350', 'INFO 4390', 'PUBPOL 2301', 'PUBPOL 3460'.

### 7. Concentration – Information Ethics, Law, and Policy (concentration slot) (high, course-list)

- **Catalog:** STS 4040 is not on the Information Ethics, Law, and Policy concentration list (it appears only under Digital Culture and Production)
- **CoursePlan:** Checker accepts 'STS 4040' (currently offered, SP26)
- **Suggested change:** Remove 'STS 4040' from this concentration.

### 8. Concentration – Interactive Technologies (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes CS 4620, INFO 4120, INFO 4320, INFO 4505, ORIE 3741
- **CoursePlan:** None of these are accepted in the concentration slot. INFO 4120/4320 are accepted only in the core slot, so a student taking both cannot count the second toward the concentration.
- **Suggested change:** Add 'CS 4620', 'INFO 4120', 'INFO 4320', 'INFO 4505', 'ORIE 3741' to the concentration slot.

### 9. Concentration – Networks, Crowds, and Markets (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes COMM 4940 (Human-Algorithm Behavior), ECON 4620, INFO 3950, INFO 4140, INFO 4145, INFO 4270, INFO 4350, PUBPOL 3460, SOC 3490
- **CoursePlan:** None of these codes (or cross-listings) are accepted
- **Suggested change:** Add 'COMM 4940', 'ECON 4620', 'INFO 3950', 'INFO 4140', 'INFO 4145', 'INFO 4270', 'INFO 4350', 'PUBPOL 3460', 'SOC 3490'.

### 10. Concentration – UX (User Experience) (concentration slot) (high, course-list)

- **Catalog:** Concentration list includes INFO 4125, INFO 4505
- **CoursePlan:** Neither is accepted
- **Suggested change:** Add 'INFO 4125', 'INFO 4505' (and 'INFO 4470' once in the roster).

### 11. Concentration – Behavioral Science (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include INFO 4800, COMM 4242, INFO 3561, STS 3440, INFO 4650, INFO 3460, COMM 4410, SOC 3350
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'INFO 4800', 'COMM 4242', 'INFO 3561', 'STS 3440', 'INFO 4650', 'INFO 3460', 'COMM 4410', 'SOC 3350'.

### 12. Concentration – Data Science (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include CS 4786, INFO 4130, INFO 3561, COMM 4242, STS 3440, COMM 4200, GOVT 2169
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'CS 4786', 'INFO 4130', 'INFO 3561', 'COMM 4242', 'STS 3440', 'COMM 4200', 'GOVT 2169'.

### 13. Concentration – Digital Culture and Production (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include STS 3440, INFO 2750, COML 3115, ENGL 3741, ARTH 4154, HIST 2293
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'STS 3440', 'INFO 2750', 'COML 3115', 'ENGL 3741', 'ARTH 4154', 'HIST 2293'.

### 14. Concentration – Information Ethics, Law, and Policy (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include STS 2761, INFO 4800, COMM 4242, CRP 3210, INFO 3460, INFO 3561, STS 3440, INFO 4130
- **CoursePlan:** Checker accepts all of these ('INFO 4940' is also listed twice)
- **Suggested change:** Remove 'STS 2761', 'INFO 4800', 'COMM 4242', 'CRP 3210', 'INFO 3460', 'INFO 3561', 'STS 3440', 'INFO 4130' and the duplicate 'INFO 4940'.

### 15. Concentration – Interactive Technologies (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include CS 4786, INFO 4130, INFO 4154, INFO 4275, CS 4752
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'CS 4786', 'INFO 4130', 'INFO 4154', 'INFO 4275', 'CS 4752'.

### 16. Concentration – Networks, Crowds, and Markets (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include ECON 4022, CS 4786, INFO 3561, STS 3440
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'ECON 4022', 'CS 4786', 'INFO 3561', 'STS 3440'.

### 17. Concentration – UX (User Experience) (concentration slot) (medium, course-list)

- **Catalog:** Catalog list does not include ENGL 3741, INFO 3460, INFO 4130, INFO 4154, INFO 4275
- **CoursePlan:** Checker accepts all of these
- **Suggested change:** Remove 'ENGL 3741', 'INFO 3460', 'INFO 4130', 'INFO 4154', 'INFO 4275'.

### 18. Elective (medium, rule)

- **Catalog:** One elective from any concentration, including core requirements; INFO 1300 may count
- **CoursePlan:** Checker accepts any course with subject 'INFO' (with a warning that concentration membership is not checked). Non-INFO concentration courses such as CS 3780, CS 4740, ECON 4020, ORIE 3120, PSYCH 3800 and COMM 3150 are rejected, and any INFO course outside the concentrations is accepted.
- **Suggested change:** Build the elective checker from the union of all concentration and core lists, plus 'INFO 1300'.

### 19. Concentration – Networks, Crowds, and Markets (core) (low, description)

- **Catalog:** Core Requirement: INFO 2850: Networks
- **CoursePlan:** Description 'Core - INFO 2040: Networks'; slot name 'INFO 2040' (accepted via cross-listing with INFO 2850)
- **Suggested change:** Use 'INFO 2850' in the checker, description and slot name to match the catalog.

### 20. Elective (low, description)

- **Catalog:** Elective courses can be from any concentration, including core requirements. INFO 1300 may count as an elective.
- **CoursePlan:** 'Choose one course from any concentration'
- **Suggested change:** Mention that core courses and INFO 1300 also count.

## Could not verify

- Which INFO 4940 and COMM 4940 topics a student took: the catalog limits each concentration to specific topics, while the file accepts any section of INFO 4940 (and the self-check warning on topics is absent).
- ARTH 4151 requires advisor approval of the topic (Digital Culture and Production footnote); the file accepts it without a warning.
- The generic Engineering minor rule ('six courses (at least 18 credits)') conflicts with the IS-minor Engineering table (5 courses, 15-18 minimum credits varying by college); the inputs do not show which governs, and the file enforces no credit minimum.
- INFO 3720, INFO 3210 and INFO 4470 are on the catalog lists but not in the roster data, so it cannot be confirmed under what code students will enroll.
- Whether the elective checker's subject === 'INFO' test matches a course a student added under a cross-listed non-INFO code (e.g. COMM 2450, CS 1300) depends on cross-listing handling not shown in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
