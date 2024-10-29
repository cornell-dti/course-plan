<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="separator-header"></div>
      Collections
    </div>

    <div class="sidebar-content">
      <div v-for="(collection, index) in collections" :key="index" class="dropdown-item-button">
        <div class="dropdown-item-button-title">
          <button @click="closeDropdownIfOpen(index)" style="padding-left: 0rem">
            <div class="dropdown-item-button-title-collection">
              <drop-down-arrow
                :fillColor="dropdownStates[index] ? emGreen : darkGray"
                :isFlipped="dropdownStates[index]"
                class="arrow"
              />
              <span :class="{ highlighted: dropdownStates[index] }">
                {{ collection }}
              </span>
            </div>
          </button>
          <button class="course-dotRow" @click="openEditCollectionModal(collection)">
            <div v-if="!isDefaultCollection(collection)">
              <img src="@/assets/images/dots/threeDots.svg" alt="open edit collection modal" />
            </div>
          </button>
        </div>
        <div v-if="!dropdownStates[index]" class="separator"></div>
        <div v-if="dropdownStates[index]">
          <div v-if="coursesAll(collection).length == 0" class="center-content">
            No classes added yet
          </div>
          <div v-else>
            <div
              v-for="(course, index2) in coursesAll(collection)"
              :key="index2"
              class="dropdown-item-content"
            >
              <draggable
                :group="{ name: 'draggable-semester-courses', pull: 'clone', put: false }"
                :modelValue="[course]"
                :clone="cloneCourse"
                item-key="code"
              >
                <template #item="{ element: templatedCourse }">
                  <course
                    :courseObj="templatedCourse"
                    :isReqCourse="false"
                    :compact="false"
                    :active="false"
                    :isSemesterCourseCard="false"
                    class="collection-course"
                    @delete-course-from-collection="deleteCourseFromCollection(collection, templatedCourse)"
                  />
                </template>
              </draggable>
            </div>
          </div>
          <div class="separator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';
import Course from '@/components/Course/Course.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { isPlaceholderCourse, isFirestoreSemesterCourse } from '@/utilities';
import store from '@/store';
import { incrementUniqueID } from '@/global-firestore-data';

export default defineComponent({
  components: {
    draggable,
    Course,
    DropDownArrow,
  },
  emits: {
    'delete-course-from-collection': (collection: string, courseCode: string) =>
      typeof collection === 'string' && typeof courseCode === 'string',
    'open-edit-collection-modal': (collection: string) => typeof collection === 'string',
  },
  data() {
    return {
      shown: false,
      emGreen: '#148481',
      darkGray: '#4F4F4F',
      dropdownStates: [] as boolean[],
      isEditCollectionModalOpen: false,
    };
  },
  computed: {
    collections() {
      // Dummy data; replace with store.state.savedCourses when integrated
      return store.state.savedCourses.map(collection => collection.name);
    },
    hasCourses(collection: Collection) {
      return collection.courses.length > 0;
    },
  },
  mounted() {
    // Initialize dropdown states when the component mounts
    this.intializeDropdownStates();
  },
  watch: {
    // Watch for changes in collections and reinitialize dropdown states
    collections: {
      immediate: true,
      handler() {
        this.intializeDropdownStates();
      },
    },
  },
  methods: {
    isPlaceholderCourse,
    isFirestoreSemesterCourse,
    isDefaultCollection(collection: string) {
      return collection === 'All';
    },
    coursesAll(name: string): readonly FirestoreSemesterCourse[] {
      const collection = store.state.savedCourses.find(c => c.name === name);
      return collection?.courses || [];
    },
    intializeDropdownStates() {
      this.dropdownStates = Array(this.collections.length).fill(false);
    },
    closeDropdownIfOpen(index: number) {
      // Toggle the clicked dropdown and close others
      this.dropdownStates = this.dropdownStates.map((state, i) => (i === index ? !state : false));
    },
    openEditCollectionModal(collection: string) {
      // Open modal to edit collection
      this.isEditCollectionModalOpen = true;
      this.$emit('open-edit-collection-modal', collection);
    },
    deleteCourseFromCollection(collection: string, course: FirestoreSemesterCourse) {
      this.$emit('delete-course-from-collection', collection, course.code);
    },
    cloneCourse(courseWithDummyUniqueID: FirestoreSemesterCourse): FirestoreSemesterCourse {
      return { ...courseWithDummyUniqueID, uniqueID: incrementUniqueID() };
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.sidebar {
  height: 100%;
  position: relative;
  margin-top: 1.5rem;

  &-header {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    font-size: 16px;
    font-weight: 700;
    color: $darkGray;
  }

  &-content {
    display: flex;
    flex-direction: column;
  }
}

.separator-header {
  width: 100%;
  height: 2px;
  background: #587c91;
}

.dropdown-item-content {
  display: flex;
  flex-direction: column;
  color: $lightGray;
  margin-top: 0.3rem;
  margin-bottom: 1.3rem;
  gap: 2rem;
}

.center-content {
  display: flex;
  justify-content: center;
  color: $lightGray;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.dropdown-item-button {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem 0;

  &-title,
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: $darkGray;
    font-size: 14px;
    font-weight: 700;

    &-collection {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .highlighted {
    color: $emGreen;
  }
}

.course-dotRow {
  padding: 0;
  &:hover,
  &:active,
  &:focus {
    cursor: pointer;
  }
}

.separator {
  margin-top: 0.5rem;
  width: 100%;
  height: 2px;
  background: rgba(196, 196, 196, 0.4);
}

:deep(.arrow) {
  margin-top: -8px;
}

:deep(.arrow-up) {
  margin-top: 3px;
}

.collection-course {
  touch-action: none;
  cursor: grab;
  
  &:active:hover {
    touch-action: none;
    cursor: grabbing;
  }
}
</style>
