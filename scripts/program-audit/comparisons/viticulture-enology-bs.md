# Viticulture and Enology (major)

- Catalog: https://catalog.cornell.edu/programs/viticulture-enology-bs/ (2026-2027 edition)
- Data file: `src/data/majors/vien.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The VIEN data file is out of date against the 2026-2027 catalog, mostly in the Viticulture & Enology Core. The core requires VIEN 4980, which the catalog does not list. Its final slot asks for VIEN 3300 or VIEN 3200 instead of the catalog's VIEN 4460 or PLSCI 2440. The supervised internship requirement is missing. The Chemistry requirement omits the CHEM 1561 lab. The elective checker is a broad subject-prefix match: it lets in unlisted subjects (HADM, GDEV, any FDSC/VIEN), rejects BIOMI 2911, and does not enforce the 5-credit VIEN minimum. The Biology and Statistics requirements match. Plant Science is accepted correctly through cross-listings but is described with retired codes.

## Findings

### 1. Viticulture & Enology Core (high, course-list)

- **Catalog:** The core requires VIEN 4700 & VIEN 4710 (4 cr) and does not list VIEN 4980 anywhere.
- **CoursePlan:** Slot 'Course 4XXX' accepts only ['VIEN 4700', 'VIEN 4710', 'VIEN 4980'] and needs 3 courses, so VIEN 4980 is effectively required.
- **Suggested change:** Remove VIEN 4980 and make this slot require VIEN 4700 and VIEN 4710 (perSlotMinCount 2).

### 2. Viticulture & Enology Core (high, course-list)

- **Catalog:** The core requires one of VIEN 4460 (Advanced Viticulture Topics) or PLSCI 2440 (Integrated Pest Management). VIEN 3300 is listed only as a viticulture-focus elective.
- **CoursePlan:** The last slot is 'VIEN 3300 or VIEN 3200', and VIEN 3200 was last offered FA21. VIEN 4460 and PLSCI 2440 are not accepted.
- **Suggested change:** Replace the slot with ['VIEN 4460', 'PLSCI 2440'] and rename it 'VIEN 4460 or PLSCI 2440'.

### 3. Required Supervised Internship Experience (high, missing-requirement)

- **Catalog:** The core includes a required supervised internship (0-3 cr). Students may take up to 3 credits of VIEN 4960, but course credit is not required.
- **CoursePlan:** No requirement or slot represents the internship.
- **Suggested change:** Add a self-check requirement for the supervised internship, noting that VIEN 4960 credit is optional.

### 4. Chemistry (high, course-list)

- **Catalog:** CHEM 1560 & CHEM 1561 (lecture and lab, 4 cr), CHEM 1570, and one biochemistry course.
- **CoursePlan:** Only CHEM 1560 is required. CHEM 1561 is not checked.
- **Suggested change:** Add a slot for CHEM 1561, or require both CHEM 1560 and CHEM 1561, and update the description.

### 5. Major-approved Elective(s) (medium, course-list)

- **Catalog:** Electives come from a specific list of Enology, Viticulture and Other options. HADM and GDEV courses are not on it, and only specific FDSC/NTRES/PLSCI courses are.
- **CoursePlan:** The checker accepts any course with subject VIEN, FDSC, HADM, PLSCS, NTRES, GDEV, PLBRG, PLBIO or PLHRT. It carries only a checkerWarning.
- **Suggested change:** Replace the subject-prefix checker with the catalog's elective list, using includesWithSingleRequirement.

### 6. Major-approved Elective(s) (medium, course-list)

- **Catalog:** BIOMI 2911 (General Microbiology Laboratory, 3 cr) is an Enology-focus elective.
- **CoursePlan:** BIOMI is not an accepted subject and BIOMI 2911 is not cross-listed, so it is rejected.
- **Suggested change:** Add BIOMI 2911 to the elective checker.

### 7. Major-approved Elective(s) (medium, rule)

- **Catalog:** Minimum 17 credits, at least 5 of which MUST be VIEN courses.
- **CoursePlan:** Only the 17-credit total is checked. The 5-credit VIEN minimum appears in the description but is not enforced.
- **Suggested change:** Add an additionalRequirements entry needing 5 credits of VIEN courses, or mention the 5-credit rule in the checkerWarning.

### 8. Chemistry (low, description)

- **Catalog:** The catalog does not mention BIOMG 3320 or BIOMG 3330.
- **CoursePlan:** The description says 'BIOMG 3320 or BIOMG 3330 are not counted towards the Biochemistry requirement.'
- **Suggested change:** Drop the statement or confirm it with the department. The checker already rejects these codes.

### 9. Plant Science (low, description)

- **Catalog:** PLSCI 2410 and PLSCI 2600.
- **CoursePlan:** The description and checker use PLBIO 2410 and PLSCS 2600. Both are accepted through cross-listings, but both codes were last offered FA23.
- **Suggested change:** Update the codes and description to PLSCI 2410 and PLSCI 2600.

### 10. All requirements (source) (low, other)

- **Catalog:** Catalog page https://catalog.cornell.edu/programs/viticulture-enology-bs/ (2026-2027).
- **CoursePlan:** Sources point to an old courses.cornell.edu catoid=55 URL.
- **Suggested change:** Update source URLs to the current catalog page.

## Could not verify

- The grade rules in the core and elective descriptions (letter grade required, C- or better, the Spring 2020/Fall 2020 exception) do not appear in the provided catalog text.
- Whether the lecture-plus-lab rule for paired electives applies beyond the paired listings shown in the catalog.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
