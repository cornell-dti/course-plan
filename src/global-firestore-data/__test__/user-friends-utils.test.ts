import {
  canRespondToFriendRequest,
  decideSendFriendRequest,
  DECLINED_REQUEST_COOLDOWN_MS,
  getFriendRequestId,
  netIdToEmail,
  SendFriendRequestContext,
} from '../user-friends-utils';

const alice = 'abc123@cornell.edu';
const bob = 'xy45@cornell.edu';
const now = 1_000_000_000_000;

const request = (
  senderEmail: string,
  receiverEmail: string,
  status: FirestoreFriendRequestStatus,
  respondedAt: number | null = null
): FirestoreFriendRequest => ({ senderEmail, receiverEmail, status, createdAt: 0, respondedAt });

const context = (overrides: Partial<SendFriendRequestContext> = {}): SendFriendRequestContext => ({
  senderEmail: alice,
  receiverEmail: bob,
  receiverExists: true,
  senderFriends: {},
  outgoingRequest: undefined,
  incomingRequest: undefined,
  now,
  ...overrides,
});

describe('netIdToEmail', () => {
  it('accepts a plain NetID', () => {
    expect(netIdToEmail('abc123')).toBe(alice);
  });

  it('normalizes case and whitespace', () => {
    expect(netIdToEmail('  ABC123 ')).toBe(alice);
  });

  it('accepts a Cornell email', () => {
    expect(netIdToEmail('ABC123@cornell.edu')).toBe(alice);
  });

  it('accepts two-letter NetIDs', () => {
    expect(netIdToEmail('xy45')).toBe(bob);
  });

  it.each(['', 'abc', '123', 'abcd123', 'a1', 'abc123456', 'abc123@gmail.com', 'ab-12'])(
    'rejects %p',
    input => {
      expect(netIdToEmail(input)).toBeNull();
    }
  );
});

describe('getFriendRequestId', () => {
  it('is directional', () => {
    expect(getFriendRequestId(alice, bob)).toBe(`${alice}_${bob}`);
    expect(getFriendRequestId(alice, bob)).not.toBe(getFriendRequestId(bob, alice));
  });
});

describe('decideSendFriendRequest', () => {
  it('creates a request in the normal case', () => {
    expect(decideSendFriendRequest(context())).toEqual({ kind: 'create' });
  });

  it('rejects requests to yourself', () => {
    expect(decideSendFriendRequest(context({ receiverEmail: alice }))).toEqual({
      kind: 'error',
      error: 'self-request',
    });
  });

  it('rejects requests to users without a CoursePlan account', () => {
    expect(decideSendFriendRequest(context({ receiverExists: false }))).toEqual({
      kind: 'error',
      error: 'user-not-found',
    });
  });

  it('rejects requests to existing friends', () => {
    expect(decideSendFriendRequest(context({ senderFriends: { [bob]: { since: 0 } } }))).toEqual({
      kind: 'error',
      error: 'already-friends',
    });
  });

  it('rejects a duplicate pending request', () => {
    expect(
      decideSendFriendRequest(context({ outgoingRequest: request(alice, bob, 'pending') }))
    ).toEqual({ kind: 'error', error: 'request-already-sent' });
  });

  it('accepts the incoming request when both users request each other', () => {
    expect(
      decideSendFriendRequest(context({ incomingRequest: request(bob, alice, 'pending') }))
    ).toEqual({ kind: 'accept-incoming' });
  });

  it('hides a recent decline by reporting the request as already sent', () => {
    const declined = request(alice, bob, 'declined', now - DECLINED_REQUEST_COOLDOWN_MS + 1);
    expect(decideSendFriendRequest(context({ outgoingRequest: declined }))).toEqual({
      kind: 'error',
      error: 'request-already-sent',
    });
  });

  it('allows re-sending once the decline cooldown has passed', () => {
    const declined = request(alice, bob, 'declined', now - DECLINED_REQUEST_COOLDOWN_MS);
    expect(decideSendFriendRequest(context({ outgoingRequest: declined }))).toEqual({
      kind: 'create',
    });
  });

  it('allows re-sending after a cancelled request', () => {
    expect(
      decideSendFriendRequest(context({ outgoingRequest: request(alice, bob, 'cancelled', now) }))
    ).toEqual({ kind: 'create' });
  });

  it('allows re-sending after the friendship was removed', () => {
    expect(
      decideSendFriendRequest(context({ outgoingRequest: request(alice, bob, 'accepted', now) }))
    ).toEqual({ kind: 'create' });
  });

  it('ignores an old declined incoming request', () => {
    expect(
      decideSendFriendRequest(context({ incomingRequest: request(bob, alice, 'declined', now) }))
    ).toEqual({ kind: 'create' });
  });
});

describe('canRespondToFriendRequest', () => {
  const pending = request(alice, bob, 'pending');

  it('lets only the receiver accept or decline', () => {
    expect(canRespondToFriendRequest(pending, bob, 'accepted')).toBe(true);
    expect(canRespondToFriendRequest(pending, bob, 'declined')).toBe(true);
    expect(canRespondToFriendRequest(pending, alice, 'accepted')).toBe(false);
    expect(canRespondToFriendRequest(pending, alice, 'declined')).toBe(false);
  });

  it('lets only the sender cancel', () => {
    expect(canRespondToFriendRequest(pending, alice, 'cancelled')).toBe(true);
    expect(canRespondToFriendRequest(pending, bob, 'cancelled')).toBe(false);
  });

  it('rejects missing or already-answered requests', () => {
    expect(canRespondToFriendRequest(undefined, bob, 'accepted')).toBe(false);
    expect(canRespondToFriendRequest(request(alice, bob, 'declined'), bob, 'accepted')).toBe(false);
  });
});
