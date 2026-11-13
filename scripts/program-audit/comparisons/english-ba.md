# English (major)

- Catalog: https://catalog.cornell.edu/programs/english-ba/ (2026-2027 edition)
- Data file: `src/data/majors/engl.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

engl.ts encodes the old English major (40 credits, 12 pre-1800 credits, 8 credits at 4000 level, a 12-credit concentration). The 2026-2027 catalog requires at least ten courses and 30 credits. It also requires distribution courses: two ENGL-PRE, two ENGL-PST, one ENGL-GLS and two ENGL-LOA, with at least one LOA course on American Indian/Indigenous, African American, Asian American, Pacific Islander or Latina/o literature. Further requirements are two 4000-level Cornell ENGL seminars and a three-course concentration. The file has no Post-1800, Global South or Literatures of the Americas requirements. Its credit thresholds would show catalog-compliant students as incomplete. Its checkers mishandle 1000-level courses, honors tutorials and the 3-credit minimum. Its descriptions and sources reflect the old department guide.

## Findings

### 1. Post 1800 (ENGL-PST) (high, missing-requirement)

- **Catalog:** Two courses on literatures in English after 1800 (ENGL-PST), chosen from the Post 1800 course category table.
- **CoursePlan:** No Post-1800 requirement exists.
- **Suggested change:** Add a 'Post-1800' requirement with fulfilledBy 'courses', perSlotMinCount [2], whose checker accepts the catalog ENGL-PST list. Set allowCourseDoubleCounting.

### 2. Global South (ENGL-GLS) (high, missing-requirement)

- **Catalog:** One course on literatures in English of the Global South (ENGL-GLS), i.e., African, African Diaspora, Asian Diaspora, South Asian, or Caribbean literature.
- **CoursePlan:** No Global South requirement exists.
- **Suggested change:** Add a 'Global South' requirement with fulfilledBy 'courses', perSlotMinCount [1], whose checker accepts the ENGL-GLS list (e.g. ENGL 2512, ENGL 2604, ENGL 3610, ENGL 4511, ENGL 4570). Set allowCourseDoubleCounting.

### 3. Literatures of the Americas (ENGL-LOA) (high, missing-requirement)

- **Catalog:** Two courses on literatures in English of the Americas (ENGL-LOA). At least one must be on American Indian or Indigenous, African American, Asian American, Pacific Islander, or Latina/o literature.
- **CoursePlan:** No Americas requirement exists.
- **Suggested change:** Add an 'English of the Americas' requirement with fulfilledBy 'courses', perSlotMinCount [2], whose checker accepts the ENGL-LOA list. Set allowCourseDoubleCounting. Enforce the 'at least one' sub-rule with a checkerWarning or an additionalRequirements slot.

### 4. Total Credits (high, count-or-credits)

- **Catalog:** A minimum of ten full-semester courses is required; Minimum Credits for Major: 30.
- **CoursePlan:** fulfilledBy 'credits', perSlotMinCount [40]. Description: '40 credit hours approved for the English major'.
- **Suggested change:** Change to 30 credits and represent the ten-course minimum, e.g. a courses requirement with 10 slots or an additional requirement. Update the description to match.

### 5. Pre-1800 (high, count-or-credits)

- **Catalog:** Two courses on literatures in English before 1800 (ENGL-PRE).
- **CoursePlan:** fulfilledBy 'credits', perSlotMinCount [12]. Description: '12 credits (normally 3 courses)'. Two 3-credit ENGL-PRE courses (e.g. ENGL 2270, ENGL 3190) would show as unmet.
- **Suggested change:** Change to fulfilledBy 'courses' with perSlotMinCount [2] and update the description.

### 6. 4000 or Above (high, count-or-credits)

- **Catalog:** Two 4000-level Cornell ENGL seminars [6-8 cr].
- **CoursePlan:** fulfilledBy 'credits', perSlotMinCount [8]. Description: '8 credits must be at the 4000 level or above'. Two 3-credit 4000-level seminars (e.g. ENGL 4509, ENGL 4815, ENGL 4225) total only 6 credits and would show as unmet.
- **Suggested change:** Change to fulfilledBy 'courses' with perSlotMinCount [2]. Update the name and description to 'Two 4000-level Cornell ENGL seminars'.

### 7. Pre-1800 (medium, course-list)

- **Catalog:** Pre-1800 courses are those designated ENGL-PRE in the Pre 1800 course category table (e.g. ENGL 2010, ENGL 2080, ENGL 2270, ENGL 3110, ENGL 3190, ENGL 4210, ENGL 4170).
- **CoursePlan:** The checker accepts only courses whose catalogComments or catalogSatisfiesReq contain the string 'pre-1800'. The catalog's list is not used.
- **Suggested change:** Replace the text-match checker with includesWithSingleRequirement over the catalog's ENGL-PRE course list, or match the ENGL-PRE attribute via courseHasAttribute.

### 8. 4000 or Above (medium, rule)

- **Catalog:** ENGL 4930 Honors Essay Tutorial I and ENGL 4940 Honors Essay Tutorial II may be applied toward the required ten full-semester courses but may not be used to satisfy other categories of requirements. The requirement is for 4000-level seminars.
- **CoursePlan:** The checker accepts any ENGL course not at the 1000-3000 level. That includes ENGL 4930, ENGL 4940 and 5000/6000-level courses.
- **Suggested change:** Restrict the checker to ENGL 4\*\*\* and exclude ENGL 4930 and ENGL 4940. Consider disallowTransferCredit, since the catalog says 'Cornell' seminars.

### 9. Total Credits (medium, course-list)

- **Catalog:** A maximum of two 1000-level courses may be applied to the major. ENGL 1100 is listed as a distribution course.
- **CoursePlan:** The checker accepts only ENGL 2**_-6_**, so ENGL 1100 can never count. ENGL 1102 counts only through its cross-listing with ENGL 2060, and nothing caps 1000-level courses at two.
- **Suggested change:** Accept ENGL 1\*\*\* in the checker and enforce the two-course limit on 1000-level courses, or note the limit in a checkerWarning.

### 10. Total Credits (medium, rule)

- **Catalog:** Courses must be 3 credits or higher to qualify for the major unless otherwise noted. First-Year Writing Seminars, ENGL 2800 and ENGL 2880 may not be applied. Up to three non-ENGL literary-study courses at 2000+ may count with advisor approval.
- **CoursePlan:** The checker accepts any ENGL 2**_-6_** course regardless of credits, so 1-2 credit courses count. It also excludes ENGL 2810 and ENGL 2890, which the catalog does not name. Non-ENGL courses not cross-listed with ENGL cannot count (e.g. AMST 4640, whose current roster cross-listings do not include ENGL).
- **Suggested change:** Add a courseMeetsCreditMinimum(course, 3) check. Align the exclusions with the catalog. Add a note or self-check for the up-to-three non-ENGL courses allowed with advisor approval.

### 11. Concentration (medium, count-or-credits)

- **Catalog:** Three courses must be related in topic, theme, time period, genre, or approach to form a 'concentration' [9-12 cr], developed with the advisor.
- **CoursePlan:** fulfilledBy 'credits', perSlotMinCount [12]. Description: '12 credits (3 courses)'. Three 3-credit courses (9 credits) would show as unmet.
- **Suggested change:** Change to fulfilledBy 'courses' with perSlotMinCount [3], or 9 credits, and update the description.

### 12. Major distribution courses (medium, rule)

- **Catalog:** A course may be used to fulfill a maximum of two major distribution categories.
- **CoursePlan:** No distribution categories exist apart from Pre-1800, so the limit is not represented.
- **Suggested change:** When adding the PRE/PST/GLS/LOA requirements, add a checkerWarning noting that one course may count toward at most two distribution categories.

### 13. Concentration (low, course-list)

- **Catalog:** Concentration courses are major courses (ENGL or up to three approved non-ENGL literary-study courses) related to one another.
- **CoursePlan:** The checker accepts any course except PE and 10\*\* courses, including unrelated subjects, ENGL 2800/2880 and FWS.
- **Suggested change:** Restrict the checker to courses eligible for the major (the same checker as Total Credits), keeping the checkerWarning for the coherence rule.

### 14. Total Credits / 4000 or Above / Concentration (sources and descriptions) (low, description)

- **Catalog:** The catalog page https://catalog.cornell.edu/programs/english-ba/ describes ten courses, 30 credits, distribution categories PRE/PST/GLS/LOA, and two 4000-level seminars.
- **CoursePlan:** The descriptions cite 40 credits, 12 pre-1800 credits and 8 credits at 4000+. Sources point to english.cornell.edu department pages.
- **Suggested change:** Rewrite the descriptions to match the catalog and point the sources to the catalog page.

## Could not verify

- Whether roster catalogComments/catalogSatisfiesReq fields currently contain the text 'pre-1800' for ENGL-PRE courses. If none do, the Pre-1800 checker accepts nothing and the issue is high severity.
- Which non-ENGL courses an advisor will approve (up to three) and which transfer or study-abroad courses the DUS approves for distribution categories.
- The minimum grade of C and the limit of two non-Cornell courses per semester; these depend on grades and transfer records not shown.
- Whether the parsed course tables map exactly to the PRE/PST/GLS/LOA categories. The parsed table merges the four category lists without headings, so the exact membership of each category is inferred.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
