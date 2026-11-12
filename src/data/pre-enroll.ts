export type EnrollmentGroup = 'senior' | 'junior' | 'sophomore' | 'freshman';

export const ENROLLMENT_GROUPS: readonly EnrollmentGroup[] = [
  'senior',
  'junior',
  'sophomore',
  'freshman',
];

export interface EnrollmentWindow {
  readonly label: string;
  readonly graduationAcademicYear: number;
  readonly start: string;
  readonly endExclusive: string;
}

export interface EnrollmentSchedule {
  readonly label: string;
  readonly year: number;
  readonly season: 'Spring' | 'Fall';
  readonly timezone: string;
  readonly showFrom: string;
  readonly windows: Readonly<Record<EnrollmentGroup, EnrollmentWindow>>;
}

export const preEnrollDates: Readonly<Partial<Record<string, EnrollmentSchedule>>> = {
  SP27: {
    label: 'Spring 2027',
    year: 2027,
    season: 'Spring',
    timezone: 'America/New_York',

    // When the countdown starts appearing. Here I set it from Oct 1st
    showFrom: '2026-10-01T00:00:00-04:00',

    windows: {
      senior: {
        label: 'Seniors',
        graduationAcademicYear: 2027,
        start: '2026-11-11T07:30:00-05:00',
        endExclusive: '2026-11-14T00:00:00-05:00',
      },
      junior: {
        label: 'Juniors',
        graduationAcademicYear: 2028,
        start: '2026-11-16T07:30:00-05:00',
        endExclusive: '2026-11-19T00:00:00-05:00',
      },
      sophomore: {
        label: 'Sophomores',
        graduationAcademicYear: 2029,
        start: '2026-11-17T07:30:00-05:00',
        endExclusive: '2026-11-20T00:00:00-05:00',
      },
      freshman: {
        label: 'First-Years',
        graduationAcademicYear: 2030,
        start: '2026-11-18T07:30:00-05:00',
        endExclusive: '2026-11-21T00:00:00-05:00',
      },
    },
  },
};
