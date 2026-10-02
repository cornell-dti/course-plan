import fs from 'fs';
import path from 'path';
import { importIcsTextForSemester } from '../import-ics';
import type { IcsCourseLookup, ImportIcsResult } from '../import-ics';

const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/2026FA_Schedule1.ics'), 'utf8');

const course = (subject: string, catalogNbr: string, crseId: number, roster = 'FA26') =>
  (({ crseId, subject, catalogNbr, roster } as unknown) as CornellCourseRosterCourse);

const allCourses = [
  course('MATH', '2930', 352295),
  course('CS', '3780', 358592),
  course('CS', '4820', 358595),
  course('ENGRG', '3400', 367080),
  course('COGST', '1500', 353568),
  course('DEA', '1500', 353568),
  course('PSYCH', '1500', 353568),
  course('CS', '4787', 370109),
];

const lookup: IcsCourseLookup = {
  byCrseId: crseId => allCourses.filter(c => c.crseId === crseId),
  rosterRank: roster => ['SP26', 'FA26'].indexOf(roster),
};

const runImport = (
  targetRoster: string,
  existing: readonly FirestoreSemesterCourse[] = [],
  text = fixture
): Extract<ImportIcsResult, { status: 'ok' }> => {
  const result = importIcsTextForSemester(text, targetRoster, existing, lookup);
  if (result.status !== 'ok') throw new Error('expected ok');
  return result;
};

it('imports every course in the fixture with its meetings', () => {
  const result = runImport('FA26');
  expect(result.matched).toHaveLength(6);
  const math = result.matched.find(entry => entry.course.subject === 'MATH');
  expect(math?.schedule.meetings.map(m => m.component)).toEqual(['LEC', 'DIS']);
  expect(math?.schedule.meetings[0]).toEqual({
    component: 'LEC',
    section: '002',
    location: 'Olin Hall 155',
    daysOfTheWeek: ['Monday', 'Wednesday', 'Friday'],
    start: '12:20pm',
    end: '1:10pm',
    startDate: '2026-08-24',
    endDate: '2026-12-07',
  });
});

it('picks the cross-listing named in the calendar, not just the shared crseId', () => {
  const codes = runImport('FA26').matched.map(e => `${e.course.subject} ${e.course.catalogNbr}`);
  expect(codes).toContain('DEA 1500');
  expect(codes).not.toContain('COGST 1500');
});

it('keeps times but drops dates when imported into the same season of another year', () => {
  const result = runImport('FA27');
  expect(result.matched).toHaveLength(6);
  result.matched.forEach(({ schedule }) =>
    schedule.meetings.forEach(meeting => expect(meeting.startDate).toBeNull())
  );
});

it('skips courses already in the semester, including under a cross-listed code', () => {
  const existing = [
    { code: 'MATH 2930', crseId: 352295 },
    { code: 'PSYCH 1500', crseId: 353568 },
  ] as FirestoreSemesterCourse[];
  const result = runImport('FA26', existing);
  expect(result.matched).toHaveLength(4);
  expect(result.skipped).toBe(2);
});

it('blocks importing into a different season', () => {
  expect(importIcsTextForSemester(fixture, 'SP27', [], lookup).status).toBe('wrong-season');
  expect(importIcsTextForSemester(fixture, 'SP26', [], lookup).status).toBe('wrong-season');
});

it('produces no undefined anywhere, so Firestore will accept the write', () => {
  const { matched } = runImport('FA26');
  expect(JSON.parse(JSON.stringify(matched))).toEqual(matched);
});
