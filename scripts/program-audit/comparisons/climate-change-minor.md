# Climate Change (minor)

- Catalog: https://catalog.cornell.edu/programs/climate-change-minor/ (2026-2027 edition)
- Data file: `src/data/minors/climate-change.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

All 31 courses in the 2026-2027 catalog list are accepted by the file, either directly or through cross-listings (PLSCS 4290 = PLSCI 4290, BEE 4800 = EAS 4800, NTRES 3030 = EAS 3030). The BEE 2000 seminar, one-course-per-category rule (Categories 1-3), 18-credit total, unstructured-credit cap and AP exclusion are all encoded. However, the file has drifted from the catalog. It accepts several courses the catalog does not list: NTRES 6240, PLSCS 5290, GOVT 3061/AMST 3061, SYSEN 5120/5210/5240, CEE 6648 and LAW 4444. It adds a 12-credit 3000-level-or-higher requirement the catalog does not have. Its descriptions also state a one-1000-level-course limit and a C- grade rule that the catalog does not mention.

## Findings

### 1. Category Courses (Category 3: Humans and Climate Change) (high, course-list)

- **Catalog:** Category 3 lists AEM 2555, AEM 4090, NTRES 3311, AMST 2581, ANTHR 2482, ANTHR 2729, CLASS 3750, ENGL 3795, HIST 4262, NTRES 3330 (plus ENGRI 1165 and CRP 5545, depending on the category boundary). GOVT 3061 / AMST 3061 is not listed anywhere in the minor.
- **CoursePlan:** humansCourses includes 'GOVT 3061' and 'AMST 3061' (same course), so taking it fills the Category 3 slot and counts toward the 18 credits.
- **Suggested change:** Remove 'GOVT 3061' and 'AMST 3061' from humansCourses.

### 2. Category Courses (Category 3: Humans and Climate Change) (high, course-list)

- **Catalog:** No SYSEN courses appear in any category of the minor.
- **CoursePlan:** humansCourses includes 'SYSEN 5120', 'SYSEN 5210' (cross-listed CEE 5200, ENMGT 5200) and 'SYSEN 5240'. Any of them fills the Category 3 slot and counts toward the 18 credits.
- **Suggested change:** Remove 'SYSEN 5120', 'SYSEN 5210' and 'SYSEN 5240' from humansCourses.

### 3. Category Courses (Category 2: Ecosystems, Water Resources and Climate Change) (medium, course-list)

- **Catalog:** Category 2 lists NTRES 3240 and PLSCI 4290. It does not list the graduate-level versions NTRES 6240 or PLSCI/PLSCS 5290.
- **CoursePlan:** ecosystemsCourses includes 'NTRES 6240' and 'PLSCS 5290' (same course as PLSCI 5290). Either one fills the Category 2 slot and counts toward credits.
- **Suggested change:** Remove 'NTRES 6240' and 'PLSCS 5290' from ecosystemsCourses unless the catalog adds them.

### 4. Total Credits (Category 4: Additional Climate Change Courses) (medium, course-list)

- **Catalog:** The remaining courses listed are CEE 4210, CEE 4640, EAS 1101 and ANSC 4880. CEE 6648 is not listed.
- **CoursePlan:** additionalCourses includes 'CEE 6648', which then counts toward the 18-credit total and the upper-level credits.
- **Suggested change:** Remove 'CEE 6648' from additionalCourses.

### 5. Upper-Level Credits (medium, extra-requirement)

- **Catalog:** The minor requires BEE 2000, at least one course in each of Categories 1-3, and enough additional courses from Categories 1-4 to reach 18 credits. There is no upper-level credit minimum.
- **CoursePlan:** A separate requirement asks for at least 12 credits at the 3000 level or higher. Students whose courses are mostly 1000/2000-level (e.g. EAS 2680, BIOEE 1610, AEM 2555, ANTHR 2482, EAS 1101) would be shown the minor as incomplete even though the catalog requirements are met.
- **Suggested change:** Delete the 'Upper-Level Credits' requirement, or confirm it against a current published source before keeping it.

### 6. Total Credits (medium, rule)

- **Catalog:** There is no limit on 1000-level courses. Only the 3-unstructured-credit cap and the AP exclusion are stated.
- **CoursePlan:** The description and checkerWarning say 'Only one course at the 1000 level can count for the minor'. A student planning BIOEE 1610, EAS 1101 and ENGRI 1165 would be told only one can count.
- **Suggested change:** Remove the one-1000-level-course limit from the description and checkerWarning.

### 7. Category Courses (Category 3: Humans and Climate Change) (low, course-list)

- **Catalog:** LAW 4444 is not listed.
- **CoursePlan:** humansCourses includes 'LAW 4444'. This code is not in the roster data, so no student can add it.
- **Suggested change:** Remove 'LAW 4444'.

### 8. Total Credits (low, description)

- **Catalog:** No minimum grade is stated for minor courses.
- **CoursePlan:** The description and checkerWarning say 'Students must earn a grade of C- or better in each course in the minor'.
- **Suggested change:** Remove the C- grade statement unless it is confirmed by a current published source.

### 9. All requirements (source) (low, other)

- **Catalog:** The catalog page is https://catalog.cornell.edu/programs/climate-change-minor/.
- **CoursePlan:** source is 'https://www.duffield.cornell.edu/eas/degree/climate-change-minor-requirements/', a department page that appears to be the origin of the rules not found in the catalog.
- **Suggested change:** Point source to the catalog page.

## Could not verify

- The parsed catalog table drops the category headers. The boundary between Category 3 and Category 4 cannot be confirmed: the 'Solutions: Mitigation, Adaptation and Remediation' heading covers ENGRI 1165, CRP 5545, CEE 4210, CEE 4640, EAS 1101 and ANSC 4880. The file places ENGRI 1165 and CRP 5545 in Category 3 and the other four in Category 4. The Category 1/2 split (EAS 4800 through PLSCI 3650 as Category 1, then 'Water Resources' and 'Ecosystems and Agriculture' as Category 2) is also inferred.
- Whether the department page (the file's source) accepts the extra courses (graduate versions, SYSEN, GOVT 3061, CEE 6648), the 12 upper-level credits, the 1000-level limit or the C- rule cannot be checked from the inputs.
- The catalog allows petitioning new courses (via Prof. Natalie Mahowald and Annmarie Card) and some transfer courses. These cases cannot be checked automatically.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
