# Robotics (minor)

- Catalog: https://catalog.cornell.edu/programs/robotics-minor/ (2026-2027 edition)
- Data file: `src/data/minors/robotics.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Robotics minor file is badly out of date compared with the 2026-2027 catalog. All four Specialization categories and the Fundamentals list are missing many accepted courses, including Fast Robots, Robot Perception, Robot Learning, Feedback Control, the 5xxx/6xxx equivalents and several newer courses. The file also accepts courses the catalog no longer lists: ECE 3400, MAE 4710, MAE 6790, and CS 4700 under Intelligence. Two of its codes (CS 4752, CS 4790) are no longer offered. Neither footnote (the ME Mechatronics restriction and the independent-research petition) is surfaced to students. The overall structure matches the catalog: 3 Fundamentals, plus 3 Specialization courses from one category, with no double counting.

## Findings

### 1. Fundamentals Courses (high, course-list)

- **Catalog:** Select three from: CS 3700/CS 3780/ECE 4200/ECE 5420; CS 4756/CS 5756; INFO 4410/INFO 6420; MAE 3780/MAE 3783; MAE 4180/MAE 5180; MAE 4190/MAE 5190; MAE 4760/CS 5750; MAE 4810/MAE 5810; MAE 5780.
- **CoursePlan:** Accepts only CS 4750 (=MAE 4760, ECE 4770), MAE 4180 (+cross-lists), CS 4752, MAE 3780, ECE 3400, CS 4700 (=CS 3700) and CS 4754 (=INFO 4410).
- **Suggested change:** Add CS 3780, ECE 4200, ECE 5420, CS 4756, CS 5756, INFO 6420, MAE 3783, MAE 5180, MAE 4190, MAE 5190, CS 5750, MAE 4810, MAE 5810 and MAE 5780. CS 3780 covers CS 4780, MAE 4190 covers ECE 4160, and MAE 4810 covers CEE 4810/ECE 4240.

### 2. Fundamentals Courses (high, course-list)

- **Catalog:** ECE 3400 is not a Fundamentals option.
- **CoursePlan:** Checker accepts ECE 3400 (last offered FA22). It also lists CS 4752, which is not in the roster data.
- **Suggested change:** Remove ECE 3400 and CS 4752. Also update the header comment about ECE majors and ECE 3400, which no longer applies.

### 3. Specialization Courses – Intelligence (high, course-list)

- **Catalog:** CS 4756/CS 5756, CS 5780, CS 6756, CS 6758, ECE 6970 (Bio-Inspired Coordination), MAE 4180/MAE 5180, MAE 4760/CS 5750, MAE 6730/CS 6751, MAE 6710, MAE 6770.
- **CoursePlan:** Accepts CS 4790, CS 6751 (=MAE 6730), MAE 6770, MAE 6790, ECE 6970, CS 4700 (=CS 3700), MAE 4180, MAE 6710.
- **Suggested change:** Add CS 4756, CS 5756, CS 5780, CS 6756, CS 6758, MAE 5180, MAE 4760 and CS 5750.

### 4. Specialization Courses – Intelligence (high, course-list)

- **Catalog:** CS 3700/CS 4700 and MAE 6790 are not in the Intelligence category.
- **CoursePlan:** Checker accepts CS 4700 (=CS 3700) and MAE 6790. It also lists CS 4790, which is not in the roster data.
- **Suggested change:** Remove CS 4700, MAE 6790 and CS 4790 from the Intelligence checker.

### 5. Specialization Courses – Modeling, Dynamics, and Control (high, course-list)

- **Catalog:** MAE 4190/MAE 5190, MAE 4730/MAE 5730, MAE 4760/CS 5750, MAE 4780/MAE 5780, MAE 6730/CS 6751, MAE 6760, MAE 6770, MAE 6780, MAE 6800.
- **CoursePlan:** Accepts MAE 4730, MAE 4710, MAE 4780, CS 4752, MAE 6760, MAE 6770, MAE 6780.
- **Suggested change:** Add MAE 4190, MAE 5190, MAE 5730, MAE 4760, CS 5750, MAE 5780, MAE 6730 and MAE 6800. Remove MAE 4710 (not in the catalog; last offered SP20) and CS 4752 (not in the roster data).

### 6. Specialization Courses – Perception (high, course-list)

- **Catalog:** CS 4670/CS 5670/CS 6670/ECE 5470, CS 6758, MAE 4180/MAE 5180, MAE 4190/MAE 5190, MAE 4320, MAE 4810/MAE 5810, MAE 6760.
- **CoursePlan:** Accepts CS 4670, ECE 5470, MAE 6790, MAE 4180, ECE 4320 (=MAE 4320), MAE 6760.
- **Suggested change:** Add CS 5670, CS 6670, CS 6758, MAE 5180, MAE 4190, MAE 5190, MAE 4810 and MAE 5810. Remove MAE 6790.

### 7. Specialization Courses – Systems and Design (high, course-list)

- **Catalog:** BEE 3900/BEE 5900, CS 4754/INFO 6420, CS 5755/INFO 5755/INFO 6755, DEA 5210, DEA 6210, ECE 4760, ECE 5725, ECE 5960 (Micro and Nano Robotics), ECE 6680, ECE 6950, INFO 4320, INFO 4420, MAE 3780/MAE 3783, MAE 4190/MAE 5190, MAE 4320, MAE 6710, MAE 6800.
- **CoursePlan:** Accepts MAE 3780, ECE 3400, ECE 4320 (=MAE 4320), ECE 4760, INFO 4410 (=CS 4754), INFO 4320, DEA 5210, INFO 4420, ECE 5725, DEA 6210, MAE 6710.
- **Suggested change:** Add BEE 3900, BEE 5900, INFO 6420, CS 5755, INFO 6755, ECE 5960, ECE 6680, ECE 6950, MAE 3783, MAE 4190, MAE 5190 and MAE 6800. Remove ECE 3400.

### 8. Fundamentals / Systems and Design – MAE 3780 restriction (fn1) (medium, rule)

- **Catalog:** ME majors may not count MAE 3780/MAE 3783 if it is used to satisfy the ME circuits requirement.
- **CoursePlan:** The restriction exists only as a code comment (TODO) and is not shown to students.
- **Suggested change:** Mention the restriction in the description of the Fundamentals and Systems and Design requirements, or add a checkerWarning, so ME majors are told about it.

### 9. Specialization Courses – independent research petition (fn2) (low, rule)

- **Catalog:** Students may petition to use one semester of independent research (min 3 credits of CS 4999, ECE 4999, INFO 4900 or MAE 4900) in lieu of one Specialization course.
- **CoursePlan:** Not mentioned anywhere.
- **Suggested change:** Add a note to the Specialization description about the research petition option.

### 10. Overall minor credit minimum (low, count-or-credits)

- **Catalog:** An engineering minor requires six courses totaling at least 18 credits.
- **CoursePlan:** Only course counts are checked; there is no 18-credit minimum.
- **Suggested change:** Mention the 18-credit minimum in a description. Variable-credit options such as ECE 6970 (1-4 cr) could leave the total short.

### 11. Specialization Courses – category name (low, description)

- **Catalog:** Category is named 'Modeling, Dynamics, and Control'.
- **CoursePlan:** Option is named 'Modelling, Dynamics, and Control'.
- **Suggested change:** Rename the option to match the catalog.

### 12. source (low, other)

- **Catalog:** Catalog page: https://catalog.cornell.edu/programs/robotics-minor/
- **CoursePlan:** Source links to an engineering.cornell.edu page.
- **Suggested change:** Point the source fields at the catalog page.

## Could not verify

- ECE 6970 counts in Intelligence only for the 'Bio-Inspired Coordination of Multi-Agent Systems' topic, but the checker accepts any ECE 6970. Whether a student's section qualifies depends on the topic taken; consider a checkerWarning.
- ECE 5960 counts in Systems and Design only for the 'Micro and Nano Robotics' topic. Once added, any ECE 5960 topic would match.
- Whether ECE 6950 (Special Topics) is restricted to particular robotics topics is not stated in the inputs.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
