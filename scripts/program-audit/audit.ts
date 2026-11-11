/**
 * Program audit: compares Cornell's official list of undergraduate majors and
 * minors against the programs CoursePlan supports (src/data/index.ts).
 *
 * State lives in scripts/program-audit/program-map.json, keyed by Cornell
 * catalog slug. Each entry is one of:
 *   - supported: mapped to a CoursePlan key, e.g. "major:CS"
 *   - missing:   Cornell offers it, CoursePlan does not (yet)
 *   - ignored:   deliberately not supported (keep a reason)
 *   - retired:   was in the map but no longer appears on Cornell's page
 *
 * Running the script:
 *   npm run program-audit
 * Outputs:
 *   - updates program-map.json (new slugs are auto-matched by name, else "missing")
 *   - rewrites MISSING_PROGRAMS.md
 *   - prints a JSON summary; in GitHub Actions also writes `new_programs`,
 *     `new_count` and `missing_count` to $GITHUB_OUTPUT
 */
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import prettier from 'prettier';
import requirementJson from '../../src/data/index';
import { CornellProgram, fetchCornellPrograms, ProgramType } from './fetch-cornell-programs';

const AUDIT_DIR = join(__dirname);
const MAP_PATH = join(AUDIT_DIR, 'program-map.json');
const REPORT_PATH = join(AUDIT_DIR, 'MISSING_PROGRAMS.md');

type MapEntry = {
  type: ProgramType;
  name: string;
  colleges: string[];
  catalogUrl: string;
  status: 'supported' | 'missing' | 'ignored' | 'retired';
  /** "major:CS" / "minor:ROBOTICS" when status is supported */
  courseplan?: string;
  /** ISO date the program was first seen as missing */
  firstSeen?: string;
  /** Why it is ignored */
  reason?: string;
};
type ProgramMap = { [slug: string]: MapEntry };

/**
 * Names on Cornell's page that differ from CoursePlan's `name` fields. Only
 * used when seeding a slug that is not yet in program-map.json; after that the
 * map is the source of truth and can be edited by hand.
 */
const NAME_ALIASES: { [cornellName: string]: string } = {
  Mathematics: 'Math',
  'Materials Science and Engineering': 'Materials Science & Engineering',
  'Science and Technology Studies': 'Science & Technology Studies',
  'Information Science, Systems, and Technology':
    'Information Science, Systems, and Technology [Fall 2020 and after]',
  'Operations Research and Information Engineering': 'Operations Research and Engineering',
  'Policy Analysis and Management': 'Policy Analysis and Management',
  'Atmospheric Science': 'Atmospheric Science',
  'Dyson Business Minor for Engineers': 'Dyson Business Minor for Engineers',
};

/**
 * Programs whose Cornell name differs too much from CoursePlan's to auto-match.
 * Keyed by Cornell catalog slug (the stable identifier). Applied when seeding.
 */
const SLUG_OVERRIDES: { [slug: string]: string } = {
  'atmospheric-science-bs': 'major:AS',
  'chemical-engineering-bs': 'major:CHEME',
  'earth-climate-sciences-ba': 'major:EAS',
  'earth-climate-sciences-ecsag-bs': 'major:EAS',
  'earth-climate-sciences-ecsen-bs': 'major:EAS',
  'earth-atmospheric-sciences-minor': 'minor:EAS',
  'fashion-design-management-bs': 'major:FSAD',
  'public-policy-bs': 'major:PAM',
  'science-technology-studies-ba': 'major:STS',
  'dyson-business-minor-engineers': 'minor:DBME',
  'urban-regional-studies-bs-urs': 'major:CRP',
};

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function courseplanIndex(): Map<string, string> {
  const index = new Map<string, string>();
  const add = (type: ProgramType, entries: { [key: string]: { name: string } }) => {
    Object.entries(entries).forEach(([key, { name }]) => {
      const normalized = normalize(name);
      // Prefer the newest variant when the same name is registered twice
      // (e.g. ISST1 "[before Fall 2020]" and ISST2 "[Fall 2020 and after]").
      if (!index.has(`${type}:${normalized}`) || key.endsWith('2')) {
        index.set(`${type}:${normalized}`, `${type}:${key}`);
      }
    });
  };
  add('major', requirementJson.major);
  add('minor', requirementJson.minor);
  return index;
}

function autoMatch(program: CornellProgram, index: Map<string, string>): string | undefined {
  if (SLUG_OVERRIDES[program.slug]) return SLUG_OVERRIDES[program.slug];
  const candidates = [program.name, NAME_ALIASES[program.name]].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const hit = index.get(`${program.type}:${normalize(candidate)}`);
    if (hit) return hit;
  }
  return undefined;
}

function loadMap(): ProgramMap {
  if (!existsSync(MAP_PATH)) return {};
  return JSON.parse(readFileSync(MAP_PATH, 'utf8'));
}

function sortedMap(map: ProgramMap): ProgramMap {
  const out: ProgramMap = {};
  Object.keys(map)
    .sort()
    .forEach(slug => {
      out[slug] = map[slug];
    });
  return out;
}

