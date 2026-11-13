# Science, Technology and Society (major)

- Catalog: https://catalog.cornell.edu/programs/science-technology-studies-ba/ (2026-2027 edition)
- Data file: `src/data/majors/sts.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

CoursePlan's STS major data does not match the 2026-2027 catalog. The catalog asks for 12 courses: STS 2011, 8 additional STS courses (at least one at the 4000 level or above), and 3 natural science or engineering courses. The file splits the 8 STS courses into level tiers the catalog does not have (1 any-level, 3 at 2000, 2 at 3000+, 2 at 4000+). It also asks for only 2 science courses, and its science checker uses outdated distribution codes that reject most physical-science courses. Smaller problems are a credit minimum the catalog does not state and a broken STS 2011 exclusion.

## Findings

### 1. 8 Additional STS Courses (One S&TS course / 2000 Level STS Courses / 3000+ STS Courses / 4000+ STS Courses) (high, rule)

- **Catalog:** 8 additional STS courses contributing to a student's Theme, with the only level rule being 'At least one must be 4000-level or above'.
- **CoursePlan:** The 8 courses are split across four requirements: 1 STS course at any level, 3 courses matching 'STS 2\*\*\*', 2 STS courses at 3000+, and 2 STS courses at 4000+.
- **Suggested change:** Replace the four requirements with one requirement for 8 STS courses (excluding STS 2011). Enforce at least one 4000+ course, for example with an additionalRequirements entry or a separate 1-course 4000+ slot that allows double counting with the 8-course requirement. As it stands, a valid plan such as eight courses with only one at 4000+, or none at 2000, shows as unfulfilled.

### 2. Science Requirement (high, count-or-credits)

- **Catalog:** 3 science courses in natural science or engineering (including computer science).
- **CoursePlan:** perSlotMinCount: [2], and the description says 'Two courses...'.
- **Suggested change:** Set perSlotMinCount to [3] and update the description to say three courses.

### 3. Science Requirement (high, course-list)

- **Catalog:** Any course in natural science or engineering (including computer science) counts.
- **CoursePlan:** The checker matches catalogDistr against ['PBS','PBSS','OPHLS','BIOLS','BIO'] or acadGroup 'EN'. The current A&S codes are PHS-AS and BIO-AS, and none of 'PBS', 'PBSS' or 'OPHLS' is a substring of 'PHS-AS'. Physical-science courses outside Engineering (e.g. chemistry, physics, astronomy) are therefore rejected; only BIO-AS courses and Engineering courses pass.
- **Suggested change:** Update the distribution list to the current codes, e.g. 'PHS-AS' and 'BIO-AS', while keeping Engineering acadGroup courses.

### 4. Science Requirement (medium, rule)

- **Catalog:** No minimum credits per science course is stated.
- **CoursePlan:** The checker requires enrollGroups unitsMinimum >= 3, and the description says 'at least 3 credits each'. Variable-credit courses whose minimum is below 3 are rejected even when taken for 3 or more credits.
- **Suggested change:** Remove the 3-credit minimum, or if it is kept, use courseMeetsCreditMinimum (which checks unitsMaximum). Drop the credit wording from the description unless a department source supports it.

### 5. Science Requirement (medium, rule)

- **Catalog:** The 3 science courses are in addition to the College of Arts and Sciences science requirement.
- **CoursePlan:** No exclusion or warning; courses used for A&S distribution can also count here.
- **Suggested change:** Add a checkerWarning saying these courses must be in addition to those used for the A&S science distribution requirement.

### 6. One S&TS course (low, other)

- **Catalog:** Additional STS courses exclude the core course STS 2011.
- **CoursePlan:** The checker excludes `course.crseId !== 2011`. crseId is the roster course ID, not the catalog number, so STS 2011 is not actually excluded. Double counting prevents most harm, but the logic is wrong.
- **Suggested change:** Use `course.catalogNbr !== '2011'`, or fold this into a corrected 8-course requirement.

### 7. Code comment / TODO (low, description)

- **Catalog:** Requirements are stated as 12 courses; there is no 37-credit rule.
- **CoursePlan:** A comment refers to 'Additional S&TS courses to total 37 credit hours in the major' and links an old courses.cornell.edu catalog (catoid=31).
- **Suggested change:** Remove the outdated 37-credit TODO and update the source comment to the current catalog page.

## Could not verify

- Whether the subject-based checkers (course.subject === 'STS', 'STS 2\*\*\*') also accept cross-listed courses taken under another subject (e.g. HIST 2031, SOC 3130, INFO 4240). The inputs do not show how cross-listing applies to custom function checkers.
- Whether the catalog's list of STS courses is exhaustive or illustrative. The file accepts any STS course, including ones not listed (e.g. independent study).
- The Theme requirement (courses designed in consultation with a faculty advisor) depends on advisor approval and is not checkable; a self-check note may be appropriate.
- Whether math courses can count toward the science requirement. The catalog only says required math prerequisites should be completed first.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
