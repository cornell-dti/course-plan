/**
 * Fetches the official list of Cornell undergraduate majors and minors from
 * https://www.cornell.edu/academics/fields.cfm and parses it into structured data.
 *
 * The page is a single HTML table. Each program row looks like:
 *   <a aria-describedby="majors" href="https://catalog.cornell.edu/programs/<slug>/">Name (BA)</a>
 *   ...followed by one or more <a href="https://catalog.cornell.edu/<college>/">College Name</a>
 *
 * This parser is deliberately dependency-free (regex over HTML) so it has no
 * runtime cost and no API key requirement. If Cornell changes the page layout,
 * `fetchCornellPrograms` throws so the workflow fails loudly instead of
 * silently reporting "nothing new".
 */
import fetch from 'node-fetch';

export const CORNELL_FIELDS_URL = 'https://www.cornell.edu/academics/fields.cfm';

export type ProgramType = 'major' | 'minor';

export type CornellProgram = {
  /** 'major' | 'minor' */
  readonly type: ProgramType;
  /** Program name with the degree suffix removed, e.g. "Computer Science" */
  readonly name: string;
  /** Degree label from the page, e.g. "BA", "BS", "BA/BS", "Minor" */
  readonly degree: string;
  /** Catalog slug, e.g. "computer-science-ba". Stable identifier for the program. */
  readonly slug: string;
  /** Catalog page with the program's requirements */
  readonly catalogUrl: string;
  /** Colleges that offer the program, as listed on the page */
  readonly colleges: readonly string[];
};

const decodeEntities = (s: string): string =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const ROW_REGEX = /<tr[\s\S]*?<\/tr>/g;
// Attribute order and extra attributes on the anchor are tolerated.
const PROGRAM_LINK_REGEX = /<a\b(?=[^>]*aria-describedby="(majors|minors)")[^>]*href="(https:\/\/catalog\.cornell\.edu\/programs\/([^/"]+)\/?)"[^>]*>([\s\S]*?)<\/a>/;
const COLLEGE_LINK_REGEX = /<a\b[^>]*href="https:\/\/catalog\.cornell\.edu\/[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
const DEGREE_SUFFIX_REGEX = /\s*\(([^()]*)\)\s*$/;

export function parseCornellFieldsPage(html: string): CornellProgram[] {
  const programs: CornellProgram[] = [];
  const rows = html.match(ROW_REGEX) ?? [];
  for (const row of rows) {
    const match = row.match(PROGRAM_LINK_REGEX);
    // eslint-disable-next-line no-continue
    if (!match) continue;
    const [, kind, catalogUrl, slug, rawLabel] = match;
    const label = decodeEntities(rawLabel.replace(/<[^>]*>/g, ''));
    const degreeMatch = label.match(DEGREE_SUFFIX_REGEX);
    const degree = degreeMatch ? degreeMatch[1].trim() : '';
    const name = label.replace(DEGREE_SUFFIX_REGEX, '').trim();

    const colleges: string[] = [];
    const rest = row.slice(row.indexOf(match[0]) + match[0].length);
    let collegeMatch: RegExpExecArray | null;
    COLLEGE_LINK_REGEX.lastIndex = 0;
    // eslint-disable-next-line no-cond-assign
    while ((collegeMatch = COLLEGE_LINK_REGEX.exec(rest)) !== null) {
      const college = decodeEntities(collegeMatch[1].replace(/<[^>]*>/g, ''));
      if (college) colleges.push(college);
    }

    programs.push({
      type: kind === 'majors' ? 'major' : 'minor',
      name,
      degree,
      slug,
      catalogUrl,
      colleges,
    });
  }

  const majors = programs.filter(p => p.type === 'major').length;
  const minors = programs.filter(p => p.type === 'minor').length;
  if (majors < 50 || minors < 50) {
    throw new Error(
      `Parsed only ${majors} majors and ${minors} minors from ${CORNELL_FIELDS_URL}. ` +
        'The page layout has probably changed; update parseCornellFieldsPage.'
    );
  }
  return programs;
}

export async function fetchCornellPrograms(): Promise<CornellProgram[]> {
  const response = await fetch(CORNELL_FIELDS_URL, {
    headers: { 'User-Agent': 'cornell-dti-courseplan-program-audit' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${CORNELL_FIELDS_URL}: HTTP ${response.status}`);
  }
  return parseCornellFieldsPage(await response.text());
}

if (require.main === module) {
  fetchCornellPrograms().then(programs => {
    console.log(JSON.stringify(programs, null, 2));
  });
}
