/**
 * Checks CoursePlan's requirement data against the Cornell catalog using Claude.
 *
 * For each supported program in program-map.json this script:
 *   1. fetches the program's catalog.cornell.edu page and keeps the requirements
 *      table and prose (catalog.ts),
 *   2. finds the program's data file through its registration in src/data/index.ts,
 *   3. asks Claude to compare the two and list every place they disagree,
 *   4. writes the result to comparisons/<slug>.md, records it in
 *      comparisons/index.json and rewrites REQUIREMENTS_REPORT.md.
 *
 * Nothing under src/ is modified: the output is a report for a human to act on.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... npm run program-compare -- biometry-statistics-bs robotics-minor
 *   ANTHROPIC_API_KEY=... npm run program-compare -- --stale 10   # the 10 least recently checked
 *   ANTHROPIC_API_KEY=... npm run program-compare -- --all        # every supported program
 *   npm run program-compare -- --dry-run biometry-statistics-bs   # fetch and resolve only, no API call
 */
import Anthropic from '@anthropic-ai/sdk';
// eslint-disable-next-line import/extensions
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import prettier from 'prettier';
import { fetchCatalogProgram, renderForPrompt } from './catalog';

const AUDIT_DIR = __dirname;
const REPO_ROOT = join(AUDIT_DIR, '..', '..');
const MAP_PATH = join(AUDIT_DIR, 'program-map.json');
const COMPARISONS_DIR = join(AUDIT_DIR, 'comparisons');
const INDEX_PATH = join(COMPARISONS_DIR, 'index.json');
const REPORT_PATH = join(AUDIT_DIR, 'REQUIREMENTS_REPORT.md');
const DATA_INDEX_PATH = join(REPO_ROOT, 'src', 'data', 'index.ts');
const ROSTER_PATH = join(REPO_ROOT, 'src', 'assets', 'courses', 'full-courses.json');

export const MODEL = 'claude-opus-5-5';

type ProgramType = 'major' | 'minor';

type MapEntry = {
  type: ProgramType;
  name: string;
  colleges: string[];
  catalogUrl: string;
  status: string;
  /** "major:CS" / "minor:ROBOTICS" when status is supported */
  courseplan?: string;
};

const SEVERITIES = ['high', 'medium', 'low'] as const;
type Severity = typeof SEVERITIES[number];

const ComparisonSchema = z.object({
  /** One or two sentences a maintainer can read in the report table. */
  summary: z.string(),
  verdict: z.enum(['matches', 'minor-differences', 'out-of-date']),
  findings: z.array(
    z.object({
      severity: z.enum(SEVERITIES),
      kind: z.enum([
        'missing-requirement',
        'extra-requirement',
        'course-list',
        'count-or-credits',
        'rule',
        'description',
        'other',
      ]),
      /** Name of the requirement in the data file, or the catalog heading if it is missing. */
      requirement: z.string(),
      catalogSays: z.string(),
      courseplanSays: z.string(),
      suggestedChange: z.string(),
    })
  ),
  /** Things that could not be judged from the two inputs. */
  cannotVerify: z.array(z.string()),
});
export type Comparison = z.infer<typeof ComparisonSchema>;

type IndexEntry = {
  /** ISO date of the last successful comparison */
  checkedOn?: string;
  catalogEdition?: string;
  verdict?: Comparison['verdict'];
  counts?: { [severity in Severity]: number };
  summary?: string;
  file?: string;
  /** Set when the last attempt failed; cleared on success. */
  error?: string;
};
type ComparisonIndex = { [slug: string]: IndexEntry };

/**
 * Finds the data file registered for a CoursePlan key by reading src/data/index.ts.
 * A key can be registered as both a major and a minor (e.g. CS), so the import path
 * must be under the folder for the requested type.
 */
