# Hotel Administration (major)

- Catalog: https://catalog.cornell.edu/programs/hotel-management-bs/ (2026-2027 edition)
- Data file: `src/data/majors/hadm.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan file follows an older Hotel Administration curriculum and is out of date. Several core course lists use retired course numbers. The HADM Electives credit count is wrong and its checker accepts only 3000-level courses. The Free Electives count and several descriptions contradict the catalog. The file is also missing the Additional Distribution Electives, Ethics, Diversity & Inclusion and Practice Credit requirements.

## Findings

### 1. Accounting; Real Estate Development (high, course-list)

- **Catalog:** Accounting; Finance; Real Estate requires HADM 1210, HADM 2210, HADM 2220, HADM 2221.
- **CoursePlan:** Requires HADM 1210, HADM 2210, HADM 2220, HADM 3210 (HADM 3210 last offered SP24).
- **Suggested change:** Replace the HADM 3210 slot with HADM 2221. Rename the requirement 'Accounting; Finance; Real Estate' and update the description and slotNames.

### 2. Food and Beverage Management (high, course-list)

- **Catalog:** HADM 1361 (4 cr) and HADM 2351 (3 cr).
- **CoursePlan:** HADM 2360 and HADM 3350 (last offered SP23 and FA24).
- **Suggested change:** Change the slots to ['HADM 1361'], ['HADM 2351'] and update the description and slotNames.

### 3. Operations (high, course-list)

- **Catalog:** HADM 1350, HADM 2011, HADM 2021 (3 courses).
- **CoursePlan:** Four slots: HADM 1350, HADM 1360, HADM 2010, HADM 3010 (1360, 2010 and 3010 last offered SP22, SP23 and FA24).
- **Suggested change:** Use three slots: ['HADM 1350'], ['HADM 2011'], ['HADM 2021'], with perSlotMinCount [1,1,1]. Update the description and slotNames.

### 4. Properties Development and Management (high, course-list)

- **Catalog:** HADM 2560 only.
- **CoursePlan:** Two slots: HADM 2550 and HADM 3550 (last offered SP23 and SP24).
- **Suggested change:** Use a single requirement for HADM 2560 with perSlotMinCount [1].

### 5. HADM Electives (high, count-or-credits)

- **Catalog:** 12 credits of HADM coursework at the 3000 level or higher.
- **CoursePlan:** perSlotMinCount [14]; the description says 'A minimum of 14 credits'.
- **Suggested change:** Set perSlotMinCount to [12] and update the description.

### 6. HADM Electives (high, course-list)

- **Catalog:** Any HADM course at the 3000 level or higher counts, including 4000-level courses.
- **CoursePlan:** The checker is includesWithSingleRequirement('HADM 3\*\*\*'), so every 4000-level HADM course is rejected.
- **Suggested change:** Accept 'HADM 3**_' and 'HADM 4_**' (and higher levels if relevant). Exclude core courses that the wildcard would catch, such as HADM 3650, HADM 3870 and HADM 4410.

### 7. Additional Distribution Electives (high, missing-requirement)

- **Catalog:** 18 credits of courses carrying the listed distribution codes (Non-JCB codes, Nolan codes such as ALC-HA and SSC-HA, and additional codes such as CE-EN and FL-AAP). Foreign language coursework also counts.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add an 18-credit requirement, either self-check or a distribution-code checker.

### 8. Ethics Course (high, missing-requirement)

- **Catalog:** One 3-credit ETM-HA course; ETH-AG courses also count.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a 3-credit Ethics requirement that accepts ETM-HA and ETH-AG courses, or make it a self-check.

### 9. Diversity & Inclusion Course (high, missing-requirement)

- **Catalog:** One 3-credit D-HA course.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a 3-credit Diversity & Inclusion requirement (D-HA), as a checker or self-check.

### 10. HADM Electives (medium, rule)

- **Catalog:** At most 3 credits from HADM 4910, HADM 4970, HADM 4971, HADM 4980 and HADM 4990 may count toward HADM electives. Credits beyond 3 count as free electives only.
- **CoursePlan:** No cap is encoded. Once 4000-level courses are accepted, these courses would count in full.
- **Suggested change:** Add a checkerWarning describing the 3-credit cap, or exclude these courses and note that up to 3 credits may be added by hand.

### 11. Practice Credit (medium, missing-requirement)

- **Catalog:** 2 units (800 hours) of work experience, in at least two separate employment periods and two significantly different positions.
- **CoursePlan:** No such requirement exists.
- **Suggested change:** Add a self-check Practice Credit requirement describing the 800-hour, 2-unit rule.

### 12. Non-HADM Electives (medium, description)

- **Catalog:** Non-JCB Distribution Electives: 15 credits. At least 3 credits must come from each of at least 3 of the 5 distribution categories, taken outside the SC Johnson College of Business (no AEM, HADM, MGMT, NACCT, NBA, NCC, REAL, etc.). One course fulfills only one category.
- **CoursePlan:** Named 'Non-HADM Electives'. The description says 'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.' (minCount 15 is unused).
- **Suggested change:** Rename it 'Non-JCB Distribution Electives' and describe 15 credits, the 3-of-5 category rule, and the exclusion of all JCB subjects.

### 13. Free Electives (medium, count-or-credits)

- **Catalog:** 8 credits. P.E. courses do not count.
- **CoursePlan:** The description says 'A minimum of 24 credits'; minCount 24.
- **Suggested change:** Change the description and minCount to 8 credits and note that P.E. courses are excluded.

### 14. HADM Electives (low, rule)

- **Catalog:** HADM electives are upper-level courses beyond the required core.
- **CoursePlan:** The 'HADM 3\*\*\*' wildcard also matches the core courses HADM 3650 and HADM 3870.
- **Suggested change:** Explicitly exclude core courses from the electives checker.

### 15. First-Year Writing Seminars (low, description)

- **Catalog:** One 3-credit FWS taken in the first or second semester.
- **CoursePlan:** The description says 'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.' The checker correctly requires 3 FWS credits.
- **Suggested change:** Change the description to 'One First-Year Writing Seminar (3 credits), taken in the first or second semester.'

## Could not verify

- Which courses carry the ETM-HA and D-HA codes, since those lists are published on the Nolan School Distribution Requirement Course List page, not in the inputs.
- Whether students who took the retired courses (HADM 1360, 2010, 2360, 2550, 3010, 3210, 3350, 3550) under the old curriculum can still count them, and whether migrations should keep those courses for earlier entry years.
- Whether the distribution-code lists for Non-JCB and Additional Distribution Electives can be fully encoded as checkers given the available catalogDistr data.
- The letter-grade rules for HADM electives and distribution courses, which CoursePlan cannot check and which belong in a description or checkerWarning.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
