export type TranscriptTerm = {
  readonly season: FirestoreSemesterSeason;
  readonly year: number;
  readonly courses: { readonly code: string; readonly credits: number }[];
};

export type TranscriptTestCredit = {
  readonly examType: TransferExamType;
  readonly subject: string;
  readonly score: number;
  readonly code: string | null;
};

const EXAM_TYPES: Readonly<Record<string, TransferExamType>> = {
  'Advanced Placement': 'AP',
  'International Baccalaureate': 'IB',
  'Cornell Advanced Standing Exam': 'CASE',
};

const TERM_PATTERN = /^(FALL|SPRING|SUMMER|WINTER) (\d{4})$/;
const COURSE_PATTERN = /^([A-Z][A-Z&]{1,7} \d{4}[A-Z]?) .+? (\d+\.\d{2})(?: (\S+))?$/;
const CODE_PATTERN = /^[A-Z][A-Z&]{1,7} \d{4}[A-Z]?\b/;
const EXAM_PATTERN = new RegExp(`^(${Object.keys(EXAM_TYPES).join('|')})\\b`);
const SCORE_PATTERN = /\((\d+(?:\.\d+)?)\)/;
const PAGE_HEADER = /^(T H I S D O C U M E N T|Cornell University$|Student (Name|ID):)/;

const readTestBlock = (
  examType: TransferExamType,
  lines: string[]
): TranscriptTestCredit | null => {
  const transferredAt = lines.findIndex(line => line.startsWith('Transferred to Term'));
  if (transferredAt < 0) return null;
  const subject = lines.slice(0, transferredAt).join(' ').replace(SCORE_PATTERN, '');
  const score = lines.join(' ').match(SCORE_PATTERN);
  const code = lines.slice(transferredAt + 1).find(line => CODE_PATTERN.test(line));
  return {
    examType,
    subject: subject.replace(/\s+/g, ' ').trim(),
    score: score ? parseFloat(score[1]) : 0,
    code: code?.match(CODE_PATTERN)?.[0] ?? null,
  };
};

export const parseTranscriptLines = (rawLines: readonly string[]) => {
  const lines = rawLines.map(line => line.replace(/\s+/g, ' ').trim()).filter(line => line);
  if (!lines.some(line => /Cornell University|UNOFFICIAL TRANSCRIPT/i.test(line))) return null;

  const terms: TranscriptTerm[] = [];
  let current: TranscriptTerm | undefined;
  const blocks: { examType: TransferExamType; lines: string[] }[] = [];
  let section: 'record' | 'tests' | 'milestones' = 'record';
  let milestone = '';
  let tookSwim = false;

  lines.forEach(line => {
    if (PAGE_HEADER.test(line)) return;
    const term = line.match(TERM_PATTERN);
    const exam = line.match(EXAM_PATTERN);
    if (term) {
      const season = (term[1][0] + term[1].slice(1).toLowerCase()) as FirestoreSemesterSeason;
      const year = parseInt(term[2], 10);
      current = terms.find(t => t.season === season && t.year === year);
      if (current == null) {
        current = { season, year, courses: [] };
        terms.push(current);
      }
      section = 'record';
    } else if (/Non-Course Milestones/.test(line)) section = 'milestones';
    else if (/Test Credits Detailed/.test(line)) section = 'tests';
    else if (section === 'record') {
      const course = line.match(COURSE_PATTERN);
      if (course == null || current == null || ['W', 'F', 'U'].includes(course[3])) return;
      current.courses.push({ code: course[1], credits: parseFloat(course[2]) });
    } else if (section === 'milestones') {
      if (/^Milestone Status: ?Completed/.test(line) && milestone === 'Swim Test') tookSwim = true;
      else if (!line.includes(':')) milestone = line;
    } else if (exam) {
      blocks.push({ examType: EXAM_TYPES[exam[1]], lines: [line.slice(exam[0].length)] });
    } else if (blocks.length > 0) blocks[blocks.length - 1].lines.push(line);
  });

  if (terms.length === 0 && blocks.length === 0) return null;
  const testCredits = blocks
    .map(({ examType, lines: blockLines }) => readTestBlock(examType, blockLines))
    .filter((credit): credit is TranscriptTestCredit => credit != null);
  return { terms, testCredits, tookSwim };
};
