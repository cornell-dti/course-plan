# Robotics (minor)

- Catalog: https://catalog.cornell.edu/programs/robotics-minor/ (2026-2027 edition)
- Data file: `src/data/minors/robotics.ts`
- Checked on 2026-11-10 by `claude-opus-5-5`
- Verdict: **out-of-date**

The Robotics minor data file is substantially out of date compared with the 2026-2027 catalog. The overall structure matches: 3 Fundamentals courses plus 3 Specialization courses from one category. However, every course list differs. Many catalog courses are rejected, including CS 3700/3780, CS 4756, the MAE 4190 Fast Robots and MAE 4810 Robot Perception courses, MAE 5780, most 5xxx/6xxx alternates, BEE 3900, MAE 6800 and others. Several courses the catalog no longer lists are still accepted, including ECE 3400, CS 4752, CS 4700, CS 4790, MAE 6790 and MAE 4710. The footnoted petition rule, the ME-major restriction on MAE 3780, and the topic-restricted ECE 6970/5960 entries are also not represented.

## Findings

### 1. Fundamentals Courses (high, course-list)

- **Catalog:** Select three from: CS 3700 / CS 3780 / ECE 4200 / ECE 5420; CS 4756 / CS 5756; INFO 4410 / INFO 6420; MAE 3780 / MAE 3783; MAE 4180 / MAE 5180; MAE 4190 / MAE 5190; MAE 4760 / CS 5750; MAE 4810 / MAE 5810; MAE 5780.
- **CoursePlan:** Checker accepts only CS 4750, MAE 4180, CS 4752, MAE 3780, ECE 3400, CS 4700, CS 4754.
- **Suggested change:** Replace the list with: CS 3700, CS 3780, ECE 4200, ECE 5420, CS 4756, CS 5756, INFO 4410, INFO 6420, MAE 3780, MAE 3783, MAE 4180, MAE 5180, MAE 4190, MAE 5190, MAE 4760, CS 5750, MAE 4810, MAE 5810, MAE 5780.

### 2. Fundamentals Courses (high, course-list)

- **Catalog:** ECE 3400, CS 4752 and CS 4700 are not listed as Fundamentals options.
- **CoursePlan:** Checker accepts ECE 3400, CS 4752 and CS 4700.
- **Suggested change:** Remove ECE 3400, CS 4752 and CS 4700. Use CS 3700 instead, unless it is confirmed to be a renumbering or cross-listing of CS 4700.

### 3. Specialization Courses – Intelligence (high, course-list)

- **Catalog:** CS 4756/CS 5756; CS 5780; CS 6756; CS 6758; ECE 6970 (Bio-Inspired Coordination of Multi-Agent Systems topic); MAE 4180/MAE 5180; MAE 4760/CS 5750; MAE 6730/CS 6751; MAE 6710; MAE 6770.
- **CoursePlan:** Checker accepts CS 4790, CS 6751, MAE 6770, MAE 6790, ECE 6970, CS 4700, MAE 4180, MAE 6710.
- **Suggested change:** Remove CS 4790, MAE 6790 and CS 4700. Add CS 4756, CS 5756, CS 5780, CS 6756, CS 6758, MAE 5180, MAE 4760, CS 5750 and MAE 6730.

### 4. Specialization Courses – Modeling, Dynamics, and Control (high, course-list)

- **Catalog:** MAE 4190/MAE 5190; MAE 4730/MAE 5730; MAE 4760/CS 5750; MAE 4780/MAE 5780; MAE 6730/CS 6751; MAE 6760; MAE 6770; MAE 6780; MAE 6800.
- **CoursePlan:** Checker accepts MAE 4730, MAE 4710, MAE 4780, CS 4752, MAE 6760, MAE 6770, MAE 6780.
- **Suggested change:** Remove MAE 4710 and CS 4752. Add MAE 4190, MAE 5190, MAE 5730, MAE 4760, CS 5750, MAE 5780, MAE 6730, CS 6751 and MAE 6800.

### 5. Specialization Courses – Perception (high, course-list)

- **Catalog:** CS 4670/CS 5670/CS 6670/ECE 5470; CS 6758; MAE 4180/MAE 5180; MAE 4190/MAE 5190; MAE 4320; MAE 4810/MAE 5810; MAE 6760.
- **CoursePlan:** Checker accepts CS 4670, ECE 5470, MAE 6790, MAE 4180, ECE 4320, MAE 6760.
- **Suggested change:** Remove MAE 6790. Add CS 5670, CS 6670, CS 6758, MAE 5180, MAE 4190, MAE 5190, MAE 4320, MAE 4810 and MAE 5810. Replace ECE 4320 with MAE 4320 unless they are cross-listed.

