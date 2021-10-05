<template>
  <main
    class="semesterView"
    :class="{
      bottomBar: isBottomBar && isBottomBarExpanded,
      expandedBottomBarSemesterView: isBottomBarExpanded,
      collapsedBottomBarSemesterView: isBottomBar && !isBottomBarExpanded,
    }"
    @click="closeBar"
    :key="key"
  >
    <div class="semesterView-top">
      <new-semester-modal
        @add-semester="addSemester"
        @close-sem-modal="closeSemesterModal"
        v-if="isSemesterModalOpen"
      />
      <div
        class="semesterView-settings"
        :class="{ 'semesterView-settings--two': noSemesters }"
      >
        <button
          v-if="noSemesters"
          class="semesterView-addSemesterButton"
          @click="openSemesterModal"
          data-cyId="semesterView-addSemesterButton"
        >
          + New Semester
        </button>
        <!--
        <div
          class="semesterView-switch"
          data-intro-group="req-tooltip"
          :data-intro="getToggleTooltipText()"
          data-disable-interaction="1"
          data-step="4"
          data-tooltipClass="tooltipCenter"
        >
          <span class="semesterView-switchText">View:</span>
          <button
            class="
              semesterView-switchImage semesterView-twoColumn
              full-opacity-on-hover
            "
            @click="setNotCompact"
            :class="{ 'semesterView-twoColumn--active': !compact }"
          />
          <button
            class="
              semesterView-switchImage semesterView-fourColumn
              full-opacity-on-hover
            "
            @click="setCompact"
            :class="{ 'semesterView-fourColumn--active': compact }"
          />
        </div>
        -->
        <order-dropdown />
      </div>
      <confirmation
        :text="confirmationText"
        v-if="isSemesterConfirmationOpen"
      />
      <div class="semesterView-content">
        <div
          v-for="(sem, semesterIndex) in semesters"
          :key="`${sem.year}-${sem.type}`"
          class="semesterView-wrapper"
          :class="{ 'semesterView-wrapper--compact': compact }"
        >
          <semester
            ref="semester"
            :type="sem.type"
            :year="sem.year"
            :courses="sem.courses"
            :semesterIndex="semesterIndex"
            :compact="compact"
            :activatedCourse="activatedCourse"
            :isFirstSem="checkIfFirstSem(sem)"
            @course-onclick="courseOnClick"
            @new-semester="openSemesterModal"
            @delete-semester="deleteSemester"
          />
        </div>
        <div
          v-if="!compact"
          class="semesterView-empty"
          aria-hidden="true"
        ></div>
        <div
          v-if="compact"
          class="semesterView-empty semesterView-empty--compact"
          aria-hidden="true"
        ></div>
        <div
          v-if="compact"
          class="semesterView-empty semesterView-empty--compact"
          aria-hidden="true"
        ></div>
        <div
          v-if="compact"
          class="semesterView-empty semesterView-empty--compact"
          aria-hidden="true"
        ></div>
        <div v-if="compact"><div v-if="compact"></div></div>
      </div>
    </div>
    <div class="semesterView-bot">
      <div class="semesterView-builtBy">
        Built with
        <img
          class="semesterView-heart"
          src="@/assets/images/redHeart.svg"
          alt="heart"
        />
        by
        <a
          target="_blank"
          href="https://www.cornelldti.org/projects/courseplan/"
        >
          Cornell Design &amp; Tech Initiative
        </a>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Semester from '@/components/Semester/Semester.vue';
import Confirmation from '@/components/Modals/Confirmation.vue';
import NewSemesterModal from '@/components/Modals/NewSemesterModal.vue';

import store from '@/store';
import { GTagEvent } from '@/gtag';
import { addSemester, deleteSemester } from '@/global-firestore-data';
import { closeBottomBar } from '@/components/BottomBar/BottomBarState';
import OrderDropdown from './OrderDropdown.vue';

