<template>
  <teleport-modal
    content-class="content-plan"
    right-button-text="Save"
    @model-closed="closeCurrentModal"
    @right-button-clicked="saveCourse"
    :has-custom-position="true"
  >
    <template #title>
      <div class="saveCourseModal-title">
        <img src="src\assets\images\savedIconBig.svg" alt="big saved icon" />
        <h1>{{ courseName }} Saved</h1>
      </div>
    </template>
    <div class="saveCourseModal-header">
      <div class="saveCourseModal-header-line"><hr /></div>
      <div class="saveCourseModal-header-content">
        <span>Collections</span>
        <button class="saveCourseModal-header-addButton" @click="addNewCollection">
          <img src="src\assets\images\plus.svg" alt="add new collection" />
        </button>
      </div>
      <div class="saveCoursesModal-header-line" v-if="isdefaultCollection"><hr /></div>
    </div>

    <div class="saveCourseModal-body">
      <!--TODO: add default view and another view when they are collections to be populated-->
      <div class="saveCourseModal-body-content">
        <p>{{ collection }}</p>
        <!--Must find all possible collections
            Checkbox Style
        -->
      </div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
// import store from '@/store';

export default defineComponent({
  components: { TeleportModal },
  props: {
    courseName: { type: String, required: true },
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
      this.$emit('save-course', this.courseName);
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
  width: 40rem;
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
    padding-top: 1rem;
    gap: 0.5rem;
    img {
      align-self: flex-start;
    }
  }
  &-header {
    display: flex;
    flex-direction: column;
    hr {
      margin-left: -6%;
      width: 112%;
    }
    &-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: $primaryGray;
      span {
        font-size: 13px;
        font-style: normal;
        font-weight: 900;
      }
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
