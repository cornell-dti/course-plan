# Nutritional Sciences (major)

- Catalog: https://catalog.cornell.edu/programs/nutritional-sciences-bs/ (2026-2027 edition)
- Data file: `src/data/majors/ns.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The ns.ts file is out of date against the 2026-2027 Nutritional Sciences catalog. Several requirements would give students wrong results:

- Introductory Chemistry ignores the labs and options B/C.
- Advanced Electives counts 3 courses instead of 9 credits and omits several eligible NS courses.
- Statistics accepts MATH 1710.
- Organic Chemistry accepts CHEM 3530.
- The 'Communications' checker accepts every course because of a function-reference bug.
- 'Communications' and 'Social Sciences and Humanities' are old CALS-style requirements the major no longer has.
- The major's FWS requirement and the Human Ecology-only 11-credit Outside Nutritional Sciences requirement are missing.
  The Organic Chemistry Lab, Physiology, Biochemistry and NS Core requirements match.

## Findings

### 1. Introductory Chemistry (high, course-list)

- **Catalog:** Option A: CHEM 2070 & CHEM 2071 & CHEM 2080 & CHEM 2081. Option B: AP Chemistry 5 / IB 6-7 plus CHEM 2080 & CHEM 2081. Option C: AP/IB plus CHEM 2150. 8 credits total.
- **CoursePlan:** Requires only CHEM 2070 and CHEM 2080 (one slot each). The labs CHEM 2071 and CHEM 2081 are not required, CHEM 2150 is not accepted, and there is no AP/IB path.
- **Suggested change:** Make this a toggleable requirement with three options:
- A: CHEM 2070, CHEM 2071, CHEM 2080, CHEM 2081.
- B: CHEM 2080 and CHEM 2081, with a checkerWarning about AP Chemistry 5 / IB 6-7.
- C: CHEM 2150, with the same AP/IB warning.
  Update the description to match.

### 2. Advanced Electives in Nutrition (high, count-or-credits)

- **Catalog:** At least 9 credits of NS courses at the 3000 level or above.
- **CoursePlan:** fulfilledBy 'courses' with perSlotMinCount [3], i.e. three courses. For example, NS 3420 (2 cr) + NS 3150 + NS 3600 totals 8 credits but would show as complete.
- **Suggested change:** Use fulfilledBy: 'credits' with perSlotMinCount [9].

### 3. Advanced Electives in Nutrition (high, course-list)

- **Catalog:** Any NS course at the 3000 level or above counts, except NS 3200, NS 3980 and NS 4030. The listed courses include NS 4210, NS 4330, NS 4430, NS 4510 and NS 5510. Up to 3 credits from NS 4000/4010/4020/4990 count. NS 3410 counts if BIOAP 3110 is used for physiology.
- **CoursePlan:** A fixed list that omits NS 4210, NS 4330, NS 4430, NS 4510, NS 5510, NS 4000, NS 4010, NS 4020 and NS 4990. The checkerWarning mentions NS 4000-series courses, but the checker rejects them. NS 4300 is listed twice.
- **Suggested change:** Accept NS 3**_, NS 4_**, NS 5**_ and NS 6_**, excluding NS 3200, NS 3980, NS 4030 and the five core courses. Keep the checkerWarning for the 3-credit special-studies cap and the NS 3410 condition. Remove the duplicate NS 4300.

### 4. Statistics (high, course-list)

- **Catalog:** STSCI 2150, STSCI 2200, PUBPOL 2100, AEM 2100, ILRST/STSCI 2100, PSYCH 2500 or SOC 3010.
- **CoursePlan:** Also accepts MATH 1710, which the catalog does not list. The description lists BTRY 3010 rather than STSCI 2200; these are cross-listed, so what counts is the same.
- **Suggested change:** Remove MATH 1710. Replace BTRY 3010 with STSCI 2200 in the checker, description and slot name.

### 5. Communications (high, rule)

- **Catalog:** The major has no 9-credit written/oral expression requirement; it requires First Year Writing Seminars (6 credits).
- **CoursePlan:** The checker uses `courseIsFWS` as a bare function reference, which is always truthy, so every course is accepted. The additional requirement asks for 9 credits of social-science/humanities distribution courses.
- **Suggested change:** Remove this requirement and replace it with the major's FWS requirement (see the next finding).

### 6. First Year Writing Seminars (high, missing-requirement)

- **Catalog:** 6 credits, completed during the first two semesters. Either two FWS courses, or AP Literature/Language 5 or IB 7 plus one FWS.
- **CoursePlan:** No FWS requirement.
- **Suggested change:** Add a requirement accepting courses that pass courseIsFWS, requiring 2 courses. Add a checkerWarning about the AP/IB substitution for one FWS and the first-two-semesters timing.

### 7. Outside Nutritional Sciences Requirement (Human Ecology students only) (high, missing-requirement)

- **Catalog:** At least 11 credits from DEA, FSAD, HD, HE (1500 level or higher) or PUBPOL. FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400 and special studies (4000, 4010, 4020, 4030) do not count. Courses may double count with Humanities and Free Electives.
- **CoursePlan:** No such requirement.
- **Suggested change:** Add a credits requirement (11) accepting DEA, FSAD, HD, PUBPOL and HE 1500+. Exclude the listed courses. Allow double counting where the catalog permits, and add a warning that it applies only to Human Ecology students (or put it in a Human Ecology-specific specialization).

### 8. Organic Chemistry Lecture (medium, course-list)

- **Catalog:** Option A: CHEM 1570. Option B: CHEM 3570 & CHEM 3580. Option C: CHEM 3590 & CHEM 3600.
- **CoursePlan:** Also accepts CHEM 3530 alone as a fourth option.
- **Suggested change:** Remove the CHEM 3530 slot. Rename the slots 'CHEM 3570 & CHEM 3580' and 'CHEM 3590 & CHEM 3600', since both courses are required.

### 9. Social Sciences and Humanities (medium, extra-requirement)

- **Catalog:** The major has no social sciences/humanities requirement. Distribution requirements belong to the college (CALS or Human Ecology).
- **CoursePlan:** Major requirement of 4 courses / 12 credits across 3 of the CA/D/FL/HA/KCM/LA/SBA categories. The 'D' slot uses a substring match on catalogDistr. The description does not mention the category rule.
- **Suggested change:** Remove this requirement from the major file.

### 10. Introductory Biology (medium, rule)

- **Catalog:** Two of three lecture options: BIOMG 1350; BIOG 1440 or BIOG 1445; BIOEE 1610 or BIOEE 1780. Students cannot take both courses within one category. AP Biology 5 / IB HL 7 places out of one lecture.
- **CoursePlan:** Any 2 of the 5 lecture codes in one slot, so BIOG 1440 + BIOG 1445 or BIOEE 1610 + BIOEE 1780 would count. There is no AP/IB path.
- **Suggested change:** Split the lectures into three category slots (BIOMG 1350 | BIOG 1440/1445 | BIOEE 1610/1780) and require 2 of 3. Add a warning about AP/IB placement out of one lecture.

### 11. Calculus/Advanced Math (medium, rule)

- **Catalog:** MATH 1105, MATH 1106, MATH 1110 or MATH 1120, or a score of 5 on the AB/BC Calculus AP exam. MATH 1105 is not for pre-health students.
- **CoursePlan:** Accepts only the four MATH courses, with no AP Calculus path.
- **Suggested change:** Add the AP Calculus (AB/BC score 5) path via AP equivalent or warning. Note that MATH 1105 is not for pre-health students.

### 12. Electives / sources (low, description)

- **Catalog:** Catalog page https://catalog.cornell.edu/programs/nutritional-sciences-bs/ (2026-2027).
- **CoursePlan:** Sources point to old courses.cornell.edu catalogs (catoid=55 and 41). The Electives source is the 2020-2021 HD curriculum sheet.
- **Suggested change:** Update all source URLs to the current catalog page.

## Could not verify

- Whether CoursePlan's college-level CALS and Human Ecology requirement files already cover FWS and distribution requirements. If so, the major-level FWS requirement may be intended to double count with them.
- The catalog's 65-credit major minimum is not encoded, and it is unclear whether CoursePlan should track it.
- NS 4140 is listed by the catalog but is not in the roster data, so its omission from Advanced Electives cannot affect students.
- Footnote 11 (NS 3600 requires STSCI 2150 or STSCI 2200) is a prerequisite note rather than a counting rule.
- Whether NS 4020 sections offered only S/U may count toward Advanced Electives is decided by exception and is not checkable from these inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