export function resolveDataFile(type: ProgramType, key: string): string {
  const source = readFileSync(DATA_INDEX_PATH, 'utf8');
  const blockRegex = new RegExp(`\\n\\s+${key}: \\{[\\s\\S]*?requirements: (\\w+),`, 'g');
  let block: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((block = blockRegex.exec(source)) !== null) {
    const importMatch = source.match(
      new RegExp(`import ${block[1]}\\b[^;]*from '\\./(${type}s/[^']+)'`)
    );
    if (importMatch) return join(REPO_ROOT, 'src', 'data', `${importMatch[1]}.ts`);
  }
  throw new Error(`No ${type} data file registered for key ${key} in src/data/index.ts`);
}

/**
 * Whether a map entry is marked supported and its key is registered on this branch.
 * The map can be ahead of src/data/index.ts while a branch that adds programs is unmerged.
 */
export function isComparable(entry: MapEntry): boolean {
  if (entry.status !== 'supported' || !entry.courseplan) return false;
  try {
    resolveDataFile(entry.type, entry.courseplan.split(':')[1]);
    return true;
  } catch {
    return false;
  }
}

type RosterCourse = { subject: string; catalogNbr: string; roster: string };

/**
 * Looks up every course code mentioned in `text` in CoursePlan's roster data and lists the
 * codes it is cross-listed with, so Claude does not have to guess which codes are one course.
 */
export function describeCrossListings(text: string): string {
  const roster: { [crseId: string]: RosterCourse[] } = JSON.parse(
    readFileSync(ROSTER_PATH, 'utf8')
  );
  const byCode = new Map<string, { group: string[]; lastOffered: string }>();
  Object.values(roster).forEach(courses => {
    const group = courses.map(course => `${course.subject} ${course.catalogNbr}`);
    courses.forEach((course, i) => {
      byCode.set(group[i], { group, lastOffered: course.roster });
    });
  });
  const codes = [...new Set(text.match(/\b[A-Z]{2,6} \d{4}\b/g) ?? [])].sort();
  return codes
    .map(code => {
      const hit = byCode.get(code);
      if (!hit) return `${code}: not in the roster data`;
      const others = hit.group.filter(other => other !== code);
      return `${code}: ${
        others.length ? `same course as ${others.join(', ')}` : 'not cross-listed'
      } (last offered ${hit.lastOffered})`;
    })
    .join('\n');
}

