import {
  getPreEnrollBanner,
  getPreEnrollDismissalKey,
  PreEnrollReminderStage,
} from '../pre-enroll';

const student = {
  entranceYear: '2026',
  entranceSem: 'Fall',
  gradYear: '2030',
  gradSem: 'Spring',
  dismissedPreEnrollBanner: {},
};

describe('pre-enroll reminder windows', () => {
  it.each<[string, PreEnrollReminderStage | null]>([
    ['2026-11-03T12:00:00-05:00', null],
    ['2026-11-04T12:00:00-05:00', '14d'],
    ['2026-11-10T12:00:00-05:00', '14d'],
    ['2026-11-11T12:00:00-05:00', '7d'],
    ['2026-11-14T12:00:00-05:00', '7d'],
    ['2026-11-15T12:00:00-05:00', '3d'],
    ['2026-11-16T12:00:00-05:00', '3d'],
    ['2026-11-17T12:00:00-05:00', '1d'],
    ['2026-11-18T00:00:00-05:00', 'today'],
    ['2026-11-18T07:30:00-05:00', 'today'],
    ['2026-11-20T23:59:59-05:00', 'today'],
    ['2026-11-21T00:00:00-05:00', null],
  ])('selects the current reminder at %s', (date, stage) => {
    const reminder = getPreEnrollBanner(student, new Date(date));

    expect(reminder?.reminderStage ?? null).toBe(stage);
    if (stage) expect(reminder?.dismissalKey).toBe(`SP27_${stage}`);
  });

  it('advances windows at New York midnight instead of UTC midnight', () => {
    expect(getPreEnrollBanner(student, new Date('2026-11-10T23:59:59-05:00'))?.reminderStage).toBe(
      '14d'
    );
    expect(getPreEnrollBanner(student, new Date('2026-11-11T00:00:00-05:00'))?.reminderStage).toBe(
      '7d'
    );
  });

  it("uses each student's window and counts calendar days across daylight saving", () => {
    const senior = { ...student, entranceYear: '2023', gradYear: '2027' };
    const reminder = getPreEnrollBanner(senior, new Date('2026-10-28T12:00:00-04:00'));

    expect(reminder?.daysRemaining).toBe(14);
    expect(reminder?.reminderStage).toBe('14d');
    expect(reminder?.group).toBe('senior');
  });

  it('does not mark reminders dismissed just because they were displayed', () => {
    const dismissedPreEnrollBanner = Object.freeze({});
    const profile = { ...student, dismissedPreEnrollBanner };

    expect(getPreEnrollBanner(profile, new Date('2026-11-13T12:00:00-05:00'))).not.toBeNull();
    expect(dismissedPreEnrollBanner).toEqual({});
  });

  it('keeps the active window dismissed without falling back to older reminders', () => {
    const profile = {
      ...student,
      dismissedPreEnrollBanner: { SP27_7d: true },
    };

    expect(getPreEnrollBanner(profile, new Date('2026-11-13T12:00:00-05:00'))).toBeNull();
    expect(getPreEnrollBanner(profile, new Date('2026-11-15T12:00:00-05:00'))?.dismissalKey).toBe(
      'SP27_3d'
    );
  });

  it.each<[string, PreEnrollReminderStage, PreEnrollReminderStage[]]>([
    ['2026-11-11T12:00:00-05:00', '7d', ['14d']],
    ['2026-11-15T12:00:00-05:00', '3d', ['14d', '7d']],
    ['2026-11-17T12:00:00-05:00', '1d', ['14d', '7d', '3d']],
    ['2026-11-18T00:00:00-05:00', 'today', ['14d', '7d', '3d', '1d']],
  ])('shows the next reminder at %s despite earlier dismissals', (date, stage, earlier) => {
    const dismissedPreEnrollBanner: Record<string, boolean> = {};
    earlier.forEach(value => {
      dismissedPreEnrollBanner[`SP27_${value}`] = true;
    });

    expect(
      getPreEnrollBanner({ ...student, dismissedPreEnrollBanner }, new Date(date))?.reminderStage
    ).toBe(stage);
  });

  it('keeps the day-of reminder dismissed through the open enrollment window', () => {
    expect(
      getPreEnrollBanner(
        { ...student, dismissedPreEnrollBanner: { SP27_today: true } },
        new Date('2026-11-19T12:00:00-05:00')
      )
    ).toBeNull();
  });

  it('does not let legacy or other-semester entries hide new reminder keys', () => {
    const profile = {
      ...student,
      dismissedPreEnrollBanner: { SP27: true, FA26_7d: true, SP27_7d: false },
    };

    expect(getPreEnrollBanner(profile, new Date('2026-11-13T12:00:00-05:00'))?.dismissalKey).toBe(
      'SP27_7d'
    );
  });

  it('hides reminders for incomplete profiles and graduate programs', () => {
    const now = new Date('2026-11-13T12:00:00-05:00');
    expect(getPreEnrollBanner({ ...student, gradYear: '' }, now)).toBeNull();
    expect(getPreEnrollBanner({ ...student, grad: 'MENG-CS' }, now)).toBeNull();
  });

  it('validates dismissal keys before they can become nested Firestore paths', () => {
    expect(getPreEnrollDismissalKey('FA27', '14d')).toBe('FA27_14d');
    expect(() => getPreEnrollDismissalKey('SP27.other', '7d')).toThrow('Invalid enrollment term');
    expect(() => getPreEnrollDismissalKey('SP27', 'other' as PreEnrollReminderStage)).toThrow(
      'Invalid enrollment reminder'
    );
  });
});
