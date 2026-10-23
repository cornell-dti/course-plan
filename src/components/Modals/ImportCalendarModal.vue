<template>
  <teleport-modal
    title="Import Calendar"
    content-class="content-import-calendar"
    left-button-text="Add"
    right-button-text="Replace"
    @modal-closed="$emit('close')"
    @left-button-clicked="$emit('import', false)"
    @right-button-clicked="$emit('import', true)"
  >
    <div class="importCalendarModal-body" data-cyId="importCalendarModal-body">
      {{ season }} {{ year }} has {{ courses.length === 1 ? 'a class' : 'classes' }} not in this
      calendar: <strong>{{ courses.map(course => course.code || course.name).join(', ') }}</strong
      >. Replace {{ courses.length === 1 ? 'it' : 'them' }} with the calendar's classes, or add the
      calendar's classes alongside?
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  props: {
    season: { type: String, required: true },
    year: { type: Number, required: true },
    courses: { type: Array as PropType<readonly FirestoreSemesterCourse[]>, required: true },
  },
  emits: {
    import: (replace: boolean) => typeof replace === 'boolean',
    close: () => true,
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.content-import-calendar {
  width: 28rem;
}

.importCalendarModal-body {
  line-height: 1.4;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-import-calendar {
    width: 100%;
  }
}
</style>
