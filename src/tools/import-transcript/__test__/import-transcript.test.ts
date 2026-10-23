import fs from 'fs';
import path from 'path';
import { importTranscriptLinesForPlan, importTranscriptSummaryMessage } from '../import-transcript';
import type { TranscriptCourseLookup } from '../import-transcript';
import { pageTextItemsToLines } from '../pdf-lines';

const lines = fs
  .readFileSync(path.join(__dirname, 'fixtures/transcript-lines.txt'), 'utf8')
  .split('\n');

const course = (code: string, roster: string, crseId: number) => {
  const [subject, catalogNbr] = code.split(' ');
  return ({ crseId, subject, catalogNbr, roster } as unknown) as CornellCourseRosterCourse;
};
const courses = [
  course('ENGL 1183', 'FA25', 1),
  course('PE 1300', 'FA25', 2),
  course('ENGRG 3400', 'SP26', 3),
  course('MATH 2930', 'SP26', 4),
  course('MATH 2930', 'FA26', 4),
];
const lookup: TranscriptCourseLookup = {
  byCode: code => courses.filter(c => `${c.subject} ${c.catalogNbr}` === code),
  rosters: ['FA25', 'SP26', 'FA26'],
};

const runImport = (existing: readonly FirestoreSemester[] = [], input = lines, college = 'EN') => {
  const result = importTranscriptLinesForPlan(input, existing, lookup, college);
  if (result.status !== 'ok') throw new Error('expected ok');
  return result;
};

it('imports each term once, skipping withdrawn, failed, known and unknown courses', () => {
  const existing = [{ season: 'Fall', year: 2026, courses: [{ code: 'ENGRG 3400', crseId: 3 }] }];
  const { semesters, skipped } = runImport(existing as FirestoreSemester[]);
  expect(
    semesters.map(s => `${s.season} ${s.year}: ${s.courses.map(c => c.course.catalogNbr)}`)
  ).toEqual(['Fall 2025: 1183,1300', 'Spring 2026: 1300', 'Fall 2026: 2930']);
  expect(skipped).toBe(2);
});

it("prefers the term's roster and keeps credits only once earned", () => {
  const { semesters } = runImport();
  expect(semesters[2].courses[1]).toEqual({ course: courses[4], credits: null });
  expect(semesters[0].courses[0].credits).toBe(3);
});

it('maps test credits onto onboarding exams, CASE only behind its flag', () => {
  const { exams, tookSwim } = runImport();
  expect(exams).toEqual([
    { examType: 'AP', subject: 'Chemistry', score: 5 },
    { examType: 'AP', subject: 'English Literature and Composition', score: 5 },
  ]);
  localStorage.setItem('CP_GK-Case', 'true');
  expect(runImport().exams[2]).toEqual({ examType: 'CASE', subject: 'MATH 1910', score: 'Pass' });
  localStorage.clear();
  expect(tookSwim).toBe(true);
  const withCalc = lines.map(line => (line === 'Chemistry' ? 'Mathematics: Calculus BC' : line));
  expect(runImport([], withCalc, 'EN').exams[0].subject).toBe('Mathematics BC (Engineering)');
  expect(runImport([], withCalc, 'AS').exams[0].subject).toBe('Mathematics BC (Non-Engineering)');
});

it('summarizes the import without any undefined for Firestore, and rejects non-transcripts', () => {
  const result = runImport();
  expect(importTranscriptSummaryMessage(result)).toBe(
    'Imported 5 courses and 2 test credits (2 not recognized)'
  );
  expect(importTranscriptLinesForPlan(['hello'], [], lookup).status).toBe('invalid-file');
  expect(JSON.parse(JSON.stringify(result))).toEqual(result);
});

it('groups pdf text into lines by column, dropping the rotated watermark', () => {
  const item = (str: string, x: number, y: number, k = 0) => ({
    str,
    transform: [1, k, 0, 1, x, y],
  });
  const result = pageTextItemsToLines(
    [
      item('UNOFFICIAL TRANSCRIPT', 86, 150, 36),
      item('Advanced Placement', 324, 483),
      item('4.00', 235, 612.7),
      item('2110', 75, 612.7),
      item('ENGRD', 36, 612.7),
      item('CS 1110', 36, 620),
    ],
    612
  );
  expect(result).toEqual(['CS 1110', 'ENGRD 2110 4.00', 'Advanced Placement']);
});
