# Information Science (major)

- Catalog: https://catalog.cornell.edu/programs/information-science-ba/ (2026-2027 edition)
- Data file: `src/data/majors/info.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The INFO data file follows an older version of the major and differs from the 2026-2027 catalog in many places. Core is missing INFO 2951, and Programming is missing CS 1112. The Statistics list accepts many courses the catalog no longer lists. Every concentration's course lists have drifted: dropped courses are still accepted and newly listed ones are missing. Interactive Technologies does not require CS 2110. Digital Culture and Production merges its two options into one rule that accepts combinations the catalog does not allow. Electives omit several approved lower-level courses, still accept INFO 4910 and INFO 4997, and do not enforce the 3-credit minimum.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** The fifth core course is INFO 2950 or INFO 2951.
- **CoursePlan:** The fifth slot accepts only 'INFO 2950'.
- **Suggested change:** Add 'INFO 2951' to the fifth slot and rename the slot 'INFO 2950 or INFO 2951'.

### 2. Programming and Math Requirements – Programming (high, course-list)

- **Catalog:** Choose one of CS 1110 or CS 1112.
- **CoursePlan:** Only 'CS 1110' is accepted. The description says CS 1110 is required and that CS 1112 students should take CS 1133.
- **Suggested change:** Add 'CS 1112' to the programming slot and remove the CS 1110-only and CS 1133 wording from the description.

### 3. Programming and Math Requirements – Statistics (high, course-list)

- **Catalog:** Choose one of ENGRD 2700, STSCI 2200 or STSCI 3110.
- **CoursePlan:** Accepts ENGRD 2700, STSCI 2200/BTRY 3010 and STSCI 3110/ECON 3110. It also accepts AEM 2100, CEE 3040, ECON 3130, ILRST 2100, STSCI 2100, MATH 1710, PAM 2100, PSYCH 2500, SOC 3010 and STSCI 2150.
- **Suggested change:** Restrict the statistics slot to 'ENGRD 2700', 'STSCI 2200' and 'STSCI 3110'.

### 4. Concentration – Behavioral Science (A, B, C) (high, course-list)

- **Catalog:** A: INFO 3170, INFO 4430, INFO 4450, INFO 4490, INFO 4500, INFO 4505, INFO 4940, COMM 4380, PSYCH 3800. B: CS 3780, CS 4740, INFO 3300, INFO 3720, INFO 3950, INFO 4100, INFO 4300, INFO 4350, INFO 4940. C: INFO 3200, INFO 4140, INFO 4940, INFO 4360, COMM 4940, INFO 3450, INFO 4240, INFO 4400.
- **CoursePlan:** Missing from A: INFO 3170, INFO 4505. Missing from B: INFO 3950, INFO 4350, INFO 4940. Missing from C: INFO 4140, INFO 4940, COMM 4940.
- **Suggested change:** Add the missing codes to their groups.

### 5. Concentration – Behavioral Science (extra courses) (high, course-list)

- **Catalog:** The catalog does not list INFO 4800, COMM 4242, INFO 3561, INFO 4650 or STS 3440 in any Behavioral Science group.
- **CoursePlan:** A accepts INFO 4800. B accepts COMM 4242. C accepts INFO 3561, INFO 4650 and STS 3440. It also lists INFO 3460, COMM 4410 and SOC 3350, which are not in the roster data.
- **Suggested change:** Remove INFO 4800, COMM 4242, INFO 3561, INFO 4650, STS 3440, INFO 3460, COMM 4410 and SOC 3350.

### 6. Concentration – Data Science (missing courses) (high, course-list)

- **Catalog:** A: INFO 3300, INFO 3900, INFO 3950, INFO 4940, CS 3780, ORIE 3120, ORIE 3741, ORIE 4740, STSCI 3740. B: CS 4740, INFO 2770, INFO 3130, INFO 3350, INFO 3370, INFO 3720, INFO 4100, INFO 4120, INFO 4300, INFO 4350, INFO 4940. C: COMM 4010, INFO 3200, INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4260, INFO 4270, INFO 4390, INFO 4561, INFO 4940, ENGL 3778, PUBPOL 3460. D: INFO 3312, INFO 4310, COMM 3150, COMM 3189, COMM 4860, COMM 4940, SOC 3580.
- **CoursePlan:** Missing from A: INFO 3900, INFO 4940, ORIE 3741. Missing from B: INFO 3130, INFO 3370, INFO 4350, INFO 4940. Missing from C: COMM 4010, INFO 4140, INFO 4145, INFO 4260, INFO 4390, PUBPOL 3460. Missing from D: INFO 3312, COMM 4940.
- **Suggested change:** Add the missing codes to their groups.

### 7. Concentration – Data Science (extra courses) (high, course-list)

- **Catalog:** These courses are not in the Data Science lists.
- **CoursePlan:** A accepts CS 4786. B accepts INFO 4130. C accepts INFO 3561, COMM 4242 and STS 3440. D accepts COMM 4200 and GOVT 2169.
- **Suggested change:** Remove CS 4786, INFO 4130, INFO 3561, COMM 4242, STS 3440, COMM 4200 and GOVT 2169.

### 8. Concentration – Digital Culture and Production (course lists) (high, course-list)

- **Catalog:** A: INFO 2921, INFO 3200, INFO 4140, INFO 4260, INFO 4270, INFO 4940, STS 4040. B: INFO 2300, INFO 2310, INFO 3152, INFO 3300, INFO 4320, CS 4620, CS 4758. C: INFO 3450, INFO 3660, INFO 4152, INFO 4240, INFO 4400, INFO 4420, INFO 4940, ART 3705, ARTH 4151.
- **CoursePlan:** Missing from A: INFO 4140, INFO 4260, INFO 4270, INFO 4940. Missing from B: INFO 2310. Extra in A: INFO 3561, STS 3440. Extra in C: INFO 2750, COML 3115, ENGL 3741. ARTH 4154 and HIST 2293 are listed but are not in the roster data.
- **Suggested change:** Add the missing A and B courses. Remove INFO 3561, STS 3440, INFO 2750, COML 3115, ENGL 3741, ARTH 4154 and HIST 2293.

### 9. Concentration – Information Ethics, Law, and Policy (A, B) (high, course-list)

- **Catalog:** A: COMM 4010, INFO 3210, INFO 4113, INFO 4140, INFO 4200, INFO 4250, INFO 4270, INFO 4301, INFO 4940, HADM 4890, PUBPOL 3460. B: INFO 2921, INFO 4240, INFO 4940, PUBPOL 2300, PUBPOL 2301.
- **CoursePlan:** Missing from A: COMM 4010, INFO 4140, INFO 4270, INFO 4940, PUBPOL 3460. A also lists STS 2761, which is not in the roster data. Missing from B: INFO 2921, PUBPOL 2301. Extra in B: INFO 4800, COMM 4242, CRP 3210.
- **Suggested change:** Add the missing courses to A and B. Remove STS 2761, INFO 4800, COMM 4242 and CRP 3210.

### 10. Concentration – Information Ethics, Law, and Policy (C, D) (high, course-list)

- **Catalog:** C: COMM 3190, COMM 4940, ENGRG 3605, INFO 3170, INFO 3200, INFO 4145, INFO 4210, INFO 4260, INFO 4390, INFO 4561, STS 4040. D: INFO 3300, INFO 3350, INFO 3370, INFO 4100, INFO 4120, INFO 4300, INFO 4350.
- **CoursePlan:** C accepts INFO 3200, INFO 4561 and STS 4040. It also accepts INFO 3561, INFO 4270, INFO 4940 and STS 3440, which the catalog does not list in C, plus INFO 3460, which is not in the roster. Missing from C: COMM 3190, COMM 4940, ENGRG 3605, INFO 3170, INFO 4145, INFO 4210, INFO 4260, INFO 4390. D has extra INFO 4130 and is missing INFO 3370, INFO 4100 and INFO 4350.
- **Suggested change:** Rebuild groups C and D from the catalog lists.

### 11. Concentration – Interactive Technologies (required CS 2110) (high, missing-requirement)

- **Catalog:** CS 2110 is a required course for the concentration, in addition to one course each from A, B and C. Courses cannot count twice within the major.
- **CoursePlan:** The checker has only the A, B and C slots, so CS 2110 is mentioned in the description but never required. CS 2110 would instead be counted toward Electives.
- **Suggested change:** Add a 'Required Course' slot ['CS 2110'] to the Interactive Technologies option, with perSlotMinCount [1,1,1,1].

### 12. Concentration – Interactive Technologies (A, B, C) (high, course-list)

- **Catalog:** A: INFO 4120, INFO 4320, CS 4758. B: INFO 3300, INFO 4340, INFO 4555, CS 3780, CS 4620, CS 5150, ORIE 3120, ORIE 3741, ORIE 4740, STSCI 3740. C: INFO 4152, INFO 4310, INFO 4410, INFO 4430, INFO 4505, INFO 4940.
- **CoursePlan:** Missing from B: CS 4620, ORIE 3741. Extra in B: CS 4786. Missing from C: INFO 4505. Extra in C: INFO 4130, INFO 4154 (cross-listed with CS 4154), INFO 4275, and CS 4752, which is not in the roster.
- **Suggested change:** Add CS 4620, ORIE 3741 and INFO 4505. Remove CS 4786, INFO 4130, INFO 4154, INFO 4275 and CS 4752.

### 13. Concentration – Networks, Crowds, and Markets (high, course-list)

- **Catalog:** A: INFO 4220, INFO 4360, INFO 4940, COMM 3150, ECON 3810, ECON 4020, ECON 4610, ECON 4620, ECON 4660, ORIE 4350, SOC 3080. B: INFO 3300, INFO 3950, INFO 4300, INFO 4350, INFO 4940, CS 3780, CS 4740, ECON 3120, ECON 3140. C: COMM 4940, INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4270, INFO 4940, PUBPOL 3460, SOC 3490.
- **CoursePlan:** A is missing INFO 4940 and ECON 4620 and has extra ECON 4022. B is missing INFO 3950, INFO 4350 and INFO 4940 and has extra CS 4786. C is missing COMM 4940, INFO 4140, INFO 4145, INFO 4270, PUBPOL 3460 and SOC 3490 and has extra INFO 3561 and STS 3440.
- **Suggested change:** Rebuild groups A, B and C from the catalog lists.

### 14. Concentration – UX (User Experience) (high, course-list)

- **Catalog:** A: INFO 3450, INFO 4400, INFO 4410, INFO 4470. B: INFO 2921, INFO 4240, INFO 4420, INFO 4505, INFO 4940. C: INFO 4125, INFO 4430, INFO 4450, INFO 4490, COMM 4380, PSYCH 3420. D: INFO 3152, INFO 4152, INFO 4310, INFO 4320, INFO 4340, CS 5150.
- **CoursePlan:** B is missing INFO 4505 and has extra ENGL 3741. C is missing INFO 4125 and lists INFO 3460, which is not in the roster. D has extra INFO 4130, INFO 4154 and INFO 4275. A does not list INFO 4470, which is not in the roster.
- **Suggested change:** Add INFO 4505, INFO 4125 and INFO 4470. Remove ENGL 3741, INFO 3460, INFO 4130, INFO 4154 and INFO 4275.

### 15. Electives (high, course-list)

- **Catalog:** Approved electives are CS 2110, CS 3110, CS 3410, INFO 3000-level or higher (except INFO 4910, INFO 4997, INFO 4998), INFO 2300 or INFO 2310 (but not both), INFO 2770, INFO 2921, MATH 2310 and MATH 2940.
- **CoursePlan:** Accepts INFO 2300, CS 2110, CS 3110, CS 3410 and INFO 3000+ except INFO 4998. INFO 2310, INFO 2770, INFO 2921, MATH 2310 and MATH 2940 are rejected. INFO 4910 and INFO 4997 are accepted.
- **Suggested change:** Add INFO 2310, INFO 2770, INFO 2921, MATH 2310 and MATH 2940, and enforce INFO 2300 or INFO 2310 but not both. Exclude INFO 4910 and INFO 4997. Update the description to match.

### 16. Concentration – Digital Culture and Production (options) (medium, rule)

- **Catalog:** Option 1 is one course each from A and B plus two courses from C. Option 2 is three courses from A plus one from B.
- **CoursePlan:** The rule is one from A, one from B, and two from a combined A-or-C pool. This accepts 2 A + 1 B + 1 C, which neither option allows.
- **Suggested change:** Split into two options, either as separate toggle options or one requirement per option: Option 1 slots A/B/C with counts [1,1,2], and Option 2 slots A/B with counts [3,1].

### 17. Electives (medium, rule)

- **Catalog:** Each elective course must be at least 3.0 credits. Only one semester of INFO 4900 may count.
- **CoursePlan:** There is no minimum-credit check, so a 1–2 credit INFO 4940 or INFO 4900 counts. The INFO 4900 limit appears only in the description.
- **Suggested change:** Add courseMeetsCreditMinimum(course, 3) to the elective checker and keep the INFO 4900 note.

### 18. Core Courses (low, description)

- **Catalog:** The core is INFO 1200 or INFO 1260, INFO 1300, INFO 2450, INFO 2850, and INFO 2950 or INFO 2951. Core classes must be taken at Cornell.
- **CoursePlan:** The description lists 'INFO 1200, INFO 1300, INFO 2040, INFO 2450, and INFO 2950', omitting the INFO 1260 and INFO 2951 alternatives. The slot is named 'INFO 2040' (accepted because it is cross-listed with INFO 2850). There is no restriction on transfer credit.
- **Suggested change:** Update the description and slot name to the catalog wording, using INFO 2850. Consider adding disallowTransferCredit, since core courses must be taken at Cornell.

### 19. Programming and Math Requirements (low, description)

- **Catalog:** AP Computer Science A (5), IB CS, or CASE may satisfy programming. AP is not accepted for statistics.
- **CoursePlan:** The description refers to 'students matriculating as of or after Fall 2015' and links to the CALS BS page.
- **Suggested change:** Update the description to the current catalog text and point the source at the A&S BA page.

### 20. Minimum major credits (low, missing-requirement)

- **Catalog:** A minimum of 50 credits is required for the major.
- **CoursePlan:** There is no 50-credit requirement or note.
- **Suggested change:** Mention the 50-credit minimum in a description or add a self-check.

## Could not verify

- Which topics of INFO 4940 and COMM 4940 are approved by the advisor for each concentration group.
- Whether ARCH 3000+ electives or option studios that address IT qualify for Digital Culture and Production group C, since these need IS Advising approval.
- Petitioned upper-level technical IS courses for Information Ethics, Law, and Policy group D.
- How CoursePlan maps AP CS A, AP Calculus, IB and CASE credits onto the programming and calculus slots, and whether AP Statistics could reach the statistics slot.
- Whether 'INFO 3000-level or higher' is meant to include 5000- and 6000-level INFO courses as electives.
- Study abroad substitutions and the 21-credit transfer cap.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
