import { deleteField, doc, runTransaction, Transaction, writeBatch } from 'firebase/firestore';

import {
  db,
  friendRequestsCollection,
  userFriendsCollection,
  usernameCollection,
} from '../firebase-config';
import store from '../store';
import {
  canRespondToFriendRequest,
  decideSendFriendRequest,
  FriendRequestError,
  getFriendRequestId,
  netIdToEmail,
} from './user-friends-utils';

export type FriendRequestResult =
  | { readonly ok: true; readonly outcome: 'sent' | 'accepted' | 'declined' | 'cancelled' }
  | { readonly ok: false; readonly error: FriendRequestError };

const currentUserEmail = (): string => store.state.currentFirebaseUser.email;

/** Adds each user to the other's friends map. */
const setMutualFriendship = (
  transaction: Transaction,
  emailA: string,
  emailB: string,
  since: number
): void => {
  transaction.set(
    doc(userFriendsCollection, emailA),
    { friends: { [emailB]: { since } } },
    { merge: true }
  );
  transaction.set(
    doc(userFriendsCollection, emailB),
    { friends: { [emailA]: { since } } },
    { merge: true }
  );
};

/**
 * Sends a friend request to the user with the given NetID (or Cornell email).
 * If that user already sent us a pending request, it is accepted instead.
 */
export const sendFriendRequest = (netIdOrEmail: string): Promise<FriendRequestResult> => {
  const senderEmail = currentUserEmail();
  const receiverEmail = netIdToEmail(netIdOrEmail);
  if (receiverEmail == null) return Promise.resolve({ ok: false, error: 'invalid-netid' });

  const outgoingRef = doc(friendRequestsCollection, getFriendRequestId(senderEmail, receiverEmail));
  const incomingRef = doc(friendRequestsCollection, getFriendRequestId(receiverEmail, senderEmail));

  return runTransaction(db, async transaction => {
    const [receiverName, senderFriends, outgoing, incoming] = await Promise.all([
      transaction.get(doc(usernameCollection, receiverEmail)),
      transaction.get(doc(userFriendsCollection, senderEmail)),
      transaction.get(outgoingRef),
      transaction.get(incomingRef),
    ]);
    const now = Date.now();
    const decision = decideSendFriendRequest({
      senderEmail,
      receiverEmail,
      receiverExists: receiverName.exists(),
      senderFriends: senderFriends.data()?.friends ?? {},
      outgoingRequest: outgoing.data(),
      incomingRequest: incoming.data(),
      now,
    });

    switch (decision.kind) {
      case 'error':
        return { ok: false, error: decision.error };
      case 'accept-incoming':
        transaction.update(incomingRef, { status: 'accepted', respondedAt: now });
        setMutualFriendship(transaction, senderEmail, receiverEmail, now);
        return { ok: true, outcome: 'accepted' };
      case 'create':
        transaction.set(outgoingRef, {
          senderEmail,
          receiverEmail,
          status: 'pending',
          createdAt: now,
          respondedAt: null,
        });
        return { ok: true, outcome: 'sent' };
      default:
        throw new Error('unreachable');
    }
  });
};

const respondToFriendRequest = (
  senderEmail: string,
  receiverEmail: string,
  newStatus: 'accepted' | 'declined' | 'cancelled'
): Promise<FriendRequestResult> => {
  const requestRef = doc(friendRequestsCollection, getFriendRequestId(senderEmail, receiverEmail));
  return runTransaction(db, async transaction => {
    const request = (await transaction.get(requestRef)).data();
    if (!canRespondToFriendRequest(request, currentUserEmail(), newStatus)) {
      return { ok: false, error: 'request-not-found' };
    }
    const now = Date.now();
    transaction.update(requestRef, { status: newStatus, respondedAt: now });
    if (newStatus === 'accepted') setMutualFriendship(transaction, senderEmail, receiverEmail, now);
    return { ok: true, outcome: newStatus };
  });
};

/** Accepts a pending request that `senderEmail` sent to the current user. */
export const acceptFriendRequest = (senderEmail: string): Promise<FriendRequestResult> =>
  respondToFriendRequest(senderEmail, currentUserEmail(), 'accepted');

/** Declines a pending request that `senderEmail` sent to the current user. */
export const declineFriendRequest = (senderEmail: string): Promise<FriendRequestResult> =>
  respondToFriendRequest(senderEmail, currentUserEmail(), 'declined');

/** Cancels a pending request the current user sent to `receiverEmail`. */
export const cancelFriendRequest = (receiverEmail: string): Promise<FriendRequestResult> =>
  respondToFriendRequest(currentUserEmail(), receiverEmail, 'cancelled');

/** Removes the friendship from both users' friends maps. */
export const removeFriend = (friendEmail: string): Promise<void> => {
  const myEmail = currentUserEmail();
  const batch = writeBatch(db);
  batch.set(
    doc(userFriendsCollection, myEmail),
    { friends: { [friendEmail]: deleteField() } },
    { merge: true }
  );
  batch.set(
    doc(userFriendsCollection, friendEmail),
    { friends: { [myEmail]: deleteField() } },
    { merge: true }
  );
  return batch.commit();
};
