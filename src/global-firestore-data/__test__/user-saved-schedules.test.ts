/**
 * Tests the Firestore side of saved schedules against a small in-memory fake of the
 * `firebase/firestore` functions it uses.
 */
import type { GeneratedScheduleOutput } from '../../schedule-generator/algorithm';
import Course from '../../schedule-generator/course-unit';
import {
  deleteSchedule,
  getFriendNames,
  getFriendSchedules,
  renameSchedule,
  saveSchedule,
} from '../user-saved-schedules';

type FakeRef = { readonly path: string };

const mockDocs = new Map<string, Record<string, unknown>>();
const mockCurrentUser = { email: '' };

const mockSnapshot = (ref: FakeRef) => ({
  exists: () => mockDocs.has(ref.path),
  data: () => mockDocs.get(ref.path),
});

jest.mock('firebase/firestore', () => ({
  doc: (collection: string, id: string) => ({ path: `${collection}/${id}` }),
  getDoc: async (ref: FakeRef) => mockSnapshot(ref),
  runTransaction: async (_db: unknown, fn: (t: unknown) => Promise<unknown>) => {
    const writes: [FakeRef, Record<string, unknown>][] = [];
    const result = await fn({
      get: async (ref: FakeRef) => mockSnapshot(ref),
      set: (ref: FakeRef, data: Record<string, unknown>) => writes.push([ref, data]),
    });
    writes.forEach(([ref, data]) => mockDocs.set(ref.path, data));
    return result;
  },
}));

jest.mock('../../firebase-config', () => ({
  db: {},
  savedSchedulesCollection: 'user-saved-schedules',
  usernameCollection: 'user-name',
}));

jest.mock('../../store', () => ({
  __esModule: true,
  default: {
    state: {
      get currentFirebaseUser() {
        return mockCurrentUser;
      },
    },
  },
}));

const alice = 'abc123@cornell.edu';
const bob = 'xy45@cornell.edu';

const course = new Course('CS 2110', '#ff0000', 4, [
  { daysOfTheWeek: ['Monday'], start: '10:10 AM', end: '11:00 AM' },
]);
const output: GeneratedScheduleOutput = {
  semester: '2026 Fall',
  schedule: new Map([[course, course.timeslots]]),
  fulfilledRequirements: new Map(),
  totalCredits: 4,
};

const save = (name: string) =>
  saveSchedule({ name, year: 2026, season: 'Fall', output, titleByCode: () => 'OOP' });
const schedulesOf = (email: string) =>
  (mockDocs.get(`user-saved-schedules/${email}`)?.schedules ?? []) as FirestoreSavedSchedule[];

beforeEach(() => {
  mockDocs.clear();
  mockCurrentUser.email = alice;
});

describe('saveSchedule', () => {
  it('creates the doc on first save and appends after', async () => {
    const first = await save('A');
    const second = await save('B');
    expect(first).not.toEqual(second);
    expect(schedulesOf(alice).map(s => [s.id, s.name])).toEqual([
      [first, 'A'],
      [second, 'B'],
    ]);
    expect(schedulesOf(alice)[0]).toMatchObject({
      year: 2026,
      season: 'Fall',
      totalCredits: 4,
      courses: [{ code: 'CS 2110', title: 'OOP', credits: 4 }],
    });
  });

  it("writes only to the current user's doc", async () => {
    await save('A');
    expect(Array.from(mockDocs.keys())).toEqual([`user-saved-schedules/${alice}`]);
  });
});

describe('renameSchedule and deleteSchedule', () => {
  it('renames only the matching schedule and bumps updatedAt', async () => {
    const first = await save('A');
    const second = await save('B');
    const before = schedulesOf(alice)[0].updatedAt;
    jest.spyOn(Date, 'now').mockReturnValueOnce(before + 1);
    await renameSchedule(first, 'Renamed');
    expect(schedulesOf(alice).map(s => [s.id, s.name])).toEqual([
      [first, 'Renamed'],
      [second, 'B'],
    ]);
    expect(schedulesOf(alice)[0].updatedAt).toBe(before + 1);
    expect(schedulesOf(alice)[1].updatedAt).toBe(schedulesOf(alice)[1].createdAt);
  });

  it('deletes only the matching schedule', async () => {
    const first = await save('A');
    const second = await save('B');
    await deleteSchedule(first);
    expect(schedulesOf(alice).map(s => s.id)).toEqual([second]);
  });

  it('ignores unknown ids', async () => {
    await save('A');
    await renameSchedule('missing', 'X');
    await deleteSchedule('missing');
    expect(schedulesOf(alice).map(s => s.name)).toEqual(['A']);
  });
});

describe('friend reads', () => {
  it("returns a friend's schedules, or [] when they have none", async () => {
    mockCurrentUser.email = bob;
    await save('Bob schedule');
    mockCurrentUser.email = alice;
    expect((await getFriendSchedules(bob)).map(s => s.name)).toEqual(['Bob schedule']);
    expect(await getFriendSchedules('none1@cornell.edu')).toEqual([]);
  });

  it('returns names keyed by email and skips friends without a name doc', async () => {
    mockDocs.set(`user-name/${bob}`, { firstName: 'Bob', lastName: 'B' });
    expect(await getFriendNames([bob, 'none1@cornell.edu'])).toEqual({
      [bob]: { firstName: 'Bob', lastName: 'B' },
    });
  });
});
