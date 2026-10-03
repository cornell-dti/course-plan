/**
 * Tests the Firestore side of the friends feature against a small in-memory fake of the
 * `firebase/firestore` functions it uses.
 */
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from '../user-friends';

type FakeRef = { readonly path: string };
type Write = {
  readonly ref: FakeRef;
  readonly data: Record<string, unknown>;
  readonly merge: boolean;
};

const mockDocs = new Map<string, Record<string, unknown>>();
const mockCurrentUser = { email: '' };
const mockDeleteSentinel = { delete: true };

const mergeInto = (target: Record<string, unknown>, data: Record<string, unknown>) => {
  const result = { ...target };
  Object.entries(data).forEach(([key, value]) => {
    if (value === mockDeleteSentinel) {
      delete result[key];
    } else if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = mergeInto((result[key] as Record<string, unknown>) ?? {}, value as never);
    } else {
      result[key] = value;
    }
  });
  return result;
};

const mockApplyWrites = (writes: readonly Write[]) =>
  writes.forEach(({ ref, data, merge }) => {
    mockDocs.set(ref.path, merge ? mergeInto(mockDocs.get(ref.path) ?? {}, data) : { ...data });
  });

jest.mock('firebase/firestore', () => ({
  doc: (collection: string, id: string) => ({ path: `${collection}/${id}` }),
  deleteField: () => mockDeleteSentinel,
  runTransaction: async (_db: unknown, fn: (t: unknown) => Promise<unknown>) => {
    const writes: Write[] = [];
    const transaction = {
      get: async (ref: FakeRef) => ({
        exists: () => mockDocs.has(ref.path),
        data: () => mockDocs.get(ref.path),
      }),
      set: (ref: FakeRef, data: Record<string, unknown>, options?: { merge?: boolean }) => {
        writes.push({ ref, data, merge: options?.merge ?? false });
      },
      update: (ref: FakeRef, data: Record<string, unknown>) => {
        if (!mockDocs.has(ref.path)) throw new Error(`update of missing doc ${ref.path}`);
        writes.push({ ref, data, merge: true });
      },
    };
    const result = await fn(transaction);
    // Writes land only after the transaction body finishes, as in Firestore.
    mockApplyWrites(writes);
    return result;
  },
  writeBatch: () => {
    const writes: Write[] = [];
    return {
      set: (ref: FakeRef, data: Record<string, unknown>, options?: { merge?: boolean }) => {
        writes.push({ ref, data, merge: options?.merge ?? false });
      },
      commit: async () => mockApplyWrites(writes),
    };
  },
}));

