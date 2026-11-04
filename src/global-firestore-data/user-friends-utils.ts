/**
 * Pure helpers for the friends feature. Kept free of Firestore and store imports so they can be
 * unit tested directly.
 */

export const CORNELL_EMAIL_DOMAIN = '@cornell.edu';

/** 2–3 letters followed by 1–5 digits, e.g. `abc123`. */
const NETID_REGEX = /^[a-z]{2,3}[0-9]{1,5}$/;

/** How long a declined request blocks the sender from re-sending. */
export const DECLINED_REQUEST_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export type FriendRequestError =
  | 'invalid-netid'
  | 'self-request'
  | 'user-not-found'
  | 'already-friends'
  | 'request-already-sent'
  | 'request-not-found';

/**
 * Turns user input (`abc123`, ` ABC123 `, or `abc123@cornell.edu`) into the email that keys every
 * per-user Firestore document. Returns null if the input is not a valid NetID.
 */
export const netIdToEmail = (input: string): string | null => {
  const trimmed = input.trim().toLowerCase();
  const netId = trimmed.endsWith(CORNELL_EMAIL_DOMAIN)
    ? trimmed.slice(0, -CORNELL_EMAIL_DOMAIN.length)
    : trimmed;
  return NETID_REGEX.test(netId) ? `${netId}${CORNELL_EMAIL_DOMAIN}` : null;
};

export const getFriendRequestId = (senderEmail: string, receiverEmail: string): string =>
  `${senderEmail}_${receiverEmail}`;

export type SendFriendRequestDecision =
  | { readonly kind: 'error'; readonly error: FriendRequestError }
  | { readonly kind: 'create' }
  // The receiver already sent us a pending request, so accept it instead of creating a second one.
  | { readonly kind: 'accept-incoming' };

export type SendFriendRequestContext = {
  readonly senderEmail: string;
  readonly receiverEmail: string;
  readonly receiverExists: boolean;
  readonly senderFriends: FirestoreUserFriends['friends'];
  /** Existing request from sender to receiver, if any. */
  readonly outgoingRequest: FirestoreFriendRequest | undefined;
  /** Existing request from receiver to sender, if any. */
  readonly incomingRequest: FirestoreFriendRequest | undefined;
  readonly now: number;
};

export const decideSendFriendRequest = ({
  senderEmail,
  receiverEmail,
  receiverExists,
  senderFriends,
  outgoingRequest,
  incomingRequest,
  now,
}: SendFriendRequestContext): SendFriendRequestDecision => {
  if (senderEmail === receiverEmail) return { kind: 'error', error: 'self-request' };
  if (!receiverExists) return { kind: 'error', error: 'user-not-found' };
  if (senderFriends[receiverEmail] != null) return { kind: 'error', error: 'already-friends' };
  if (incomingRequest?.status === 'pending') return { kind: 'accept-incoming' };
  if (outgoingRequest?.status === 'pending') {
    return { kind: 'error', error: 'request-already-sent' };
  }
  // Declines are not revealed to the sender: within the cooldown it looks like it is still pending.
  if (
    outgoingRequest?.status === 'declined' &&
    outgoingRequest.respondedAt != null &&
    now - outgoingRequest.respondedAt < DECLINED_REQUEST_COOLDOWN_MS
  ) {
    return { kind: 'error', error: 'request-already-sent' };
  }
  return { kind: 'create' };
};

/**
 * Checks that `actorEmail` may move `request` to `newStatus`: only the receiver accepts or
 * declines, only the sender cancels, and only pending requests can change.
 */
export const canRespondToFriendRequest = (
  request: FirestoreFriendRequest | undefined,
  actorEmail: string,
  newStatus: Exclude<FirestoreFriendRequestStatus, 'pending'>
): boolean => {
  if (request == null || request.status !== 'pending') return false;
  return newStatus === 'cancelled'
    ? request.senderEmail === actorEmail
    : request.receiverEmail === actorEmail;
};