export function buildSystemPrompt(): string {
  const read = (path: string) => readFileSync(join(REPO_ROOT, path), 'utf8');
  return [
    "You review requirement data for CoursePlan, Cornell DTI's degree planner. Students rely on",
    'it to see which graduation requirements their planned courses fulfil, so a requirement that',
    'is wrong in the data is a requirement a student may plan around incorrectly.',
    '',
    'Each request gives you three things for one major or minor: the requirements as published',
    'in the Cornell catalog (a parsed course-list table plus the prose and footnotes around it),',
    'the TypeScript data file CoursePlan uses for that program, and a cross-listing table for',
    'every course code that appears in either. Compare the catalog with the data file and report',
    'every place where the data file would tell a student something different from the catalog.',
    '',
    'How to read the data file:',
    '- It exports an array of requirements. Each has a `checker` that decides which courses',
    '  count, and fields such as `perSlotMinCount`, `minNumberOfSlots` and `fulfilledBy` that',
    '  decide how many courses or credits are needed. The type definitions and the checker',
    '  helpers are included below so you can work out exactly what each requirement accepts.',
    '- Courses are matched across cross-listings automatically, so a requirement that lists',
    '  "BTRY 3010" also accepts "STSCI 2200" if the cross-listing table says they are the same',
    '  course. Use the table before calling a code missing or extra: a code is only missing if',
    '  neither it nor any code it is cross-listed with is accepted. The table comes from the',
    '  latest term each course was offered; a code marked "not in the roster data" has not been',
    '  offered since 2017 under that number, so no student can add it.',
    '- Two requirements of the same program cannot both count one course unless one of them',
    '  sets `allowCourseDoubleCounting`.',
    '- A code such as "PHIL 3***" is a wildcard for any course at that level.',
    '- `fulfilledBy: "self-check"` and `checkerWarning` mean the student confirms the',
    '  requirement by hand. That is the expected way to encode rules about grades, GPA,',
    '  petitions and advisor approval, and is not a finding on its own.',
    '',
    'What to report:',
    '- A requirement in the catalog that the file does not have, or one in the file that the',
    '  catalog no longer has.',
    '- A course the catalog accepts that the checker rejects, or one the checker accepts that',
    '  the catalog does not (including courses a wildcard lets in by accident, such as required',
    '  core courses counting again as electives).',
    '- A different number of courses or credits, or a different rule about alternatives,',
    '  double counting, exclusions or minimum credits per course.',
    '- A description shown to students that contradicts the catalog or the checker beside it.',
    '',
    'Severity:',
    '- high: a student following CoursePlan could believe a requirement is met when it is not,',
    '  or could not get a correct course to count without overriding it by hand.',
    '- medium: the result is right for most students but wrong for a real case the catalog',
    '  covers.',
    '- low: wording, an outdated description, or a difference that does not change what counts.',
    '',
    'Work from these inputs only. Quote course codes and numbers exactly as they appear. If the',
    'catalog text is ambiguous, or the answer depends on something the inputs do not show (for',
    'example a rule published on a department page, or which topic of a special-topics course a',
    'student took), put it in `cannotVerify` instead of guessing. An empty `findings` list with the verdict',
    '"matches" is the right answer when the file agrees with the catalog.',
    '',
    '=== src/requirement-types.d.ts ===',
    read('src/requirement-types.d.ts'),
    '',
    '=== src/requirements/types.ts ===',
    read('src/requirements/types.ts'),
    '',
    '=== src/requirements/checkers.ts ===',
    read('src/requirements/checkers.ts'),
  ].join('\n');
}

export function buildUserMessage(
  slug: string,
  entry: MapEntry,
  catalogText: string,
  dataFile: string
): string {
  const data = readFileSync(dataFile, 'utf8');
  return [
    `Program: ${entry.name} (${entry.type})`,
    `Colleges: ${entry.colleges.join(', ')}`,
    `Catalog page: ${entry.catalogUrl}`,
    `Catalog slug: ${slug}`,
    '',
    '=== Catalog requirements ===',
    catalogText,
    '',
    `=== CoursePlan data file: ${relative(REPO_ROOT, dataFile)} ===`,
    data,
    '',
    '=== Cross-listings from the course roster ===',
    describeCrossListings(`${catalogText}\n${data}`),
  ].join('\n');
}

export async function compareProgram(
  client: Anthropic,
  systemPrompt: string,
  userMessage: string
): Promise<Comparison> {
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // If the request is declined, let the API retry it on its default fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'high', format: betaZodOutputFormat(ComparisonSchema) },
    // The system prompt is identical for every program, so later calls read it from cache.
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage }],
  });
  if (response.stop_reason === 'refusal') {
    throw new Error(`Claude declined the request: ${response.stop_details?.explanation ?? ''}`);
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('Claude ran out of output tokens before finishing the comparison');
  }
  if (!response.parsed_output) {
    throw new Error(`Claude returned no parseable output (stop_reason=${response.stop_reason})`);
  }
  return response.parsed_output;
}

const countBySeverity = (comparison: Comparison): { [severity in Severity]: number } => ({
  high: comparison.findings.filter(f => f.severity === 'high').length,
  medium: comparison.findings.filter(f => f.severity === 'medium').length,
  low: comparison.findings.filter(f => f.severity === 'low').length,
});

