/**
 * Fetches a program page from catalog.cornell.edu and extracts just the parts
 * that describe requirements: the CourseLeaf course-list table, parsed into
 * rows, plus the surrounding prose and footnotes. The rest of the page (a
 * sidebar listing every Cornell program, header, footer) is discarded.
 */
import fetch from 'node-fetch';

export type CatalogRow =
  | { kind: 'header'; text: string; hours?: string }
  | { kind: 'course'; code: string; title: string; hours?: string; indent: boolean; or: boolean }
  | { kind: 'text'; text: string; hours?: string; indent: boolean }
  | { kind: 'total'; text: string; hours?: string };

export type CatalogProgram = {
  readonly url: string;
  /** Parsed rows of the course-list table(s), in page order */
  readonly rows: readonly CatalogRow[];
  /** Prose around the table with tables replaced by "[TABLE]" */
  readonly prose: string;
  /** Catalog edition, e.g. "2026-2027" */
  readonly edition?: string;
};

export const decodeHtml = (s: string): string =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#39;|&rsquo;|&lsquo;|&#8217;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;|&mdash;/g, '-')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\u200b/g, '');

const stripTags = (html: string): string =>
  decodeHtml(html.replace(/<sup>\s*(\d+)\s*<\/sup>/g, ' [fn$1]').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

const COURSE_CODE = /^[A-Z]{2,6}\s+\d{4}$/;

/** Course codes on the catalog are written "PMA 3750"; normalize spacing. */
const normalizeCode = (code: string): string => code.replace(/\s+/g, ' ').trim();

export function parseCourseList(tableHtml: string): CatalogRow[] {
  const rows: CatalogRow[] = [];
  const trRegex = /<tr(?:\s+class="([^"]*)")?[^>]*>([\s\S]*?)<\/tr>/g;
  let tr: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((tr = trRegex.exec(tableHtml)) !== null) {
    const cls = tr[1] ?? '';
    const body = tr[2];
    const cells = [...body.matchAll(/<td(?:\s+class="([^"]*)")?[^>]*>([\s\S]*?)<\/td>/g)].map(
      m => ({
        cls: m[1] ?? '',
        text: stripTags(m[2]),
      })
    );
    if (cls.includes('noscript') || cls.includes('hidden') || cells.length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const hours = cells.find(c => c.cls.includes('hourscol'))?.text || undefined;
    const indent = cells.some(c => c.cls.includes('blockindent')) || /\bindent\b/.test(cls);
    const firstText = cells[0].text.replace(/^or\s+/i, '').trim();
    if (cls.includes('areaheader')) {
      rows.push({ kind: 'header', text: cells[0].text, hours });
    } else if (cls.includes('listsum')) {
      rows.push({ kind: 'total', text: cells[0].text, hours });
    } else if (
      cells.length >= 2 &&
      (cells[0].cls.includes('codecol') || COURSE_CODE.test(firstText))
    ) {
      rows.push({
        kind: 'course',
        code: normalizeCode(firstText),
        title: cells[1].text,
        hours,
        indent,
        or: cls.includes('orclass') || /^or\s/i.test(cells[0].text),
      });
    } else {
      rows.push({ kind: 'text', text: cells[0].text, hours, indent });
    }
  }
  return rows;
}

/** Rows of a free-form table, one text row per <tr> with cells joined by " | ". */
export function parseFreeformTable(tableHtml: string): CatalogRow[] {
  const rows: CatalogRow[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let tr: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((tr = trRegex.exec(tableHtml)) !== null) {
    const cells = [...tr[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
      .map(m => stripTags(m[1]))
      .filter(Boolean);
    if (cells.length) rows.push({ kind: 'text', text: cells.join(' | '), indent: false });
  }
  return rows;
}

export function parseCatalogPage(url: string, html: string): CatalogProgram {
  const editionMatch = html.match(/(\d{4}-\d{4})\s*Edition/);
  const idIndex = html.indexOf('id="curriculumtextcontainer"');
  if (idIndex === -1) {
    throw new Error(`No curriculum section found on ${url}; catalog layout may have changed`);
  }
  // Start at the opening tag so the attribute fragment does not leak into the prose.
  const start = html.lastIndexOf('<', idIndex);
  // The container ends where the next tab panel or the page footer begins.
  const tail = html.slice(start);
  const endCandidates = [
    tail.indexOf('class="page_content tab_content"', 100),
    tail.indexOf('<footer'),
  ].filter(i => i > 0);
  const section = tail.slice(0, endCandidates.length ? Math.min(...endCandidates) : undefined);

  const rows: CatalogRow[] = [];
  // CourseLeaf uses `sc_courselist` for standard course lists. Some pages (AAP
  // programs, for example) use free-form `sc_sctable` tables and `sc_plangrid`
  // semester grids instead; those rows are emitted as text with codes inline.
  const tableRegex = /<table[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/table>/g;
  let table: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((table = tableRegex.exec(section)) !== null) {
    const [, classes, body] = table;
    if (classes.includes('sc_courselist')) rows.push(...parseCourseList(body));
    else if (classes.includes('sc_sctable') || classes.includes('sc_plangrid')) {
      rows.push({ kind: 'header', text: `[table ${classes.trim()}]` });
      rows.push(...parseFreeformTable(body));
    }
  }

  const prose = stripTags(
    section
      .replace(/<table[\s\S]*?<\/table>/g, ' [TABLE] ')
      .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
  );

  if (rows.length === 0 && prose.length < 200) {
    throw new Error(`Curriculum section on ${url} is empty`);
  }
  return { url, rows, prose, edition: editionMatch?.[1] };
}

export async function fetchCatalogProgram(url: string): Promise<CatalogProgram> {
  const response = await fetch(url, {
    // catalog.cornell.edu returns an empty body without a browser-like UA.
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  const html = await response.text();
  // The catalog answers automated clients it distrusts with HTTP 202 and an empty page.
  if (response.status === 202 || html.trim().length === 0) {
    throw new Error(`${url} returned an empty page (HTTP ${response.status}); try again later`);
  }
  return parseCatalogPage(url, html);
}

/** Renders the parsed catalog as the text block handed to Claude. */
export function renderForPrompt(program: CatalogProgram): string {
  const rowLines = program.rows.map(row => {
    const hours = row.hours ? `  [${row.hours} cr]` : '';
    switch (row.kind) {
      case 'header':
        return `## ${row.text}${hours}`;
      case 'total':
        return `-- ${row.text}${hours}`;
      case 'course':
        return `${row.indent ? '    ' : ''}${row.or ? 'OR ' : '- '}${row.code}: ${
          row.title
        }${hours}`;
      default:
        return `${row.indent ? '    ' : ''}* ${row.text}${hours}`;
    }
  });
  return [
    `Catalog edition: ${program.edition ?? 'unknown'}`,
    '',
    '=== Course list table (parsed) ===',
    ...rowLines,
    '',
    '=== Prose and footnotes ===',
    program.prose,
  ].join('\n');
}

if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('usage: catalog.ts <catalog url>');
    process.exit(1);
  }
  fetchCatalogProgram(url).then(program => console.log(renderForPrompt(program)));
}
