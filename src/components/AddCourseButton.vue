<template>
  <div
    class="semester-courseWrapper semester-addWrapper"
    :class="{
      'semester-addWrapper--compact': compact,
      'my-2 mx-0': shouldClearPadding,
    }"
    @click="onClick"
    :data-intro-group="shouldShowWalkthrough ? 'pageTour' : null"
    :data-step="shouldShowWalkthrough ? '3' : null"
    :data-intro="shouldShowWalkthrough ? walkthroughText() : null"
    :data-disable-interaction="shouldShowWalkthrough ? '1' : null"
    :data-tooltipClass="shouldShowWalkthrough ? 'tooltipCenter' : null"
  >
    <span class="semester-buttonText" :class="{ 'semester-buttonText--compact': compact }">
      {{ addCourseText }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    compact: { type: Boolean, required: true },
    shouldClearPadding: { type: Boolean, default: false },
    shouldShowWalkthrough: { type: Boolean, default: false },
  },
  computed: {
    addCourseText() {
      return '+ Course';
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    walkthroughText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Add Classes to your Schedule</div><div class="introjs-customProgress">3/3</div>
      </div><div class = "introjs-bodytext">Press "+ Course" to add classes! Edit semesters using the ellipses on the top right and drag courses between semesters.</div>`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

@mixin hover-button {
  border-color: $yuxuanBlue;
  background: rgba(0, 0, 0, 0.03);
  color: $yuxuanBlue;
  cursor: pointer;
}

.semester {
  width: fit-content;
  position: relative;
  border-radius: 11px;

  &--compact {
    padding: 0.875rem 1.125rem;
  }

  &-courseWrapper {
    margin: 0.5rem 0 0.5rem 0;
  }

  &-addWrapper {
    margin-top: -5rem;
    width: 21.375rem;
    height: 4.625rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1.125rem;
    margin-right: 1.125rem;

    &--compact {
      margin-top: -1.2rem;
      width: 10rem;
      height: 2rem;
    }

    &:hover,
    &:active,
    &:focus {
      @include hover-button();
    }
  }

  &-buttonText {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $medGray;

    &--compact {
      font-size: 14px;
      line-height: 17px;
    }
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .semester {
    &-addWrapper {
      width: 17rem;
      &--compact {
        width: 10rem;
        height: 2rem;
      }
    }
  }
}
</style>
