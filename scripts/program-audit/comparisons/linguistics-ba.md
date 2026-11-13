# Linguistics (major)

- Catalog: https://catalog.cornell.edu/programs/linguistics-ba/ (2026-2027 edition)
- Data file: `src/data/majors/ling.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **minor-differences**

The foundation courses, the six-course structure (at least 2 at 3000+, at most 1 at the 1000 level) and the two ancillary skills courses match the catalog. Several catalog rules are missing or loosened in the file. The 37-credit minimum for the ten linguistics courses is not checked. A 3-credit CU-UGR course is accepted where the catalog requires four credits. A CU-UGR course below the 3000 level can never count. Language courses with a LING prefix are not excluded. Other-department petition courses have no path to count. Some descriptions are inaccurate.

## Findings

### 1. Additional Courses (overall major credit minimum) (medium, count-or-credits)

- **Catalog:** Ten courses (minimum of 37 credit hours) in linguistics and two ancillary skills courses are required to complete the major.
- **CoursePlan:** Four foundation courses plus six additional courses, each needing only 3 credits. Nothing checks a 37-credit total, so 4×4 + 6×3 = 34 credits shows as complete.
- **Suggested change:** Add a check or a checkerWarning that the ten linguistics courses must total at least 37 credits, or mention the 37-credit minimum in the Additional Courses descriptions.

### 2. Additional Courses: 3000 or above, CU-UGR (medium, rule)

- **Catalog:** no more than 1 of these may be satisfied by four credits of coursework with a CU-UGR designation
- **CoursePlan:** The checker is `courseMeetsCreditMinimum(course, 3) || (courseMeetsCreditMinimum(course, 4) && courseHasAttribute(course, 'CU-UGR'))`. The first disjunct already admits any course of 3 or more credits, CU-UGR courses included, so a 3-credit CU-UGR course counts. The description says it must be 4 credits.
- **Suggested change:** Change the condition to `courseHasAttribute(course,'CU-UGR') ? courseMeetsCreditMinimum(course,4) : courseMeetsCreditMinimum(course,3)`.

### 3. Additional Courses (CU-UGR placement) (medium, rule)

- **Catalog:** The single allowed CU-UGR course is one of the six additional courses, with no level restriction tied to it. The level limits are separate: at least 2 at 3000+ and at most 1 at the 1000 level.
- **CoursePlan:** CU-UGR courses are accepted only by 'Additional Courses: 3000 or above, CU-UGR', which rejects 1000- and 2000-level courses. The 2000+ and 1000+ requirements exclude CU-UGR entirely, so a 2000-level CU-UGR course can never count.
- **Suggested change:** Allow one 4-credit CU-UGR course in the 2000+ (or 1000+) slots, or restructure as a compound requirement as the TODO suggests.

### 4. Additional Courses (all four requirements) (medium, rule)

- **Catalog:** Any course with a LING prefix except for First-Year Writing Seminars and language courses counts as a linguistics course.
- **CoursePlan:** The checkers exclude FWS but not language courses, even though the descriptions say 'Language courses do not count'. The file's TODO acknowledges this.
- **Suggested change:** Exclude known LING-prefix language courses explicitly, or add a checkerWarning telling students that language courses do not count.

### 5. Additional Courses (petition courses from other departments) (low, rule)

- **Catalog:** One course in another department with at least 50% linguistic content will be considered by petition.
- **CoursePlan:** All Additional Courses checkers require subject LING, so an approved petition course cannot count without a manual override. Nothing in the descriptions mentions the petition option.
- **Suggested change:** Mention the petition option in the description or a checkerWarning.

### 6. Additional Courses (Cornell residency) (low, rule)

- **Catalog:** Of the six courses, at least three need to be regularly scheduled linguistics courses taken at Cornell.
- **CoursePlan:** Not represented. Transfer credit and independent study are not restricted.
- **Suggested change:** Add a checkerWarning noting that at least three of the six must be regularly scheduled Cornell LING courses.

### 7. Additional Courses: 1000 or above (low, description)

- **Catalog:** no more than 1 of these may be at the 1000 level
- **CoursePlan:** Description: 'At most 1 additional linguistics course can be 1000 level or above'. That is wrong, since most courses are 1000 level or above. The slot actually accepts one course at any level.
- **Suggested change:** Reword to: 'One additional linguistics course at any level (at most 1 of the six may be at the 1000 level), at least 3 credits.'

### 8. Ancillary Skills Courses (low, rule)

- **Catalog:** The Ancillary Skills Course requirement may be waived for students who are majoring in more than one field. Courses must be in statistics, logic, computer programming, specified language study, or language teaching methodology.
- **CoursePlan:** Accepts any course of 3 or more credits, with a warning that areas are not checked. The waiver for multiple majors is not mentioned.
- **Suggested change:** List the allowed areas and the double-major waiver in the description or checkerWarning.

### 9. All requirements (source) (low, description)

- **Catalog:** Catalog page https://catalog.cornell.edu/programs/linguistics-ba/
- **CoursePlan:** source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:'
- **Suggested change:** Point the source to the catalog page.

## Could not verify

- Which LING-prefix courses are 'language courses' that the catalog excludes from the additional courses.
- Which LING courses carry the CU-UGR attribute, and at what levels and credit amounts they are offered.
- Whether the custom subject check `ifCodeMatch(course.subject, 'LING')` accepts cross-listed courses taken under another prefix, as the catalog footnote requires. This depends on the crseId-based cross-listing matching, which these inputs do not show.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