export function renderComparison(
  slug: string,
  entry: MapEntry,
  dataFile: string,
  comparison: Comparison,
  checkedOn: string,
  edition?: string
): string {
  const findings = [...comparison.findings].sort(
    (a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity)
  );
  return [
    `# ${entry.name} (${entry.type})`,
    '',
    `- Catalog: ${entry.catalogUrl} (${edition ?? 'unknown'} edition)`,
    `- Data file: \`${relative(REPO_ROOT, dataFile)}\``,
    `- Checked on ${checkedOn} by \`${MODEL}\``,
    `- Verdict: **${comparison.verdict}**`,
    '',
    comparison.summary,
    '',
    '## Findings',
    '',
    ...(findings.length
      ? findings.flatMap((finding, i) => [
          `### ${i + 1}. ${finding.requirement} (${finding.severity}, ${finding.kind})`,
          '',
          `- **Catalog:** ${finding.catalogSays}`,
          `- **CoursePlan:** ${finding.courseplanSays}`,
          `- **Suggested change:** ${finding.suggestedChange}`,
          '',
        ])
      : ['None.', '']),
    '## Could not verify',
    '',
    ...(comparison.cannotVerify.length ? comparison.cannotVerify.map(n => `- ${n}`) : ['None.']),
    '',
    '_Generated by `npm run program-compare`. Check each finding against the catalog page before',
    'changing the data file._',
    '',
  ].join('\n');
}

export function renderReport(
  map: { [slug: string]: MapEntry },
  index: ComparisonIndex,
  generatedOn: string
): string {
  const supported = Object.keys(map).filter(slug => isComparable(map[slug]));
  const checked = supported.filter(slug => index[slug]?.checkedOn);
  const failed = supported.filter(slug => index[slug]?.error);
  const score = (slug: string) => {
    const counts = index[slug].counts ?? { high: 0, medium: 0, low: 0 };
    return counts.high * 10000 + counts.medium * 100 + counts.low;
  };
  const rows = [...checked]
    .sort((a, b) => score(b) - score(a) || map[a].name.localeCompare(map[b].name))
    .map(slug => {
      const item = index[slug];
      const counts = item.counts ?? { high: 0, medium: 0, low: 0 };
      return `| [${map[slug].name}](${item.file}) | ${map[slug].type} | ${item.verdict} | ${
        counts.high
      } | ${counts.medium} | ${counts.low} | ${item.checkedOn} | ${(item.summary ?? '').replace(
        /\|/g,
        '\\|'
      )} |`;
    });
  return [
    '# Requirement data compared with the Cornell catalog',
    '',
    `_Generated by \`npm run program-compare\` on ${generatedOn}. Do not edit by hand._`,
    '',
    `Supported programs: ${supported.length} · Checked: ${checked.length} · Never checked: ${
      supported.length - checked.length
    } · Last attempt failed: ${failed.length}`,
    '',
    '| Program | Type | Verdict | High | Medium | Low | Checked | Summary |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    '## Last attempt failed',
    '',
    ...(failed.length
      ? failed.map(slug => `- ${map[slug].name} (\`${slug}\`): ${index[slug].error}`)
      : ['_None._']),
    '',
  ].join('\n');
}

function loadJson<T>(path: string, fallback: T): T {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
}

/** Supported programs ordered so that never-checked and least recently checked come first. */
export function staleFirst(map: { [slug: string]: MapEntry }, index: ComparisonIndex): string[] {
  return Object.keys(map)
    .filter(slug => isComparable(map[slug]))
    .sort(
      (a, b) =>
        (index[a]?.checkedOn ?? '').localeCompare(index[b]?.checkedOn ?? '') || a.localeCompare(b)
    );
}

