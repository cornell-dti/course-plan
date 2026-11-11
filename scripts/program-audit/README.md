# Program audit

Two checks that keep CoursePlan's majors and minors in line with Cornell:

- **Which programs exist.** `npm run program-audit` compares Cornell's official list at
  https://www.cornell.edu/academics/fields.cfm with the programs registered in `src/data/index.ts`.
- **Whether their requirements are still right.** `npm run program-compare` asks Claude to compare
  a supported program's data file with its catalog.cornell.edu page and list every difference.

Neither changes anything under `src/`. Both produce reports for a person to act on.

## Files

| File                        | Purpose                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fetch-cornell-programs.ts` | Parses Cornell's page into `{type, name, degree, slug, catalogUrl, colleges}`. No API key needed.                                                                              |
| `audit.ts`                  | Diffs Cornell's list against `src/data/index.ts`, updates `program-map.json`, rewrites `MISSING_PROGRAMS.md`.                                                                  |
| `catalog.ts`                | Downloads a catalog program page and keeps the requirements table and the prose around it.                                                                                     |
| `compare.ts`                | Sends the catalog requirements and the program's data file to Claude (`claude-opus-5-5`) and writes the differences it reports. Needs `ANTHROPIC_API_KEY`.                     |
| `program-map.json`          | Source of truth. One entry per Cornell catalog slug with `status`: `supported`, `missing`, `ignored`, or `retired`. Edit by hand to mark programs ignored or to fix a mapping. |
| `MISSING_PROGRAMS.md`       | Generated list of programs Cornell offers and CoursePlan lacks. Do not edit by hand.                                                                                           |
| `REQUIREMENTS_REPORT.md`    | Generated summary of every comparison, worst first. Do not edit by hand.                                                                                                       |
| `comparisons/`              | One generated file per compared program, plus `index.json`, which records when each was last checked.                                                                          |

## Commands

```bash
npm run program-audit                                    # refresh program-map.json and MISSING_PROGRAMS.md
npm run program-compare -- computer-science-bs           # compare one program (or several slugs)
npm run program-compare -- --stale 10                    # compare the 10 least recently checked programs
npm run program-compare -- --dry-run robotics-minor      # fetch and resolve only; no API key or API call
npm run ts-node -- scripts/program-audit/catalog.ts https://catalog.cornell.edu/programs/theatre-minor/   # see what Claude sees
```

## How a comparison is produced

1. `catalog.ts` downloads the program page and keeps only the curriculum section: the course-list
   table parsed into header / course / or / text rows, plus the prose and footnotes.
2. `compare.ts` finds the program's data file through its registration in `src/data/index.ts`.
3. Claude receives the catalog text, the data file, a cross-listing table for every course code
   in either, and the requirement type definitions and `checkers.ts` so it can work out what each
   checker accepts. It returns a verdict (`matches`,
   `minor-differences` or `out-of-date`) and a list of findings, each with a severity, what the
   catalog says, what CoursePlan says and a suggested change.
4. The result is written to `comparisons/<slug>.md` and summarised in `REQUIREMENTS_REPORT.md`.

A program is only compared if it is `supported` in `program-map.json` and its key is registered in
`src/data/index.ts` on the current branch.

## Reading the results

The findings are Claude's reading of the catalog. Check each one against the catalog page before
editing a data file. Three limits to keep in mind:

- Claude is told which course codes are cross-listed, using the roster data in the repo. Courses
  matched only by a wildcard or a custom checker function are not expanded, so it reasons about
  those from the code alone.
- Some departments publish rules on their own site that are newer or more detailed than the
  catalog. The comparison only uses the catalog.
- College requirements (`src/data/colleges/`) are not compared, only majors and minors.

## How the GitHub Action works

`.github/workflows/audit-requirements.yml` runs on the 1st of every month and on demand (Actions
tab, "Compare Requirements with Cornell Catalog", Run workflow).

1. It refreshes `program-map.json` with `program-audit`.
2. It compares the 10 least recently checked programs (change `count` when running by hand, or
   give specific `slugs`). Programs never checked go first, so repeated runs work through the
   whole list and then start again with the oldest.
3. It opens a PR on branch `program-audit/requirements` containing the report. If that branch
   already exists from an earlier run, its results are restored first so the next run continues
   where the last one stopped.

If the catalog cannot be reached for a program, or Claude's reply cannot be used, that program is
listed under "Last attempt failed" in the report and its previous result is kept. The run fails
only if no program could be compared.

## Setup needed once

Add an `ANTHROPIC_API_KEY` secret to the repository (Settings, Secrets and variables, Actions).
Without it the workflow fails at the comparison step.
