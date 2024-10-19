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
                :fillColor="dropdownStates[0] && !isEditCollectionModalOpen ? emGreen : darkGray"
                :isFlipped="dropdownStates[0] && !isEditCollectionModalOpen"
                class="arrow"
              >
              </drop-down-arrow>
              <span :class="{ highlighted: dropdownStates[0] && !isEditCollectionModalOpen }">
                All
              </span>
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
                @course-on-click="courseOnClick"
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
              >
              </drop-down-arrow>
              <span :class="{ highlighted: dropdownStates[index + 1] }">
                {{ collection }}
              </span>
            </div>
          </button>
          <button class="course-dotRow" @click="openEditCollectionModal">
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

import { /* PropType , */ defineComponent } from 'vue';
// import draggable from 'vuedraggable'; // implement later with backend
import Course from '@/components/Course/Course.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { isPlaceholderCourse } from '@/utilities';
import store from '@/store';

export default defineComponent({
  components: {
    // draggable, // implement later with backend
    Course,
    DropDownArrow,
  },
  props: {
    // collections: {
    //   type: Array as PropType<readonly Collection[]>,
    //   required: true,
    // },
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
      return store.state.currentPlan.semesters[6].courses
        .map(course => {
          if (!isPlaceholderCourse(course)) {
            return course;
          }
          // do not want to return placeholder courses
          return null;
        })
        .filter(course => course !== null)
        .filter(
          course =>
            course.name === 'Beginning Swimming' || course.name === 'Introductory Statistics'
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
  emits: {
    'course-onclick': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'delete-course-from-collection': (courseCode: string) => typeof courseCode === 'string',
    'open-edit-collection-modal': (collection: string) => typeof collection === 'string',
  },
  methods: {
    isPlaceholderCourse,
    closeDropdownIfOpen(index: number) {
      // Toggle the clicked dropdown and close others
      this.dropdownStates = this.dropdownStates.map((state, i) => (i === index ? !state : false));
    },
    openEditCollectionModal() {
      // Open modal to edit collection
      this.isEditCollectionModalOpen = true;
      this.$emit('open-edit-collection-modal', 'Collection X');
    },
    deleteCourseFromCollection(courseCode: string) {
      this.$emit('delete-course-from-collection', courseCode);
    },
    courseOnClick(course: FirestoreSemesterCourse) {
      this.$emit('course-onclick', course);
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
    gap: 0.5rem;
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

::v-deep .arrow {
  margin-top: -8px;

  &-up {
    margin-top: 3px;
  }
}
</style>
