<template>
  <div class="course-outerWrapper course-tooltip">
    <div v-if="!compact" class="course-iconWrapper course-iconWrapper--caution">
      <img
        class="course-icon course-icon--caution"
        src="@/assets/images/caution.svg"
        alt="caution sign"
      />
    </div>
    <div class="course-tooltiptext course-tooltiptext--caution" v-html="cautionString"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    compact: Boolean,
    cautionString: {
      type: String,
      required: true,
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

    // TODO: styling for info icon on course card
    // &--info {
    //   &:before {
    //     margin-right: 0.2rem;
    //     font-style: normal;
    //     content: '|';
    //   }
    // }

    &--caution {
      &:before {
        margin-right: 0.2rem;
        font-style: normal;
        content: '|';
      }
    }
  }

  &-icon {
    width: 13px;

    &--info {
      margin-right: 4px;
    }
  }
}

// TODO: convert px to rem for spacing
/* Tooltip container */
.course-tooltip {
  position: relative;
  display: inline-block;
  // border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.course-tooltip .course-tooltiptext {
  visibility: hidden;
  width: 120px;
  color: $medGray;
  background-color: $white;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  left: -5.2rem;
  border: 0.75px solid #a7a7a7;
  top: 1.25rem;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;

  &--caution {
    width: 7.5rem;
  }
}

/* Show the tooltip text when you mouse over the tooltip container */
.course-tooltip:hover .course-tooltiptext {
  visibility: visible;
}

.course-tooltip .course-tooltiptext::after {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  right: 14px;
  margin-left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
  z-index: 3;
}

.course-tooltip .course-tooltiptext::before {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  right: 12px;
  margin-left: -2px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #a7a7a7 transparent;

  z-index: 2;
}

.course-tooltip .course-tooltiptext--info::after {
  right: 10px;
}

.course-tooltip .course-tooltiptext--info::before {
  right: 8px;
}
</style>
