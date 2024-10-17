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

    <div :class="['saveCourseModal-body']">
      <div
        :class="[
          'saveCourseModal-body-content',
          { 'default-collection': isDefaultCollection, scrollable: isNumCollectionGreaterThanFour },
        ]"
        v-for="(collection, index) in collections"
        :key="collection"
      >
        <div class="saveCourseModal-body-content-collection">
          <input
            v-if="!isDefaultCollection"
            type="checkbox"
            :id="'collection-' + index"
            :value="collection"
            v-model="checkedCollections"
          />
          <label :for="'collection-' + index">{{ collection }}</label>
        </div>
      </div>
    </div>
    <div v-if="isNumCollectionGreaterThanFour" class="saveCourseModal-divider-line"></div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  components: { TeleportModal },
  props: {
    courseCode: { type: String, required: true },
  },
  data() {
    return {
      checkedCollections: [] as string[], // New data property to manage checked state
    };
  },
  computed: {
    isDefaultCollection() {
      const collections = store.state.savedCourses.map(collection => collection.name);
      return collections.length === 0;
    },
    collections() {
      const collections = store.state.savedCourses.map(collection => collection.name);
      return collections.length === 0 ? ['No collections added yet'] : collections;
    },
    placeholder_name() {
      const oldcollections = store.state.savedCourses.map(collection => collection.name);
      let newCollectionNum = 1;
      // eslint-disable-next-line no-loop-func
      while (oldcollections.find(p => p === `Collection ${newCollectionNum}`)) {
        newCollectionNum += 1;
      }
      return `Collection ${newCollectionNum}`;
    },
    isNumCollectionGreaterThanFour() {
      return store.state.savedCourses.length >= 4;
    },
  },
  emits: {
    'close-save-course-modal': () => true,
    'save-course': (collections: string[]) => typeof collections === 'object',
    'add-collection': (name: string) => typeof name === 'string',
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-save-course-modal');
    },
    saveCourse() {
      this.$emit('save-course', this.checkedCollections);
      this.closeCurrentModal();
    },
    addCollection() {
      this.$emit('add-collection', this.placeholder_name);
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
    margin-bottom: 0.7rem;
    width: 112%;
    height: 2rem;
    border: 0.3px solid $lightGray;
    color: $primaryGray;
    padding: 1rem;

    &-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
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
    justify-content: flex-start;
    align-items: flex-start;
    color: $primaryGray;
    width: 100%;
    position: relative;
    max-height: 4.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;

    ::-webkit-scrollbar-button {
      display: none; /* Hide the up and down arrows */
    }

    &-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      width: 100%;

      &.default-collection {
        justify-content: center;
        align-items: center;
      }

      &-collection {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: $primaryGray;
        gap: 0.5rem;

        input[type='checkbox'] {
          margin: 0;
          padding: 0;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 0;
          border: 1px solid $lightGray;
          background-color: white;
          cursor: pointer;
          position: relative; // For the ::before element positioning
          user-select: none;
          outline: none;

          &:hover {
            border: 1px solid $emGreen;
          }

          &:checked {
            background-color: $emGreen;
            border: 1px solid $emGreen;
          }

          // Show checkbox vector when checked
          &:checked::before {
            content: '';
            background-image: url('@/assets/images/checkmark-color.svg');
            background-size: contain;
            background-repeat: no-repeat;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-48%, -40%);
            width: 10px;
            height: 10px;
          }
        }

        label {
          cursor: pointer;
          user-select: none;
          margin: 0;
          padding: 0;
          outline: none;
        }
      }
    }
  }
  &-divider-line {
    display: flex;
    align-self: center;
    width: 112%;
    height: 0.3px;
    background-color: $lightGray;
  }
}
</style>
