# Chemical Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/chemical-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/chemE.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The chemE.ts file is out of date and contains copy-paste errors.

- **Semester 8:** the description says CHEME 4620, but the checker duplicates Semester 5. Because Semester 5 allows double counting, Semester 8 shows as complete without CHEME 4620.
- **Missing course:** CHEME 2200 is not required anywhere.
- **Unfulfillable slot:** Semester 4 requires CHEM 3090, which is no longer in the roster.
- **Computing:** CS 1110 is rejected; only CS 1112 is accepted.
- **Advanced CHEME electives:** the list is badly outdated in both directions.
- **Major-approved electives:** 3 credits are required instead of 9.
- **Biology elective options:** some are stale (BIOG 1107/1108) or incomplete (BIOG 1445, AP score).
- **Chemistry and physics alternatives:** the AP Chem + CHEM 2080/2081 path and PHYS 2217 are missing.

## Findings

### 1. Semester 8 (high, missing-requirement)

- **Catalog:** CHEME 4620 (Chemical Engineering Capstone Design II) is a required major course.
- **CoursePlan:** The description reads 'CHEME 4620 or CHEME 4930', but the checker copies Semester 5: CS 1112, CHEM 3570/3530/3590, CHEM 2510, CHEME 3130, CHEME 3240. Semester 5 sets allowCourseDoubleCounting, so those same courses also fill Semester 8. CHEME 4620 is accepted by no requirement.
- **Suggested change:** Replace the Semester 8 checker with includesWithSubRequirements(['CHEME 4620']), using perSlotMinCount [1] and slotNames ['CHEME 4620']. Drop CHEME 4930, which is not in the roster data.

### 2. CHEME 2200 (Physical Chemistry II for Engineers) (high, missing-requirement)

- **Catalog:** CHEME 2200 is a required major course. It is also a fourth-semester affiliation prerequisite.
- **CoursePlan:** No requirement accepts CHEME 2200.
- **Suggested change:** Add CHEME 2200 as a required slot, most naturally in Semester 4 in place of CHEM 3090.

### 3. Semester 4 (high, course-list)

- **Catalog:** Major required courses include CHEME 2200, CHEME 3230 and CHEM 2900, plus MATH 2940 or CEE 3040 or ENGRD 2700. CHEM 3090 is not listed.
- **CoursePlan:** A slot requires CHEM 3090. That course is not in the roster data, so no student can add it and the requirement can never be fulfilled.
- **Suggested change:** Replace ['CHEM 3090'] with ['CHEME 2200'] and update the description and slotNames.

### 4. Semester 5 – computing slot (high, course-list)

- **Catalog:** The computing requirement is CS 1110 or CS 1112; either one counts toward the degree.
- **CoursePlan:** Only CS 1112 is accepted. Students who took CS 1110 cannot fill the slot.
- **Suggested change:** Change the slot to ['CS 1110', 'CS 1112'] and update the description and slotName.

### 5. Semester 6 / Semester 7 – advanced CHEME electives (high, course-list)

- **Catalog:** The approved list is:
- CHEME 4020, 4130, 4310, 4410, 4430, 4440, 4660, 4770, 4800, 4840
- CHEME 5430, 5610
- CHEME 6310, 6400, 6660
- the CHEME 6661–6682 modules
- CHEME 6800, 6880, 6888
- **CoursePlan:** The checker list rejects catalog courses CHEME 4310, 4410, 4440, 4660, 4770, 4800, 6880, 6888 and the CHEME 6661, 6662, 6663, 6664, 6667, 6670, 6671, 6676, 6679, 6681 and 6682 modules.

It accepts courses not on the catalog list, including currently offered CHEME 5440, CHEME 6240 (=CHEME 7310), CHEME 6440 and CHEME 6610. It also accepts discontinued CHEME 4010, 4630, 4700, 4810, 5640, 5720, 6560, 6640 and 6650.

- **Suggested change:** Replace both lists with the catalog's Advanced CHEME Electives list. CHEME 5610 can be listed directly; it is already matched via CHEME 4610.

### 6. Major-Approved Electives (high, count-or-credits)

- **Catalog:** Major-approved electives are 9 credits (three courses), usually technical courses at the 3000 level or above. Footnote 7 says 12 credits of major-approved electives including the biology requirement.
- **CoursePlan:** Three credits are required, with the description 'Three credits of electives are required'. The checker accepts any non-PE course not numbered 10xx.
- **Suggested change:** Set perSlotMinCount to [9] and update the description to match the catalog. Keep the checkerWarning for advisor approval.

### 7. Advanced CHEME electives (Semester 6 + Semester 7) (medium, count-or-credits)

