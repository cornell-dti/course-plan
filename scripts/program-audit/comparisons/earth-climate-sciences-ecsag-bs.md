# Earth and Climate Sciences (major)

- Catalog: https://catalog.cornell.edu/programs/earth-climate-sciences-ecsag-bs/ (2026-2027 edition)
- Data file: `src/data/majors/eas.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The EAS data file follows an older version of the Earth and Climate Sciences major and disagrees with the 2026-2027 catalog in many places. The data file has these problems:

- **Mathematics:** it accepts MATH 1110/1120.
- **Physics:** it does not allow mixing the alternatives.
- **Chemistry:** it accepts CHEM 1570 alone or PHYS 2214.
- **Biology:** it omits BIOG 1440.
- **Core courses:** the Environmental and Ocean core courses are wrong.
- **Elective lists:** every concentration's elective list both misses current catalog courses and accepts courses the catalog does not list, including a nonexistent BEE 4840 and core courses counted again as electives.

## Findings

### 1. Mathematics (high, course-list)

- **Catalog:** MATH 1910 & MATH 1920 (8 cr); no other option is listed.
- **CoursePlan:** Toggle with Option 1: MATH 1110 and MATH 1120, or Option 2: MATH 1910 and MATH 1920.
- **Suggested change:** Remove Option 1 (MATH 1110/MATH 1120). Make the requirement a plain 'courses' requirement with includesWithSubRequirements(['MATH 1910'], ['MATH 1920']), and update the description.

### 2. Chemistry (high, rule)

- **Catalog:** Students need both of the following:
- one of CHEM 2070 & CHEM 2071, or CHEM 2090 & CHEM 2091;
- one of CHEM 2080 & CHEM 2081, or CHEM 1570.
- **CoursePlan:** Option 2 is satisfied by CHEM 1570 alone, with no first-semester general chemistry course.
- **Suggested change:** Use two slots: ['CHEM 2070', 'CHEM 2090'] and ['CHEM 2080', 'CHEM 1570']. Either add the lab courses or note them in the description.

### 3. Chemistry (high, extra-requirement)

- **Catalog:** No physics alternative is listed for the chemistry requirement.
- **CoursePlan:** Option 3: PHYS 2214 alone satisfies Chemistry.
- **Suggested change:** Remove Option 3 (PHYS 2214).

### 4. Biology (high, course-list)

- **Catalog:** Students select one of BIOG 1140, BIOG 1440, BIOEE 1610, BIOEE 1780, BIOMG 1350, BIOSM 1610, BIOSM 1780.
- **CoursePlan:** The checker lists 'BIOG 1140' twice and omits BIOG 1440, so BIOG 1440 cannot count even though the description names it.
- **Suggested change:** Replace the duplicate 'BIOG 1140' with 'BIOG 1440'.

### 5. Concentration – Climate Science electives (high, course-list)

- **Catalog:** Students take 5 courses from: EAS 1400, EAS 2400, EAS 3010, EAS 3030, EAS 3340, EAS 3530, EAS 4350, EAS 4470, EAS 4720, EAS 4800, EAS 4860, EAS 5555, BEE 2000, BEE 4850.
- **CoursePlan:** The elective list lacks EAS 1400, EAS 2400, EAS 4720, EAS 4860 and BEE 4850. It accepts EAS 3421, EAS 4443, EAS 4444 and BEE 4110, none of which the catalog lists.
- **Suggested change:** Add 'EAS 1400', 'EAS 2400', 'EAS 4720', 'EAS 4860' and 'BEE 4850'. Remove 'EAS 3421', 'EAS 4443', 'EAS 4444' and 'BEE 4110'.

### 6. Concentration – Environmental Science core (high, course-list)

- **Catalog:** The core is EAS 2250, EAS 3090, EAS 3030 and EAS 4710.
- **CoursePlan:** The core slots are EAS 3090, EAS 3030 and EAS 3450 (cross-listed EAS 4340). EAS 4710 is not required as a core course, and EAS 3450 is required even though the catalog does not list it.
- **Suggested change:** Replace the 'EAS 3450' core slot with 'EAS 4710' and update slotNames.

### 7. Concentration – Environmental Science electives (high, course-list)

- **Catalog:** Students take 5 courses from: BEE 4270, BEE 4730, BEE 4750, EAS 3010, EAS 3050, EAS 3530, EAS 3540, PLSCI 3650, EAS 4190, EAS 4710, EAS 4720, EAS 4740, EAS 4870.
- **CoursePlan:** The elective list lacks EAS 3050, EAS 4190 and EAS 4720. It accepts PLSCS 4110 (CEE 4110), which the catalog does not list. PLSCS 3650 is cross-listed with PLSCI 3650, so that course is covered.
- **Suggested change:** Add 'EAS 3050', 'EAS 4190' and 'EAS 4720'. Remove 'PLSCS 4110'. Optionally change 'PLSCS 3650' to 'PLSCI 3650'.

### 8. Concentration – Geological Sciences electives (high, course-list)

- **Catalog:** Students take 5 courses from: EAS 4010, EAS 4040, EAS 4050, EAS 4060, EAS 4550, EAS 4561, EAS 4580, EAS 4720, EAS 4740, EAS 4790, EAS 4840, EAS 5770.
- **CoursePlan:** The elective list lacks EAS 4060, EAS 4720 and EAS 4840. It lists 'BEE 4840', which is not in the roster data and is likely a typo for EAS 4840. It also accepts EAS 4540, EAS 4760, EAS 4780, EAS 4820 and EAS 5780 (ASTRO 6578), none of which the catalog lists.
- **Suggested change:** Add 'EAS 4060', 'EAS 4720' and 'EAS 4840'. Remove 'BEE 4840', 'EAS 4540', 'EAS 4760', 'EAS 4780', 'EAS 4820' and 'EAS 5780'.

### 9. Concentration – Ocean Sciences core (high, course-list)

- **Catalog:** The core is EAS 2250, EAS 3050, EAS 3530 and EAS 3030.
- **CoursePlan:** The core slots are EAS 3050, EAS 3530 and EAS 3010. EAS 3030 is not required, and EAS 3010 (a catalog elective) is required as core.
- **Suggested change:** Replace the 'EAS 3010' core slot with 'EAS 3030', update slotNames, and move EAS 3010 into the elective list.

### 10. Concentration – Ocean Sciences electives (high, course-list)

- **Catalog:** Students take 5 courses from: EAS 3010, EAS 3420, EAS 3540, EAS 3555, EAS 4720.
- **CoursePlan:** The elective list lacks EAS 3010 and EAS 4720. It accepts BIOEE 4570, BIOEE 4780, BIOEE 4920, BIOEE 4930, BIOEE 6680, BIOSM 3650, BIOSM 3210, BIOSM 3830 and EAS 4620, none of which the catalog lists. It also lists EAS 3530, which is a required core course, as an elective.
- **Suggested change:** Set the elective list to ['EAS 3010', 'EAS 3420', 'EAS 3540', 'EAS 3555', 'EAS 4720'].

### 11. Physics (medium, rule)

- **Catalog:** PHYS 2207 OR PHYS 1112, and PHYS 2208 OR PHYS 2213; each slot is an independent choice.
- **CoursePlan:** Option 1 requires PHYS 2207 + PHYS 2208 and Option 2 requires PHYS 1112 + PHYS 2213. The mixed pairs PHYS 2207 + PHYS 2213 and PHYS 1112 + PHYS 2208 are rejected.
- **Suggested change:** Replace the toggle with a single 'courses' requirement: includesWithSubRequirements(['PHYS 2207', 'PHYS 1112'], ['PHYS 2208', 'PHYS 2213']), perSlotMinCount [1, 1].

### 12. Chemistry (medium, course-list)

- **Catalog:** The chemistry options include the labs: CHEM 2070 & CHEM 2071, CHEM 2090 & CHEM 2091, and CHEM 2080 & CHEM 2081.
- **CoursePlan:** Only the lecture courses CHEM 2070, CHEM 2090 and CHEM 2080 are required; no lab is checked or mentioned.
- **Suggested change:** Add lab slots that pair with the lectures (CHEM 2071/CHEM 2091, and CHEM 2081 when CHEM 2080 is chosen), or at least mention the labs in the description.

### 13. Field Work (medium, rule)

- **Catalog:** Each focused elective requires a field course:
- Climate Science: EAS 2500.
- Environmental and Geological Sciences: EAS 4370.
- Ocean Sciences: Shoals Marine Lab, Sea Education Association or Woods Hole courses.
- Alternatives: approved outside field courses, field research or REU, or EAS 4910/EAS 4920 research totaling at least 3 credits.
- Students using a non-credit research option must complete an additional EAS concentration course.
- **CoursePlan:** The requirement asks for 3 credits of any 'EAS \*\*\*\*' course, with a warning that the field work is not checked. Shoals (BIOSM) courses are rejected. The description never names the field courses or the extra-course rule for the non-credit option.
- **Suggested change:** Rewrite the description to list the field course for each focused elective and the research option, and to state the extra concentration course rule. Either convert the requirement to self-check or widen the checker to include EAS 2500, EAS 4370, EAS 4910, EAS 4920 and BIOSM courses.

### 14. Introductory Course (low, description)

- **Catalog:** EAS 2250 is part of the 'Core Required Courses-Must take all' in every focused elective. The page is for the CALS degree and says nothing about Engineering ENGRD substitution or an 'Additional Required Courses' section.
- **CoursePlan:** The description discusses College of Engineering students counting EAS 2250 as ENGRD and refers to an 'Additional Required Courses' section.
- **Suggested change:** Rewrite the description to say EAS 2250 is a required core course for all focused electives, and drop the Engineering text.

### 15. Concentration (low, description)

- **Catalog:** Each focused elective has 4 required core courses (including EAS 2250) plus 5 focused electives. Some electives are below the 3000 level: EAS 1400, EAS 2400 and BEE 2000.
- **CoursePlan:** Every option's description says 'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.'
- **Suggested change:** Reword to say each option has 4 core courses, with EAS 2250 tracked separately, plus 5 focused electives from the listed courses. Drop the '3000-level or above' claim.

### 16. All requirements (source) (low, other)

- **Catalog:** The current catalog page is https://catalog.cornell.edu/programs/earth-climate-sciences-ecsag-bs/.
- **CoursePlan:** source: 'https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753'.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether EAS 4710 may count both as an Environmental Science core course and as one of the 5 focused electives. The catalog lists it in both tables, as it does EAS 3030 in Climate Science and EAS 3050 in the Environmental electives.
- Which specific Shoals Marine Lab, Sea Education Association and Woods Hole courses count as Ocean Sciences field courses. The catalog names programs, not course codes.
- Whether the Concentration requirement lets a single course fill both a core slot and an elective slot within the same option (for example EAS 3530 in Ocean Sciences). This depends on slot-assignment logic not shown in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
