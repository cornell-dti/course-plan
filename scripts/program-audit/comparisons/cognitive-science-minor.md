# Cognitive Science (minor)

- Catalog: https://catalog.cornell.edu/programs/cognitive-science-minor/ (2026-2027 edition)
- Data file: `src/data/minors/cogsci.ts`
- Checked on 2026-11-13 by `claude-opus-5-5`
- Verdict: **out-of-date**

The CoursePlan file for the Cognitive Science minor does not match the 2026-2027 catalog. The intro requirement accepts COGST 2200 (HD 2200) where the catalog names COGST 2350, so COGST 2350 cannot count. The file asks for three upper-level courses where the catalog requires four. The upper-level checker only accepts COGST-coded courses, so most of the catalog's non-COGST sample courses are rejected. It also adds a required Lab Requirement that the catalog describes only as encouraged. The two-department rule and the 15-credit minimum are not encoded.

## Findings

### 1. Introductory Requirement (high, course-list)

- **Catalog:** Students take COGST 1101 or COGST 2350 as their introductory course requirement.
- **CoursePlan:** Checker accepts 'COGST 1101' and 'COGST 2200', with the description 'Choose COGST 1101 or COGST 2200'. COGST 2200 is cross-listed with HD 2200 (The Human Brain and Mind), not with COGST 2350. COGST 2350 and its cross-listings HD 2310 and PSYCH 2300 are rejected.
- **Suggested change:** Replace 'COGST 2200' with 'COGST 2350' in the checker and the description.

### 2. Three Courses at the 3000 or 4000 Level (high, count-or-credits)

- **Catalog:** A minimum of four courses at the 3000- and 4000-level in at least two departments (or certain suitable 1- 2000-level courses by petition). Five courses are required in total: the intro course plus four upper-level courses.
- **CoursePlan:** perSlotMinCount [3]. The description says 'Three courses at the 3000- and 4000-level ... (or certain suitable 2000- level courses by petition)'.
- **Suggested change:** Change perSlotMinCount to [4]. Update the name and description to say four courses, and note that suitable 1000-2000-level courses may count by petition.

### 3. Three Courses at the 3000 or 4000 Level (high, course-list)

- **Catalog:** The upper-level courses may come from any department, in at least two departments, chosen with the advisor. Sample track courses include CS 4110, HD 4240, LING 3303, LING 4403, LING 4421, PSYCH 3800, CS 3700, CS 4701 and PSYCH 3220.
- **CoursePlan:** Checker is includesWithSingleRequirement('COGST 3**_', 'COGST 4_**'). It only accepts courses with a COGST code or a COGST cross-listing, so CS 4110, HD 4240, LING 3303, LING 4403, LING 4421, PSYCH 3800, CS 3700/CS 4700, CS 4701 and PSYCH 3220/BIONB 3220/HD 3220 are all rejected.
- **Suggested change:** Accept any 3000- or 4000-level course from relevant departments, for example by adding the sample track courses or broad wildcards such as PSYCH 3**_/4_**, LING 3**_/4_**, CS 3**_/4_**, HD 3**_/4_** and BIONB 3**_/4_**. Add a checkerWarning that the courses must form a coherent program approved by the advisor.

### 4. Three Courses at the 3000 or 4000 Level (medium, rule)

- **Catalog:** The upper-level courses must come from at least two departments.
- **CoursePlan:** No two-department rule is encoded. Because the checker only accepts COGST codes, the rule cannot be evaluated at all.
- **Suggested change:** Add a checkerWarning telling students to confirm the courses span at least two departments.

### 5. Lab Requirement (medium, extra-requirement)

- **Catalog:** The catalog requires only the intro course and four upper-level courses (five courses in total). An independent research project (e.g., COGST 4700) and a research workshop (COGST 4710) are described as 'encouraged'. The prose refers to 'the lab requirement' but never defines one as required.
- **CoursePlan:** A separate required 'Lab Requirement' needs COGST 4700 or COGST 4710.
- **Suggested change:** Remove the Lab Requirement, or if the department confirms it is required, document where that comes from. COGST 4700 and COGST 4710 should be able to count toward the upper-level courses.

### 6. Minimum Credits for Minor (medium, count-or-credits)

- **Catalog:** Minimum Credits for Minor: 15.
- **CoursePlan:** No credit minimum is encoded. Variable-credit courses such as COGST 4700 or COGST 4710 (1-4 cr) and CS 4701 (2 cr) could leave a student under 15 credits while CoursePlan shows the minor as complete.
- **Suggested change:** Add a 15-credit requirement or a self-check/checkerWarning for the minimum credits.

## Could not verify

- Whether the department currently requires a lab requirement (COGST 4700/4710). The catalog prose mentions 'the lab requirement' without defining one, and the data file's source is the department page, which was not provided.
- Which 1000-2000-level courses would be approved by petition for the upper-level requirement.
- Whether the Independent Study track's custom course collections, approved by the curriculum committee, should be represented in the data.
- Whether 6000-level courses such as LING 6422, listed as a track sample, may count toward the 3000/4000-level requirement.

_Generated by `npm run program-compare`. Check each finding against the catalog page before
changing the data file._