### 6. Specialization Courses – Systems and Design (high, course-list)

- **Catalog:** BEE 3900/BEE 5900; CS 4754/INFO 6420; CS 5755/INFO 5755/INFO 6755; DEA 5210; DEA 6210; ECE 4760; ECE 5725; ECE 5960 (Micro and Nano Robotics topic); ECE 6680; ECE 6950; INFO 4320; INFO 4420; MAE 3780/MAE 3783; MAE 4190/MAE 5190; MAE 4320; MAE 6710; MAE 6800.
- **CoursePlan:** Checker accepts MAE 3780, ECE 3400, ECE 4320, ECE 4760, INFO 4410, INFO 4320, DEA 5210, INFO 4420, ECE 5725, DEA 6210, MAE 6710.
- **Suggested change:** Remove ECE 3400. Add BEE 3900, BEE 5900, CS 4754/INFO 6420, CS 5755, INFO 5755, INFO 6755, ECE 5960 (topic-restricted), ECE 6680, ECE 6950, MAE 3783, MAE 4190, MAE 5190, MAE 4320 and MAE 6800.

### 7. Specialization Courses – Intelligence (ECE 6970) (medium, rule)

- **Catalog:** Only ECE 6970 with the topic 'Bio-Inspired Coordination of Multi-Agent Systems' counts.
- **CoursePlan:** Accepts any ECE 6970 with no warning.
- **Suggested change:** Add a checkerWarning stating that only the Bio-Inspired Coordination of Multi-Agent Systems topic counts. Apply the same treatment to ECE 5960 (Micro and Nano Robotics) when adding it to Systems and Design.

### 8. Specialization Courses – independent research petition (medium, missing-requirement)

- **Catalog:** Students may petition to use one semester of independent research in lieu of one Specialization course. This must be at least 3 credits of CS 4999, ECE 4999, INFO 4900 or MAE 4900, with a project description and a faculty advisor note.
- **CoursePlan:** Not represented; independent research courses are rejected and there is no warning.
- **Suggested change:** Add a checkerWarning, and optionally accept these courses with a note that a petition is required and a minimum of 3 credits applies.

### 9. Fundamentals / Systems and Design – MAE 3780 for ME majors (medium, rule)

- **Catalog:** ME majors may not count MAE 3780 / MAE 3783 if it is used to satisfy the ME circuits requirement.
- **CoursePlan:** Only a code comment (TODO) records this; students see no warning. The comment also mentions an ECE 3400 restriction for ECE majors that the catalog no longer has.
- **Suggested change:** Add a checkerWarning about the ME circuits restriction on MAE 3780/MAE 3783. Remove the obsolete ECE 3400 comment.

### 10. Minor total (low, count-or-credits)

- **Catalog:** Six distinct courses totalling at least 18 credits.
- **CoursePlan:** Counts courses only; there is no credit minimum or warning.
- **Suggested change:** Add a description or warning noting the 18-credit minimum for engineering minors.

### 11. Specialization Courses – category name (low, description)

- **Catalog:** 'Modeling, Dynamics, and Control'
- **CoursePlan:** 'Modelling, Dynamics, and Control'
- **Suggested change:** Rename the option to match the catalog spelling.

### 12. Source links (low, description)

- **Catalog:** The catalog page is https://catalog.cornell.edu/programs/robotics-minor/
- **CoursePlan:** Links to an old engineering.cornell.edu page.
- **Suggested change:** Update the source to the catalog URL.

## Could not verify

- Whether CS 4750 is cross-listed with MAE 4760 (Foundations of Robotics). If it is, MAE 4760 is already accepted via CS 4750, but CS 5750 is still missing.
- Whether CS 4754 is cross-listed with INFO 4410 (Re-Designing Robots), which would make INFO 4410 accepted in Fundamentals and CS 4754 accepted in Systems and Design.
- Whether ECE 4320 is cross-listed with MAE 4320 (Integrated Micro Sensors and Actuators).
- Whether CS 6751 is cross-listed with MAE 6730 (Robot Manipulation).
- Whether CS 3700 is a renumbering or cross-listing of CS 4700.
- Whether CoursePlan by default prevents one course from counting toward both Fundamentals and Specialization. The catalog requires six distinct courses, and several courses (e.g. MAE 4180, MAE 3780, MAE 4190) appear in both lists. The RequirementCommon type, including any double-counting flag, is not shown.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
