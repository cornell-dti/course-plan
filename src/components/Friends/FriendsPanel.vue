<template>
  <aside class="fp" role="dialog" aria-label="Friends" @keydown.esc="$emit('close')">
    <div class="fp-head">
      <div class="fp-headText">
        <h2 class="fp-title">Friends</h2>
        <p class="fp-sub">See what your friends are taking</p>
      </div>
      <button
        ref="close"
        type="button"
        class="fp-iconButton"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.33"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>

    <div class="fp-body">
      <div class="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tabs-tab"
          :class="{ 'tabs-tab--on': tab === 'friends' }"
          :aria-selected="tab === 'friends'"
          @click="tab = 'friends'"
        >
          My friends
        </button>
        <button
          type="button"
          role="tab"
          class="tabs-tab"
          :class="{ 'tabs-tab--on': tab === 'requests' }"
          :aria-selected="tab === 'requests'"
          data-cyId="friends-requestsTab"
          @click="tab = 'requests'"
        >
          Requests
          <span
            v-if="incoming.length > 0"
            class="tabs-dot"
            role="img"
            :aria-label="`${incoming.length} new ${incoming.length === 1 ? 'request' : 'requests'}`"
          />
        </button>
      </div>

      <p
        v-if="status"
        class="fp-status"
        :class="{ 'fp-status--error': status.error }"
        role="status"
      >
        {{ status.text }}
      </p>

      <template v-if="tab === 'friends'">
        <label class="share">
          <svg v-bind="iconAttrs" aria-hidden="true">
            <path
              d="M10.67 14v-1.33A2.67 2.67 0 0 0 8 10H4a2.67 2.67 0 0 0-2.67 2.67V14M6 7.33A2.67 2.67 0 1 0 6 2a2.67 2.67 0 0 0 0 5.33ZM14.67 14v-1.33a2.67 2.67 0 0 0-2-2.58M10.67 2.09a2.67 2.67 0 0 1 0 5.17"
            />
          </svg>
          <span>Friends compare with your</span>
          <span class="share-select">
            <select
              :value="sharedPlanName"
              aria-label="Plan friends compare with"
              data-cyId="friends-sharedPlan"
              @change="changeSharedPlan"
            >
              <option v-for="plan in plans" :key="plan.name" :value="plan.name">
                {{ plan.name }}
              </option>
            </select>
          </span>
        </label>

        <label class="search">
          <svg v-bind="iconAttrs" aria-hidden="true">
            <path d="M7.33 12.67A5.33 5.33 0 1 0 7.33 2a5.33 5.33 0 0 0 0 10.67ZM14 14l-2.9-2.9" />
          </svg>
          <input
            v-model="query"
            class="search-input"
            placeholder="Search friends or add by NetID"
            aria-label="Search friends or add by NetID"
            autocomplete="off"
            data-cyId="friends-search"
          />
        </label>

        <template v-if="!trimmedQuery && outgoing.length > 0">
          <div class="fp-section">
            Sent requests <span class="fp-count">{{ outgoing.length }}</span>
          </div>
          <div class="fp-list">
            <div v-for="request in outgoing" :key="request.receiverEmail" class="fp-slim">
              <span class="fp-avatar">{{ initialsFor(request.receiverEmail) }}</span>
              <div class="fp-person">
                <span class="fp-name">{{ nameFor(request.receiverEmail) }}</span>
                <span class="fp-meta">
                  {{ netIdOf(request.receiverEmail) }} · Waiting for them to accept
                </span>
              </div>
              <button
                type="button"
                class="fp-button"
                :disabled="busy[request.receiverEmail]"
                @click="cancel(request.receiverEmail)"
              >
                Cancel
              </button>
            </div>
          </div>
        </template>

        <div class="fp-section">
          Your friends <span class="fp-count">{{ matchingFriends.length }}</span>
        </div>
        <p v-if="friendEmails.length === 0" class="fp-hint">
          No friends yet. Type a friend’s NetID above to send them a request.
        </p>
        <p v-else-if="matchingFriends.length === 0" class="fp-hint">
          No friends match “{{ trimmedQuery }}”.
        </p>
        <div v-else class="fp-list">
          <div v-for="email in matchingFriends" :key="email" class="fp-card" data-cyId="friendCard">
            <div class="fp-row">
              <span class="fp-avatar">{{ profileOf(email).initials }}</span>
              <div class="fp-person">
                <span class="fp-name">{{ profileOf(email).name }}</span>
                <span class="fp-meta">{{ metaLine(email) }}</span>
              </div>
              <button
                type="button"
                class="fp-button"
                :disabled="!canCompare(email)"
                :title="canCompare(email) ? '' : compareBlockedReason(email)"
                data-cyId="friendCard-compare"
                @click="compare(email)"
              >
                Compare
              </button>
            </div>
            <div>
              <div class="fp-cap">Shared courses</div>
              <div class="fp-chips">
                <template v-if="sharedCodes(email).length > 0">
                  <span v-for="code in sharedCodes(email)" :key="code" class="fp-chip">
                    {{ code }}
                  </span>
                </template>
                <span v-else class="fp-cap">{{ sharedEmptyText(email) }}</span>
              </div>
            </div>
          </div>
        </div>

        <template v-if="trimmedQuery">
          <div class="fp-section">Add a friend</div>
          <p v-if="addState.kind === 'typing'" class="fp-hint">
            Type their full NetID, like aw456.
          </p>
          <p v-else-if="addState.kind === 'self'" class="fp-hint">That’s your NetID.</p>
          <p v-else-if="addState.kind === 'friend'" class="fp-hint">
            {{ nameFor(addTarget) }} is already your friend.
          </p>
          <p v-else-if="addState.kind === 'loading'" class="fp-hint">Looking up {{ addNetId }}…</p>
          <div v-else-if="addState.kind === 'not-found'" class="missing">
            <b>No CoursePlan account uses “{{ addNetId }}”</b>
            <span class="fp-cap">
              Check the spelling. They need to sign in to CoursePlan once before you can add them.
            </span>
          </div>
          <div v-else-if="addState.kind === 'error'" class="missing">
            <b>Couldn’t look up “{{ addNetId }}”</b>
            <span class="fp-cap">Check your connection and try again.</span>
          </div>
          <div v-else class="fp-slim">
            <span class="fp-avatar">{{ initialsFor(addTarget) }}</span>
            <div class="fp-person">
              <span class="fp-name">{{ nameFor(addTarget) }}</span>
              <span class="fp-meta">{{ addNetId }}</span>
            </div>
            <button
              v-if="addState.kind === 'incoming'"
              type="button"
              class="fp-button"
              @click="tab = 'requests'"
            >
              Respond
            </button>
            <button
              v-else-if="addState.kind === 'outgoing'"
              type="button"
              class="fp-button"
              disabled
            >
              Requested
            </button>
            <button
              v-else
              type="button"
              class="fp-primary"
              :disabled="busy[addTarget]"
              data-cyId="friends-sendRequest"
              @click="send(addTarget)"
            >
              Send request
            </button>
          </div>
        </template>
      </template>

      <template v-else>
        <p v-if="incoming.length === 0" class="fp-empty">
          No pending requests. New ones show up here.
        </p>
        <div v-else class="fp-list">
          <div v-for="request in incoming" :key="request.senderEmail" class="fp-card">
            <div class="fp-row">
              <span class="fp-avatar">{{ initialsFor(request.senderEmail) }}</span>
              <div class="fp-person">
                <span class="fp-name">{{ nameFor(request.senderEmail) }}</span>
                <span class="fp-meta">{{ netIdOf(request.senderEmail) }}</span>
              </div>
            </div>
            <div class="fp-actions">
              <button
                type="button"
                class="fp-button"
                :disabled="busy[request.senderEmail]"
                @click="decline(request.senderEmail)"
              >
                Decline
              </button>
              <button
                type="button"
                class="fp-primary"
                :disabled="busy[request.senderEmail]"
                data-cyId="friends-accept"
                @click="accept(request.senderEmail)"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  loadFriendProfile,
  loadUserName,
  sendFriendRequest,
  setSharedPlanName,
} from '@/global-firestore-data';
import { FriendRequestResult } from '@/global-firestore-data/user-friends';
import { FriendProfile } from '@/global-firestore-data/friend-profiles';
import { FriendRequestError, netIdToEmail } from '@/global-firestore-data/user-friends-utils';
import {
  displayName,
  emailToNetId,
  initials,
  sharedCourseCodes,
  sharedPlanOf,
} from '@/components/Friends/friends-utils';

