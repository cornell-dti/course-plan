import rosters from '../../assets/courses/rosters.json';
import { fullCoursesArray } from '../../assets/courses/typed-full-courses';
import { importTranscriptLinesForPlan } from './import-transcript';
import type { ImportTranscriptResult } from './import-transcript';
import { extractPdfLines } from './pdf-lines';

export { importTranscriptSummaryMessage } from './import-transcript';
export type { ImportTranscriptResult } from './import-transcript';

const byCode = (code: string) => {
  const [subject, catalogNbr] = code.split(' ');
  return fullCoursesArray.filter(c => c.subject === subject && c.catalogNbr === catalogNbr);
};

export const importTranscriptForPlan = async (
  pdf: ArrayBuffer,
  existingSemesters: readonly FirestoreSemester[],
  college?: string
): Promise<ImportTranscriptResult> =>
  importTranscriptLinesForPlan(
    await extractPdfLines(pdf),
    existingSemesters,
    { byCode, rosters },
    college
  );
