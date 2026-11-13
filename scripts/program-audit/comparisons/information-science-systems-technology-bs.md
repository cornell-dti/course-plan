# Information Science, Systems, and Technology (major)

- Catalog: https://catalog.cornell.edu/programs/information-science-systems-technology-bs/ (2026-2027 edition)
- Data file: `src/data/majors/isst.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ISST data file is out of date against the 2026-2027 catalog. The core requires INFO 2300 where the catalog requires INFO 1300. The ML core option and several concentration groups omit ORIE 3741. Almost every concentration group is missing current courses and accepts courses the catalog no longer lists. Behavioral Science is encoded as any three courses instead of one each from A, B and C. The CS 2800 requirement is not enforced. The major-approved elective list reflects an old area scheme rather than 'any concentration course'.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** Core includes INFO 1300 (Introductory Design and Programming for the Web). Footnote fn2 says INFO 2300 or INFO 2310 counts only as a major-approved elective.
- **CoursePlan:** Slot 3 requires 'INFO 2300'. INFO 1300 (cross-listed CS 1300) is not accepted.
- **Suggested change:** Replace ['INFO 2300'] with ['INFO 1300'] and update the slot name.

### 2. Core Courses – Data Science and Machine Learning (high, course-list)

- **Catalog:** One of CS 3780, ORIE 3741, ORIE 4740, STSCI 3740.
- **CoursePlan:** ORIE 4740, CS 4780 (=CS 3780), CS 4786, STSCI 4740 (=STSCI 3740). ORIE 3741 (=ORIE 4741) is not accepted. CS 4786 is accepted although the catalog does not list it.
- **Suggested change:** Use ['CS 3780','ORIE 3741','ORIE 4740','STSCI 3740'] and drop CS 4786. Update the slot name to match.

### 3. Engineering Mathematics (high, rule)

- **Catalog:** CS 2800 must be completed, either as the fourth Engineering Math requirement or in place of PHYS 2214.
- **CoursePlan:** The fourth slot accepts MATH 2930, MATH 3040 or CS 2800. A student with MATH 2930 and no CS 2800 is shown as complete.
- **Suggested change:** Require CS 2800 in the major, for example as its own slot or requirement with double counting allowed. The catalog does not list MATH 3040, so verify whether it should stay.

### 4. Primary/Secondary Concentration – Data Science A. Data Analysis (high, course-list)

- **Catalog:** INFO 3300, INFO 3900, INFO 3950, INFO 4940, ORIE 4740.
- **CoursePlan:** INFO 3300, INFO 3950, CS 4780, CS 4786, ORIE 3120, ORIE 4740, STSCI 4740.
- **Suggested change:** Add INFO 3900 and INFO 4940. Remove CS 4780, CS 4786, ORIE 3120 (a core course) and STSCI 4740.

### 5. Primary/Secondary Concentration – Data Science B. Domain Expertise (high, course-list)

- **Catalog:** CS 4740, INFO 2770, INFO 3350, INFO 3370, INFO 3720, INFO 4100, INFO 4120, INFO 4300, INFO 4350, INFO 4940.
- **CoursePlan:** INFO 2770, INFO 3350, INFO 4100, INFO 4120, INFO 4130, INFO 4300, CS 4740.
- **Suggested change:** Add INFO 3370, INFO 3720, INFO 4350 and INFO 4940, and remove INFO 4130. Apply this to both the primary and secondary options.

### 6. Primary/Secondary Concentration – Data Science C. Big Data Ethics, Policy and Society (high, course-list)

- **Catalog:** INFO 3200, INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4260, INFO 4270, INFO 4390, INFO 4561, INFO 4940, COMM 4010, ENGL 3778, PUBPOL 3460.
- **CoursePlan:** INFO 3200, INFO 3561, INFO 4200, INFO 4240, INFO 4250, INFO 4270, INFO 4561, INFO 4940, COMM 4242, ENGL 3778, STS 3440.
- **Suggested change:** Add INFO 4140, INFO 4145, INFO 4260, INFO 4390, COMM 4010 and PUBPOL 3460. Remove INFO 3561, COMM 4242 and STS 3440. Apply this to both options.

### 7. Primary/Secondary Concentration – Data Science D. Data Communication (high, course-list)

- **Catalog:** INFO 3312, INFO 4310, COMM 3150, COMM 3189, COMM 3190, COMM 4860, COMM 4940, SOC 3580, SOC 4390.
- **CoursePlan:** INFO 4310, COMM 3150, COMM 3189, COMM 4200, COMM 4860, GOVT 2169, SOC 3580.
- **Suggested change:** Add INFO 3312, COMM 3190, COMM 4940 and SOC 4390, and remove COMM 4200 and GOVT 2169. Apply this to both options.

### 8. Primary/Secondary Concentration – Interactive Technologies B. Working with Data/Software (high, course-list)

- **Catalog:** INFO 3300, INFO 4340, INFO 4555, CS 4620, CS 5150, ORIE 3741.
- **CoursePlan:** INFO 3300, INFO 4340, INFO 4555, CS 4780, CS 4786, CS 5150, ORIE 3120, ORIE 4740, STSCI 4740. The primary option's slot D lists the same courses.
- **Suggested change:** Add CS 4620 and ORIE 3741. Remove CS 4780, CS 4786, ORIE 3120, ORIE 4740 and STSCI 4740 from slot B and from the primary option's union slot.

### 9. Primary/Secondary Concentration – Interactive Technologies C. Context/Application Domains (high, course-list)

- **Catalog:** INFO 4152, INFO 4310, INFO 4410, INFO 4430, INFO 4505, INFO 4940.
- **CoursePlan:** INFO 4130, INFO 4152, INFO 4154, INFO 4275, INFO 4310, INFO 4410, INFO 4430, INFO 4940, CS 4752.
- **Suggested change:** Add INFO 4505. Remove INFO 4130, INFO 4154, INFO 4275 and CS 4752, also from the primary option's slot D.

### 10. Primary/Secondary Concentration – Networks, Crowds, and Markets A. Models (high, course-list)

- **Catalog:** INFO 4220, INFO 4360, INFO 4940, COMM 3150, ECON 3810, ECON 4020, ECON 4610, ECON 4620, ECON 4660, ORIE 4350, SOC 3080.
- **CoursePlan:** INFO 4220, INFO 4360, COMM 3150, ECON 3810, ECON 4020, ECON 4022, ECON 4610, ECON 4660, ORIE 4350, SOC 3080.
- **Suggested change:** Add INFO 4940 and ECON 4620, and remove ECON 4022.

### 11. Primary/Secondary Concentration – Networks, Crowds, and Markets B. Data (high, course-list)

- **Catalog:** INFO 3300, INFO 3950, INFO 4300, INFO 4350, INFO 4940, CS 4740, ECON 3120, ECON 3140.
- **CoursePlan:** INFO 3300, INFO 4300, CS 4740, CS 4780, CS 4786, ECON 3120, ECON 3140.
- **Suggested change:** Add INFO 3950, INFO 4350 and INFO 4940, and remove CS 4780 and CS 4786.

### 12. Primary/Secondary Concentration – Networks, Crowds, and Markets C. Policy/Values (high, course-list)

- **Catalog:** INFO 4140, INFO 4145, INFO 4200, INFO 4240, INFO 4250, INFO 4270, INFO 4940, COMM 4940, PUBPOL 3460, SOC 3490.
- **CoursePlan:** INFO 3561, INFO 4200, INFO 4240, INFO 4250, INFO 4940, STS 3440.
- **Suggested change:** Add INFO 4140, INFO 4145, INFO 4270, COMM 4940, PUBPOL 3460 and SOC 3490. Remove INFO 3561 and STS 3440.

### 13. Secondary Concentration – Behavioral Science (high, rule)

- **Catalog:** Choose one course each from A (Understanding Social Behavior), B (Social Data Analytics) and C (Behavior in Sociological, Network, or Design Context).
- **CoursePlan:** A single slot accepting any 3 courses from a pooled list, described as 'Choose three courses'.
- **Suggested change:** Split into three slots A, B and C with perSlotMinCount [1,1,1] and update the description.

### 14. Secondary Concentration – Behavioral Science (high, course-list)

- **Catalog:** A: INFO 3170, INFO 4430, INFO 4450, INFO 4490, INFO 4500, INFO 4505, INFO 4940, COMM 4380, PSYCH 3800. B: INFO 3300, INFO 3720, INFO 3950, INFO 4100, INFO 4300, INFO 4350, INFO 4940, CS 4740. C: INFO 3200, INFO 4140, INFO 4940, INFO 4360, COMM 4940, INFO 3450, INFO 4240, INFO 4400.
- **CoursePlan:** The pooled list omits INFO 3170, INFO 4505, INFO 3720, INFO 3950, INFO 4350, INFO 4140 and COMM 4940. It also accepts INFO 4800, COMM 4242, CS 4780, INFO 3561, INFO 4650 and STS 3440, plus INFO 3460, COMM 4410 and SOC 3350, which are not in the roster.
- **Suggested change:** Rebuild the A, B and C lists from the catalog.

### 15. Secondary Concentration – Digital Culture and Production A. Digital Culture and History (high, course-list)

- **Catalog:** INFO 2921, INFO 3200, INFO 4140, INFO 4260, INFO 4270, INFO 4940, STS 4040.
- **CoursePlan:** INFO 2921, INFO 3200, INFO 3561, STS 3440, STS 4040 (the same list appears in slot C).
- **Suggested change:** Add INFO 4140, INFO 4260, INFO 4270 and INFO 4940. Remove INFO 3561 and STS 3440 from slots A and C.

### 16. Secondary Concentration – Digital Culture and Production B. Media, Art, Design (high, course-list)

- **Catalog:** INFO 3450, INFO 3660, INFO 4152, INFO 4240, INFO 4400, INFO 4420, INFO 4940, ARTH 4151.
- **CoursePlan:** Accepts all of these plus INFO 2750, ART 3705, ARTH 4154, COML 3115, ENGL 3741 and HIST 2293 (the same list appears in slot C).
- **Suggested change:** Remove INFO 2750, ART 3705, ARTH 4154, COML 3115, ENGL 3741 and HIST 2293 from slots B and C.

### 17. Secondary Concentration – Information Ethics, Law, and Policy A. Frameworks and Institutions (high, course-list)

- **Catalog:** COMM 4010, INFO 3210, INFO 4113, INFO 4140, INFO 4200, INFO 4250, INFO 4301, INFO 4940, HADM 4890, PUBPOL 3460.
- **CoursePlan:** INFO 4113, INFO 4200, INFO 4250, INFO 4301, HADM 4890, STS 2761.
- **Suggested change:** Add COMM 4010, INFO 3210, INFO 4140, INFO 4940 and PUBPOL 3460, and remove STS 2761.

### 18. Secondary Concentration – Information Ethics, Law, and Policy B. Methods and Analysis (high, course-list)

- **Catalog:** INFO 2921, INFO 4240, INFO 4940, PUBPOL 2300, PUBPOL 2301.
- **CoursePlan:** INFO 4240, INFO 4800, INFO 4940, COMM 4242, CRP 3210, PAM 2300 (=PUBPOL 2300).
- **Suggested change:** Add INFO 2921 and PUBPOL 2301. Remove INFO 4800, COMM 4242 and CRP 3210.

### 19. Secondary Concentration – Information Ethics, Law, and Policy C. Cases/Topics (high, course-list)

- **Catalog:** COMM 4940, ENGRG 3605, INFO 3170, INFO 3200, INFO 4145, INFO 4210, INFO 4260, INFO 4390, INFO 4561, STS 4040.
- **CoursePlan:** INFO 3200, INFO 3460, INFO 3561, INFO 4270, INFO 4561, INFO 4940, STS 3440, STS 4040.
- **Suggested change:** Add COMM 4940, ENGRG 3605, INFO 3170, INFO 4145, INFO 4210, INFO 4260 and INFO 4390. Remove INFO 3460, INFO 3561, INFO 4270, INFO 4940 and STS 3440.

### 20. Two Major Approved Electives (high, course-list)

- **Catalog:** Two courses from any concentration list. INFO 2300 or INFO 2310 (not both) also counts. INFO 4910, INFO 4997 and INFO 4998 do not count. One semester of INFO 4900 counts if taken for 3-4 credits.
- **CoursePlan:** Uses an old 'Area 1-6' list. It accepts non-concentration courses such as ORIE 3150, ORIE 3510, ORIE 4580, CS 3110, CS 3410, CS 4320, CS 4700, CS 4850, CS 5430, CS 5780, ORIE 5126, AEM 3220, ART 3705, DEA 4700 and INFO 3152. It omits many current concentration courses, such as INFO 3900, INFO 3370, INFO 4350, INFO 4140, INFO 4145, INFO 4260, INFO 4390, INFO 3312, COMM 3150, COMM 4860, SOC 3580, CS 4758, INFO 4505, ECON 4660, INFO 3170, INFO 4125, INFO 2921, PUBPOL 3460, INFO 4210 and ORIE 3741. It also omits INFO 2300 and INFO 2310.
- **Suggested change:** Rebuild the list as the union of all current concentration lists plus INFO 2300, INFO 2310 and INFO 4900. Add a warning that only one of INFO 2300/INFO 2310 counts and INFO 4900 needs 3-4 credits.

### 21. Secondary Concentration – UX (User Experience) (medium, course-list)

- **Catalog:** A: INFO 3450, INFO 4400, INFO 4410, INFO 4470. B: INFO 2921, INFO 4240, INFO 4420, INFO 4505, INFO 4940. C: INFO 4125, INFO 4430, INFO 4450, INFO 4490, COMM 4380, PSYCH 3420.
- **CoursePlan:** A omits INFO 4470. B omits INFO 4505 and accepts ENGL 3741. C omits INFO 4125 and lists INFO 3460, which is not in the roster.
- **Suggested change:** Add INFO 4470 to A, INFO 4505 to B and INFO 4125 to C. Remove ENGL 3741 and INFO 3460.

### 22. Core Courses (low, description)

- **Catalog:** Networks is listed as INFO 2850.
- **CoursePlan:** Slot name 'INFO 2040'. It is cross-listed with INFO 2850, so matching is correct.
- **Suggested change:** Rename the slot to 'INFO 2850' for clarity.

### 23. Primary Concentration – Interactive Technologies (low, description)

- **Catalog:** The concentration has no 'Required Course: CS 2110'. CS 2110/ENGRD 2110 is required elsewhere in the major.
- **CoursePlan:** The description begins 'Required Course: CS 2110.'
- **Suggested change:** Remove the CS 2110 statement from the concentration description.

### 24. Secondary Concentration – Digital Culture and Production (low, description)

- **Catalog:** Group B is named 'Media, Art, Design'.
- **CoursePlan:** The description calls it 'B. Digital Production'.
- **Suggested change:** Rename the group to 'Media, Art, Design'.

### 25. Two Major Approved Electives (low, description)

- **Catalog:** INFO 4900 counts only if taken for 3-4 credits with a letter grade of C- or higher, and only one semester counts.
- **CoursePlan:** The description says only 'INFO 4900 may be used to fulfill one major-approved elective'. The checker does not enforce the one-semester limit.
- **Suggested change:** Add the credit and one-semester conditions to the description or a checkerWarning.

## Could not verify

- Whether MATH 3040 is an acceptable fourth Engineering Math course; the catalog only names CS 2800 in this context.
- Which INFO 4940, COMM 4940 and ARTH 4151 topics are advisor-approved for each concentration group.
- Whether the 'Courses outside the major (≥9 credits)' and 'Major-required courses ≥30 / major-approved electives ≥9 credits' rows are enforced in the Engineering college requirements file rather than in this major file.
- Whether CoursePlan prevents one course from filling both a named group slot and the 'any category' slot in the primary Interactive Technologies option.
- Whether INFO 3720, INFO 3210 and INFO 4470, which are catalog courses not in the roster data, need placeholders.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
