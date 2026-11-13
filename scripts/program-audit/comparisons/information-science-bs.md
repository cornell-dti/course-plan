# Information Science (major)

- Catalog: https://catalog.cornell.edu/programs/information-science-bs/ (2026-2027 edition)
- Data file: `src/data/majors/info.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CALS Information Science data file is out of date against the 2026-2027 catalog. Core does not accept INFO 2951. Programming does not accept CS 1112. Statistics accepts many courses the catalog dropped. The Interactive Technologies concentration omits the required CS 2110. Digital Culture and Production uses the wrong combination rule. Every concentration's course lists have drifted: many current catalog courses are missing and many retired or non-listed courses are accepted. The Electives requirement misses INFO 2310, INFO 2770, INFO 2921, MATH 2310 and MATH 2940, wrongly accepts INFO 4910 and INFO 4997, and does not enforce the 3-credit minimum. Several descriptions and source URLs still describe the old or A&S version of the major.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** Five core courses: INFO 1200 or INFO 1260, INFO 1300, INFO 2450, INFO 2850, and INFO 2950 or INFO 2951.
- **CoursePlan:** The last slot accepts only 'INFO 2950'. INFO 2951 is not accepted and is not cross-listed with INFO 2950.
- **Suggested change:** Change the last slot to ['INFO 2950', 'INFO 2951'] and rename it 'INFO 2950 or INFO 2951'.

### 2. Programming and Math Requirements – Programming (high, course-list)

- **Catalog:** Choose one: CS 1110 or CS 1112.
- **CoursePlan:** The Programming slot accepts only 'CS 1110'.
- **Suggested change:** Add 'CS 1112' to the Programming slot.

### 3. Programming and Math Requirements – Statistics (high, course-list)

- **Catalog:** Choose one: ENGRD 2700, STSCI 2200, or STSCI 3110.
- **CoursePlan:** Accepts ENGRD 2700, STSCI 2200/BTRY 3010 and ECON 3110 (= STSCI 3110). It also accepts AEM 2100, CEE 3040, ECON 3130, ILRST 2100, MATH 1710, PAM 2100, PSYCH 2500, SOC 3010, STSCI 2100 and STSCI 2150, none of which the catalog lists.
- **Suggested change:** Reduce the Statistics slot to ['ENGRD 2700', 'STSCI 2200', 'STSCI 3110'].

### 4. Concentration – Behavioral Science (high, course-list)

- **Catalog:** A (choose two): INFO 3170, INFO 4430, INFO 4450, INFO 4490, INFO 4500, INFO 4505, INFO 4940, COMM 4380, PSYCH 3800. B (choose one): CS 3780, CS 4740, INFO 3300, INFO 3720, INFO 3950, INFO 4100, INFO 4300, INFO 4350, INFO 4940. C (choose one): INFO 3200, INFO 4140, INFO 4940, INFO 4360, COMM 4940, INFO 3450, INFO 4240, INFO 4400.
- **CoursePlan:** Missing from A: INFO 3170, INFO 4505. Missing from B: INFO 3950, INFO 4350, INFO 4940. Missing from C: INFO 4140, INFO 4940, COMM 4940.
- **Suggested change:** Add the missing courses to Groups A, B and C as listed in the catalog.

### 5. Concentration – Behavioral Science (high, course-list)

- **Catalog:** Only the courses listed in A, B, and C count.
- **CoursePlan:** Also accepts INFO 4800 and INFO 3460 in A, COMM 4242 in B, and INFO 3561, INFO 4650, COMM 4410, STS 3440 and SOC 3350 in C.
- **Suggested change:** Remove INFO 4800, INFO 3460, COMM 4242, INFO 3561, INFO 4650, COMM 4410, STS 3440 and SOC 3350.

### 6. Concentration – Data Science (high, course-list)

- **Catalog:** A: INFO 3300, INFO 3900, INFO 3950, INFO 4940, CS 3780, ORIE 3120, ORIE 3741, ORIE 4740, STSCI 3740. B: CS 4740, INFO 2770, INFO 3130, INFO 3350, INFO 3370, INFO 3720, INFO 4100, INFO 4120, INFO 4300, INFO 4350, INFO 4940. C: COMM 4010, INFO 3200, INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4260, INFO 4270, INFO 4390, INFO 4561, INFO 4940, ENGL 3778, PUBPOL 3460. D: INFO 3312, INFO 4310, COMM 3150, COMM 3189, COMM 4860, COMM 4940, SOC 3580.
- **CoursePlan:** Missing from A: INFO 3900, INFO 4940, ORIE 3741. Missing from B: INFO 3130, INFO 3370, INFO 4350, INFO 4940. Missing from C: COMM 4010, INFO 4140, INFO 4145, INFO 4260, INFO 4390, PUBPOL 3460. Missing from D: INFO 3312, COMM 4940.
- **Suggested change:** Add the missing courses to the corresponding groups.

### 7. Concentration – Data Science (high, course-list)

- **Catalog:** Only the listed courses count.
- **CoursePlan:** Also accepts CS 4786 in A, INFO 4130 in B, INFO 3561, COMM 4242 and STS 3440 in C, and COMM 4200 and GOVT 2169 in D.
- **Suggested change:** Remove CS 4786, INFO 4130, INFO 3561, COMM 4242, STS 3440, COMM 4200 and GOVT 2169.

### 8. Concentration – Digital Culture and Production (high, course-list)

- **Catalog:** A: INFO 2921, INFO 3200, INFO 4140, INFO 4260, INFO 4270, INFO 4940, STS 4040. B: INFO 2300, INFO 2310, INFO 3152, INFO 3300, INFO 4320, CS 4620, CS 4758. C: ART 3705, ARTH 4151, INFO 3450, INFO 3660, INFO 4152, INFO 4240, INFO 4400, INFO 4420, INFO 4940.
- **CoursePlan:** Missing from A: INFO 4140, INFO 4260, INFO 4270, INFO 4940. Missing from B: INFO 2310. The file also accepts INFO 3561 and STS 3440 (as A) and INFO 2750, COML 3115, ENGL 3741, ARTH 4154 and HIST 2293 (as C), which the catalog does not list.
- **Suggested change:** Add INFO 4140, INFO 4260, INFO 4270 and INFO 4940 to A, and INFO 2310 to B. Remove INFO 3561, STS 3440, INFO 2750, COML 3115, ENGL 3741, ARTH 4154 and HIST 2293.

### 9. Concentration – Information Ethics, Law, and Policy (high, course-list)

- **Catalog:** A: COMM 4010, INFO 3210, INFO 4113, INFO 4140, INFO 4200, INFO 4250, INFO 4270, INFO 4301, INFO 4940, HADM 4890, PUBPOL 3460. B: INFO 2921, INFO 4240, INFO 4940, PUBPOL 2300, PUBPOL 2301. C: COMM 3190, COMM 4940, ENGRG 3605, INFO 3170, INFO 3200, INFO 4145, INFO 4210, INFO 4260, INFO 4390, INFO 4561, STS 4040. D: INFO 3300, INFO 3350, INFO 3370, INFO 4100, INFO 4120, INFO 4300, INFO 4350.
- **CoursePlan:** Missing from A: COMM 4010, INFO 4140, INFO 4270, INFO 4940, PUBPOL 3460. Missing from B: INFO 2921, PUBPOL 2301. Missing from C: COMM 3190, COMM 4940, ENGRG 3605, INFO 3170, INFO 4145, INFO 4210, INFO 4260, INFO 4390. Missing from D: INFO 3370, INFO 4100, INFO 4350.
- **Suggested change:** Add the missing courses to the corresponding groups.

### 10. Concentration – Information Ethics, Law, and Policy (high, course-list)

- **Catalog:** INFO 4270 is in A, INFO 4940 is in A and B (not C), and only the listed courses count.
- **CoursePlan:** Accepts STS 2761 in A. Accepts INFO 4800, COMM 4242 and CRP 3210 in B. Accepts INFO 3460, INFO 3561, INFO 4270, INFO 4940 and STS 3440 in C. Accepts INFO 4130 in D.
- **Suggested change:** Remove STS 2761, INFO 4800, COMM 4242, CRP 3210, INFO 3460, INFO 3561, STS 3440 and INFO 4130. Move INFO 4270 from C to A. Remove INFO 4940 from C.

### 11. Concentration – Interactive Technologies (high, missing-requirement)

- **Catalog:** Required course CS 2110, plus one course each from A, B and C (4 courses).
- **CoursePlan:** Only slots A, B and C (3 courses). CS 2110 appears only in the description and is not checked.
- **Suggested change:** Add a required CS 2110 slot (accepting ENGRD 2110 via cross-listing) to the Interactive Technologies option.

### 12. Concentration – Interactive Technologies (high, course-list)

- **Catalog:** A: INFO 4120, INFO 4320, CS 4758. B: INFO 3300, INFO 4340, INFO 4555, CS 4620, CS 3780, CS 5150, ORIE 3120, ORIE 3741, ORIE 4740, STSCI 3740. C: INFO 4152, INFO 4310, INFO 4410, INFO 4430, INFO 4505, INFO 4940.
- **CoursePlan:** Missing from B: CS 4620, ORIE 3741. Missing from C: INFO 4505. The file also accepts CS 4786 in B, and INFO 4130, INFO 4154, INFO 4275 and CS 4752 in C.
- **Suggested change:** Add CS 4620 and ORIE 3741 to B and INFO 4505 to C. Remove CS 4786, INFO 4130, INFO 4154, INFO 4275 and CS 4752.

### 13. Concentration – Networks, Crowds, and Markets (high, course-list)

- **Catalog:** A (two): COMM 3150, ECON 3810, ECON 4020, ECON 4610, ECON 4620, ECON 4660, INFO 4220, INFO 4360, INFO 4940, ORIE 4350, SOC 3080. B: INFO 3300, INFO 3950, INFO 4300, INFO 4350, INFO 4940, CS 3780, CS 4740, ECON 3120, ECON 3140. C: COMM 4940, INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4270, INFO 4940, PUBPOL 3460, SOC 3490.
- **CoursePlan:** Missing from A: ECON 4620, INFO 4940. Missing from B: INFO 3950, INFO 4350, INFO 4940. Missing from C: COMM 4940, INFO 4140, INFO 4145, INFO 4270, PUBPOL 3460, SOC 3490. The file also accepts ECON 4022 (A), CS 4786 (B), and INFO 3561 and STS 3440 (C).
- **Suggested change:** Add the missing courses. Remove ECON 4022, CS 4786, INFO 3561 and STS 3440.

### 14. Concentration – UX (User Experience) (high, course-list)

- **Catalog:** A: INFO 3450, INFO 4400, INFO 4410, INFO 4470. B: INFO 2921, INFO 4240, INFO 4420, INFO 4505, INFO 4940. C: INFO 4125, INFO 4430, INFO 4450, INFO 4490, COMM 4380, PSYCH 3420. D: INFO 3152, INFO 4152, INFO 4310, INFO 4320, INFO 4340, CS 5150.
- **CoursePlan:** Missing from B: INFO 4505. Missing from C: INFO 4125. The file also accepts ENGL 3741 (B), INFO 3460 (C), and INFO 4130, INFO 4154 and INFO 4275 (D).
- **Suggested change:** Add INFO 4505 to B and INFO 4125 to C. Remove ENGL 3741, INFO 3460, INFO 4130, INFO 4154 and INFO 4275. Add INFO 4470 to A once it appears in the roster.

### 15. Electives (high, course-list)

- **Catalog:** Approved electives: CS 2110, CS 3110, CS 3410, INFO 3000-level or higher, INFO 2300 or INFO 2310 (but not both), INFO 2770, INFO 2921, MATH 2310, MATH 2940.
- **CoursePlan:** Accepts INFO 2300, CS 2110, CS 3110, CS 3410 and INFO 3000+. Rejects INFO 2310, INFO 2770, INFO 2921, MATH 2310 and MATH 2940.
- **Suggested change:** Add INFO 2310, INFO 2770, INFO 2921, MATH 2310 and MATH 2940. Allow only one of INFO 2300 and INFO 2310 to count (for example with a checkerWarning).

### 16. Electives (high, course-list)

- **Catalog:** INFO 3000-level or higher, except INFO 4910, INFO 4997, and INFO 4998.
- **CoursePlan:** Excludes only INFO 4998, so INFO 4910 and INFO 4997 are accepted.
- **Suggested change:** Exclude INFO 4910 and INFO 4997 as well as INFO 4998.

### 17. Concentration – Digital Culture and Production (medium, rule)

- **Catalog:** Option 1: one course each from A and B, and two courses from C. Option 2: three courses from A and one from B.
- **CoursePlan:** Slots are 1 A, 1 B, and 2 from 'A or C', with a description saying '2 additional courses from A or C'. This accepts a mixed 2 A + 1 C + 1 B plan, which neither catalog option allows.
- **Suggested change:** Split the concentration into two toggle options (Option 1: A=1, B=1, C=2. Option 2: A=3, B=1), or restrict the third slot to C only and add a separate Option 2. Update the description to match.

### 18. Electives (medium, count-or-credits)

- **Catalog:** Each elective course must be at least 3.0 credits. Only one semester (3.0-4.0 credits) of INFO 4900 may count.
- **CoursePlan:** The checker does not enforce a minimum of 3 credits per course, so 1–2 credit INFO 4940 or INFO 4900 enrollments count. The single-INFO 4900 limit appears only in the description.
- **Suggested change:** Use courseMeetsCreditMinimum(course, 3) in the checker. Add a checkerWarning about the one-semester INFO 4900 limit.

### 19. Core Courses (low, description)

- **Catalog:** Core: INFO 1200 or INFO 1260, INFO 1300, INFO 2450, INFO 2850, INFO 2950 or INFO 2951. Core classes must be taken at Cornell.
- **CoursePlan:** Description lists 'INFO 1200, INFO 1300, INFO 2040, INFO 2450, and INFO 2950', which omits INFO 1260 and INFO 2951 and uses the old number INFO 2040 (cross-listed with INFO 2850). Slot name is 'INFO 2040'. The source URL points to the A&S BA page. No disallowTransferCredit is set.
- **Suggested change:** Update the description and slot names to the catalog wording (INFO 2850, the INFO 1260 and INFO 2951 alternatives). Point the source at the CALS BS page. Consider setting disallowTransferCredit, since core classes must be taken at Cornell.

### 20. Programming and Math Requirements (low, description)

- **Catalog:** Programming is CS 1110 or CS 1112, or AP CS A (5), IB CS (6/7), or CASE. Students are assumed to know Python. AP credit is not accepted for statistics. Calculus is MATH 1106, MATH 1110, or MATH 1910.
- **CoursePlan:** Description says students must take 'CS 1110, Calculus I' and refers to a Fall 2015 AP cutoff. It tells CS 1112 students to take CS 1133.
- **Suggested change:** Rewrite the description to match the catalog: CS 1110 or CS 1112, one calculus course, one statistics course, and the current AP rules.

### 21. Electives (low, description)

- **Catalog:** Electives include CS 2110, CS 3110, CS 3410, INFO 3000+ (except INFO 4910, INFO 4997, INFO 4998), INFO 2300 or INFO 2310, INFO 2770, INFO 2921, MATH 2310, MATH 2940.
- **CoursePlan:** Description lists 'INFO 2300, CS 2110, CS 3110, CS 3410 or any INFO 3000+ ... (except INFO 4998)'. Source URL points to the A&S BA page.
- **Suggested change:** Update the description and source URL to the current CALS BS elective list.

### 22. Major credit minimum (low, missing-requirement)

- **Catalog:** Minimum number of credits required for the major = 50 credits.
- **CoursePlan:** No requirement or warning reflects the 50-credit major minimum.
- **Suggested change:** Add a self-check or a checkerWarning noting the 50-credit major minimum.

### 23. Concentration (low, description)

- **Catalog:** Program is the CALS BS in Information Science (catalog slug information-science-bs).
- **CoursePlan:** The Concentration source URL points to the A&S BA page 'ba-information-science-college-arts-sciences/degree-requirements-0'.
- **Suggested change:** Point the source at the CALS BS catalog page.

## Could not verify

- Whether INFO 4940 and COMM 4940 special-topics courses count depends on the specific topic approved by an advisor.
- Digital Culture and Production C also accepts any ARCH elective or option studio at 3000+ addressing IT, with IS advising approval. The data cannot show which ARCH courses qualify.
- Information Ethics, Law, and Policy D allows a petition for an upper-level technical IS course. This depends on DUS approval.
- Whether AP CS A (5), IB CS, CASE, and the calculus AP/IB/GCE equivalents are credited, and whether AP credit is blocked from Statistics. These are handled outside the shown file; the combined requirement cannot set disallowTransferCredit only for Statistics.
- INFO 3720, INFO 3210 and INFO 4470 are in the catalog but not in the roster data, so they cannot be added yet.
- Transfer-credit limits (21 credits max, C or higher) and the study-abroad rule (up to two courses, DUS pre-approval) depend on approvals not visible in the inputs.
- Whether the Interactive Technologies CS 2110 requirement may also count toward Electives. The catalog forbids double counting within the major, but the intended encoding is not shown.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
