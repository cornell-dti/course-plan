<template>
  <aside
    class="fp"
    role="dialog"
    :aria-label="`You and ${profile.name}`"
    @keydown.esc="$emit('close')"
  >
    <div class="fp-head compare-head">
      <button
        ref="back"
        type="button"
        class="fp-iconButton"
        aria-label="Back to friends"
        @click="$emit('back')"
      >
        <svg v-bind="iconAttrs" aria-hidden="true"><path d="M10 12L6 8l4-4" /></svg>
      </button>
      <span class="pair" aria-hidden="true">
        <span class="fp-avatar pair-you">{{ myInitials }}</span>
        <span class="fp-avatar pair-friend">{{ profile.initials }}</span>
      </span>
      <div class="fp-headText compare-headText">
        <h2 class="compare-title">You &amp; {{ profile.name }}</h2>
        <span class="fp-cap">
          Your {{ myPlanName }} · {{ firstName }}’s {{ profile.plan.name }} · {{ semesterLabel }}
        </span>
      </div>
      <button type="button" class="fp-iconButton" aria-label="Close" @click="$emit('close')">
        <svg v-bind="iconAttrs" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
      </button>
    </div>

    <div class="fp-body">
      <p v-if="myPlanName !== mySharedPlanName" class="planNote">
        You’re comparing {{ myPlanName }}, but friends compare with your {{ mySharedPlanName }}.
        {{ firstName }} won’t see {{ myPlanName }} unless you change that in the Friends panel.
      </p>

      <div class="stats">
        <button
          v-for="tile in tiles"
          :key="tile.key"
          type="button"
          class="stat"
          :class="[`stat--${tile.tone}`, { 'stat--on': focus === tile.key }]"
          :aria-pressed="focus === tile.key"
          @click="$emit('focus', focus === tile.key ? null : tile.key)"
        >
          <span class="stat-value">{{ tile.value }}</span>
          <span class="stat-label">{{ tile.label }}</span>
          <span class="stat-go">{{ focus === tile.key ? 'Showing' : 'View' }}</span>
        </button>
      </div>

      <div v-if="focus" class="focusBar">
        <span>{{ focusText }}</span>
        <button type="button" class="fp-link" @click="$emit('focus', null)">Show all</button>
      </div>

      <section v-for="group in groups" :key="group.title" class="group">
        <h3 class="group-head" :class="`group-head--${group.tone}`">
          <i class="group-dot" />
          {{ group.title }}
          <span class="group-count">{{ group.items.length }}</span>
        </h3>
        <p v-if="group.items.length === 0" class="fp-cap">{{ group.empty }}</p>
        <component
          :is="item.clickable ? 'button' : 'div'"
          v-for="item in group.items"
          :key="item.key"
          :data-code="item.code"
          :type="item.clickable ? 'button' : undefined"
          class="card"
          :class="[
            `card--${group.tone}`,
            { 'card--button': item.clickable, 'card--flash': flashCode === item.code },
          ]"
          :aria-label="item.clickable ? `${item.code}, ${item.name}. Show on calendar` : undefined"
          @click="item.clickable && $emit('pick', item.code)"
        >
          <span class="card-bar" />
          <span class="card-text">
            <span class="card-top">
              <span class="card-code">{{ item.code }}</span>
              <span class="card-credits">{{ item.credits }} cr</span>
            </span>
            <span class="card-name">{{ item.name }}</span>
            <span v-if="item.when" class="card-when">{{ item.when }}</span>
          </span>
        </component>
      </section>

      <div class="remove">
        <template v-if="confirmingRemove">
          <span class="fp-cap">Remove {{ profile.name }} from your friends?</span>
          <button type="button" class="fp-button" @click="confirmingRemove = false">Cancel</button>
          <button
            type="button"
            class="fp-button remove-danger"
            :disabled="removing"
            @click="remove"
          >
            Remove
          </button>
        </template>
        <button v-else type="button" class="fp-link remove-link" @click="confirmingRemove = true">
          Remove friend
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import store from '@/store';
import { removeFriend } from '@/global-firestore-data';
import { FriendProfile } from '@/global-firestore-data/friend-profiles';
import {
  CompareCourse,
  FriendComparison,
  compareFriendPlans,
  initials,
  sharedPlanOf,
} from '@/components/Friends/friends-utils';

export type CompareFocus = 'together' | 'diff' | 'later';

type CardItem = CompareCourse & {
  readonly key: string;
  readonly when?: string;
  /** Only this semester's classes are on the calendar, so only they can be shown there. */
  readonly clickable: boolean;
};

