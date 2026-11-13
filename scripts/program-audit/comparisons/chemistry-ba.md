# Chemistry (major)

- Catalog: https://catalog.cornell.edu/programs/chemistry-ba/ (2026-2027 edition)
- Data file: `src/data/majors/chem.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan Chemistry file does not match the 2026-2027 catalog in several places that change what counts. Missing pieces: the general chemistry labs (CHEM 2071, CHEM 2081), the PHYS 1110 lab in physics sequence 2, and CHEM 3880 in physical chemistry, so a single CHEM 3870/2870 counts for every student. The file also keeps a retired organic option (CHEM 3530). The catalog's 60-credit (57 for class of 2027) elective structure, which accepts any CHEM course at 4000 level or above and caps research at 4 credits, is replaced by invented track-based course counts with a fixed list. That list includes a core course (CHEM 2880/3880) and lets an 'Honors' option need 0 electives. The 8-credit lab rule is reduced to one course.

## Findings

### 1. General Chemistry (high, course-list)

- **Catalog:** Sequence 1 is CHEM 2070 & CHEM 2071 and CHEM 2080 & CHEM 2081 (lectures plus their laboratories); Sequence 2 is CHEM 2150.
- **CoursePlan:** Option 1 requires only CHEM 2070 and CHEM 2080; the labs CHEM 2071 and CHEM 2081 are not required.
- **Suggested change:** Make Option 1 four slots: ['CHEM 2070'], ['CHEM 2071'], ['CHEM 2080'], ['CHEM 2081']. Update the description to name the labs.

### 2. Physical Chemistry (high, course-list)

- **Catalog:** Select CHEM 3870 & CHEM 3880 or CHEM 3890 & CHEM 3900. Only students graduating in the class of 2027 may take CHEM 3870 alone as a one-semester course.
- **CoursePlan:** Option 2 accepts CHEM 2870 alone, which is cross-listed with CHEM 3870. Any student who takes only CHEM 3870 is shown the requirement as met.
- **Suggested change:** Change Option 2 to two slots, ['CHEM 3870'], ['CHEM 3880'], titled 'CHEM 3870 and CHEM 3880'. Handle the class-of-2027 single-semester case with a migration or a note in the description.

### 3. Physics (high, course-list)

- **Catalog:** Option 2 is PHYS 1112 & PHYS 1110 & PHYS 2213 (includes Introduction to Experimental Physics).
- **CoursePlan:** Option 2 requires only PHYS 1112 and PHYS 2213.
- **Suggested change:** Add a ['PHYS 1110'] slot to Option 2 and update the description.

### 4. Electives (high, rule)

- **Catalog:** Students must complete 60 credits in chemistry and related subjects (57 for the class of 2027), including the core. The remainder comes from approved electives, and any CHEM course at the 4000 level or higher may be taken as an elective. The catalog has no tracks.
- **CoursePlan:** A toggle of tracks sets elective counts: Biological Focus 6 courses, Physical Focus 5, Accelerated Honors 1, Honors 0. The 'Honors' option is satisfied with no electives.
- **Suggested change:** Replace the tracks with a credit-based requirement for the remaining credits toward the 60 (57 for class of 2027) total, or make it self-check with a warning pointing to the department's approved list. Remove the 0-course 'Honors' option.

### 5. Electives (high, course-list)

- **Catalog:** Any CHEM course at the 4000 level or higher counts, plus approved courses from other departments. Up to four credits of research (CHEM 4210, CHEM 4330, CHEM 4430, CHEM 4610, CHEM 4770) may count.
- **CoursePlan:** Only a fixed list of 24 CHEM codes is accepted. Other CHEM 4000+ courses, the research courses and all outside-department electives are rejected.
- **Suggested change:** Accept 'CHEM 4**_' through 'CHEM 7_**' (excluding core CHEM 4100) plus the approved outside electives. Cap research credit at 4.

### 6. Organic Chemistry (medium, extra-requirement)

- **Catalog:** Select one of CHEM 3570 & CHEM 3580 or CHEM 3590 & CHEM 3600.
- **CoursePlan:** Adds Option 3: CHEM 3530 alone (last offered FA22). The description also says only 'one of the two-semester sequences' is required for Honors, implying a one-semester option exists.
- **Suggested change:** Remove Option 3 (CHEM 3530) and the related description text, or move it to a migration for older entry years.

### 7. Laboratory Requirement (medium, count-or-credits)

- **Catalog:** A total of 8 credits of laboratory, including core laboratories, is required. It may be met by CHEM 3010 and/or CHEM 3020 or by approved laboratory electives outside chemistry. Independent research does not count.
- **CoursePlan:** One course from CHEM 3010, CHEM 3020, BIOMG 4400 or CHEM 4010 satisfies it, regardless of total lab credits.
- **Suggested change:** Count lab credits toward an 8-credit total, or add a checkerWarning that the total of 8 lab credits (including CHEM 2510 and CHEM 2900/3030) must be confirmed.

### 8. Electives (medium, course-list)

- **Catalog:** CHEM 3880 (cross-listed with CHEM 2880) is a required core course in the CHEM 3870 & CHEM 3880 physical chemistry sequence, not an elective.
- **CoursePlan:** The elective list includes CHEM 2880, so the core course CHEM 3880 counts as an elective.
- **Suggested change:** Remove CHEM 2880 from the elective list and require CHEM 3880 under Physical Chemistry.

### 9. Electives (research cap) (medium, missing-requirement)

- **Catalog:** No more than four credits of independent research (CHEM 4210, CHEM 4330, CHEM 4430, CHEM 4610 or CHEM 4770) may count as elective credit.
- **CoursePlan:** No research cap or description of it. Research courses are not in the list at all.
- **Suggested change:** Add the research courses with a 4-credit cap, or describe the cap in a checkerWarning.

### 10. Physical Chemistry (low, description)

- **Catalog:** Students must take a prerequisite semester of multivariable calculus before enrolling in CHEM 3890. The non-honors sequence is CHEM 3870 & CHEM 3880.
- **CoursePlan:** The description names 'CHEM 2870' as Option 2. It says CHEM 3890/3900 students must take 'Multivariable Calculus or Linear Algebra from the electives below'.
- **Suggested change:** Update the description to the current codes (CHEM 3870 & CHEM 3880). State that multivariable calculus is a prerequisite for CHEM 3890, and drop the linear algebra alternative.

### 11. Inorganic Laboratory (low, description)

- **Catalog:** CHEM 4100 is listed under 'Inorganic Chemistry' as Inorganic Chemistry (3 cr). It is not a laboratory course.
- **CoursePlan:** The requirement is named 'Inorganic Laboratory'.
- **Suggested change:** Rename the requirement to 'Inorganic Chemistry'.

### 12. Mathematics / Physics (low, rule)

- **Catalog:** AP credit may be substituted for one or more of the math courses and for one or both physics courses. The math alternative is '4 AP Credits and MATH 1910'.
- **CoursePlan:** No AP credit is accepted by the checkers. The MATH 1910 option checks only MATH 1910, and the AP part appears only in the description.
- **Suggested change:** Add the relevant AP calculus/physics exam IDs where possible, or add a checkerWarning explaining the AP substitution.

### 13. Laboratory Requirement (low, course-list)

- **Catalog:** Approved outside-chemistry lab courses are listed on the department website.
- **CoursePlan:** Includes CHEM 4010, which is not in the roster data.
- **Suggested change:** Remove CHEM 4010 and confirm the outside-lab list against the department's approved list.

### 14. Electives (low, course-list)

- **Catalog:** (Catalog points to the department's approved list.)
- **CoursePlan:** The list includes CHEM 4510, CHEM 6280 and CHEM 6710, which are not in the roster data, and CHEM 4300 (last offered SP19).
- **Suggested change:** Remove codes that no student can add once the elective requirement is rebuilt.

## Could not verify

- The department's approved elective list (including electives from other departments), which the catalog says is on the program website.
- Which laboratory courses outside chemistry are approved for the 8-credit lab requirement (e.g. whether BIOMG 4400 is on the list).
- Credit values of CHEM 3010 and CHEM 3020, needed to tell how many extra lab courses reach 8 credits given CHEM 2900 is 2 or 5 credits.
- Whether CHEM 3530 or the track-based elective counts applied to earlier entry years, which would justify keeping them as migrations.
- Which AP exam scores/credits the department accepts in place of the math and physics core courses.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
