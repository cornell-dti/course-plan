<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="separator-header"></div>
      Collections
    </div>

    <div class="sidebar-content">
      <div class="dropdown-item-button">
        <div class="dropdown-item-button-title">
          <button @click="closeDropdownIfOpen(0)" style="padding-left: 0rem">
            <div class="dropdown-item-button-title-collection">
              <drop-down-arrow
                :fillColor="dropdownStates[0] ? emGreen : darkGray"
                :isFlipped="dropdownStates[0]"
                class="arrow"
              />
              <span :class="{ highlighted: dropdownStates[0] }"> All </span>
            </div>
          </button>
        </div>
        <div v-if="dropdownStates[0]">
          <div v-if="!hasCourses" class="center-content">No classes added yet</div>
          <div v-else>
            <div v-for="(course, index) in coursesAll" :key="index" class="dropdown-item-content">
              <course
                :courseObj="course"
                :isReqCourse="false"
                :compact="false"
                :active="false"
                :isSemesterCourseCard="false"
                @delete-course-from-collection="deleteCourseFromCollection"
              />
            </div>
          </div>
        </div>
        <div class="separator"></div>
      </div>
      <!-- Dynamic Collections -->
      <div v-for="(collection, index) in collections" :key="index" class="dropdown-item-button">
        <div class="dropdown-item-button-title">
          <button @click="closeDropdownIfOpen(index + 1)" style="padding-left: 0rem">
            <div class="dropdown-item-button-title-collection">
              <drop-down-arrow
                :fillColor="dropdownStates[index + 1] ? emGreen : darkGray"
                :isFlipped="dropdownStates[index + 1]"
                class="arrow"
              />
              <span :class="{ highlighted: dropdownStates[index + 1] }">
                {{ collection }}
              </span>
            </div>
          </button>
          <button class="course-dotRow" @click="openEditCollectionModal(collection)">
            <img src="@/assets/images/dots/threeDots.svg" alt="open edit collection modal" />
          </button>
        </div>
        <div v-if="dropdownStates[index + 1]">
          <div v-if="true" class="center-content">No classes added yet</div>
          <div v-else>
            <!-- Add your course components here. For Backend Implementation -->
          </div>
        </div>
        <div class="separator"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* Hannah's note for backend: This component is a sidebar that shows collections of saved courses
collections: data from the store, given from parent RequirementSideBar.vue
when we open a collection, we will show the courses from that collection
*/

import { defineComponent } from 'vue';
// import draggable from 'vuedraggable'; // implement later with backend
import Course from '@/components/Course/Course.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { isPlaceholderCourse } from '@/utilities';
import store from '@/store';

export default defineComponent({
  // props: {
  //   // collections: {
  //   //   type: Array as PropType<readonly Collection[]>,
  //   //   required: true,
  //   // },
  // },
  components: {
    // draggable, // implement later with backend
    Course,
    DropDownArrow,
  },
  emits: {
    'delete-course-from-collection': (courseCode: string) => typeof courseCode === 'string',
    'open-edit-collection-modal': (collection: string) => typeof collection === 'string',
  },
  data() {
    return {
      shown: false,
      dropdownStates: [false, false, false], // This will change when integrated with backend
      emGreen: '#148481',
      darkGray: '#4F4F4F',
      isEditCollectionModalOpen: false,
    };
  },
  computed: {
    coursesAll() {
      // fixed courses for the All Collection
      return store.state.currentPlan.semesters[0].courses
        .filter(course => !isPlaceholderCourse(course)) // Filter out placeholder courses directly
        .filter(
          course =>
            course.name === 'Introduction to Computing: A Design and Development Perspective' ||
            course.name === 'Object-Oriented Programming and Data Structures'
        );
    },
    collections() {
      // Dummy data; replace with store.state.savedCourses when integrated
      return ['Collection 1', 'Collection 2'];
    },
    hasCourses() {
      return this.coursesAll.length > 0; // dummy data
    },
  },
  methods: {
    isPlaceholderCourse,
    closeDropdownIfOpen(index: number) {
      // Toggle the clicked dropdown and close others
      this.dropdownStates = this.dropdownStates.map((state, i) => (i === index ? !state : false));
    },
    openEditCollectionModal(collection: string) {
      // Open modal to edit collection
      this.isEditCollectionModalOpen = true;
      this.$emit('open-edit-collection-modal', collection);
    },
    deleteCourseFromCollection(courseCode: string) {
      this.$emit('delete-course-from-collection', courseCode);
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
</style>