/** A profile before it loads, built from what we already know. */
type ProfileState = FriendProfile | 'loading' | 'error';
/** undefined: not looked up; 'loading'; null: no account. */
type NameState = FirestoreUserName | null | 'loading' | 'error';

type AddState =
  | { readonly kind: 'typing' }
  | { readonly kind: 'self' }
  | {
      readonly kind:
        | 'friend'
        | 'incoming'
        | 'outgoing'
        | 'loading'
        | 'found'
        | 'not-found'
        | 'error';
      readonly email: string;
    };

const ERROR_TEXT: Record<FriendRequestError, string> = {
  'invalid-netid': 'That isn’t a valid NetID.',
  'self-request': 'You can’t add yourself.',
  'user-not-found': 'No CoursePlan account uses that NetID.',
  'already-friends': 'You’re already friends.',
  'request-already-sent': 'You already sent them a request.',
  'request-not-found': 'That request is no longer pending.',
};

const STATUS_MS = 4000;
const LOOKUP_DELAY_MS = 300;

export default defineComponent({
  emits: {
    close: () => true,
    compare: (profile: FriendProfile) => typeof profile === 'object',
  },
  data() {
    return {
      tab: 'friends' as 'friends' | 'requests',
      query: '',
      profiles: {} as Record<string, ProfileState>,
      names: {} as Record<string, NameState>,
      busy: {} as Record<string, boolean>,
      status: null as { text: string; error: boolean } | null,
      statusTimer: 0,
      lookupTimer: 0,
      iconAttrs: {
        width: 16,
        height: 16,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.33,
        'stroke-linecap': 'round' as const,
        'stroke-linejoin': 'round' as const,
      },
    };
  },
  computed: {
    myEmail(): string {
      return store.state.currentFirebaseUser.email;
    },
    plans(): readonly Plan[] {
      return store.state.plans;
    },
    sharedPlanName(): string {
      return sharedPlanOf({ plans: this.plans, sharedPlanName: store.state.sharedPlanName ?? '' })
        .name;
    },
    mySemesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
    },
    // newest friends first
    friendEmails(): string[] {
      const { friends } = store.state;
      return Object.keys(friends).sort((a, b) => friends[b].since - friends[a].since);
    },
    incoming(): readonly FirestoreFriendRequest[] {
      return store.state.incomingFriendRequests;
    },
    outgoing(): readonly FirestoreFriendRequest[] {
      return store.state.outgoingFriendRequests;
    },
    trimmedQuery(): string {
      return this.query.trim();
    },
    matchingFriends(): string[] {
      const q = this.trimmedQuery.toLowerCase();
      if (!q) return this.friendEmails;
      return this.friendEmails.filter(email => {
        const profile = this.profileOf(email);
        return (
          profile.name.toLowerCase().includes(q) ||
          profile.netId.startsWith(q) ||
          profile.majorLine.toLowerCase().includes(q)
        );
      });
    },
    addEmail(): string | null {
      return netIdToEmail(this.trimmedQuery);
    },
    // set whenever addState names someone; '' only while still typing
    addTarget(): string {
      return this.addEmail ?? '';
    },
    addNetId(): string {
      return this.addEmail ? emailToNetId(this.addEmail) : this.trimmedQuery;
    },
    addState(): AddState {
      const email = this.addEmail;
      if (email == null) return { kind: 'typing' };
      if (email === this.myEmail) return { kind: 'self' };
      if (store.state.friends[email] != null) return { kind: 'friend', email };
      if (this.incoming.some(r => r.senderEmail === email)) return { kind: 'incoming', email };
      if (this.outgoing.some(r => r.receiverEmail === email)) return { kind: 'outgoing', email };
      const name = this.names[email];
      if (name === undefined || name === 'loading') return { kind: 'loading', email };
      if (name === 'error') return { kind: 'error', email };
      return name == null ? { kind: 'not-found', email } : { kind: 'found', email };
    },
    requestEmails(): string[] {
      return [...this.incoming.map(r => r.senderEmail), ...this.outgoing.map(r => r.receiverEmail)];
    },
  },
  watch: {
    friendEmails: {
      handler(emails: string[]) {
        emails.forEach(email => {
          if (this.profiles[email] == null) this.loadProfile(email);
        });
      },
      immediate: true,
    },
    requestEmails: {
      handler(emails: string[]) {
        emails.forEach(email => {
          if (this.names[email] === undefined) this.loadName(email);
        });
      },
      immediate: true,
    },
    // look the NetID up once typing pauses
    addEmail(email: string | null) {
      window.clearTimeout(this.lookupTimer);
      if (email == null || this.names[email] !== undefined) return;
      this.lookupTimer = window.setTimeout(() => this.loadName(email), LOOKUP_DELAY_MS);
    },
  },
  mounted() {
    (this.$refs.close as HTMLButtonElement | undefined)?.focus();
  },
  beforeUnmount() {
    window.clearTimeout(this.statusTimer);
    window.clearTimeout(this.lookupTimer);
  },
  methods: {
    netIdOf(email: string): string {
      return emailToNetId(email);
    },
    async loadProfile(email: string) {
      this.profiles = { ...this.profiles, [email]: 'loading' };
      let next: ProfileState;
      try {
        next = await loadFriendProfile(email);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Friends: could not load ${email}`, error);
        next = 'error';
      }
      this.profiles = { ...this.profiles, [email]: next };
    },
    async loadName(email: string) {
      this.names = { ...this.names, [email]: 'loading' };
      let next: NameState;
      try {
        next = await loadUserName(email);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Friends: could not look up ${email}`, error);
        next = 'error';
      }
      this.names = { ...this.names, [email]: next };
    },
    /** The loaded profile, or a stand-in with the NetID while it loads. */
    profileOf(email: string): FriendProfile {
      const state = this.profiles[email];
      if (state != null && typeof state === 'object') return state;
      const name = this.nameFor(email);
      return {
        email,
        netId: emailToNetId(email),
        name,
        initials: initials(name),
        majorLine: '',
        plan: null,
      };
    },
    nameFor(email: string): string {
      const state = this.names[email];
      const loaded = this.profiles[email];
      if (loaded != null && typeof loaded === 'object') return loaded.name;
      return displayName(state != null && typeof state === 'object' ? state : null, email);
    },
    initialsFor(email: string): string {
      return initials(this.nameFor(email));
    },
    metaLine(email: string): string {
      const profile = this.profileOf(email);
      return [profile.netId, profile.majorLine].filter(Boolean).join(' · ');
    },
    canCompare(email: string): boolean {
      return this.profileOf(email).plan != null;
    },
    compareBlockedReason(email: string): string {
      return this.profiles[email] === 'loading'
        ? 'Loading their plan…'
        : 'Their plan can’t be shown right now';
    },
    sharedCodes(email: string): string[] {
      const { plan } = this.profileOf(email);
      return plan ? sharedCourseCodes(this.mySemesters, plan.semesters) : [];
    },
    sharedEmptyText(email: string): string {
      const state = this.profiles[email];
      if (state === 'loading' || state == null) return 'Loading…';
      return this.profileOf(email).plan ? 'None yet' : 'Their plan can’t be shown right now';
    },
    compare(email: string) {
      const profile = this.profileOf(email);
      if (profile.plan) this.$emit('compare', profile);
    },
    changeSharedPlan(event: Event) {
      const name = (event.target as HTMLSelectElement).value;
      setSharedPlanName(name);
      this.showStatus(`Friends now compare with ${name}`);
    },
    showStatus(text: string, error = false) {
      window.clearTimeout(this.statusTimer);
      this.status = { text, error };
      this.statusTimer = window.setTimeout(() => {
        this.status = null;
      }, STATUS_MS);
    },
    /** Runs a friend action for one person, then reports how it went. */
    async run(
      email: string,
      action: () => Promise<FriendRequestResult>,
      messages: Partial<Record<string, string>>
    ) {
      this.busy = { ...this.busy, [email]: true };
      try {
        const result = await action();
        if (result.ok) {
          this.showStatus(messages[result.outcome] ?? 'Done');
        } else {
          this.showStatus(ERROR_TEXT[result.error], true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Friends: request failed', error);
        this.showStatus('Something went wrong. Try again.', true);
      } finally {
        this.busy = { ...this.busy, [email]: false };
      }
    },
    send(email: string) {
      const name = this.nameFor(email);
      this.run(email, () => sendFriendRequest(email), {
        sent: `Friend request sent to ${name}`,
        // they had already asked us, so sending accepts theirs
        accepted: `You and ${name} are now friends`,
      }).then(() => {
        this.query = '';
      });
    },
    accept(email: string) {
      this.run(email, () => acceptFriendRequest(email), {
        accepted: `${this.nameFor(email)} added to your friends`,
      });
    },
    decline(email: string) {
      this.run(email, () => declineFriendRequest(email), {
        declined: `Declined ${this.nameFor(email)}’s request`,
      });
    },
    cancel(email: string) {
      this.run(email, () => cancelFriendRequest(email), {
        cancelled: `Canceled your request to ${this.nameFor(email)}`,
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Friends/_friends-panel.scss';

.tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid $cp-line;

  &-tab {
    @include cp-reset-button;
    @include cp-text(14px, 20px);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 10px;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    color: $cp-muted;

    &:hover {
      color: $cp-ink;
    }

    &--on {
      color: $cp-ink;
      font-weight: 600;
      border-bottom-color: $cp-brand;
    }
  }

  &-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $cp-err;
  }
}

.share {
  @include cp-text(13px, 18px);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 8px 12px;
  color: $cp-muted;
  background: $cp-subtle;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;

  > svg {
    flex-shrink: 0;
  }

  &-select {
    position: relative;
    display: inline-flex;
    align-items: center;

    // chevron drawn in CSS so the native select can keep its own arrow hidden
    &::after {
      @include cp-css-chevron;
      content: '';
      position: absolute;
      right: 10px;
      pointer-events: none;
    }

    select {
      @include cp-text(13px, 18px, 600);
      appearance: none;
      height: 28px;
      padding: 0 28px 0 10px;
      color: $cp-ink;
      background: #fff;
      border: 1px solid $cp-line-strong;
      border-radius: $cp-r-sm;
      cursor: pointer;

      &:focus-visible {
        outline: 2px solid $cp-brand;
        outline-offset: 2px;
      }
    }
  }
}

.search {
  @include cp-input;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  margin: 0;
  padding: 0 12px;
  color: $cp-muted;

  &-input {
    @include cp-text(14px, 20px);
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: none;
    color: $cp-ink;
  }
}

.missing {
  @include cp-text(13px, 18px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  text-align: center;
  background: $cp-subtle;
  border: 1px dashed $cp-line-strong;
  border-radius: $cp-r-md;
}
</style>
