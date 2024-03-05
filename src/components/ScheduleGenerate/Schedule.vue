<template>
  <div class="schedule-main">
    <div class="schedule-week">
      <div>Monday</div>
      <div>Tuesday</div>
      <div>Wednesday</div>
      <div>Thursday</div>
      <div>Friday</div>
      <div>Saturday</div>
      <div>Sunday</div>
    </div>
    <div class="schedule-body">
      <div class="schedule-hours" v-for="hoursRange"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  props: {
    classes: {
      type: Array as PropType<
        Array<{ color: string; title: string; name: string; startHour: Date; endHour: Date }>
      >,
      required: true,
    },
  },
  computed: {
    hoursRange(): number[] {
      return Array.from(
        { length: this.endHour - this.startHour },
        (_, i) => this.startHour + 1 + i
      );
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.schedule {
  &-main {
    border-color: $inactiveGray;
    border: 1px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 4px;

    padding: 2rem 3rem 1rem 5rem;
  }

  &-week {
    display: flex;
    flex-direction: row;
    color: $secondaryGray;
    justify-content: space-between;
  }
}
</style>
