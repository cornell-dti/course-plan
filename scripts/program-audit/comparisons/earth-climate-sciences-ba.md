# Earth and Climate Sciences (major)

- Catalog: https://catalog.cornell.edu/programs/earth-climate-sciences-ba/ (2026-2027 edition)
- Data file: `src/data/majors/eas.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The eas.ts file does not match the 2026-2027 catalog. It still accepts MATH 1110/1120, a CHEM 1570-only path and PHYS 2214 for chemistry. It drops BIOG 1440 because BIOG 1140 is listed twice. The Environmental core uses EAS 3450 instead of EAS 4710, and the Ocean core uses EAS 3010 instead of EAS 3030. All four elective lists differ substantially from the catalog. The field-course rule is reduced to 3 credits of any EAS course. Several descriptions are stale.

## Findings

### 1. Mathematics (high, extra-requirement)

- **Catalog:** MATH 1910 & MATH 1920 (8 cr); no other option is listed.
- **CoursePlan:** Toggleable 'Option 1: MATH 1110 and MATH 1120' or 'Option 2: MATH 1910 and MATH 1920'.
- **Suggested change:** Remove Option 1 (MATH 1110/MATH 1120) and require MATH 1910 and MATH 1920. Update the description to match.

### 2. Chemistry (high, rule)

- **Catalog:** Two requirements. First, one of CHEM 2070 & CHEM 2071 or CHEM 2090 & CHEM 2091. Second, one of CHEM 2080 & CHEM 2081 or CHEM 1570.
- **CoursePlan:** Option 2 accepts CHEM 1570 alone as satisfying all of chemistry. A CHEM 2070/2090 + CHEM 1570 combination is not accepted by any option.
- **Suggested change:** Model this as two slots: ['CHEM 2070','CHEM 2090'] and ['CHEM 2080','CHEM 1570']. Drop the CHEM 1570-only option.

### 3. Chemistry (high, course-list)

- **Catalog:** Only CHEM courses are listed; PHYS 2214 is not an option.
- **CoursePlan:** 'Option 3: PHYS 2214' satisfies chemistry.
- **Suggested change:** Remove Option 3 (PHYS 2214).

### 4. Biology (high, course-list)

- **Catalog:** BIOG 1140, BIOG 1440, BIOEE 1610, BIOEE 1780, BIOMG 1350, BIOSM 1610, BIOSM 1780.
- **CoursePlan:** Checker lists 'BIOG 1140' twice and omits BIOG 1440, so BIOG 1440 does not count. The description lists BIOG 1440, which contradicts the checker.
- **Suggested change:** Replace the duplicate 'BIOG 1140' with 'BIOG 1440'.

### 5. Concentration – Climate Science electives (high, course-list)

- **Catalog:** EAS 1400, EAS 2400, EAS 3010, EAS 3030, EAS 3340, EAS 3530, EAS 4350, EAS 4470, EAS 4720, EAS 4800, EAS 4860, EAS 5555, BEE 2000, BEE 4850.
- **CoursePlan:** Missing EAS 1400, EAS 2400, EAS 4720, EAS 4860 and BEE 4850. Extra courses not in the catalog: EAS 3421, EAS 4443, EAS 4444, BEE 4110.
- **Suggested change:** Replace the elective list with the catalog list.

### 6. Concentration – Environmental Science core (high, course-list)

- **Catalog:** Core: EAS 2250, EAS 3090, EAS 3030, EAS 4710.
- **CoursePlan:** Core slots are EAS 3090, EAS 3030 and EAS 3450. EAS 3450 is not in the catalog, and EAS 4710 is not a core slot.
- **Suggested change:** Replace the 'EAS 3450' core slot with 'EAS 4710' and update slotNames.

### 7. Concentration – Environmental Science electives (high, course-list)

- **Catalog:** BEE 4270, BEE 4730, BEE 4750, EAS 3010, EAS 3050, EAS 3530, EAS 3540, PLSCI 3650, EAS 4190, EAS 4710, EAS 4720, EAS 4740, EAS 4870.
- **CoursePlan:** Missing EAS 3050, EAS 4190 and EAS 4720. Extra: PLSCS 4110 (cross-listed with CEE 4110). PLSCS 3650 already covers PLSCI 3650 through the cross-listing.
- **Suggested change:** Add EAS 3050, EAS 4190 and EAS 4720. Remove PLSCS 4110.

### 8. Concentration – Geological Sciences electives (high, course-list)

- **Catalog:** EAS 4010, EAS 4040, EAS 4050, EAS 4060, EAS 4550, EAS 4561, EAS 4580, EAS 4720, EAS 4740, EAS 4790, EAS 4840, EAS 5770.
- **CoursePlan:** Missing EAS 4060, EAS 4720 and EAS 4840; the file lists 'BEE 4840', which is not in the roster. Extra: EAS 4540, EAS 4760, EAS 4780, EAS 4820, EAS 5780.
- **Suggested change:** Replace the elective list with the catalog list, changing 'BEE 4840' to 'EAS 4840'.

### 9. Concentration – Ocean Sciences core (high, course-list)

- **Catalog:** Core: EAS 2250, EAS 3050, EAS 3530, EAS 3030.
- **CoursePlan:** Core slots are EAS 3050, EAS 3530 and EAS 3010. EAS 3010 should be EAS 3030.
- **Suggested change:** Replace the 'EAS 3010' core slot with 'EAS 3030' and update slotNames.

### 10. Concentration – Ocean Sciences electives (high, course-list)

- **Catalog:** EAS 3010, EAS 3420, EAS 3540, EAS 3555, EAS 4720.
- **CoursePlan:** Missing EAS 3010 and EAS 4720. Extra: BIOEE 4570, BIOEE 4780, BIOEE 4920, BIOEE 4930, BIOEE 6680, BIOSM 3650, BIOSM 3210, BIOSM 3830, EAS 4620, and EAS 3530 (which is a core course).
- **Suggested change:** Replace the elective list with the catalog list.

### 11. Physics (medium, rule)

- **Catalog:** PHYS 2207 OR PHYS 1112, and PHYS 2208 OR PHYS 2213. Each slot is chosen independently, so mixed pairs such as PHYS 1112 + PHYS 2208 or PHYS 2207 + PHYS 2213 are allowed.
- **CoursePlan:** Toggleable fixed pairs only: PHYS 2207+PHYS 2208, or PHYS 1112+PHYS 2213.
- **Suggested change:** Use a single 'courses' requirement built with includesWithSubRequirements(['PHYS 2207','PHYS 1112'], ['PHYS 2208','PHYS 2213']) and perSlotMinCount [1,1].

### 12. Field Work (medium, rule)

- **Catalog:** Each focused elective has its own field course rule. Climate: EAS 2500. Environmental and Geological: EAS 4370. Ocean: Shoals Marine Lab, Sea Education Association or Woods Hole courses. Other options need pre-approval: outside field courses, field research/REU, or EAS 4910/EAS 4920 research totaling at least 3 credits. A non-credit research option requires an additional EAS concentration course.
- **CoursePlan:** Any 3 credits of 'EAS \*\*\*\*', with a checkerWarning. This accepts unrelated EAS courses and rejects non-EAS field courses such as Shoals BIOSM courses. It never mentions EAS 2500 or EAS 4370 and does not model the extra-course rule.
- **Suggested change:** Describe the per-concentration field course options in the description and checkerWarning, listing EAS 2500, EAS 4370, Shoals/SEA/WHOI and EAS 4910/4920. Either broaden the checker to include those courses or make the requirement a self-check. Mention the additional-concentration-course rule for non-credit research.

### 13. Chemistry (low, course-list)

- **Catalog:** The lab courses CHEM 2071, CHEM 2091 and CHEM 2081 are required with their lectures.
- **CoursePlan:** Labs are not checked or mentioned.
- **Suggested change:** Add the lab courses to the slots, or mention the lab co-requirement in the description.

### 14. Introductory Course (EAS 2250) (low, description)

- **Catalog:** EAS 2250 is part of each focused elective's core. The catalog says nothing about Engineering students counting it as ENGRD or taking an extra elective, and it has no 'Additional Required Courses' section.
- **CoursePlan:** The description talks about Engineering ENGRD use and refers to an 'Additional Required Courses' section.
- **Suggested change:** Rename the requirement to something like 'Core: EAS 2250 The Earth System' and remove the outdated Engineering and section-reference text.

### 15. Concentration descriptions (low, description)

- **Catalog:** Each focused elective has 4 core courses, including EAS 2250, plus 5 elective courses. Electives include courses below 3000, such as EAS 1400, EAS 2400 and BEE 2000.
- **CoursePlan:** 'Students must complete 3 core courses and 5 concentration courses at the 3000-level or above.'
- **Suggested change:** Drop the '3000-level or above' wording. Note that EAS 2250 is the fourth core course and is tracked separately.

### 16. All requirements (source) (low, other)

- **Catalog:** https://catalog.cornell.edu/programs/earth-climate-sciences-ba/
- **CoursePlan:** https://courses.cornell.edu/preview_program.php?catoid=45&poid=23753
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- The catalog lists EAS 4710 both as an Environmental Science core course and as an Environmental Science elective. It is unclear whether one course can count for both.
- The Ocean Sciences elective table lists only 5 courses for a 5-course requirement. The parsed table may be incomplete, so some of the BIOEE/BIOSM courses in the file may be accepted on a department page.
- Which Shoals Marine Lab, Sea Education Association or Woods Hole courses qualify as Ocean Sciences field courses, and the credit amounts of field options, are not given in the inputs.
- Whether CHEM 2071, CHEM 2081 and CHEM 2091 carry credit or are taken together with the lectures is not shown in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
