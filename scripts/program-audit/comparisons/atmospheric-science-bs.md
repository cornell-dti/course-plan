# Atmospheric Sciences (major)

- Catalog: https://catalog.cornell.edu/programs/atmospheric-science-bs/ (2026-2027 edition)
- Data file: `src/data/majors/as.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Core and Computer Science requirements match the catalog, but the rest of the file is out of date. Statistics accepts only AEM 2100, not the catalog's EAS 4350 or STSCI 2100. Chemistry requires CHEM 1560 instead of CHEM 2070 & CHEM 2071. Physics omits the PHYS 1112 and PHYS 2213 alternatives. Electives count 2 courses instead of 6 credits, accept EAS 1340, EAS 4570, EAS 4960 and EAS 4980, which the catalog does not list as electives, and reject EAS 5555. Mathematics accepts MATH 2130, which the catalog does not list.

## Findings

### 1. Statistics (high, course-list)

- **Catalog:** Select one of the following: EAS 4350 (Statistical Methods in Meteorology and Climatology) or STSCI 2100 (Introductory Statistics and Data Science) (or equivalent); AP credit accepted.
- **CoursePlan:** checker accepts only 'AEM 2100'; description 'AEM 2100 or equivalent'; slotNames ['AEM 2100'].
- **Suggested change:** Change the checker to includesWithSingleRequirement('EAS 4350', 'STSCI 2100') and update the description and slot name. STSCI 2100 also matches ILRST 2100 through the cross-listing. Remove AEM 2100 unless the department confirms it as an equivalent.

### 2. Chemistry (in 'Basic Physical Sciences') (high, course-list)

- **Catalog:** CHEM 2070 & CHEM 2071: General Chemistry I and General Chemistry I Laboratory (4 cr); AP credit accepted.
- **CoursePlan:** Third slot accepts only 'CHEM 1560'; description 'PHYS 2207, PHYS 2208, and CHEM 1560'.
- **Suggested change:** Replace the CHEM 1560 slot with slots for CHEM 2070 and CHEM 2071. These can be separate slots, or a separate Chemistry requirement with two slots. Update the description and slotNames to match.

### 3. Physics (in 'Basic Physical Sciences') (high, course-list)

- **Catalog:** PHYS 2207 OR PHYS 1112; PHYS 2208 OR PHYS 2213.
- **CoursePlan:** Slots accept only ['PHYS 2207'] and ['PHYS 2208'].
- **Suggested change:** Change the physics slots to ['PHYS 2207', 'PHYS 1112'] and ['PHYS 2208', 'PHYS 2213']. Update the slotNames and description to show the alternatives.

### 4. Electives (high, count-or-credits)

- **Catalog:** Select 6 additional credits from the listed Atmospheric Science Electives.
- **CoursePlan:** fulfilledBy 'courses' with perSlotMinCount [2]; description 'Choose at least 2 other atmospheric courses'. For example, EAS 1310 + EAS 1330 (a lecture and its lab) would count as 2 courses even though they total fewer than 6 credits.
- **Suggested change:** Use fulfilledBy: 'credits' with perSlotMinCount [6]. Change the description to 'Select 6 additional credits from the following'.

### 5. Electives (high, course-list)

- **Catalog:** The elective list is EAS 1310 & EAS 1330, EAS 2500, EAS 2680, EAS 3340, EAS 4350, EAS 4700, EAS 4800, EAS 4860, EAS 5555. EAS 4960 and EAS 4980 appear only under the separate 'Optional Atmospheric Science Experience Course (S/U only)' table.
- **CoursePlan:** Checker also accepts EAS 1340, EAS 4570, EAS 4960 and EAS 4980.
- **Suggested change:** Remove 'EAS 1340', 'EAS 4570', 'EAS 4960' and 'EAS 4980' from the Electives checker.

### 6. Electives (medium, course-list)

- **Catalog:** EAS 5555: Theory and Practice of Earth System Modeling is an accepted elective.
- **CoursePlan:** EAS 5555 is not in the Electives checker.
- **Suggested change:** Add 'EAS 5555' to the Electives checker.

### 7. Mathematics (medium, course-list)

- **Catalog:** MATH 1110, MATH 1120, MATH 1920, MATH 2930. No alternative is listed for MATH 1920.
- **CoursePlan:** Third slot accepts ['MATH 1920', 'MATH 2130']; description 'MATH 1920 or MATH 2130'.
- **Suggested change:** Remove 'MATH 2130' from the third slot and from the description and slotNames, unless the department confirms it as an alternative.

### 8. All requirements (source) (low, description)

- **Catalog:** Catalog page: https://catalog.cornell.edu/programs/atmospheric-science-bs/
- **CoursePlan:** source points to https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements
- **Suggested change:** Update the source URLs to the catalog page.

## Could not verify

- Whether EAS 4350 may count toward both the Statistics requirement and the 6 elective credits. The catalog lists it in both tables but does not state a double-counting rule. If it may, allowCourseDoubleCounting would be needed on one of the two requirements.
- What courses the catalog's 'or equivalent' covers for STSCI 2100 and EAS 2900 (for example, whether AEM 2100 is an accepted statistics equivalent). This is not shown in the inputs.
- Whether the EAS 1310 & EAS 1330 elective must be taken as a pair, or whether EAS 1310 alone counts toward the 6 credits.
- How AP credit for MATH 1110, STSCI 2100, PHYS 2207 and CHEM 2070 (footnote fn1) maps to specific exams and scores. This is not shown in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