function parseArgs(argv: string[]): { slugs: string[]; stale?: number; dryRun: boolean } {
  const slugs: string[] = [];
  let stale: number | undefined;
  let dryRun = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') dryRun = true;
    else if (arg === '--all') stale = Infinity;
    else if (arg === '--stale') {
      const raw = argv[(i += 1)];
      stale = Number(raw);
      if (!Number.isInteger(stale) || stale < 1) {
        throw new Error(`--stale must be a positive integer, got "${raw}"`);
      }
    } else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`);
    else slugs.push(arg);
  }
  return { slugs, stale, dryRun };
}

async function formatted(contents: string, filepath: string): Promise<string> {
  const config = (await prettier.resolveConfig(filepath)) ?? {};
  return prettier.format(contents, { ...config, filepath });
}

async function main() {
  const { slugs, stale, dryRun } = parseArgs(process.argv.slice(2));
  const map = loadJson<{ [slug: string]: MapEntry }>(MAP_PATH, {});
  const index = loadJson<ComparisonIndex>(INDEX_PATH, {});
  const selected = slugs.length ? slugs : staleFirst(map, index).slice(0, stale ?? 0);
  if (selected.length === 0) {
    console.log('Nothing to compare. Pass catalog slugs, --stale <count> or --all.');
    return;
  }
  if (!dryRun && !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    throw new Error('ANTHROPIC_API_KEY is not set (use --dry-run to test without calling Claude)');
  }

  const today = new Date().toISOString().slice(0, 10);
  const systemPrompt = buildSystemPrompt();
  const client = dryRun ? undefined : new Anthropic();
  if (!existsSync(COMPARISONS_DIR)) mkdirSync(COMPARISONS_DIR, { recursive: true });

  let succeeded = 0;
  let failed = 0;
  for (const slug of selected) {
    try {
      const entry = map[slug];
      if (!entry) throw new Error('not in program-map.json');
      if (entry.status !== 'supported' || !entry.courseplan) {
        throw new Error(`status is "${entry.status}", only supported programs can be compared`);
      }
      const dataFile = resolveDataFile(entry.type, entry.courseplan.split(':')[1]);
      // Sequential on purpose: one program at a time keeps catalog and API usage predictable.
      // eslint-disable-next-line no-await-in-loop
      const catalog = await fetchCatalogProgram(entry.catalogUrl);
      const userMessage = buildUserMessage(slug, entry, renderForPrompt(catalog), dataFile);
      if (!client) {
        console.log(
          `[dry run] ${slug}: ${relative(REPO_ROOT, dataFile)}, catalog ${catalog.edition}, ` +
            `${catalog.rows.length} table rows, prompt ${
              systemPrompt.length + userMessage.length
            } chars`
        );
        succeeded += 1;
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      const comparison = await compareProgram(client, systemPrompt, userMessage);
      const file = `comparisons/${slug}.md`;
      writeFileSync(
        join(AUDIT_DIR, file),
        // eslint-disable-next-line no-await-in-loop
        await formatted(
          renderComparison(slug, entry, dataFile, comparison, today, catalog.edition),
          join(AUDIT_DIR, file)
        )
      );
      index[slug] = {
        checkedOn: today,
        catalogEdition: catalog.edition,
        verdict: comparison.verdict,
        counts: countBySeverity(comparison),
        summary: comparison.summary,
        file,
      };
      succeeded += 1;
      console.log(
        `Compared ${slug}: ${comparison.verdict}, ${comparison.findings.length} finding(s)`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Keep the last good result; only note that the latest attempt failed.
      if (!dryRun) index[slug] = { ...index[slug], error: message };
      failed += 1;
      console.error(`Failed ${slug}: ${message}`);
    }
  }

  if (!dryRun) {
    const sortedIndex: ComparisonIndex = {};
    Object.keys(index)
      .sort()
      .forEach(slug => {
        sortedIndex[slug] = index[slug];
      });
    writeFileSync(INDEX_PATH, await formatted(JSON.stringify(sortedIndex, null, 2), INDEX_PATH));
    writeFileSync(REPORT_PATH, await formatted(renderReport(map, sortedIndex, today), REPORT_PATH));
  }

  const highCount = selected.reduce((sum, slug) => sum + (index[slug]?.counts?.high ?? 0), 0);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      [`compared=${succeeded}`, `failed=${failed}`, `high_findings=${highCount}`, ''].join('\n')
    );
  }
  console.log(`Done: ${succeeded} compared, ${failed} failed.`);
  // Fail only when nothing worked, so one unreachable catalog page does not hide the rest.
  if (succeeded === 0) process.exitCode = 1;
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
