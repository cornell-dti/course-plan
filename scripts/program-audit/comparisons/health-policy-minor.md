# Health Policy (minor)

- Catalog: https://catalog.cornell.edu/programs/health-policy-minor/ (2026-2027 edition)
- Data file: `src/data/minors/hp.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The data file still encodes the old PAM-based Health Policy minor. The PUBPOL 2350 core is still accepted through its cross-listing. However, the 9-credit HCP-EL elective list is badly out of date: many current HCP-EL courses are rejected, and several non-listed courses (5000-level PAM courses, PAM 4140, PAM 4230, PAM 4280) are accepted. The 'additional course' checker only accepts PAM-subject courses, so most PUBPOL-only courses are rejected, and it does not cap the level at 4000. Names, descriptions and the source URL also still refer to PAM and the old Human Ecology page.

## Findings

### 1. 3000/4000+ Level (HCP-EL electives, 9 credits) (high, course-list)

- **Catalog:** 9 credits from HCP-EL courses, including AMST 3230/PUBPOL 3230/SOC 3230, AMST 3261/GOVT 3251/PUBPOL 3251, ECON 3711/PUBPOL 4281, ECON 3720/PUBPOL 4370, ECON 3910/NS 4570, FGSS 3260/PUBPOL 3260, PUBPOL 2050, PUBPOL 3011, PUBPOL 3320, PUBPOL 3350, PUBPOL 3490, PUBPOL 3650, PUBPOL 3720
- **CoursePlan:** Checker accepts only PAM 3110, PAM 3180, PAM 3280, PAM 3780, PAM 3870, PAM 4110, PAM 4140, PAM 4280, PAM 4230, PAM 5500, PAM 5740, PAM 5760, PAM 5900 and their cross-listings; none of the listed catalog courses are accepted
- **Suggested change:** Replace the list with the catalog HCP-EL list: PUBPOL 2050, PUBPOL 3011, PUBPOL 3110, PUBPOL 3180, PUBPOL 3230, PUBPOL 3251, PUBPOL 3260, PUBPOL 3280, PUBPOL 3320, PUBPOL 3350, PUBPOL 3490, PUBPOL 3650, PUBPOL 3720, PUBPOL 3780, PUBPOL 3870, PUBPOL 4110, PUBPOL 4281, PUBPOL 4370, AMST 3230, AMST 3261, GOVT 3251, ECON 3711, ECON 3720, ECON 3910, NS 4570, FGSS 3260, GDEV 3280, SOC 3180, SOC 3230. Alternatively, use courseHasAttribute for HCP-EL.

### 2. 3000/4000+ Level (HCP-EL electives, 9 credits) (high, course-list)

- **Catalog:** Only the HCP-EL courses listed count; no 5000-level courses, and PAM 4140/ECON 3740, PAM 4230/DSOC 4230, PAM 4280/ECON 3710/PUBPOL 4280 are not listed
- **CoursePlan:** Accepts PAM 4140, PAM 4230, PAM 4280, PAM 5500, PAM 5740, PAM 5760, PAM 5900 (and cross-listings such as ECON 3740, DSOC 4230, ECON 3710, HADM 6033, PUBPOL 5500, PUBPOL 5740, PUBPOL 5900)
- **Suggested change:** Remove PAM 4140, PAM 4230, PAM 4280, PAM 5500, PAM 5740, PAM 5760, PAM 5900 from the checker.

### 3. Additional Course (high, course-list)

- **Catalog:** Any PUBPOL coursework at the 2000, 3000 or 4000 level (excluding PUBPOL 4000, PUBPOL 4010, PUBPOL 4020, PUBPOL 4030)
- **CoursePlan:** Accepts only courses whose subject is PAM, so PUBPOL-only courses (e.g. PUBPOL 2050, PUBPOL 3011, PUBPOL 3320, PUBPOL 3490, PUBPOL 3650, PUBPOL 3720) are rejected
- **Suggested change:** Change the subject check to PUBPOL, e.g. courseMatchesCodeOptions(course, ['PUBPOL 2***','PUBPOL 3***','PUBPOL 4***']), while keeping the PUBPOL 4000/4010/4020/4030 exclusion.

### 4. Additional Course (medium, course-list)

- **Catalog:** PUBPOL coursework at the 2000, 3000 or 4000 level only
- **CoursePlan:** Accepts any non-1000-level course, including 5000- and 6000-level PAM courses
- **Suggested change:** Restrict the checker to 2000–4000 level course numbers.

### 5. Additional Course (medium, count-or-credits)

- **Catalog:** 3 credits of PUBPOL coursework at the 2000–4000 level
- **CoursePlan:** One course of any credit value (fulfilledBy 'courses', perSlotMinCount [1]), so a 1-credit course satisfies it
- **Suggested change:** Count credits (fulfilledBy 'credits', perSlotMinCount [3]) or add a courseMeetsCreditMinimum(course, 3) check.

### 6. PAM 2350 (low, description)

- **Catalog:** PUBPOL 2350: The U.S. Health Care System
- **CoursePlan:** Name and description say 'PAM 2350'; the checker uses PAM 2350, which is cross-listed with PUBPOL 2350, so the right course is accepted
- **Suggested change:** Rename the requirement and use 'PUBPOL 2350' in the name, description and checker.

### 7. 3000/4000+ Level / Additional Course (low, description)

- **Catalog:** Minimum 15 credits; core PUBPOL 2350, any PUBPOL 2000–4000 level course, and 9 credits of HCP-EL courses (which include ECON, AMST, GOVT, NS, FGSS, SOC, GDEV and 2000-level PUBPOL courses)
- **CoursePlan:** Descriptions say '9 credit at the 3000 or 4000 level in PAM' and 'minimum of 15 credits of PAM courses'
- **Suggested change:** Update the descriptions to refer to HCP-EL courses and PUBPOL coursework.

### 8. All requirements (source) (low, other)

- **Catalog:** https://catalog.cornell.edu/programs/health-policy-minor/
- **CoursePlan:** https://www.human.cornell.edu/pam/studentlife/advising/minorhealthpolicy
- **Suggested change:** Point source to the catalog page.

## Could not verify

- Whether PAM 3870 and PAM 4110 (accepted by the file) are the same courses as catalog PUBPOL 3870 and PUBPOL 4110. Those PUBPOL codes are not in the roster data, so they cannot be added either way.
- Whether PAM 4280/ECON 3710/PUBPOL 4280 is an older numbering of PUBPOL 4281/ECON 3711.
- Whether the roster exposes an 'HCP-EL' catalogAttribute that could be used instead of a hard-coded list, and whether the HCP-EL list shown is complete.
- Footnote 2 (cross-listed courses count only if the PUBPOL cross-list existed at the time of completion) depends on term-specific cross-listing data not shown here; a checkerWarning may be appropriate.
- AMST 3230 is listed in the roster as cross-listed with ECON 3310 rather than PUBPOL 3230/SOC 3230; whether ECON 3310 should count as HCP-EL is unclear.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
