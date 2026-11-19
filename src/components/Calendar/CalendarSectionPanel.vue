<template>
  <aside class="panel" role="dialog" aria-label="Choose sections" @keydown.esc="$emit('close')">
    <div class="panel-head">
      <div class="panel-titles">
        <span class="panel-code" :style="{ color: inkColor }">{{ course.code }}</span>
        <h2 class="panel-title">{{ course.name }}</h2>
        <span class="panel-sub">{{ semesterLabel }} · {{ course.credits }} credits</span>
      </div>
      <button
        ref="close"
        type="button"
        class="panel-close"
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

    <div class="panel-body">
      <p v-if="options.length === 0" class="panel-empty">
        No sections are listed for {{ course.code }} in {{ semesterLabel }}.
      </p>
      <p v-else class="panel-hint">
        Pick the section you plan to take for each part of this class. Your choice is saved to your
        plan.
      </p>

      <fieldset v-for="option in options" :key="option.component" class="panel-group">
        <legend class="panel-groupLabel">
          {{ componentLabel(option.component) }}
          <span class="panel-count">{{ option.sections.length }}</span>
        </legend>
        <label
          v-for="section in option.sections"
          :key="section.section"
          class="panel-option"
          :class="{ 'panel-option--on': isSelected(option.component, section.section) }"
        >
          <input
            type="radio"
            class="panel-radio"
            :name="`section-${course.uniqueID}-${option.component}`"
            :checked="isSelected(option.component, section.section)"
            @change="$emit('pick', option.component, section.section)"
          />
          <span class="panel-dot" aria-hidden="true" />
          <span class="panel-optionText">
            <span class="panel-optionName">{{ option.component }} {{ section.section }}</span>
            <span class="panel-optionTime">{{ meetingText(section) }}</span>
          </span>
        </label>
      </fieldset>
    </div>
  </aside>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import {
  ComponentOptions,
  CourseSection,
  formatMeeting,
  selectedSections,
} from '@/components/Calendar/calendar-utils';

const COMPONENT_NAMES: Record<string, string> = {
  LEC: 'Lecture',
  DIS: 'Discussion',
  LAB: 'Lab',
  SEM: 'Seminar',
  REC: 'Recitation',
  STU: 'Studio',
  IND: 'Independent study',
  CLN: 'Clinical',
  FLD: 'Fieldwork',
  PRA: 'Practicum',
  TA: 'Tutorial',
};

export default defineComponent({
  props: {
    course: { type: Object as PropType<FirestoreSemesterCornellCourse>, required: true },
    options: { type: Array as PropType<readonly ComponentOptions[]>, required: true },
    semesterLabel: { type: String, required: true },
  },
  emits: {
    close: () => true,
    pick: (component: string, section: string) =>
      typeof component === 'string' && typeof section === 'string',
  },
  computed: {
    inkColor(): string {
      return `color-mix(in srgb, #${this.course.color} 72%, black)`;
    },
    selected(): CourseSection[] {
      return selectedSections(this.options, this.course.sectionChoices);
    },
  },
  mounted() {
    (this.$refs.close as HTMLButtonElement | undefined)?.focus();
  },
  methods: {
    componentLabel(component: string): string {
      const name = COMPONENT_NAMES[component];
      return name ? `${name} (${component})` : component;
    },
    isSelected(component: string, section: string): boolean {
      return this.selected.some(s => s.component === component && s.section === section);
    },
    meetingText(section: CourseSection): string {
      return section.meetings.length > 0
        ? section.meetings.map(formatMeeting).join(' · ')
        : 'No meeting time listed';
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

// V2 side panel: full height on the right, slides over the page
.panel {
  @include cp-font;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  width: min(400px, 90vw);
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: -8px 0 24px 0 rgba(15, 23, 41, 0.1);
  animation: panel-in 200ms cubic-bezier(0.2, 0.8, 0.2, 1) both;

  &-head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid $cp-line;
  }

  &-titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &-code {
    @include cp-text(12px, 16px, 600);
  }

  &-title {
    @include cp-text(18px, 24px, 700);
    color: $cp-ink;
    margin: 0;
  }

  &-sub {
    @include cp-text(12px, 16px);
    color: $cp-muted;
  }

  &-close {
    @include cp-reset-button;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $cp-r-sm;
    color: $cp-muted;

    &:hover {
      background: $cp-hover;
      color: $cp-ink;
    }

    &:active {
      background: $cp-press;
    }
  }

  &-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &-hint,
  &-empty {
    @include cp-text(13px, 18px);
    color: $cp-muted;
    margin: 0;
  }

  &-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    border: none;
    min-width: 0;
  }

  &-groupLabel {
    @include cp-text(12px, 16px, 600);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
    color: $cp-ink;
  }

  &-count {
    @include cp-pill(fill);
  }

  // radio row, like the prototype's Radio: soft teal when picked
  &-option {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 8px 12px;
    background: #fff;
    border: 1px solid $cp-line-strong;
    border-radius: $cp-r-md;
    cursor: pointer;
    transition: background-color 100ms, border-color 100ms;

    &:hover {
      background: $cp-hover;
    }

    &:focus-within {
      outline: 2px solid $cp-brand;
      outline-offset: 2px;
    }

    &--on,
    &--on:hover {
      background: $cp-soft;
      border-color: $cp-link;
    }
  }

  &-radio {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &-dot {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid $cp-line-strong;
    background: #fff;

    .panel-option--on & {
      border-color: $cp-link;
      background: radial-gradient(circle, $cp-brand 0 4px, #fff 4.5px);
    }
  }

  &-optionText {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &-optionName {
    @include cp-text(13px, 18px, 600);
    color: $cp-ink;

    .panel-option--on & {
      color: $cp-link-strong;
    }
  }

  &-optionTime {
    @include cp-text(12px, 16px);
    color: $cp-muted;
  }
}

@keyframes panel-in {
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
</style>
