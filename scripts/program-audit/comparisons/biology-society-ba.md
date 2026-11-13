# Biology & Society (major)

- Catalog: https://catalog.cornell.edu/programs/biology-society-ba/ (2026-2027 edition)
- Data file: `src/data/majors/bsoc.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The bsoc.ts file has the same overall structure as the 2026-2027 catalog: intro bio, calculus, statistics, ethics, the social sciences/humanities foundation, biology breadth and depth, core, and theme. However, many of its course lists are out of date. The Core requirement is missing BSOC 2071 and accepts four courses the catalog does not list. Statistics accepts MATH 1710, which the catalog does not list. General Chemistry is enforced as required although the catalog only recommends it for pre-health students. Every foundation and theme list is missing current catalog courses and accepts retired or non-listed courses. The senior seminar's open 4000-level option and the rule that lets senior seminars count as theme electives are not represented.

## Findings

### 1. Core Courses (high, course-list)

- **Catalog:** Select one of the following: BSOC 2071 (Introduction to the History of Medicine) or BSOC 2468 (Medicine, Culture, and Society).
- **CoursePlan:** Checker accepts BSOC 1942, BSOC 2468, BSOC 3011, BSOC 2821, NTRES 2320. BSOC 2071 is not accepted, and none of its cross-listings (HIST 2710, STS 2071) are either.
- **Suggested change:** Set the checker to includesWithSingleRequirement('BSOC 2071', 'BSOC 2468'). Remove BSOC 1942, BSOC 3011 (still offered, SP26), BSOC 2821 and NTRES 2320.

### 2. Statistics (high, course-list)

- **Catalog:** One of AEM 2100, ECON 3130, ILRST 2100, PUBPOL 2100, PSYCH 2500, SOC 3010, STSCI 2100, STSCI 2150.
- **CoursePlan:** Checker also accepts MATH 1710. STSCI 2100 is covered via ILRST 2100 and PUBPOL 2100 via PAM 2100.
- **Suggested change:** Remove MATH 1710. Optionally list PUBPOL 2100 and STSCI 2100 explicitly instead of relying on cross-listings.

### 3. Social Sciences/Humanities Foundation – History of Science (high, course-list)

- **Catalog:** BSOC 2071, BSOC 2581, BSOC 2599, BSOC 2640, STS 1180, STS 2023.
- **CoursePlan:** Accepts BSOC 1942, BSOC 2071, BSOC 2581, BSOC 2721, NTRES 2320, NTRES 3320, STS 2820, STS 2821, STS 1180, STS 3561. It is missing BSOC 2599 (offered FA26), BSOC 2640 and STS 2023 (offered FA26).
- **Suggested change:** Add BSOC 2599, BSOC 2640, STS 2023. Remove BSOC 1942, BSOC 2721, NTRES 2320, NTRES 3320, STS 2820, STS 2821, STS 3561.

### 4. Social Sciences/Humanities Foundation – Philosophy of Science (high, course-list)

- **Catalog:** BIOG 1180, PHIL 2455.
- **CoursePlan:** Accepts PHIL 2455, STS 2011, STS 2831, STS 3811. BIOG 1180 (offered FA26) is missing. STS 2011 is a Sociology of Science course in the catalog, so a student could pair STS 2011 with another sociology course and wrongly meet the 'two different subject areas' rule.
- **Suggested change:** Set the slot to ['BIOG 1180', 'PHIL 2455']. Remove STS 2011, STS 2831 and STS 3811 (not in roster data).

### 5. Social Sciences/Humanities Foundation – Sociology of Science (high, course-list)

- **Catalog:** BSOC 2101, BSOC 2468, BSOC 3011, GDEV 3400, NS 2450, NTRES 2201, STS 2011, STS 3111.
- **CoursePlan:** Accepts BSOC 2201 (= NTRES 2201), BSOC 2468, BSOC 3011, BSOC 3311, DSOC 2200, DSOC 3400 (= GDEV 3400), NS 2450, STS 2011, STS 3111. BSOC 2101 is missing. DSOC 2200 is extra. BSOC 3311 is a Politics of Science course in the catalog but is listed in both areas here.
- **Suggested change:** Add BSOC 2101. Remove DSOC 2200 and remove BSOC 3311 from this slot (keep it in Politics of Science).

### 6. Social Sciences/Humanities Foundation – Science Communication (high, course-list)

- **Catalog:** COMM 3210, STS 2851.
- **CoursePlan:** Also accepts STS 3020 (= COMM 3020, offered FA26) and STS 4661.
- **Suggested change:** Remove STS 3020 and STS 4661.

### 7. Social Sciences/Humanities Foundation – Literature and Science (high, course-list)

- **Catalog:** COML 2035, ENGL 2350.
- **CoursePlan:** Accepts COML 2035 and ENGL 2780. ENGL 2350 is not accepted, nor are its cross-listings such as BSOC 2350.
- **Suggested change:** Replace ENGL 2780 with ENGL 2350.

### 8. Social Sciences/Humanities Foundation – Anthropology of Science, Medicine, and Environment (high, course-list)

- **Catalog:** ANTHR 2201, ANTHR 2245, ANTHR 2420, ANTHR 2424.
- **CoursePlan:** Accepts ANTHR 2201, ANTHR 2245, ANTHR 2420. ANTHR 2424 (offered FA26) is missing.
- **Suggested change:** Add ANTHR 2424.

### 9. Biology Foundation (Breadth) – Anatomy and Physiology (high, course-list)

- **Catalog:** ANSC 2400, BIOAP 3110, NS 3410.
- **CoursePlan:** Accepts BIOAP 3110 and NS 3410 only.
- **Suggested change:** Add ANSC 2400.

### 10. Biology Foundation (Breadth) – Biochemistry, Molecular and Cell Biology (high, course-list)

- **Catalog:** BIOMG 3300, BIOMG 3310, BIOMG 3350, BIOMG 4450, NS 3200.
- **CoursePlan:** Accepts BIOMG 3300, BIOMG 3310, BIOMG 3330, BIOMG 3350, NS 3200. BIOMG 4450 is missing and BIOMG 3330 (last offered SU21) is extra.
- **Suggested change:** Add BIOMG 4450 and remove BIOMG 3330.

### 11. Biology Foundation (Breadth) – Biological Diversity (high, course-list)

- **Catalog:** BIOEE 2740, BIOEE 3730, BIOEE 4750, BIOEE 4760, BIOMI 2900, BIOSM 3210, BIOSM 3740, ENTOM 2120, PLSCI 2410, PLSCI 2480, PLSCI 3010, PLSCI 4300.
- **CoursePlan:** BIOSM 3740 (offered SU26) is missing. The checker also accepts BIOEE 4500 (offered FA26), BIOEE 4700 (a depth course in the catalog, not a breadth course), BIOEE 4701 and BIOSM 3830. The PLSCI courses are covered via PLBIO/PLPPM cross-listings.
- **Suggested change:** Add BIOSM 3740. Remove BIOEE 4500, BIOEE 4700, BIOEE 4701, BIOSM 3830. Consider using the current PLSCI codes.

### 12. Theme – Natural Science Issues/Biology Elective (high, course-list)

- **Catalog:** The approved list includes BIOAP 2140, BIOAP 3200, BIOMI 1400, BIOMI 2600, BIOMI 2950, BIOMI 4200, BIOMS 4250, BIONB 3215, BIONB 4380, BIONB 4740, ENTOM 2030, ENTOM 4520, HD 3210, HD 3320, PLSCI 2020, PLSCI 2100, PLSCI 2400, PLSCI 2440, PLSCI 4730, plus the courses already in the file. It does not include ANSC 2410, BIOSM 3650, FSAD 4390, HD 3250, NS 2750, PLSCI 3600 or PSYCH 3260.
- **CoursePlan:** The slot is missing all 19 catalog courses listed above. It accepts ANSC 2410, BIOSM 3650, FSAD 4390, HD 3250, NS 2750, PLSCI 3600 and PSYCH 3260; ANSC 2410, BIOSM 3650 and FSAD 4390 are still offered.
- **Suggested change:** Replace slot 1 with the catalog's Natural Science/Biology Elective list.

### 13. Theme – Humanities/Social Science Elective (high, course-list)

- **Catalog:** The approved list includes AEM 4500, ANTHR 2421, ANTHR 4530, ANTHR 4610, BSOC 2640, BSOC 4413, FGSS 2010, GDEV 3030, GDEV 3230, HD 2150, HD 2510, HD 3320, NS 4450, PLSCI 4230, PUBPOL 2050, PUBPOL 3180, PUBPOL 3330, PUBPOL 4370, PSYCH 2450, PSYCH 2800, plus the courses already in the file. It does not include ANTHR 4390, BME 4440, BSOC 3231, BSOC 3620, DSOC 2050, IARD 4850, PAM 2300, PHIL 2410, PSYCH 3250, SOC 2650 or STS 4240.
- **CoursePlan:** The slot is missing all 20 catalog courses listed above. It accepts ANTHR 4390, BME 4440, BSOC 3231, BSOC 3620 (not in roster), DSOC 2050, IARD 4850 (not in roster), PAM 2300, PHIL 2410, PSYCH 3250, SOC 2650 and STS 4240.
- **Suggested change:** Replace slot 2 with the catalog's Humanities/Social Sciences Elective list.

### 14. Theme – Senior Seminar (high, course-list)

- **Catalog:** The approved list includes AEM 4500, ANTHR 4448, ANTHR 4610, BSOC 4412, BSOC 4634, HD 4250, NS 4450, NS 4480, NS 4570, PLSCI 4230, SOC 4380, STS 4231, plus ANTHR 4682, ASRC 4602, BSOC 4101, BSOC 4131, BSOC 4227, BSOC 4682, BSOC 4691, BSOC 4911, HIST 4127, NTRES 4300, STS 4041.
- **CoursePlan:** The slot is missing the 12 catalog seminars listed first above. It accepts ANTHR 4390, BME 4440, BSOC 4280, BSOC 4425/ENGL 4425, BSOC 4460, BSOC 4650, COMM 3210, DEA 4500, DSOC 4380, ENGL 4430, FGSS 4114, FGSS 7114, NTRES 4330, STS 4661 and STS 4751, none of which the catalog lists. BME 4440, BSOC 4460 and DEA 4500 are still offered, and COMM 3210 is a 3000-level foundation course.
- **Suggested change:** Replace slot 3 with the catalog's Senior Seminar list.

### 15. General Chemistry (medium, extra-requirement)

- **Catalog:** General chemistry appears only under 'Recommended for Students on a Pre-health Careers Track'; it is not a major requirement. The options listed are CHEM 2070 & CHEM 2071, CHEM 2080 & CHEM 2081, or CHEM 2150.
- **CoursePlan:** It is a required 'courses' requirement (the code comment says 'TODO: we currently make this required'). The checker accepts CHEM 1560, or CHEM 2070 and CHEM 2080, or CHEM 2150 and CHEM 2160. CHEM 2160 is not in the roster data. The description says 'Recommended but not required', which contradicts the checker.
- **Suggested change:** Remove this requirement from the major, or make it non-blocking (for example self-check with a note that it is recommended for pre-health). If kept, align the course options with the catalog (CHEM 2070/2071, CHEM 2080/2081, CHEM 2150).

### 16. Theme – Senior Seminar (medium, rule)

- **Catalog:** Select from the approved Senior Seminars, or any 4000-level or above Social Science or Humanities course with a significant focus on the life sciences (including 4000-level Humanities/Social Science Electives).
- **CoursePlan:** Only the fixed list is accepted. There is no route for the open 4000-level option and no checkerWarning.
- **Suggested change:** Add a checkerWarning explaining the open 4000-level option, so students know the slot may need a manual override. Alternatively, also accept the 4000-level courses on the Humanities/Social Science Elective list.

### 17. Theme – electives (medium, rule)

- **Catalog:** Courses from the list of senior seminars may be used as theme electives if not used to meet another requirement.
- **CoursePlan:** Senior seminar courses are only accepted in the Senior Seminars slot, not in the elective slots.
- **Suggested change:** Allow senior seminar courses to fill the elective slots as well, or add a checkerWarning describing this option.

### 18. Biology Foundation (Depth requirement) (low, description)

- **Catalog:** The depth course must have, as a prerequisite, a course completed for the Breadth requirement. A year of introductory biology does not count as that prerequisite.
- **CoursePlan:** The name reads 'Biology Doundation (Depth requirement)'. The checkerWarning says 'We do not check the this course is a prerequisite for the Breadth Requirement', which reverses the relationship.
- **Suggested change:** Fix the typo to 'Biology Foundation'. Reword the warning to say CoursePlan does not check that a Breadth course is a prerequisite of the depth course, and that intro bio does not count.

### 19. College Calculus (low, rule)

- **Catalog:** Students may petition to take a second, advanced statistics course (in sequence with the foundation statistics course) in place of the calculus requirement.
- **CoursePlan:** There is no mention of the petition option.
- **Suggested change:** Mention the petition alternative in the description.

### 20. Theme – Natural Science Issues/Biology Elective (low, rule)

- **Catalog:** Students may take BIOAP 2140 or ANSC 2400 for credit, but not both.
- **CoursePlan:** BIOAP 2140 is not accepted at all, so the exclusion is not represented.
- **Suggested change:** When BIOAP 2140 is added, note the either/or rule in the description.

### 21. All requirements (source URLs) (low, description)

- **Catalog:** Current requirements are at https://catalog.cornell.edu/programs/biology-society-ba/.
- **CoursePlan:** Sources point to https://sts.cornell.edu/bio-society#requirements and to old courses.cornell.edu catoid=41 pages.
- **Suggested change:** Update the source URLs to the current catalog page.

## Could not verify

- Whether 'any higher-level calculus course' should include courses beyond MATH 1920, MATH 2130, MATH 2220 and MATH 2240, such as MATH 1910 or MATH 2210.
- The catalog's Statistics header reads '(AP credit may be accepted for Calculus)', which looks like a copy error; it is unclear whether AP Statistics is accepted, as CoursePlan's Statistics description says.
- The catalog lists NTRES 4300 at 0.5 credits as a senior seminar while also requiring theme courses to be at least 3 credits; it is unclear whether NTRES 4300 actually qualifies.
- The note on BIOAP 2140 vs ANSC 2400 refers to 'Animal Science major credit'; it is unclear whether it is meant to apply to this major.
- Theme courses 'must be above the 2000-level' per the prose, yet the approved elective lists include 2000-level courses; it is unclear which governs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