export default defineComponent({
  components: { Confirmation, NewSemesterModal, Semester, OrderDropdown },
  props: {
    compact: { type: Boolean, required: true },
    isBottomBar: { type: Boolean, required: true },
    isBottomBarExpanded: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    startTour: { type: Boolean, required: true },
  },
  emits: {
    'compact-updated': (compact: boolean) => typeof compact === 'boolean',
  },
  data() {
    return {
      confirmationText: '',
      key: 0,
      activatedCourse: {} as FirestoreSemesterCourse,
      isCourseClicked: false,
      isSemesterConfirmationOpen: false,
      isSemesterModalOpen: false,
    };
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    noSemesters(): boolean {
      return this.semesters.length === 0;
    },
  },
  methods: {
    checkIfFirstSem(semester: FirestoreSemester) {
      return (
        this.semesters[0].year === semester.year &&
        this.semesters[0].type === semester.type
      );
    },
    setCompact() {
      if (!this.compact) {
        this.$emit('compact-updated', !this.compact);
        GTagEvent(this.$gtag, 'to-compact');
      }
    },
    setNotCompact() {
      if (this.compact) {
        this.$emit('compact-updated', !this.compact);
        GTagEvent(this.$gtag, 'to-not-compact');
      }
    },
    openSemesterConfirmationModal(
      type: FirestoreSemesterType,
      year: number,
      isAdd: boolean
    ) {
      if (isAdd) {
        this.confirmationText = `Added ${type} ${year} to plan`;
      } else {
        this.confirmationText = `Deleted ${type} ${year} from plan`;
      }

      this.isSemesterConfirmationOpen = true;

      setTimeout(() => {
        this.isSemesterConfirmationOpen = false;
      }, 2000);
    },
    openSemesterModal() {
      this.isSemesterModalOpen = true;
    },
    closeSemesterModal() {
      this.isSemesterModalOpen = false;
    },
    addSemester(type: string, year: number) {
      addSemester(type as FirestoreSemesterType, year, this.$gtag);
      this.openSemesterConfirmationModal(
        type as FirestoreSemesterType,
        year,
        true
      );
    },
    deleteSemester(type: string, year: number) {
      deleteSemester(type as FirestoreSemesterType, year, this.$gtag);
      this.openSemesterConfirmationModal(
        type as FirestoreSemesterType,
        year,
        false
      );
    },
    courseOnClick(course: FirestoreSemesterCourse) {
      this.activatedCourse = course;
      this.key += 1;
      this.isCourseClicked = true;
    },
    closeBar() {
      if (!this.isCourseClicked) {
        closeBottomBar(this.$gtag);
      }
      this.isCourseClicked = false;
    },
    getToggleTooltipText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Toggle between Views</div><div class="introjs-customProgress">4/4</div>
      </div><div class = "introjs-bodytext">View semesters and courses in full or compact mode.</div>`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semesterView {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1.5rem 3rem 0;
  position: relative;

  &-content {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.75rem;
  }

  &-addSemesterButton {
    background: $sangBlue;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 9rem;
    color: $white;
    border: none;
    font-size: 16px;
  }

  &-settings {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    min-height: 2.25rem;
    align-items: center;
    &--two {
      justify-content: space-between;
    }
  }

  &-switch {
    display: flex;
    color: $medGray;
    align-items: center;
  }

  &-switchText {
    margin-right: 0.5rem;
    font-size: 16px;
    line-height: 19px;
  }

  &-switchImage {
    width: 2.25rem;
    height: 2.25rem;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }

  &-twoColumn {
    background-image: url('@/assets/images/views/twoColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      cursor: pointer;
      background-image: url('@/assets/images/views/twoColumnSelected.svg');
    }
  }

  &-fourColumn {
    background-image: url('@/assets/images/views/fourColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      cursor: pointer;
      background-image: url('@/assets/images/views/fourColumnSelected.svg');
    }
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    flex: 1 1 50%;

    margin-bottom: 1.5rem;
    padding: 0 0.75rem;

    &--compact {
      flex: 1 1 25%;
    }
  }

  &-empty {
    flex: 1 1 50%;
    padding: 0 0.75rem;

    &--compact {
      flex: 1 1 25%;
      min-width: 14.5rem;
    }
  }

  &-builtBy {
    color: $medGray;
    text-align: right;
    font-size: 15px;
    padding: 8px 10px;

    a {
      color: $medGray;
      &:hover {
        text-decoration: underline $medGray;
      }
    }
  }

  &-emoji-text {
    height: 14px;
  }

  &-heart {
    height: 18px;
  }
}

.bottomBar {
  margin-bottom: 350px;
}

@media only screen and (max-width: $medium-breakpoint) {
  .semesterView {
    margin-top: 5.5rem;
    margin-left: 2.5rem;
    margin-right: 1rem;
    &-switch {
      padding-right: 0.75rem;
    }
    &-content {
      width: 100%;
      justify-content: center;
    }
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .semesterView {
    margin-top: 5.5rem;
    margin-left: 0;
    margin-right: 0;

    &-content {
      margin: 0;
    }

    &-wrapper {
      flex: 1 1 auto;
      padding: 0 2rem;
    }
  }
}
</style>
