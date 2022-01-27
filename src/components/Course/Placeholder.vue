<template>
  <div :class="{ 'placeholder--min': compact }" class="placeholder">
    <new-self-check-or-placeholder-course-modal
      v-if="isPlaceholderModalOpen"
      :subReqName="placeholderObj.name"
      :subReqDescription="getRequirementDescription()"
      :subReqLearnMore="getRequirementLearnMore()"
      :requirementId="getRequirementID()"
      :isPlaceholderModal="true"
      @add-course="assignCourse"
      @close-course-modal="closeModal"
      @delete-placeholder="deletePlaceholder"
    />
    <div class="placeholder-color">
      <img src="@/assets/images/dots/sixDots.svg" alt="" />
    </div>
    <div class="placeholder-content" @click="openModal()">
      <div class="placeholder-name" :class="{ 'placeholder-name--min': compact }">
        {{ placeholderObj.name }}
      </div>
      <course-caution :course="placeholderObj" :semesterIndex="semesterIndex" />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';
import NewSelfCheckOrPlaceholderCourseModal from '@/components/Modals/NewCourse/NewSelfCheckOrPlaceholderCourseModal.vue';

export default defineComponent({
  components: { CourseCaution, NewSelfCheckOrPlaceholderCourseModal },
  props: {
    placeholderObj: { type: Object as PropType<FirestoreSemesterPlaceholder>, required: true },
    compact: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  emits: {
    'delete-placeholder': (placeholderObj: FirestoreSemesterPlaceholder) =>
      typeof placeholderObj === 'object',
  },
  data() {
    return {
      isPlaceholderModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isPlaceholderModalOpen = true;
    },
    closeModal() {
      this.isPlaceholderModalOpen = false;
    },
    assignCourse() {
      // TODO @willespencer write the code that assigns a course to a placeholder
    },
    getRequirementID() {
      // TODO @willespencer get requirement ID from name and slot
      return '0';
    },
    getRequirementDescription() {
      // TODO @willespencer get requirement description to show on add modal
      return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum eu ligula in feugiat. Mauris sed cursus enim, eu feugiat nibh.';
    },
    getRequirementLearnMore() {
      // TODO @willespencer get requirement learn more link to show on add modal
      return 'https://cornelldti.org';
    },
    deletePlaceholder() {
      this.$emit('delete-placeholder', this.placeholderObj);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.placeholder {
  box-sizing: border-box;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  position: relative;
  height: 5.625rem;

  border-style: dashed;
  border-color: $borderGray;
  border-width: 2px 2px 2px 0;
  border-radius: 0.5rem;

  &:hover,
  &:active,
  &.focus {
    border-color: $yuxuanBlue;
    background: rgba(0, 0, 0, 0.03);
    color: $yuxuanBlue;
    cursor: grab;
  }

  &--min {
    height: 2.125rem;
  }

  &-color {
    background-color: $darkPlaceholderGray;
    width: $colored-grabber-width;
    border-radius: 0.42rem 0 0 0.42rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -2px 0;
  }

  &-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-name {
    font-size: 16px;
    font-weight: bold;
    color: $lightPlaceholderGray;

    &--min {
      font-size: 14px;
    }
  }
}
</style>