type Group = {
  readonly title: string;
  readonly tone: 'green' | 'purple' | 'amber';
  readonly items: readonly CardItem[];
  readonly empty: string;
};

export default defineComponent({
  props: {
    profile: { type: Object as PropType<FriendProfile & { plan: Plan }>, required: true },
    season: { type: String as PropType<FirestoreSemesterSeason>, required: true },
    year: { type: Number, required: true },
    focus: { type: String as PropType<CompareFocus | null>, default: null },
    /** A course to scroll to and pulse, e.g. after its block was clicked on the calendar. */
    flashCode: { type: String as PropType<string | null>, default: null },
  },
  emits: {
    back: () => true,
    close: () => true,
    focus: (focus: CompareFocus | null) => focus === null || typeof focus === 'string',
    pick: (code: string) => typeof code === 'string',
    removed: () => true,
  },
  data() {
    return {
      confirmingRemove: false,
      removing: false,
      iconAttrs: {
        width: 16,
        height: 16,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.5,
        'stroke-linecap': 'round' as const,
        'stroke-linejoin': 'round' as const,
      },
    };
  },
  computed: {
    semesterLabel(): string {
      return `${this.season} ${this.year}`;
    },
    firstName(): string {
      return this.profile.name.split(' ')[0];
    },
    myInitials(): string {
      const { firstName, lastName } = store.state.userName;
      return initials(`${firstName ?? ''} ${lastName ?? ''}`) || 'ME';
    },
    myPlanName(): string {
      return store.state.currentPlan.name;
    },
    mySharedPlanName(): string {
      return sharedPlanOf({
        plans: store.state.plans,
        sharedPlanName: store.state.sharedPlanName ?? undefined,
      }).name;
    },
    comparison(): FriendComparison {
      return compareFriendPlans(
        store.getters.getCurrentPlanSemesters,
        this.profile.plan.semesters,
        {
          season: this.season,
          year: this.year,
        }
      );
    },
    tiles(): { key: CompareFocus; value: number; label: string; tone: string }[] {
      const { together, differentSemester, togetherLater } = this.comparison;
      return [
        {
          key: 'together',
          value: together.length,
          label: `taking together in ${this.semesterLabel}`,
          tone: 'green',
        },
        {
          key: 'diff',
          value: differentSemester.length,
          label: 'same course, different semester',
          tone: 'amber',
        },
        {
          key: 'later',
          value: togetherLater.length,
          label: 'together in later semesters',
          tone: 'green',
        },
      ];
    },
    focusText(): string {
      if (this.focus === 'together')
        return 'Only classes you share are highlighted on the calendar.';
      if (this.focus === 'diff') return 'Courses you’re both taking, but in different semesters.';
      return 'Classes you’ll share in future semesters.';
    },
    groups(): Group[] {
      const { together, onlyTheirs, differentSemester, togetherLater } = this.comparison;
      const current = (items: readonly CompareCourse[]): CardItem[] =>
        items.map(item => ({ ...item, key: item.code, clickable: true }));
      const togetherGroup: Group = {
        title: 'Taking together',
        tone: 'green',
        items: current(together),
        empty: `No shared classes in ${this.semesterLabel}.`,
      };
      if (this.focus === 'together') return [togetherGroup];
      if (this.focus === 'diff') {
        return [
          {
            title: 'Same course, different semester',
            tone: 'amber',
            items: differentSemester.map(item => ({
              ...item,
              key: item.code,
              clickable: false,
              when: `You: ${item.mySeason} ${item.myYear} · ${this.firstName}: ${item.season} ${item.year}`,
            })),
            empty: 'None yet.',
          },
        ];
      }
      if (this.focus === 'later') {
        return [
          {
            title: 'Together in later semesters',
            tone: 'green',
            items: togetherLater.map(item => ({
              ...item,
              key: `${item.code}-${item.season}-${item.year}`,
              clickable: false,
              when: `${item.season} ${item.year}`,
            })),
            empty: `No shared classes planned after ${this.semesterLabel}.`,
          },
        ];
      }
      return [
        togetherGroup,
        {
          title: `${this.firstName}’s courses`,
          tone: 'purple',
          items: current(onlyTheirs),
          empty: `Nothing else in ${this.semesterLabel}.`,
        },
      ];
    },
  },
  watch: {
    flashCode(code: string | null) {
      if (code == null) return;
      this.$nextTick(() => {
        const card = (this.$el as HTMLElement).querySelector(`[data-code="${CSS.escape(code)}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    },
  },
  mounted() {
    (this.$refs.back as HTMLButtonElement | undefined)?.focus();
  },
  methods: {
    async remove() {
      this.removing = true;
      try {
        await removeFriend(this.profile.email);
        this.$emit('removed');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Friends: could not remove friend', error);
        this.removing = false;
        this.confirmingRemove = false;
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Friends/_friends-panel.scss';

// prototype colors for You / friend / together
$you: #2f6fa3;
$friend: #7b4fb0;
$friend-soft: #efe8f7;

.compare-head {
  align-items: center;
}

.compare-headText {
  gap: 2px;
}

.compare-title {
  @include cp-text(18px, 24px, 700);
  margin: 0;
}

.pair {
  display: flex;

  .fp-avatar {
    border: 2px solid #fff;
  }

  &-you {
    background: $you;
  }

  &-friend {
    background: $friend;
    margin-left: -8px;
  }
}

.planNote {
  @include cp-text(12px, 16px);
  margin: 0;
  padding: 8px 12px;
  color: $cp-warn-ink;
  background: $cp-warn-bg;
  border: 1px solid $cp-warn-line;
  border-radius: $cp-r-md;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat {
  @include cp-reset-button;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  text-align: left;
  background: $cp-subtle;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;
  transition: border-color 150ms, box-shadow 150ms;

  &:hover {
    border-color: $cp-line-strong;
  }

  &--green:first-child {
    background: $cp-success-bg;
    border-color: transparent;
  }

  &--on,
  &--on:first-child {
    border-color: $cp-success;
    box-shadow: 0 0 0 1px $cp-success;
  }

  &--amber.stat--on {
    border-color: $cp-warn-accent;
    box-shadow: 0 0 0 1px $cp-warn-accent;
  }

  &-value {
    @include cp-text(18px, 24px, 700);
    font-variant-numeric: tabular-nums;
  }

  &--green &-value {
    color: $cp-success;
  }

  &--amber &-value {
    color: $cp-warn-accent;
  }

  &-label {
    @include cp-text(11px, 15px);
    color: $cp-muted;
  }

  &-go {
    @include cp-text(11px, 14px, 600);
    margin-top: auto;
    padding-top: 4px;
    color: $cp-link;
  }
}

.focusBar {
  @include cp-text(13px, 18px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: $cp-muted;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;

  &-head {
    @include cp-text(16px, 22px, 600);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;

    --dot: #{$cp-success};

    &--purple {
      --dot: #{$friend};
    }

    &--amber {
      --dot: #{$cp-warn-accent};
    }
  }

  &-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--dot);
  }

  &-count {
    @include cp-text(11px, 14px, 500);
    padding: 1px 8px;
    border-radius: 999px;
    color: $cp-muted;
    background: $cp-hover;
  }
}

.card {
  --tone: #{$cp-success};
  --tone-soft: #{$cp-success-bg};
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 12px 12px 12px 8px;
  text-align: left;
  background: var(--tone-soft);
  border: 1px solid color-mix(in srgb, var(--tone) 35%, white);
  border-radius: $cp-r-sm;
  box-shadow: $cp-shadow-rest;

  &--purple {
    --tone: #{$friend};
    --tone-soft: #{$friend-soft};
  }

  &--amber {
    --tone: #{$cp-warn-accent};
    --tone-soft: #{$cp-warn-bg};
  }

  &--button {
    @include cp-reset-button;
    background: var(--tone-soft);
    border: 1px solid color-mix(in srgb, var(--tone) 35%, white);
    padding: 12px 12px 12px 8px;

    &:hover {
      border-color: var(--tone);
    }
  }

  &--flash {
    animation: card-flash 1.2s ease-out;
  }

  &-bar {
    width: 4px;
    flex-shrink: 0;
    border-radius: 4px;
    background: var(--tone);
  }

  &-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  &-code {
    @include cp-text(12px, 16px, 600);
    color: color-mix(in srgb, var(--tone) 80%, black);
  }

  &-credits {
    @include cp-text(11px, 16px);
    color: $cp-muted;
  }

  &-name {
    @include cp-text(13px, 18px, 500);
    color: $cp-ink;
  }

  &-when {
    @include cp-text(11px, 14px);
    color: $cp-muted;
  }
}

.remove {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $cp-line;

  &-link {
    color: $cp-muted;

    &:hover {
      color: $cp-err;
    }
  }

  &-danger {
    color: $cp-err;
    border-color: $cp-err-line;
  }
}

@keyframes card-flash {
  0%,
  40% {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 40%, white);
  }
  100% {
    box-shadow: $cp-shadow-rest;
  }
}
</style>
