# Food Science (major)

- Catalog: https://catalog.cornell.edu/programs/food-science-bs/ (2026-2027 edition)
- Data file: `src/data/majors/foodsci.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The foodsci.ts file reflects an older Food Science curriculum and differs substantially from the 2026-2027 catalog. Key gaps: FDSC 2000 is required instead of FDSC 2005, and FDSC 4240 and the CHEM labs are missing. Elective credit totals and course lists are wrong. The Business focus is built around marketing, accounting, finance and business-elective slots the catalog no longer has, and lacks the Business-only chemistry path. Both Business and Safety require FDSC 5970, which was last offered FA21. The Science focus does not require MATH 1120. There are also extra or missing alternatives: CHEM 2150, MATH 1710, PHYS 1101, ORIE 2380 and ENTOM 4250 are accepted, while BIOMG 1350, PHYS 1110/1112 and ENTOM 4520 are not.

## Findings

### 1. Introductory Biology Courses (high, course-list)

- **Catalog:** Minimum 6 credits from BIOG 1140, BIOG 1440, BIOG 1500, BIOMG 1350, BIOEE 1610, BIOEE 1780, BIOAP 1100, PLSCI 1115.
- **CoursePlan:** Checker omits BIOMG 1350; it is not cross-listed with any accepted code.
- **Suggested change:** Add 'BIOMG 1350' to the checker and description.

### 2. General Chemistry (Option 2) (high, extra-requirement)

- **Catalog:** Science and Safety focus: CHEM 2070 & CHEM 2071 and CHEM 2080 & CHEM 2081. CHEM 2150 is not listed.
- **CoursePlan:** Option 2 accepts CHEM 2150 alone as fulfilling General Chemistry.
- **Suggested change:** Remove the CHEM 2150 option unless the department confirms it is still accepted.

### 3. General Chemistry labs (high, missing-requirement)

- **Catalog:** CHEM 2070 & CHEM 2071 and CHEM 2080 & CHEM 2081 (lecture and lab) for the Science and Safety focus areas.
- **CoursePlan:** Only CHEM 2070 and CHEM 2080 are required; the labs CHEM 2071 and CHEM 2081 are not checked.
- **Suggested change:** Add slots for CHEM 2071 and CHEM 2081.

### 4. Chemistry for Business focus (high, rule)

- **Catalog:** Business Focused Elective Area takes CHEM 1560 & CHEM 1561 and CHEM 1570 instead of general and organic chemistry.
- **CoursePlan:** Every student must take CHEM 2070/2080 (or CHEM 2150) and CHEM 3570 and CHEM 3580; CHEM 1560, CHEM 1561 and CHEM 1570 are never accepted.
- **Suggested change:** Make chemistry depend on focus area. One option is a toggle offering 'Business: CHEM 1560, CHEM 1561, CHEM 1570' versus 'Science/Safety: CHEM 2070, 2071, 2080, 2081, 3570, 3580'. Another is moving chemistry into the Concentration options.

### 5. Calculus II (Science focus) (high, missing-requirement)

- **Catalog:** MATH 1120 is required for the Science Focused Elective Area, in addition to MATH 1110.
- **CoursePlan:** Only MATH 1110 is required; the Science option does not require MATH 1120.
- **Suggested change:** Add a MATH 1120 slot to the Science concentration option.

### 6. Statistics (high, course-list)

- **Catalog:** One of AEM 2100, STSCI 2100, STSCI 2150, STSCI 2200, PSYCH 2500.
- **CoursePlan:** Also accepts MATH 1710. PSYCH 3500 is listed instead of PSYCH 2500; this is acceptable because they are cross-listed.
- **Suggested change:** Remove MATH 1710. Replace PSYCH 3500 with PSYCH 2500 in the checker and description.

### 7. Physics (high, course-list)

- **Catalog:** PHYS 2207, or PHYS 1110 & PHYS 1112.
- **CoursePlan:** Accepts PHYS 1101 or PHYS 2207. PHYS 1101 is not in the catalog, and PHYS 1110/PHYS 1112 are not accepted.
- **Suggested change:** Use a toggle with two options: 'PHYS 2207', or 'PHYS 1110 and PHYS 1112' (two slots). Drop PHYS 1101.

### 8. Core Courses (high, course-list)

- **Catalog:** FDSC 2005 (Science and Technology of Raw and Processed Foods) is required in every focus area.
- **CoursePlan:** Requires FDSC 2000 (cross-listed with NS 3450, a different course); FDSC 2005 is not accepted.
- **Suggested change:** Replace 'FDSC 2000' with 'FDSC 2005' in the checker, slot names and description.

### 9. Core Courses / Concentration (high, missing-requirement)

- **Catalog:** FDSC 4240 (Food Processing Laboratory) is required in the Science, Business and Safety focus areas.
- **CoursePlan:** FDSC 4240 is not required anywhere. In Business it can instead fill the FDSC 4\*\*\* elective slot.
- **Suggested change:** Add FDSC 4240 as a required core course.

### 10. Concentration – Business required FDSC courses (high, missing-requirement)

- **Catalog:** The Business focus also requires FDSC 3950 and FDSC 4100, along with FDSC 4230.
- **CoursePlan:** The Business option requires only FDSC 4230. FDSC 3950 and FDSC 4100 are not required, and FDSC 4100 can count as the Business FDSC elective.
- **Suggested change:** Move FDSC 3950 and FDSC 4230 (required in all three areas) into Core Courses, and add FDSC 4100 to the Business option.

### 11. Concentration – FDSC 5970 (Business and Safety) (high, extra-requirement)

- **Catalog:** FDSC 5970 is not required in any focus area.
- **CoursePlan:** Business and Safety each have a required 'FDSC 5970' slot. FDSC 5970 was last offered FA21, so these options can never be completed.
- **Suggested change:** Remove the FDSC 5970 slots.

### 12. Concentration – Business FDSC electives (high, count-or-credits)

- **Catalog:** 10 credits of FDSC electives above the 3000 level, excluding special studies courses.
- **CoursePlan:** A single course from 'FDSC 4**_', 'FDSC 5_**', 'FDSC 6\*\*\*' ('2 credits of 4000+ FDSC electives'). The wildcard also accepts the excluded FDSC 4960, 4970, 4980, 4990 and required courses such as FDSC 4100 and FDSC 4240.
- **Suggested change:** Require 10 credits. Exclude FDSC 4960–4990 and the required FDSC courses from the elective checker.

### 13. Concentration – Business marketing, accounting, finance and business electives (high, extra-requirement)

- **Catalog:** The Business focus requires ECON 1110 and AEM 1200 plus FDSC courses and electives. There are no marketing, accounting, finance or business-elective requirements.
- **CoursePlan:** Requires a marketing course, an accounting course, a finance course and 2 business electives from AEM/HADM/NCC/NBA lists.
- **Suggested change:** Remove the Marketing, Accounting, Finance and business-elective slots.

### 14. Concentration – Business economics and management (high, course-list)

- **Catalog:** ECON 1110 and AEM 1200 specifically.
- **CoursePlan:** The Economics slot also accepts ECON 3030 and PAM 2000. The Management slot also accepts HADM 1810, ILRID 1700, AEM 2200 and ILROB 1220.
- **Suggested change:** Restrict the slots to ECON 1110 and AEM 1200.

### 15. Concentration – Safety Epidemiology (high, course-list)

- **Catalog:** NS 3600, PUBPOL 3280, or ENTOM 4520 (in order of preference).
- **CoursePlan:** Accepts NS 3600, PAM 3280 (cross-listed with PUBPOL 3280, so fine) and ENTOM 4250. ENTOM 4250 is not in the roster data, and ENTOM 4520 is not accepted.
- **Suggested change:** Replace 'ENTOM 4250' with 'ENTOM 4520'. Prefer 'PUBPOL 3280' as the listed code.

### 16. Concentration – Safety Risk Analysis and Management (high, course-list)

- **Catalog:** PUBPOL 4240 or GDEV 4080.
- **CoursePlan:** Accepts PAM 4240 and DSOC 4080 (both acceptable via cross-listing) and also ORIE 2380, which the catalog does not list.
- **Suggested change:** Remove ORIE 2380. Use the current codes PUBPOL 4240 and GDEV 4080.

### 17. Introductory Biology Courses (medium, count-or-credits)

- **Catalog:** Minimum 6 credits.
- **CoursePlan:** fulfilledBy 'courses' with perSlotMinCount [2] ('Two courses'), so two low-credit courses (e.g. one including BIOG 1500) could show as complete under 6 credits.
- **Suggested change:** Change to fulfilledBy: 'credits' with perSlotMinCount [6] and update the description.

### 18. Concentration – Safety: FDSC 4230 or FDSC 4250 (medium, course-list)

- **Catalog:** FDSC 4230 is required, with no alternative.
- **CoursePlan:** Slot 'FDSC 4230 or FDSC 4250' accepts FDSC 4250 in place of FDSC 4230.
- **Suggested change:** Require FDSC 4230 only.

### 19. Concentration – Science FDSC electives (medium, count-or-credits)

- **Catalog:** 4 credits of FDSC electives above the 3000 level, excluding special studies FDSC 4960, 4970, 4980, 4990. No group structure.
- **CoursePlan:** Three courses from two fixed lists (Group 1 / Group 2 4000+ electives). The description says 'at least 3 credits from group 1 and 2 credits from group 2'.
- **Suggested change:** Replace with a single 4-credit elective requirement. Accept FDSC courses at 3000 level and above, excluding FDSC 4960–4990 and the required core courses. Update the description.

### 20. Concentration – FDSC elective lists (Science, Safety) (medium, course-list)

- **Catalog:** Any FDSC course above the 3000 level counts, except the special studies courses.
- **CoursePlan:** Only fixed lists are accepted, e.g. FDSC 4010, 4020, 4040, 4050, 4220, 4250, 4400, 4110, 4500, 4510, 4880, 5970, 6950 for Science. Other eligible FDSC courses are rejected.
- **Suggested change:** Use FDSC level wildcards (e.g. 'FDSC 3**_' through 'FDSC 6_**'). Explicitly exclude FDSC 4960, 4970, 4980, 4990 and the required core FDSC courses.

### 21. Concentration – Safety FDSC electives (medium, count-or-credits)

- **Catalog:** 3 credits of FDSC electives above the 3000 level, excluding special studies courses.
- **CoursePlan:** '2 credits of 4000+ FDSC electives', implemented as one course from a fixed list.
- **Suggested change:** Change to 3 credits. Accept FDSC courses at 3000 level and above, excluding FDSC 4960–4990 and required courses.

### 22. Core Courses / Concentration / Statistics / Physics / General Chemistry descriptions (low, description)

- **Catalog:** The 2026-2027 catalog lists the courses and credits described in the findings above.
- **CoursePlan:** Descriptions name FDSC 2000, CHEM 2150, PHYS 1101, MATH 1710, PSYCH 3500, PAM/DSOC codes, ENTOM 4250, FDSC 5970, group-based electives and Business marketing/accounting/finance courses. The source links point to the CALS website rather than the catalog page.
- **Suggested change:** Rewrite the descriptions to match the catalog. Set source to https://catalog.cornell.edu/programs/food-science-bs/.

## Could not verify

- Whether the Physics, Statistics, Biochemistry, Microbiology and Introductory Biology core tables apply to all three focus areas. The parsed table merges the Physics table into the Science elective list, but the prose lists seven core tables.
- Whether 'FDSC Electives (>3000 level)' includes 3000-level courses or only courses above 3000, and whether 5000/6000-level FDSC courses (e.g. FDSC 5400, FDSC 6950) are intended to count.
- Whether the department still accepts CHEM 2150 as a substitute for CHEM 2070/2080 under a policy published outside the catalog.
- Whether required FDSC courses that are not core in a given focus (e.g. FDSC 4190 for Business or Safety, FDSC 4100 for Safety) may count as that focus area's FDSC electives.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
