<template>
  <teleport-modal
    content-class="content-plan"
    right-button-text="Done"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="saveCourse"
  >
    <template #title>
      <div class="saveCourseModal-title">
        <img src="@/assets/images/saveIconBig.svg" alt="big saved icon" />
        <h1>{{ courseCode }} Saved</h1>
      </div>
    </template>

    <div class="saveCourseModal-header">
      <!-- create a rectangular border-->
      <div class="saveCourseModal-header-text">
        <span> Collections </span>
        <button class="saveCourseModal-header-text-addButton" @click="addNewCollection">
          <img src="@/assets/images/plus.svg" alt="add new collection" />
        </button>
      </div>
    </div>

    <div class="saveCourseModal-body">
      <div class="saveCourseModal-body-content">
        <p>{{ collection }}</p>
        <!--Must find all possible collections
            Checkbox Style
            Need a collections variable in firestore
        -->
      </div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  props: {
    courseCode: { type: String, required: true },
    collection: { type: String, default: 'No collections added yet' },
    isdefaultCollection: { type: Boolean, default: true },
  },
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
      this.$emit('save-course', this.courseCode);
      this.$emit('close-save-course-modal');
    },
    addNewCollection() {
      this.$emit('close-save-course-modal');
      this.$emit('open-add-collection-modal');
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.content-plan {
  width: 20rem;
  margin-top: 8rem;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}

.saveCourseModal {
  &-title {
    display: flex;
    justify-content: space-between;
    padding-top: 0.6rem;
    gap: 0.5rem;
    img {
      margin-top: 2%;
      align-self: flex-start;
    }
  }
  &-header {
    display: flex;
    align-self: center;
    margin-left: 0%;
    margin-bottom: 2rem;
    width: 112%;
    height: 2rem;
    border: 0.5px solid rgb(176, 156, 156);
    color: $primaryGray;
    padding: 0.5rem;
    &-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 13px;
      font-style: normal;
      font-weight: 900;
      width: 100%;
      &-addButton {
        cursor: pointer;
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  &-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $darkPlaceholderGray;
  }
}
</style>
