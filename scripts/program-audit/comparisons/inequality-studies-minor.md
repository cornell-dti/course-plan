# Inequality Studies (minor)

- Catalog: https://catalog.cornell.edu/programs/inequality-studies-minor/ (2026-2027 edition)
- Data file: `src/data/minors/ineq.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file for the Inequality Studies minor is out of date against the 2026-2027 catalog. The core course requirement is correct. The overview course list is missing three catalog options (GOVT 3251, PUBPOL 2250, PUBPOL 2370) and accepts several courses the catalog does not list (ECON 3450/ILRLE 4426, PAM 3370/SOC 3370, ILROB 6260, PAM 4470/SOC 4470). The Health Equity Track is only mentioned in the description and is not modelled. None of the five health-equity sample electives (AEM 1600, ANTHR 2424, BSOC 2051, NS 1150, PUBPOL 3280) is accepted by the elective checker. The rule that courses must span at least three departments is not shown anywhere. The elective list also accepts the required core course and contains a few codes that are not in the roster.

## Findings

### 1. Inequality Overview Course (high, course-list)

- **Catalog:** Select one of the following Overview Courses: GDEV 3700, GOVT 3251, PUBPOL 2250, PUBPOL 2370, SOC 2220.
- **CoursePlan:** The checker accepts the SOC 2220 group and the GDEV 3700 group (via DSOC 3700/SOC 3710). It accepts none of GOVT 3251 (AMST 3261), PUBPOL 2250 (AMST 2070, PAM 2250, SOC 2070) or PUBPOL 2370 (AMST 2365, SOC 2370).
- **Suggested change:** Add 'GOVT 3251', 'PUBPOL 2250' and 'PUBPOL 2370' to the overview checker.

### 2. Inequality Overview Course (high, course-list)

- **Catalog:** Only GDEV 3700, GOVT 3251, PUBPOL 2250, PUBPOL 2370 and SOC 2220 are listed as overview courses.
- **CoursePlan:** The checker also accepts 'PAM 3370', 'SOC 3370', 'ILROB 6260', 'PAM 4470', 'SOC 4470', 'ILRLE 4426' and 'ECON 3450'.
- **Suggested change:** Remove PAM 3370, SOC 3370, ILROB 6260, PAM 4470, SOC 4470, ILRLE 4426 and ECON 3450 from the overview checker. If older cohorts still need them, keep them only through a migration.

### 3. Inequality Electives (Health Equity Track electives) (high, course-list)

- **Catalog:** The health equity track electives include AEM 1600, ANTHR 2424, BSOC 2051, NS 1150 and PUBPOL 3280.
- **CoursePlan:** None of these is accepted, including through cross-listings: STS 2051 for BSOC 2051, and DSOC 3280, GDEV 3280 and PAM 3280 for PUBPOL 3280.
- **Suggested change:** Add 'AEM 1600', 'ANTHR 2424', 'BSOC 2051', 'NS 1150' and 'PUBPOL 3280', plus the rest of the program's health-equity elective list, to the elective checker.

### 4. Health Equity Track (medium, missing-requirement)

- **Catalog:** Students in the Health Equity Track must complete two of their four electives from the health-equity elective list. The other two come from the full elective list.
- **CoursePlan:** The track appears only in the elective description. There is no toggle or sub-requirement checking that two electives are health-equity courses.
- **Suggested change:** Model the requirement as toggleable (General vs. Health Equity Track). Alternatively, add a separate health-equity elective requirement with perSlotMinCount [2] for track students.

### 5. Department distribution (medium, rule)

- **Catalog:** The electives and the overview course must together span at least three departments. All ILR courses count as one department, and a cross-listed course can count as any of its listings.
- **CoursePlan:** No requirement, description or checkerWarning mentions this rule. The minor shows as complete even when every course is from one department.
- **Suggested change:** Add a self-check requirement, or a checkerWarning on the electives, describing the three-department distribution rule.

### 6. Inequality Electives (medium, course-list)

- **Catalog:** SOC 2208 is the required core course. It is not listed as an elective, and the minor requires six distinct courses.
- **CoursePlan:** The elective checker includes 'SOC 2208', 'DSOC 2090' and 'PAM 2208' (the core course), so the core course can be placed in the elective requirement instead of the core. It also includes 'DSOC 3700' and 'SOC 3710' (the GDEV 3700 overview course).
- **Suggested change:** Remove SOC 2208, DSOC 2090 and PAM 2208 from the elective checker. Confirm with the program whether a second overview course may count as an elective.

### 7. Letter grade (low, rule)

- **Catalog:** All courses toward the minor must be taken for a letter grade.
- **CoursePlan:** No description or warning mentions the letter-grade rule.
- **Suggested change:** Mention the letter-grade requirement in the descriptions, or add a checkerWarning.

### 8. Inequality Electives (low, course-list)

- **Catalog:** (No catalog equivalent.)
- **CoursePlan:** The elective checker includes codes that are not in the roster data: 'DSCO 3130', 'DSCO 5130' (likely typos for DSOC), 'FGSS 2467' (likely a typo for FGSS 2468) and 'STST 2721' (likely a typo for STS 2721).
- **Suggested change:** Fix the typos: DSCO → DSOC after verifying the intended courses, FGSS 2467 → FGSS 2468, and STST 2721 → STS 2721. The FGSS and STS courses are already covered by their cross-listings.

### 9. Inequality Core Course (low, description)

- **Catalog:** The core course is SOC 2208 (4 cr).
- **CoursePlan:** The description says the course is 'Offered every spring semester.' The roster shows SOC 2208 last offered SU26.
- **Suggested change:** Remove or update the offering-term claim in the description.

## Could not verify

- The catalog lists only sample electives and points to the program website for the full approved list. The many other courses in the elective checker (CRP, AIIS, HIST, ILR, NS, PAM, etc.) cannot be confirmed or rejected from these inputs.
- Whether a second overview course may count as one of the four electives is not stated in the catalog.
- The intended courses behind 'DSCO 3130' and 'DSCO 5130' cannot be determined from these inputs.
- Whether the removed overview courses (e.g., ECON 3450, PAM 3370) are still valid for students under earlier catalog years cannot be determined from these inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
