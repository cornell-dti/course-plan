import { isPlaceholderCourse } from '../../utilities';
import { parseTranscriptLines } from './transcript-parser';
import transcriptTestCreditsToExams from './transcript-exams';

export type TranscriptCourseLookup = {
  readonly byCode: (code: string) => readonly CornellCourseRosterCourse[];
  readonly rosters: readonly string[];
};

export type ImportTranscriptResult =
  | { readonly status: 'invalid-file' }
  | {
      readonly status: 'ok';
      readonly semesters: readonly {
        readonly season: FirestoreSemesterSeason;
        readonly year: number;
        readonly courses: readonly {
          readonly course: CornellCourseRosterCourse;
          readonly credits: number | null;
        }[];
      }[];
      readonly exams: readonly FirestoreTransferExam[];
      readonly tookSwim: boolean;
      readonly skipped: number;
    };

const matchCourse = (code: string, roster: string, { byCode, rosters }: TranscriptCourseLookup) =>
  byCode(code).reduce<CornellCourseRosterCourse | null>((best, c) => {
    if (best == null || c.roster === roster) return c;
    if (best.roster === roster) return best;
    return rosters.indexOf(c.roster) > rosters.indexOf(best.roster) ? c : best;
  }, null);

export const importTranscriptLinesForPlan = (
  lines: readonly string[],
  existingSemesters: readonly FirestoreSemester[],
  lookup: TranscriptCourseLookup,
  college?: string
): ImportTranscriptResult => {
  const parsed = parseTranscriptLines(lines);
  if (parsed == null) return { status: 'invalid-file' };

  let skipped = 0;
  const semesters = parsed.terms
    .map(({ season, year, courses }) => {
      const existing = (
        existingSemesters.find(s => s.season === season && s.year === year)?.courses ?? []
      ).filter((c): c is FirestoreSemesterCourse => !isPlaceholderCourse(c));
      const imported: { course: CornellCourseRosterCourse; credits: number | null }[] = [];
      const roster = `${season.slice(0, 2).toUpperCase()}${year - 2000}`;
      courses.forEach(({ code, credits }) => {
        const course = matchCourse(code, roster, lookup);
        if (course == null) skipped += 1;
        else if (
          !existing.some(c => c.code === code || c.crseId === course.crseId) &&
          !imported.some(entry => entry.course.crseId === course.crseId)
        ) {
          imported.push({ course, credits: credits > 0 ? credits : null });
        }
      });
      return { season, year, courses: imported };
    })
    .filter(semester => semester.courses.length > 0);
  const { exams, skipped: skippedExams } = transcriptTestCreditsToExams(
    parsed.testCredits,
    college
  );
  const { tookSwim } = parsed;
  return { status: 'ok', semesters, exams, tookSwim, skipped: skipped + skippedExams };
};

const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`;

export const importTranscriptSummaryMessage = (
  result: Extract<ImportTranscriptResult, { status: 'ok' }>
): string => {
  const courses = result.semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const note = result.skipped > 0 ? ` (${result.skipped} not recognized)` : '';
  return `Imported ${count(courses, 'course')} and ${count(
    result.exams.length,
    'test credit'
  )}${note}`;
};
