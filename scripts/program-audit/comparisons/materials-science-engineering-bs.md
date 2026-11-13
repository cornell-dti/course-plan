# Materials Science and Engineering (major)

- Catalog: https://catalog.cornell.edu/programs/materials-science-engineering-bs/ (2026-2027 edition)
- Data file: `src/data/majors/mse.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The MSE file follows an older department curriculum and is out of date with the 2026-2027 catalog. The catalog requires one Category 2 ENGRD; the file requires both MSE 2610 and MSE 2620. The core list adds MSE 3010 and omits MSE 2010, 2020, 2030 and 2110. The file keeps junior courses the catalog no longer lists (MSE 3120, ENGRC 3111, MSE 3070). Senior Design also accepts MSE 5070. The file asks for three application electives where the catalog asks for four, and it keeps an Advanced Math requirement the catalog does not have. The Senior Lab/Thesis toggle, the two-category application rule and the outside technical elective broadly match.

## Findings

### 1. MSE Engineering Distributions (high, count-or-credits)

- **Catalog:** One ENGRD 2xxx Engineering distribution from Category 2 (Materials Science), i.e. ENGRD 2610 or ENGRD 2620 (4 cr). Neither is listed as an additional core course.
- **CoursePlan:** Two slots, perSlotMinCount [1, 1], requiring both MSE 2610/ENGRD 2610 and MSE 2620/ENGRD 2620. The description says the second one is taken 'as an MSE core course'.
- **Suggested change:** Use a single slot accepting 'ENGRD 2610' or 'ENGRD 2620' (cross-listings cover MSE 2610/2620) with perSlotMinCount [1]. Update the description to match.

### 2. Core Courses (high, course-list)

- **Catalog:** Required Major Courses: MSE 2010, MSE 2020, MSE 2030, MSE 2060, MSE 2110, MSE 3030, MSE 3040, MSE 3050, MSE 3110, MSE 4020, MSE 4070. MSE 3010 is not required.
- **CoursePlan:** Requires MSE 2060, MSE 3010, MSE 3030, MSE 3040, MSE 3050, MSE 4020. A student who follows the catalog and skips MSE 3010 can never complete this requirement.
- **Suggested change:** Remove the MSE 3010 slot and update the description.

### 3. Core Courses (high, missing-requirement)

- **Catalog:** MSE 2010 (Physics and Chemistry of Materials, 3 cr), MSE 2020 (Professional Skills, 0.5 cr), MSE 2030 (Essential Thermodynamics, 1 cr) and MSE 2110 (Materials Laboratory I, 2 cr) are required.
- **CoursePlan:** None of these four courses is required anywhere in the file, so a student without them can see the core as complete.
- **Suggested change:** Add slots for MSE 2010, MSE 2020, MSE 2030 and MSE 2110. All four are currently 'not in the roster data', so roster data must also support them, or use a self-check until they appear.

### 4. Junior Courses (high, extra-requirement)

- **Catalog:** Of these courses only MSE 3110 (Junior Laboratory I) is required. MSE 3120, ENGRC 3111 and MSE 3070 are not in the catalog requirements.
- **CoursePlan:** Requires MSE 3110, MSE 3120, ENGRC 3111 (last offered FA22) and MSE 3070. A student following the catalog cannot complete this requirement.
- **Suggested change:** Drop the MSE 3120, ENGRC 3111 and MSE 3070 slots and keep MSE 3110, or fold it into Core Courses.

### 5. Senior Design (high, course-list)

- **Catalog:** MSE 4070 Materials Design: Ideation is required. MSE 5070 is not an alternative.
- **CoursePlan:** Accepts MSE 5070 or MSE 4070. The description offers a fall MSE 5070 option.
- **Suggested change:** Accept only MSE 4070 (MSE 4072 is cross-listed) and update the description.

### 6. Materials Applications Electives: 3 courses (high, count-or-credits)

- **Catalog:** Four application-related electives in at least two different types of applications. Two of them must be taken from outside MSE.
- **CoursePlan:** perSlotMinCount [3]. The description says 3 courses, one MSE and two non-MSE.
- **Suggested change:** Change to 4 courses, rename the requirement, and say that two must be outside MSE. Consider a checkerWarning, since the outside-MSE rule is not enforced.

### 7. Advanced Math (medium, extra-requirement)

- **Catalog:** The catalog's major requirements have no advanced mathematics or computational modeling elective requirement.
- **CoursePlan:** Requires one course from a list of advanced math/modeling courses. allowCourseDoubleCounting is set.
- **Suggested change:** Remove the requirement, or confirm it is still current department policy and cite the catalog.

### 8. Materials Electives (low, rule)

- **Catalog:** Two materials-related electives covering two groups of different materials.
- **CoursePlan:** Any 2 courses from the materialsElectives list count. The 'different groups' rule is neither checked nor flagged. The list includes MSE 5550, which is not in the roster data.
- **Suggested change:** Add a checkerWarning that the two electives must cover different material groups. Review the list against the current department list.

### 9. Senior Lab or Thesis (low, description)

- **Catalog:** Lab option is the sequence MSE 4030 & MSE 4072 (Senior Materials Laboratory I and Materials Design: Ideation).
- **CoursePlan:** Laboratory Course option requires only MSE 4030; the description says 'MSE 4030, offered in fall term only.' MSE 4072 is cross-listed with MSE 4070, which the Senior Design requirement covers.
- **Suggested change:** Mention MSE 4072 in the description, or clarify how MSE 4072 relates to the required MSE 4070.

## Could not verify

- Which courses belong to the materials electives and each application-elective category. The catalog gives no lists, so the materialsElectives and applicationElectives arrays (including research courses and CHEM 3890) cannot be checked.
- Whether materials electives may also count as application electives, and whether only one semester of research may count. Both come from the department page, not the catalog.
- Whether the outside technical elective must be at the 2000 level or above. The catalog only says 'one additional technical elective outside MSE'.
- The catalog lists MSE 4070 as required and also pairs MSE 4030 with MSE 4072, a cross-listed copy of MSE 4070. It is unclear whether the lab option needs a separate course.
- Major-specific math, physics, chemistry and fourth-science requirements, and the major credit categories (≥30 required, ≥9 major-approved, ≥9 outside major). These are presumably handled in the college file, which is not shown.
- MSE 2010, MSE 2020, MSE 2030 and MSE 2110 are not in the roster data, so it is unknown when students can add them.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
