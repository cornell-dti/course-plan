<template>
  <div class="course-tooltip">
    <div class="course-iconWrapper course-iconWrapper--caution">
      <img class="course-icon course-icon--caution" :src="icon" :alt="alt" />
    </div>
    <div class="course-tooltiptext">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import info from '@/assets/images/info.svg';
import caution from '@/assets/images/caution.svg';

export default defineComponent({
  props: {
    isInformation: { type: Boolean, required: true },
  },
  computed: {
    icon(): string {
      return this.isInformation ? info : caution;
    },
    alt(): string {
      return this.isInformation ? 'information sign' : 'caution sign';
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.course {
  &-iconWrapper {
    font-style: normal;
    display: flex;
    margin-left: 0.2rem;
    align-items: center;

    &--caution {
      &:before {
        margin-right: 0.2rem;
        font-style: normal;
        content: '|';
      }
    }
  }

  &-icon {
    width: 0.875rem;
  }
}

// TODO: convert px to rem for spacing
/* Tooltip container */
.course-tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.course-tooltip .course-tooltiptext {
  visibility: hidden;
  width: 10rem;
  color: $medGray;
  background-color: $white;
  text-align: left;
  padding: 0.5rem;
  border-radius: 6px;
  left: -0.25rem;
  border: 0.75px solid #a7a7a7;
  top: 1.25rem;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.course-tooltip:hover .course-tooltiptext {
  visibility: visible;
}

/**
 * The element that produces a white triangle,
 * which hides most of the gray triangle below except a 1px border.
 */
.course-tooltip .course-tooltiptext::after {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  left: 0.875rem;
  margin-right: -0.625rem;
  border-width: 0.313rem;
  border-style: solid;
  border-color: transparent transparent white transparent;
  z-index: 3;
}

/** The element that produces a gray triangle */
.course-tooltip .course-tooltiptext::before {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  left: 0.75rem;
  margin-right: -0.125rem;
  border-width: 0.438rem;
  border-style: solid;
  border-color: transparent transparent #a7a7a7 transparent;

  z-index: 2;
}
</style>
