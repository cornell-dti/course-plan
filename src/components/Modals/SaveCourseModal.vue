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
      <div class="saveCourseModal-header-text">
        <span> Collections </span>
        <button class="saveCourseModal-header-text-addButton" @click="addCollection">
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
    'add-collection': (name: string) => typeof name === 'string',
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-save-course-modal');
    },
    saveCourse() {
      this.$emit('save-course', this.courseCode);
      this.$emit('close-save-course-modal');
    },
    addCollection() {
      // this.$emit('add-collection');
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
    margin-bottom: 2rem;
    width: 112%;
    color: $primaryGray;
    padding: 1rem 0rem; /* Increased padding for vertical spacing */
  }

  &-header-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 900;
    width: 100%;
    position: relative;
    padding: 0rem 0.5rem;

    /* Create horizontal lines using ::before and ::after */
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background-color: $darkPlaceholderGray;
    }

    /* Top line */
    &::before {
      top: -0.5rem; /* Position line above the text */
    }

    /* Bottom line */
    &::after {
      bottom: -0.5rem; /* Position line below the text */
    }

    &-addButton {
      margin-left: 0.5rem;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
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
