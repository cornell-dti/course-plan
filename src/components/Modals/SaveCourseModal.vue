<template>
  <teleport-modal
    :title="`${courseName} Saved`"
    content-class="content-plan"
    right-button-text="Save"
    @model-closed="closeCurrentModal"
    @right-button-clicked="saveCourse"
  >
    <div>
      <hr />
      <span> Collection </span>
      <div @click="addNewCollection">
        <img src="src\assets\images\plus.svg" alt="add new collection" />
      </div>
      <hr />
    </div>
    <div class="saveCourseModal-body">
      <!--TODO: add default view and another view when they are collections to be populated-->
      <div>
        <p>{{ collection }}</p>
      </div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
// import store from '@/store';

export default defineComponent({
  props: {
    courseName: { type: String, required: true },
    collection: { type: String, default: 'No collections added yet' },
  },
  components: { TeleportModal },
  emits: {
    'close-save-course-modal': () => true,
    'save-course': (name: string) => typeof name === 'string',
    'open-add-collection-modal': () => true,
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-save-course-modal');
    },
    saveCourse() {
      this.$emit('save-course', this.courseName);
      this.$emit('close-save-course-modal');
    },
    addNewCollection() {
      this.$emit('close-save-course-modal');
      this.$emit('open-add-collection-modal');
    },
  },
  data() {
    return { isDisabled: false };
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.content-plan {
  width: 20rem;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}
</style>