jest.mock('../../firebase-config', () => ({
  db: {},
  friendRequestsCollection: 'friend-requests',
  userFriendsCollection: 'user-friends',
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

const actAs = (email: string) => {
  mockCurrentUser.email = email;
};
const requestDoc = (sender: string, receiver: string) =>
  mockDocs.get(`friend-requests/${sender}_${receiver}`);
const friendsOf = (email: string) =>
  (mockDocs.get(`user-friends/${email}`)?.friends ?? {}) as Record<string, unknown>;

beforeEach(() => {
  mockDocs.clear();
  mockDocs.set(`user-name/${alice}`, { firstName: 'Alice', lastName: 'A' });
  mockDocs.set(`user-name/${bob}`, { firstName: 'Bob', lastName: 'B' });
  actAs(alice);
});

describe('sendFriendRequest', () => {
  it('creates a pending request keyed by sender and receiver', async () => {
    expect(await sendFriendRequest('XY45')).toEqual({ ok: true, outcome: 'sent' });
    expect(requestDoc(alice, bob)).toMatchObject({
      senderEmail: alice,
      receiverEmail: bob,
      status: 'pending',
      respondedAt: null,
    });
  });

  it('rejects an invalid NetID without touching Firestore', async () => {
    expect(await sendFriendRequest('not a netid')).toEqual({ ok: false, error: 'invalid-netid' });
    expect(mockDocs.size).toBe(2);
  });

  it('rejects a NetID with no CoursePlan account', async () => {
    expect(await sendFriendRequest('zz999')).toEqual({ ok: false, error: 'user-not-found' });
  });

  it('rejects sending a request to yourself', async () => {
    expect(await sendFriendRequest('abc123')).toEqual({ ok: false, error: 'self-request' });
  });

  it('rejects a duplicate request', async () => {
    await sendFriendRequest('xy45');
    expect(await sendFriendRequest('xy45')).toEqual({
      ok: false,
      error: 'request-already-sent',
    });
  });

  it('auto-accepts when the other user already sent a request', async () => {
    actAs(bob);
    await sendFriendRequest('abc123');
    actAs(alice);

    expect(await sendFriendRequest('xy45')).toEqual({ ok: true, outcome: 'accepted' });
    expect(requestDoc(bob, alice)?.status).toBe('accepted');
    expect(requestDoc(alice, bob)).toBeUndefined();
    expect(Object.keys(friendsOf(alice))).toEqual([bob]);
    expect(Object.keys(friendsOf(bob))).toEqual([alice]);
  });

  it('rejects a request to an existing friend', async () => {
    await sendFriendRequest('xy45');
    actAs(bob);
    await acceptFriendRequest(alice);
    actAs(alice);
    expect(await sendFriendRequest('xy45')).toEqual({ ok: false, error: 'already-friends' });
  });
});

describe('responding to requests', () => {
  beforeEach(async () => {
    await sendFriendRequest('xy45');
  });

  it('accepting makes both users friends', async () => {
    actAs(bob);
    expect(await acceptFriendRequest(alice)).toEqual({ ok: true, outcome: 'accepted' });
    expect(requestDoc(alice, bob)?.status).toBe('accepted');
    expect(friendsOf(alice)[bob]).toBeDefined();
    expect(friendsOf(bob)[alice]).toBeDefined();
  });

  it('declining does not create a friendship', async () => {
    actAs(bob);
    expect(await declineFriendRequest(alice)).toEqual({ ok: true, outcome: 'declined' });
    expect(requestDoc(alice, bob)?.status).toBe('declined');
    expect(friendsOf(alice)).toEqual({});
    expect(friendsOf(bob)).toEqual({});
  });

  it('a declined sender cannot immediately re-send', async () => {
    actAs(bob);
    await declineFriendRequest(alice);
    actAs(alice);
    expect(await sendFriendRequest('xy45')).toEqual({
      ok: false,
      error: 'request-already-sent',
    });
  });

  it('the sender can cancel, then send again', async () => {
    expect(await cancelFriendRequest(bob)).toEqual({ ok: true, outcome: 'cancelled' });
    expect(requestDoc(alice, bob)?.status).toBe('cancelled');
    expect(await sendFriendRequest('xy45')).toEqual({ ok: true, outcome: 'sent' });
    expect(requestDoc(alice, bob)?.status).toBe('pending');
  });

  it('the sender cannot accept their own request', async () => {
    expect(await acceptFriendRequest(bob)).toEqual({ ok: false, error: 'request-not-found' });
    expect(requestDoc(alice, bob)?.status).toBe('pending');
  });

  it('the receiver cannot cancel the request', async () => {
    actAs(bob);
    expect(await cancelFriendRequest(alice)).toEqual({ ok: false, error: 'request-not-found' });
  });

  it('a request cannot be answered twice', async () => {
    actAs(bob);
    await declineFriendRequest(alice);
    expect(await acceptFriendRequest(alice)).toEqual({ ok: false, error: 'request-not-found' });
    expect(friendsOf(bob)).toEqual({});
  });
});

describe('removeFriend', () => {
  it('removes the friendship from both users and allows a new request', async () => {
    await sendFriendRequest('xy45');
    actAs(bob);
    await acceptFriendRequest(alice);

    await removeFriend(alice);
    expect(friendsOf(alice)).toEqual({});
    expect(friendsOf(bob)).toEqual({});

    actAs(alice);
    expect(await sendFriendRequest('xy45')).toEqual({ ok: true, outcome: 'sent' });
  });
});
