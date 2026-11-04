import type { GeneratedScheduleOutput } from '../../schedule-generator/algorithm';
import Course from '../../schedule-generator/course-unit';
import Requirement from '../../schedule-generator/requirement';
import {
  generatedScheduleToClassesSchedule,
  generatedScheduleToFirestore,
  savedScheduleToClassesSchedule,
  toScheduleCalendar,
} from '../user-saved-schedules-utils';

const requirement = new Requirement('Intro CS', 'Major', 'CS');
const cs2110 = new Course(
  'CS 2110',
  '#ff0000',
  4,
  [
    { daysOfTheWeek: ['Tuesday', 'Thursday'], start: '10:10 AM', end: '11:25 AM' },
    { daysOfTheWeek: ['Wednesday'], start: '7:30 PM', end: '8:20 PM' },
  ],
  ['2026 Fall'],
  [requirement]
);
const math2940 = new Course(
  'MATH 2940',
  '#00ff00',
  4,
  [{ daysOfTheWeek: ['Monday', 'Wednesday', 'Friday'], start: '9:05 AM', end: '9:55 AM' }],
  ['2026 Fall'],
  [requirement]
);

const output: GeneratedScheduleOutput = {
  semester: '2026 Fall',
  schedule: new Map([
    [cs2110, cs2110.timeslots],
    [math2940, math2940.timeslots],
  ]),
  fulfilledRequirements: new Map(),
  totalCredits: 8,
};

const metadata = { id: 'id1', name: 'My schedule', year: 2026, season: 'Fall' as const };
const titles: Record<string, string> = { 'CS 2110': 'Object-Oriented Programming' };

describe('generatedScheduleToFirestore', () => {
  const saved = generatedScheduleToFirestore(output, metadata, code => titles[code], 1000);

  it('stores metadata, credits, and timestamps', () => {
    expect(saved).toMatchObject({
      ...metadata,
      totalCredits: 8,
      createdAt: 1000,
      updatedAt: 1000,
    });
  });

  it('stores each course with its timeslots and falls back to the code for a missing title', () => {
    expect(saved.courses).toEqual([
      {
        code: 'CS 2110',
        title: 'Object-Oriented Programming',
        credits: 4,
        color: '#ff0000',
        timeslots: cs2110.timeslots,
      },
      {
        code: 'MATH 2940',
        title: 'MATH 2940',
        credits: 4,
        color: '#00ff00',
        timeslots: math2940.timeslots,
      },
    ]);
  });

  it('produces plain JSON with no generator class instances or Maps', () => {
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(Object.getPrototypeOf(saved.courses[0])).toBe(Object.prototype);
  });

  it('does not share timeslot arrays with the generator output', () => {
    expect(saved.courses[0].timeslots[0].daysOfTheWeek).not.toBe(cs2110.timeslots[0].daysOfTheWeek);
  });
});

describe('schedule calendars', () => {
  it('groups timeslots by day', () => {
    const calendar = generatedScheduleToClassesSchedule(output);
    expect(calendar.Wednesday).toEqual([
      {
        title: 'CS 2110',
        name: 'CS 2110',
        color: '#ff0000',
        timeStart: '7:30 PM',
        timeEnd: '8:20 PM',
      },
      {
        title: 'MATH 2940',
        name: 'MATH 2940',
        color: '#00ff00',
        timeStart: '9:05 AM',
        timeEnd: '9:55 AM',
      },
    ]);
    expect(calendar.Tuesday.map(c => c.name)).toEqual(['CS 2110']);
    expect(calendar.Saturday).toEqual([]);
  });

  it('renders a saved schedule the same as the output it was saved from', () => {
    const saved = generatedScheduleToFirestore(output, metadata, code => titles[code], 1000);
    expect(savedScheduleToClassesSchedule(saved)).toEqual(
      generatedScheduleToClassesSchedule(output)
    );
  });

  it('has every day for an empty schedule', () => {
    expect(Object.keys(toScheduleCalendar([]))).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });
});