function renderReport(map: ProgramMap, generatedOn: string): string {
  const section = (type: ProgramType, title: string) => {
    const rows = Object.entries(map)
      .filter(([, e]) => e.type === type && e.status === 'missing')
      .sort(([, a], [, b]) => a.name.localeCompare(b.name));
    const lines = [
      `## ${title} (${rows.length})`,
      '',
      '| Program | College(s) | Catalog | First seen |',
      '| --- | --- | --- | --- |',
      ...rows.map(
        ([slug, e]) =>
          `| ${e.name} | ${e.colleges.join(', ')} | [${slug}](${e.catalogUrl}) | ${
            e.firstSeen ?? ''
          } |`
      ),
    ];
    return lines.join('\n');
  };
  const ignored = Object.entries(map).filter(([, e]) => e.status === 'ignored');
  const supported = Object.values(map).filter(e => e.status === 'supported').length;
  return [
    '# Cornell programs not yet in CoursePlan',
    '',
    `_Generated by \`npm run program-audit\` on ${generatedOn} from https://www.cornell.edu/academics/fields.cfm. Do not edit by hand; edit \`program-map.json\` instead._`,
    '',
    `Supported: ${supported} · Missing: ${
      Object.values(map).filter(e => e.status === 'missing').length
    } · Ignored: ${ignored.length}`,
    '',
    section('major', 'Missing majors'),
    '',
    section('minor', 'Missing minors'),
    '',
    '## Ignored',
    '',
    ...(ignored.length
      ? ignored.map(
          ([slug, e]) => `- ${e.name} (${e.type}, \`${slug}\`): ${e.reason ?? 'no reason given'}`
        )
      : ['_None._']),
    '',
  ].join('\n');
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const index = courseplanIndex();
  const programs = await fetchCornellPrograms();
  const map = loadMap();
  const seen = new Set<string>();
  const newlyMissing: CornellProgram[] = [];

  for (const program of programs) {
    seen.add(program.slug);
    const existing = map[program.slug];
    if (existing) {
      // Refresh descriptive fields; keep status decisions made by humans.
      existing.name = program.name;
      existing.colleges = [...program.colleges];
      existing.catalogUrl = program.catalogUrl;
      if (existing.status === 'retired') {
        // Came back after disappearing: restore the human decision if there was one.
        if (existing.courseplan) existing.status = 'supported';
        else if (existing.reason) existing.status = 'ignored';
        else {
          existing.status = 'missing';
          existing.firstSeen = today;
          newlyMissing.push(program);
        }
      }
      if (existing.status === 'missing') {
        const match = autoMatch(program, index);
        if (match) {
          existing.status = 'supported';
          existing.courseplan = match;
          delete existing.firstSeen;
        }
      }
      // eslint-disable-next-line no-continue
      continue;
    }
    const match = autoMatch(program, index);
    map[program.slug] = {
      type: program.type,
      name: program.name,
      colleges: [...program.colleges],
      catalogUrl: program.catalogUrl,
      status: match ? 'supported' : 'missing',
      ...(match ? { courseplan: match } : { firstSeen: today }),
    };
    if (!match) newlyMissing.push(program);
  }

  Object.entries(map).forEach(([slug, entry]) => {
    if (!seen.has(slug) && entry.status !== 'retired') entry.status = 'retired';
  });

  const finalMap = sortedMap(map);
  const formatted = async (contents: string, filepath: string): Promise<string> => {
    const config = (await prettier.resolveConfig(filepath)) ?? {};
    return prettier.format(contents, { ...config, filepath });
  };
  writeFileSync(MAP_PATH, await formatted(JSON.stringify(finalMap, null, 2), MAP_PATH));
  writeFileSync(REPORT_PATH, await formatted(renderReport(finalMap, today), REPORT_PATH));

  const missingCount = Object.values(finalMap).filter(e => e.status === 'missing').length;
  // CoursePlan programs no Cornell slug points at: either Cornell renamed them (add a
  // SLUG_OVERRIDES entry) or CoursePlan has something Cornell no longer lists.
  const mapped = new Set(Object.values(finalMap).map(e => e.courseplan));
  const unmappedCourseplanKeys = [...index.values()].filter(key => !mapped.has(key)).sort();
  const summary = {
    cornellMajors: programs.filter(p => p.type === 'major').length,
    cornellMinors: programs.filter(p => p.type === 'minor').length,
    supported: Object.values(finalMap).filter(e => e.status === 'supported').length,
    missing: missingCount,
    newlyMissing: newlyMissing.map(p => ({ slug: p.slug, type: p.type, name: p.name })),
    unmappedCourseplanKeys,
  };
  console.log(JSON.stringify(summary, null, 2));

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `new_programs=${JSON.stringify(summary.newlyMissing)}`,
        `new_count=${summary.newlyMissing.length}`,
        `missing_count=${missingCount}`,
        '',
      ].join('\n')
    );
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