- **Catalog:** Six credits are required. Three one-credit CHEME 6660-associated modules may be combined to satisfy one advanced elective.
- **CoursePlan:** There are two separate 1-course slots counted by courses, not credits, and both are labeled '3 credits'. Combining three modules into one slot is not possible.
- **Suggested change:** Consider a single credits-based requirement of 6 credits over the advanced elective list, or a single requirement of 2 course slots. Either way, document how modules combine.

### 8. Major-Approved Electives – double counting (medium, rule)

- **Catalog:** Major-approved electives are additional courses beyond the major-required and common curriculum courses.
- **CoursePlan:** Semester 3, 4 and 5 and Freshman Requirements set allowCourseDoubleCounting. As a result, required courses such as CHEM 3890, CHEME 3130 or MATH 2930 also count toward Major-Approved Electives.
- **Suggested change:** Remove allowCourseDoubleCounting from the required-course requirements where it is not needed. Alternatively, exclude required codes in the Major-Approved Electives checker.

### 9. Freshman Requirements – chemistry options (medium, missing-requirement)

- **Catalog:** There are three options:
- CHEM 2090 & 2091 & 2080 & 2081
- AP Chem credit & CHEM 2080 & CHEM 2081
- AP Chem credit & CHEM 2150
- **CoursePlan:** Option 1 requires CHEM 2090 and CHEM 2080 without the 2091/2081 labs. Option 2 requires CHEM 2150. There is no option for AP Chem + CHEM 2080/2081, so an AP student taking CHEM 2080 cannot fulfill the requirement.
- **Suggested change:** Add an 'AP Chem credit + CHEM 2080 & CHEM 2081' option. Add CHEM 2091 and CHEM 2081 slots to Option 1.

### 10. Semester 3 – physics slot (medium, course-list)

- **Catalog:** PHYS 2213 or PHYS 2217.
- **CoursePlan:** Only PHYS 2213 is accepted.
- **Suggested change:** Change the slot to ['PHYS 2213', 'PHYS 2217'].

### 11. Semester 4: Biology Elective – pre-med sequence (medium, course-list)

- **Catalog:** 8 credits of a pre-med biology sequence: BIOG 1500, BIOMG 1350, and BIOG 1440 or BIOG 1445.
- **CoursePlan:** Option 1 requires BIOG 1500, BIOMG 1350 and BIOG 1440; BIOG 1445 is not accepted. Option 2 requires BIOG 1107 and BIOG 1108, which are not in the roster data.
- **Suggested change:** Restructure the sequence as slots [BIOG 1500], [BIOMG 1350], [BIOG 1440, BIOG 1445]. Remove option 2.

### 12. Semester 4: Biology Elective – AP option (medium, missing-requirement)

- **Catalog:** The biology elective can be satisfied by a score of 5 on the CEEB AP exam or 7 on the IB Higher Level exam.
- **CoursePlan:** There is no AP/IB option, so students with AP Biology credit cannot fulfill the requirement.
- **Suggested change:** Add an AP/IB Biology option, for example a self-check or the AP Biology course id.

### 13. Semester 5 – organic chemistry slot (low, course-list)

- **Catalog:** CHEM 3570 or CHEM 3590.
- **CoursePlan:** Accepts CHEM 3570, CHEM 3530 or CHEM 3590. CHEM 3530 was last offered FA22 and is not in the catalog.
- **Suggested change:** Remove CHEM 3530 from the slot and the description.

### 14. Source URLs / descriptions (low, description)

- **Catalog:** The current catalog is https://catalog.cornell.edu/programs/chemical-engineering-bs/ (2026-2027).
- **CoursePlan:** Sources point to the old courses.cornell.edu catoid=41 page and the department site. Descriptions reference retired courses (CHEM 3090, CHEME 4930, CHEM 3530).
- **Suggested change:** Update the sources to the current catalog page and refresh the descriptions.

### 15. Letter grade rule (low, missing-requirement)

- **Catalog:** Major requirements must be completed for a letter grade.
- **CoursePlan:** There is no mention of the letter-grade rule.
- **Suggested change:** Add a checkerWarning or a description note about the letter-grade rule.

## Could not verify

- Whether CHEME 5430 may count both as the Biology Elective and as an Advanced CHEME Elective. The catalog lists it in both places but states no double-counting rule; the file currently prevents double counting.
- Whether the Biology Elective credits count toward the 9 credits of major-approved electives. Footnote 7 says 12 credits including the biology requirement, while the elective section says 9 credits; how the file should combine these is ambiguous.
- The ABET rule that at least 3 elective credits must be Engineering College courses. The old 3-credit Major-Approved Electives requirement may have been intended for this, but the inputs do not confirm it.
- Advisor-approved electives (6 credits), liberal studies, FWS, ENGRI and the ENGRD distribution may be handled in the Engineering college requirements file, which is not provided.
- Which major-approved elective courses an advisor will approve. This is correctly left to a checkerWarning.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
