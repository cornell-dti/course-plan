# History (major)

- Catalog: https://catalog.cornell.edu/programs/history-ba/ (2026-2027 edition)
- Data file: `src/data/majors/hist.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan History major file has the right three headline requirements: four world-area courses, three pre-1800 courses and two seminars. It does not enforce what the 2026-2027 catalog actually requires. The world-area requirement accepts any HIST course instead of one course from each of four of the five HIST-HAN/HNA/HEU/HGS/HTR categories. The seminar requirement accepts any HIST course and does not enforce the 4000-level seminar or the published seminar number ranges. The file has no requirement for the overall nine courses and 30 credits. It also forbids double counting, which the catalog explicitly allows. The description still refers to the classes of 2019–2021.

## Findings

### 1. History Major Classes (world areas) (high, rule)

- **Catalog:** Four courses must be taken from one each of the five world area categories: Asia (HIST-HAN), North America (HIST-HNA), Europe (HIST-HEU), Global South (HIST-HGS) and Transregional/Comparative/Methodological (HIST-HTR). That means four different categories, with published course lists for each.
- **CoursePlan:** The checker accepts any course with subject 'HIST', `perSlotMinCount: [4]`, one slot. Four European (or four North American) courses would show the requirement as met. The checkerWarning only mentions graduation year, not the area categories.
- **Suggested change:** Encode five slots, one per category (HAN, HNA, HEU, HGS, HTR). Check each with the catalogCourseSubfield attribute, as the Pre 1800 requirement does with 'HPE', or with the catalog course lists. Set `minNumberOfSlots: 4` with one course per slot.

### 2. Overall major total (nine courses, 30 credits) (high, missing-requirement)

- **Catalog:** A total minimum of nine (3 or 4 credit) history courses, with a grade of 'C' or better, and a total minimum of 30 credits.
- **CoursePlan:** No requirement checks the total number of history courses or the 30-credit minimum. Nine 3-credit courses (27 credits) spread across the three requirements would show the major as complete.
- **Suggested change:** Add a requirement for at least nine history courses of 3–4 credits and at least 30 credits. Use a credits-based requirement, or a courses requirement with a credit warning. Set allowCourseDoubleCounting on it so that it can overlap with the category requirements.

### 3. Seminars (medium, rule)

- **Catalog:** Two HIST seminar courses are required, and one must be at the 4000-level. Sophomore seminars are HIST 2006-2499. 4000-level seminars are HIST 4000 and HIST 4003-4999. HIST 4001 and HIST 4002 cannot be used for the 4000-level seminar.
- **CoursePlan:** The checker accepts any HIST course except HIST 4001 and HIST 4002, including 1000-level and 3000-level lectures, and needs 2 courses with no 4000-level slot. The checkerWarning says only that seminar status is not checked.
- **Suggested change:** Split into two slots. Slot one is the 4000-level seminar: HIST 4000 or HIST 4003–4999. Slot two accepts HIST 2006–2499 or HIST 4000/4003–4999. Keep a warning that the student must confirm the course is actually a seminar.

### 4. Double counting across major requirements (medium, rule)

- **Catalog:** A single course may be used to fulfill more than one requirement (e.g. a pre-1800 course that is also a world-area course or a seminar).
- **CoursePlan:** None of the three requirements sets allowCourseDoubleCounting. A course can therefore count toward only one of world areas, Pre 1800 or Seminars.
- **Suggested change:** Set allowCourseDoubleCounting on the Pre 1800, world-area and seminar requirements. Rely on a separate nine-course/30-credit total requirement for the overall count.

### 5. First-Year Writing Seminars excluded (medium, rule)

- **Catalog:** First-Year Writing seminars do not count for the major.
- **CoursePlan:** The 'History Major Classes' and 'Seminars' checkers accept any HIST course, including HIST FWS courses.
- **Suggested change:** Exclude FWS courses (e.g. `&& !courseIsFWS(course)`) from the major checkers.

### 6. Minimum credits per course (low, rule)

- **Catalog:** Courses counted toward the major are 3 or 4 credit history courses.
- **CoursePlan:** No minimum credits per course is enforced, so 1–2 credit HIST courses are accepted.
- **Suggested change:** Add `courseMeetsCreditMinimum(course, 3)` to the major checkers.

### 7. History Major Classes description (low, description)

- **Catalog:** The current catalog states only the four-of-five world-area rule.
- **CoursePlan:** The description still covers the graduating classes of 2019, 2020 and 2021 ('4 History courses categorized as outside of U.S. History'). The checkerWarning refers to graduation-year differences that no longer apply.
- **Suggested change:** Remove the 2019–2021 wording and the graduation-year warning. Describe the HIST-HAN/HNA/HEU/HGS/HTR categories and use the catalog page as the source.

## Could not verify

- Whether catalogCourseSubfield on roster courses actually carries 'HPE' (and HAN/HNA/HEU/HGS/HTR) for every course in the catalog's HIST-HPE list, including non-HIST cross-listed codes.
- Whether the subject === 'HIST' checkers accept a course the student adds under a cross-listed code (e.g. ASIAN 2222 / HIST 1622), since cross-listing matching is described for code lists, not subject checks.
- Which specific HIST courses in the 2006-2499 and 4000-4999 ranges are offered as seminars in a given term.
- The grade of C or better, the transfer-credit limits (2 or 3 courses) and the Cornell in Washington petition for 4000-level seminar credit are self-check rules not encoded; whether they should be surfaced in descriptions is a judgment call.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
