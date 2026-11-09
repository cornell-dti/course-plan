<template>
  <aside v-if="isVisible" class="pre-enroll-banner" aria-label="Pre-enrollment reminder">
    <button
      type="button"
      class="pre-enroll-banner-close"
      aria-label="Dismiss pre-enrollment countdown"
      :disabled="saving"
      :aria-busy="saving"
      @click="dismiss"
    >
      <img src="@/assets/images/x-white.svg" alt="" />
    </button>

    <div>
      <!-- Avoid announcing the countdown every second to screen readers. -->
      <p class="pre-enroll-banner-message" role="timer" aria-live="off">
        {{ message }}
      </p>
      <p v-if="error" class="pre-enroll-banner-error" role="alert">{{ error }}</p>
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref } from 'vue';

import { dismissPreEnrollBanner } from '@/global-firestore-data';
import { getPreEnrollBanner } from '@/pre-enroll';

export default defineComponent({
  name: 'PreEnrollBanner',

  props: {
    onboardingData: {
      type: Object as PropType<AppOnboardingData>,
      required: true,
    },
  },

  emits: ['dismiss'],

  setup(props, { emit }) {
    const now = ref(Date.now());
    const saving = ref(false);
    const dismissalError = ref<{ key: string; message: string } | null>(null);
    let intervalId: number | undefined;

    const banner = computed(() => getPreEnrollBanner(props.onboardingData, new Date(now.value)));

    const isVisible = computed(() => banner.value !== null);

    const error = computed(() =>
      dismissalError.value?.key === banner.value?.dismissalKey
        ? dismissalError.value?.message ?? ''
        : ''
    );

    const dateRange = computed(() => {
      const enrollment = banner.value;
      if (!enrollment) return '';

      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: enrollment.timezone,
        month: 'short',
        day: 'numeric',
      });

      const finalDay = new Date(enrollment.endExclusive.getTime() - 1);

      return `${formatter.format(enrollment.start)} – ${formatter.format(finalDay)}`;
    });

    const message = computed(() => {
      const enrollment = banner.value;
      if (!enrollment) return '';

      if (enrollment.status === 'open') {
        return `Your pre-enroll window is open: ${dateRange.value}`;
      }

      const days = enrollment.daysRemaining;

      if (days >= 14) {
        const weeks = Math.floor(days / 7);
        return `Pre-enroll starts in ${weeks} weeks: ${dateRange.value}`;
      }

      if (days > 0) {
        return `Pre-enroll starts in ${days} ${days === 1 ? 'day' : 'days'}: ${dateRange.value}`;
      }

      const seconds = Math.max(0, Math.ceil((enrollment.start.getTime() - now.value) / 1000));
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remaining = seconds % 60;

      const countdown = [hours, minutes, remaining]
        .map(value => String(value).padStart(2, '0'))
        .join(':');

      return `Pre-enroll starts in ${countdown}: ${dateRange.value}`;
    });

    const dismiss = async () => {
      const enrollment = banner.value;
      if (!enrollment || saving.value) return;

      saving.value = true;
      dismissalError.value = null;

      try {
        await dismissPreEnrollBanner(enrollment.termId, enrollment.reminderStage);
        emit('dismiss', enrollment.termId);
      } catch {
        dismissalError.value = {
          key: enrollment.dismissalKey,
          message: 'Could not save dismissal. Please try again.',
        };
      } finally {
        saving.value = false;
      }
    };

    onMounted(() => {
      now.value = Date.now();

      intervalId = window.setInterval(() => {
        now.value = Date.now();
      }, 1000);
    });

    onBeforeUnmount(() => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    });

    return {
      isVisible,
      message,
      dismiss,
      saving,
      error,
    };
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.pre-enroll-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  min-height: 41px;
  padding: 8px 4.5rem;
  background-color: #4daaa5;
  border: 0.5px solid #508197;

  &-message {
    margin: 0;
    color: $searchBoxWhite;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  &-error {
    margin: 4px 0 0;
    color: $searchBoxWhite;
    font-size: 14px;
    text-align: center;
  }

  &-close {
    position: absolute;
    top: 50%;
    left: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    cursor: pointer;
    transform: translate(-50%, -50%);

    img {
      display: block;
    }

    &:disabled {
      cursor: wait;
      opacity: 0.6;
    }

    &:focus-visible {
      outline: 2px solid $white;
      outline-offset: 2px;
      border-radius: 3px;
    }
  }

  @media screen and (max-width: $medium-breakpoint) {
    &-close {
      // The mobile navbar places the CoursePlan logo on the right.
      left: calc(100% - 2.25rem);
    }
  }

  @media screen and (max-width: $small-breakpoint) {
    &-message {
      font-size: 16px;
      line-height: 20px;
    }
  }
}
</style>
