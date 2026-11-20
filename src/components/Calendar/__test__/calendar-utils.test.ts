import {
  CalendarEvent,
  formatMeeting,
  layoutDay,
  parseRosterPattern,
  parseRosterTime,
  sectionsByComponent,
  selectedSections,
  visibleHours,
} from '../calendar-utils';

describe('parseRosterTime', () => {
  it('parses morning, noon, afternoon and midnight times', () => {
    expect(parseRosterTime('10:10AM')).toBe(610);
    expect(parseRosterTime('12:20PM')).toBe(740);
    expect(parseRosterTime('1:25PM')).toBe(805);
    expect(parseRosterTime('12:05AM')).toBe(5);
  });

  it('rejects missing or malformed values', () => {
    expect(parseRosterTime(undefined)).toBeNull();
    expect(parseRosterTime('')).toBeNull();
    expect(parseRosterTime('TBA')).toBeNull();
    expect(parseRosterTime('13:00PM')).toBeNull();
  });
});

describe('parseRosterPattern', () => {
  it('parses weekday patterns', () => {
    expect(parseRosterPattern('MWF')).toEqual(['M', 'W', 'F']);
    expect(parseRosterPattern('TR')).toEqual(['T', 'R']);
  });

  it('tells Saturday from Sunday', () => {
    expect(parseRosterPattern('SSu')).toEqual(['S', 'Su']);
    expect(parseRosterPattern('Su')).toEqual(['Su']);
  });

  it('returns no days for TBA or missing patterns', () => {
    expect(parseRosterPattern('TBA')).toEqual([]);
    expect(parseRosterPattern(undefined)).toEqual([]);
    expect(parseRosterPattern('')).toEqual([]);
  });
});

const rosterCourse = {
  enrollGroups: [
    {
      classSections: [
        {
          ssrComponent: 'LEC',
          section: '001',
          meetings: [{ pattern: 'MWF', timeStart: '10:10AM', timeEnd: '11:00AM' }],
        },
        {
          ssrComponent: 'DIS',
          section: '201',
          meetings: [{ pattern: 'T', timeStart: '9:05AM', timeEnd: '9:55AM' }],
        },
        {
          ssrComponent: 'DIS',
          section: '202',
          meetings: [{ pattern: 'R', timeStart: '2:55PM', timeEnd: '3:45PM' }],
        },
        {
          ssrComponent: 'IND',
          section: '601',
          meetings: [{ pattern: '', timeStart: '', timeEnd: '' }],
        },
      ],
    },
    // a second enroll group repeating LEC 001 should not list it twice
    {
      classSections: [
        {
          ssrComponent: 'LEC',
          section: '001',
          meetings: [{ pattern: 'MWF', timeStart: '10:10AM', timeEnd: '11:00AM' }],
        },
      ],
    },
  ],
};

describe('sectionsByComponent', () => {
  it('groups sections by component in roster order without duplicates', () => {
    const options = sectionsByComponent(rosterCourse);
    expect(options.map(o => o.component)).toEqual(['LEC', 'DIS', 'IND']);
    expect(options[0].sections.map(s => s.section)).toEqual(['001']);
    expect(options[1].sections.map(s => s.section)).toEqual(['201', '202']);
  });

  it('drops meetings without days or times', () => {
    const options = sectionsByComponent(rosterCourse);
    expect(options[2].sections[0].meetings).toEqual([]);
    expect(options[0].sections[0].meetings).toEqual([
      { days: ['M', 'W', 'F'], start: 610, end: 660 },
    ]);
  });

  it('handles courses with no enroll groups', () => {
    expect(sectionsByComponent({})).toEqual([]);
  });
});

describe('selectedSections', () => {
  const options = sectionsByComponent(rosterCourse);

  it('defaults to the first section of every component', () => {
    expect(selectedSections(options, undefined).map(s => `${s.component} ${s.section}`)).toEqual([
      'LEC 001',
      'DIS 201',
      'IND 601',
    ]);
  });

  it('uses a saved choice, and falls back when it no longer exists', () => {
    expect(
      selectedSections(options, { DIS: '202', LEC: '999' }).map(s => `${s.component} ${s.section}`)
    ).toEqual(['LEC 001', 'DIS 202', 'IND 601']);
  });
});

describe('formatMeeting', () => {
  it('shares am/pm when both ends match and keeps both when they differ', () => {
    expect(formatMeeting({ days: ['M', 'W', 'F'], start: 610, end: 660 })).toBe(
      'MWF 10:10–11:00am'
    );
    expect(formatMeeting({ days: ['T', 'R'], start: 700, end: 775 })).toBe('TR 11:40am–12:55pm');
  });
});

const event = (key: string, courseUniqueID: number, start: number, end: number): CalendarEvent => ({
  key,
  courseUniqueID,
  code: key,
  component: 'LEC',
  section: '001',
  color: '000000',
  day: 'M',
  start,
  end,
});

describe('layoutDay', () => {
  it('gives non-overlapping events a single column', () => {
    const laid = layoutDay([event('b', 2, 700, 760), event('a', 1, 600, 650)]);
    expect(laid.map(e => [e.key, e.column, e.columns, e.conflict])).toEqual([
      ['a', 0, 1, false],
      ['b', 0, 1, false],
    ]);
  });

  it('puts overlapping events side by side and flags the conflict', () => {
    const laid = layoutDay([
      event('a', 1, 600, 660),
      event('b', 2, 630, 700),
      event('c', 3, 700, 750),
    ]);
    expect(laid.map(e => [e.key, e.column, e.columns, e.conflict])).toEqual([
      ['a', 0, 2, true],
      ['b', 1, 2, true],
      ['c', 0, 1, false],
    ]);
  });

  it('reuses a column once it frees up', () => {
    const laid = layoutDay([
      event('a', 1, 600, 720),
      event('b', 2, 610, 640),
      event('c', 3, 650, 700),
    ]);
    expect(laid.map(e => [e.key, e.column])).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 1],
    ]);
    expect(laid.every(e => e.columns === 2)).toBe(true);
  });

  it('does not call two blocks of the same course a conflict', () => {
    const laid = layoutDay([event('a', 1, 600, 660), event('b', 1, 630, 700)]);
    expect(laid.every(e => !e.conflict)).toBe(true);
  });
});

describe('visibleHours', () => {
  it('defaults to 8am–5pm and widens to fit early and late classes', () => {
    expect(visibleHours([])).toEqual({ startHour: 8, endHour: 17 });
    expect(
      visibleHours([event('a', 1, 7 * 60 + 30, 9 * 60), event('b', 2, 19 * 60, 20 * 60 + 15)])
    ).toEqual({ startHour: 7, endHour: 21 });
  });
});

describe('layoutDay with a friend', () => {
  it('does not flag overlaps with a friend’s class as conflicts', () => {
    const laid = layoutDay([
      event('a', 1, 600, 660),
      { ...event('b', -1, 630, 700), friendName: 'J' },
    ]);
    expect(laid.map(e => [e.key, e.columns, e.conflict])).toEqual([
      ['a', 2, false],
      ['b', 2, false],
    ]);
  });
});
