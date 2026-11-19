<template>
  <div
    class="course-container"
    :class="{ 'figma-shake': isShaking, 'tooltip-active': isTooltipHovered }"
  >
    <div
      :class="{
        'course--min': compact,
        conflict: isCourseConflict(course.uniqueID),
        active: active,
      }"
      class="course"
      :style="cssVars"
      :id="`course-${course.uniqueID}`"
    >
      <save-course-modal
        :courseCode="courseCode"
        @close-save-course-modal="closeSaveCourseModal"
        @save-course="saveCourse"
        @add-collection="addCollection"
        v-if="isSaveCourseOpen"
      />
      <edit-color
        :editedColor="editedColor"
        @color-course="colorCourse"
        @color-subject="colorSubject"
        @close-edit-color="closeEditColorModal"
        v-if="isEditColorOpen"
      />
      <div
        class="course-color"
        :style="cssVars"
        :class="{
          'course-color--active': active,
        }"
      ></div>
      <div class="course-content" @click="courseOnClick()">
        <div class="course-main">
          <div class="course-top">
            <div class="course-left">
              <div class="course-code" data-cyId="courseCode">
                {{ course.code }}
              </div>
              <course-caution
                v-if="!isReqCourse && compact"
                :course="course"
                :isCompactView="true"
              />
            </div>
            <button
              v-if="!isReqCourse && isSemesterCourseCard"
              class="course-dotRow"
              :class="{ 'course-dotRow--open': menuOpen }"
              @click="openMenu"
              aria-label="Course options"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="3.5" cy="8" r="1.1" fill="currentColor" />
                <circle cx="8" cy="8" r="1.1" fill="currentColor" />
                <circle cx="12.5" cy="8" r="1.1" fill="currentColor" />
              </svg>
            </button>
            <button
              v-else-if="!isReqCourse && !isSemesterCourseCard && !isCourseConfirmationCard"
              class="course-trash"
              @click.stop="deleteCourseFromCollection"
              @mouseover="hoverTrashIcon"
              @mouseleave="unhoverTrashIcon"
            >
              <img :src="trashIcon" alt="delete course from collection" />
            </button>
          </div>
          <div v-if="!compact" class="course-name">{{ course.name }}</div>
          <div v-if="!compact" class="course-info">
            <span class="course-credits">{{ creditString }}</span>
            <span
              v-if="semesterString && !isCourseConfirmationCard && !isBlankCourse"
              class="course-semesters"
              >{{ semesterString }}</span
            >
            <span v-if="isBlankCourse" class="course-semesters">{{ course.courseType }}</span>
            <span @mouseenter="isTooltipHovered = true" @mouseleave="isTooltipHovered = false">
              <course-base-tooltip
                v-if="
                  !isReqCourse &&
                  !isSchedGenCourse &&
                  !isCourseConfirmationCard &&
                  fulfilledRequirements.length > 0
                "
                :isInformation="true"
                :hideVerticalBar="false"
              >
                <div>
                  Fulfills
                  <span v-for="(req, index) in fulfilledRequirements" :key="index">
                    <strong>{{ req.requirementName }}</strong> ({{
                      req.groupName || req.groupType
                    }})<span v-if="index < fulfilledRequirements.length - 1">, </span>
                  </span>
                </div>
              </course-base-tooltip>
            </span>
            <course-caution
              v-if="!isReqCourse && !isSchedGenCourse && !isCourseConfirmationCard"
              :course="course"
              :isCompactView="false"
            />
          </div>
        </div>
      </div>
    </div>
    <course-menu
      v-if="menuOpen"
      :courseObj="course"
      :semesterIndex="semesterIndex"
      :isCompact="compact"
      :courseColor="course.color"
      :courseCode="course.code"
      @open-note-modal="openNoteModal"
      @open-edit-color-modal="openEditColorModal"
      @delete-course="deleteCourse"
      @edit-course-credit="editCourseCredit"
      @open-save-course-modal="openSaveCourseModal"
      :getCreditRange="getCreditRange || []"
      v-click-outside="closeMenuIfOpen"
    />
    <Note
      v-if="isNoteVisible"
      class="note"
      :width="'calc(102.8% - 10px)'"
      :color="cssVars['--bg-color']"
      :initialNote="course.note || ''"
      :lastUpdated="course.lastUpdated"
      @save-note="saveNote"
      @open-delete-note-modal="openDeleteNoteModal"
      @note-state-change="handleNoteStateChange"
      @height-change="handleNoteHeightChange"
      ref="note"
      v-click-outside="handleClickOutsideNote"
      :noteId="`course-${course.uniqueID}`"
      :isSemesterCourseNote="isSemesterCourseCard"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CourseMenu from '@/components/Modals/CourseMenu.vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';
import SaveCourseModal from '@/components/Modals/SaveCourseModal.vue';
import {
  addCourseToBottomBar,
  reportCourseColorChange,
  reportSubjectColorChange,
} from '@/components/BottomBar/BottomBarState';
import { isCourseConflict, updateFA25GiveawayField } from '@/store';
import { clickOutside } from '@/utilities';
import EditColor from '../Modals/EditColor.vue';
import trashGrayIcon from '@/assets/images/trash-gray.svg';
import trashRedIcon from '@/assets/images/trash.svg';
import Note from '../Notes/Note.vue';
import CourseBaseTooltip from '@/components/Course/CourseBaseTooltip.vue';
import infoBlueIcon from '@/assets/info-blue.svg';
import {
  getRequirementsFulfilledForCourse,
  FulfilledRequirementInfo,
} from '@/requirements/requirement-frontend-utils';

// MinimalNoteComponent is a representation of everything required for a functional,
// but minimal Note component to work statefully.
interface MinimalNoteComponent {
  note: string;
  isDirty: boolean;
  isExpanded: boolean;
  collapseNote: () => void;
  expandNote: () => void;
}

export default defineComponent({
  name: 'Course',
  components: { CourseCaution, CourseMenu, EditColor, SaveCourseModal, Note, CourseBaseTooltip },
  props: {
    courseObj: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    compact: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    isReqCourse: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
    season: { type: String, required: false, default: '' },
    year: { type: Number, required: false, default: 0 },
    isSemesterCourseCard: { type: Boolean, required: true },
    isSchedGenCourse: { type: Boolean, required: false, default: false },
    isCourseConfirmationCard: { type: Boolean, required: false, default: false },
    groupedRequirementFulfillmentReport: {
      type: Array as PropType<readonly GroupedRequirementFulfillmentReport[]>,
      required: false,
      default: () => [],
    },
  },
  mounted() {
    if (this.isNoteVisible) {
      this.$nextTick(() => {
        this.reportNoteHeight();
      });
    }
    this.computeFulfilledRequirements();
  },
  emits: {
    'delete-course': (code: string, uniqueID: number) =>
      typeof code === 'string' && typeof uniqueID === 'number',
    'color-course': (color: string, uniqueID: number, code: string) =>
      typeof color === 'string' && typeof uniqueID === 'number' && typeof code === 'string',
    'color-subject': (color: string, code: string) =>
      typeof color === 'string' && typeof code === 'string',
    'course-on-click': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'edit-course-credit': (credit: number, uniqueID: number) =>
      typeof credit === 'number' && typeof uniqueID === 'number',
    'save-course': (
      course: FirestoreSemesterCourse,
      addedToCollections: string[],
      deletedFromCollection: string[]
    ) =>
      typeof course === 'object' &&
      typeof addedToCollections === 'object' &&
      typeof deletedFromCollection === 'object',
    'add-collection': (name: string) => typeof name === 'string',
    'delete-course-from-collection': (courseCode: string) => typeof courseCode === 'string',
    'save-note': (uniqueID: number, note: string) =>
      typeof uniqueID === 'number' && typeof note === 'string',
    'open-delete-note-modal': (uniqueID: number) => typeof uniqueID === 'number',
    'note-state-change': (uniqueID: number, isExpanded: boolean) =>
      typeof uniqueID === 'number' && typeof isExpanded === 'boolean',
    'new-note-created': (uniqueID: number, isNewNote: boolean) =>
      typeof uniqueID === 'number' && typeof isNewNote === 'boolean',
    'note-height-change': (uniqueID: number, heightRem: number) =>
      typeof uniqueID === 'number' && typeof heightRem === 'number',
  },
  data() {
    const course = this.courseObj as FirestoreSemesterCourse;
    return {
      menuOpen: false,
      stopCloseFlag: false,
      getCreditRange: course.creditRange,
      isEditColorOpen: false,
      isSaveCourseOpen: false,
      editedColor: '',
      deletingCourse: false,
      trashIcon: trashGrayIcon, // Default icon
      courseCode: '',
      isExpanded: false,
      // isNotVisible represents a small open 'portrusion' indicating that there is a note
      // for the course in question. The note itself will not be visible without `isExpanded`
      // being true as well.
      isNoteVisible: Boolean(course.note),
      isShaking: false,
      isBlankCourse: course.type === 'BlankCourse',
      fulfilledRequirements: [] as FulfilledRequirementInfo[],
      infoBlueIcon,
      isTooltipHovered: false,
    };
  },
  computed: {
    // refactored courseObj prop
    course(): FirestoreSemesterCourse {
      return this.courseObj as FirestoreSemesterCourse;
    },
    semesterString(): string {
      let semesterString = '';
      this.course.semesters.forEach((semester: string) => {
        semesterString += `${semester}, `;
      });
      if (semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }

      return semesterString;
    },

    creditString(): string {
      if (this.course.credits === 1) {
        return `${this.course.credits} credit`;
      }
      return `${this.course.credits} credits`;
    },

    cssVars(): Record<string, string> {
      return {
        '--bg-color': `#${this.course.color}`,
      };
    },
  },
  methods: {
    openMenu() {
      this.stopCloseFlag = true;
      this.menuOpen = true;
    },
    closeMenuIfOpen() {
      if (this.stopCloseFlag) {
        this.stopCloseFlag = false;
      } else if (this.menuOpen) {
        this.menuOpen = false;
      }
    },
    openSaveCourseModal(courseCode: string) {
      this.courseCode = courseCode;
      this.isSaveCourseOpen = true;
      this.closeMenuIfOpen();
    },
    closeSaveCourseModal() {
      this.isSaveCourseOpen = false;
    },
    deleteCourse() {
      this.$emit('delete-course', this.course.code, this.course.uniqueID);
      this.closeMenuIfOpen();
    },
    deleteCourseFromCollection() {
      this.$emit('delete-course-from-collection', this.course.code);
    },
    openEditColorModal(color: string) {
      this.editedColor = color;
      this.isEditColorOpen = true;
    },
    closeEditColorModal() {
      this.isEditColorOpen = false;
    },
    addCollection(name: string) {
      this.$emit('add-collection', name);
    },
    saveCourse(addedToCollections: string[], deletedFromCollections: string[]) {
      const course = { ...this.course };
      this.$emit('save-course', course, addedToCollections, deletedFromCollections);
    },
    colorCourse(color: string) {
      this.$emit('color-course', color, this.course.uniqueID, this.course.code);
      reportCourseColorChange(this.course.uniqueID, color);
      this.closeMenuIfOpen();
    },
    colorSubject(color: string) {
      this.$emit('color-subject', color, this.course.code);
      reportSubjectColorChange(this.course.code, color);
      this.closeMenuIfOpen();
    },
    courseOnClick() {
      if (!this.menuOpen && !this.deletingCourse) {
        this.$emit('course-on-click', this.course);
        addCourseToBottomBar(this.course, this.season, this.year);
      }
    },
    /**
     * Compute fulfilled requirements for the course to display in tooltip
     * Output:  "Requirement Name (GroupName)" for each requirement that is fulfilled for the particular course
     */
    computeFulfilledRequirements() {
      if (this.isReqCourse || this.isSchedGenCourse || this.isCourseConfirmationCard) {
        return;
      }

      const fulfilledRequirements = getRequirementsFulfilledForCourse(
        this.course,
        this.groupedRequirementFulfillmentReport
      );

      if (fulfilledRequirements && fulfilledRequirements.length > 0) {
        const reqsByType: { [key: string]: FulfilledRequirementInfo[] } = {
          Major: [],
          Minor: [],
          College: [],
          Grad: [],
        };

        fulfilledRequirements.forEach((req: FulfilledRequirementInfo) => {
          reqsByType[req.groupType].push(req);
        });

        // Collect all requirements to display, prioritizing Major > Minor > College > Grad
        const allDisplayReqs: FulfilledRequirementInfo[] = [];
        ['Major', 'Minor', 'College', 'Grad'].forEach(type => {
          if (reqsByType[type].length > 0) {
            allDisplayReqs.push(...reqsByType[type]);
          }
        });

        if (allDisplayReqs.length > 0) {
          this.fulfilledRequirements = allDisplayReqs;
        }
      }
    },
    editCourseCredit(credit: number) {
      this.$emit('edit-course-credit', credit, this.course.uniqueID);
      this.closeMenuIfOpen();
    },
    isCourseConflict,
    hoverTrashIcon() {
      this.trashIcon = trashRedIcon;
    },
    unhoverTrashIcon() {
      this.trashIcon = trashGrayIcon;
    },
    openNoteModal() {
      const now = new Date();
      const deadline = new Date('2025-04-20T23:59:00');

      if (now < deadline) {
        updateFA25GiveawayField({ step2: true });
      }
      if (!this.isNoteVisible) {
        this.isNoteVisible = true;
        this.menuOpen = false;
        // NOTE: should use $nextTick, as the browser engine could optimize away the
        // UI update by applying changes in the same render pass. Also important for allowing
        // for time for the note component to be rendered before attempting to access it.
        this.$nextTick(() => {
          const noteComponent = this.$refs.note as MinimalNoteComponent | undefined;
          if (noteComponent) {
            this.$emit('new-note-created', this.course.uniqueID, true); // toggles new note to true
            noteComponent.expandNote();
            setTimeout(() => {
              this.reportNoteHeight();
            }, 320);
          }
        });
      } else {
        const noteComponent = this.$refs.note as MinimalNoteComponent | undefined;
        if (!noteComponent) {
          return;
        }
        // Note already open — trigger a shake to indicate this to the user.
        if (noteComponent.isExpanded) {
          this.triggerCourseCardShake();
        } else {
          noteComponent.expandNote();
        }
      }
      this.menuOpen = false;
    },
    closeNote() {
      // NOTE: this function hides the note entirely!
      // Grant time for the slide-back-in animation to play out.
      this.isNoteVisible = false;
      this.$nextTick(() => {
        // Note closed; height goes to 0
        this.$emit('note-height-change', this.course.uniqueID, 0);
      });
    },
    triggerCourseCardShake() {
      this.isShaking = true;
      setTimeout(() => {
        this.isShaking = false;
      }, 900); // 3 shakes * 0.3s = 0.9s
    },
    saveNote(note: string) {
      if (!note || note === this.course.note) {
        return;
      }
      this.$emit('save-note', this.course.uniqueID, note);
      this.$emit('new-note-created', this.course.uniqueID, false); // toggles new note back to undefined
    },
    handleClickOutsideNote(event: MouseEvent) {
      // Don't count a click on the open note (.courseMenu) or three dots (.course-dotRow)
      // as a click outside.
      const target = event.target as HTMLElement;
      if (target.closest('.courseMenu') || target.closest('.course-dotRow')) {
        return;
      }

      const noteComponent = this.$refs.note as MinimalNoteComponent | undefined;

      if (!noteComponent || !this.isNoteVisible) {
        return;
      }

      if (noteComponent.isDirty) {
        // Warn if the user is trying to leave a note with unsaved changes.
        this.triggerCourseCardShake();
      } else if (noteComponent.note && this.isNoteVisible) {
        noteComponent.collapseNote();
        this.$emit('new-note-created', this.course.uniqueID, false); // toggles new note back to undefined
      } else {
        // this is a new note that hasn't been saved yet, and it gets cancelled
        this.$emit('new-note-created', this.course.uniqueID, false); // toggles new note back to undefined
        this.closeNote();
      }
    },
    openDeleteNoteModal() {
      this.$emit('open-delete-note-modal', this.course.uniqueID);
    },
    handleNoteStateChange(isExpanded: boolean) {
      this.$emit('note-state-change', this.course.uniqueID, isExpanded);
    },
    handleNewNote(isNewNote: boolean) {
      this.$emit('new-note-created', this.course.uniqueID, isNewNote);
    },
    handleNoteHeightChange() {
      this.$nextTick(() => {
        this.reportNoteHeight();
      });
    },
    reportNoteHeight() {
      const comp = (this.$refs.note as unknown) as { $el?: HTMLElement } | undefined;
      const el = comp && comp.$el ? comp.$el : undefined;
      if (!el) return;
      const rectH = el.getBoundingClientRect().height;
      const { transform } = getComputedStyle(el);
      let translateYPx = 0;
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (match) {
          const parts = match[1].split(',').map(s => s.trim());
          const ty = parts[5];
          if (ty) translateYPx = parseFloat(ty);
        }
      }
      const rootFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const marginBottomRem = 0.7;
      // Effective extra height added below the card is the element height plus its translateY offset
      // (which is usually negative), converted to rem, minus the note's negative bottom margin.
      const effectiveRem = Math.max(0, rectH + translateYPx) / rootFontSizePx - marginBottomRem;
      this.$emit('note-height-change', this.course.uniqueID, Math.max(0, effectiveRem));
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  watch: {
    // NOTE: this is required for reactive deletion of notes client-side after the deletion
    // modal is confirmed, as isNoteVisible is not reactive.
    'courseObj.note': {
      handler(newNote) {
        if (!newNote) {
          this.isNoteVisible = false;
          // Note removed; inform parent
          this.$emit('note-height-change', this.course.uniqueID, 0);
        }
      },
      immediate: true,
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_tokens.scss';

.course-container {
  position: relative;
  &.tooltip-active {
    z-index: 9999;
  }
}

// Emulates a slight side-to-side sway à la Figma micro-interaction.
.figma-shake {
  animation: tilt-shaking 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) 3;
  transform-origin: center center;
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg) translateX(0);
  }
  25% {
    transform: rotate(4deg) translateX(6px);
  }
  50% {
    transform: rotate(0deg) translateX(0);
  }
  75% {
    transform: rotate(-4deg) translateX(-6px);
  }
  100% {
    transform: rotate(0deg) translateX(0);
  }
}

// V2 course card: white, 1px border, 4px color bar on the left, code tinted with the course color.
// Hover draws a 2px border in the course color. Height follows the content; the semester's
// drop-area estimate lives in `../Semester/Semester.vue` (courseContainerHeight).
.course {
  @include cp-font;
  --ink-color: color-mix(in srgb, var(--bg-color) 72%, black);
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-height: 56px;
  padding: 8px 12px 8px 8px;
  background: #fff;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;
  box-shadow: $cp-shadow-rest;
  cursor: grab;
  z-index: 1;
  transition: box-shadow 150ms, border-color 150ms;

  &:hover {
    border-color: var(--bg-color);
    box-shadow: inset 0 0 0 1px var(--bg-color);
  }

  &:active:hover {
    touch-action: none;
    cursor: grabbing;
  }

  &--min {
    min-height: 36px;
    padding-top: 6px;
    padding-bottom: 6px;
    align-items: center;
  }

  &-main {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-color {
    width: 4px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 999px;
    background-color: var(--bg-color);
  }

  &-dotRow,
  &-trash {
    @include cp-icon-button;
    position: relative;
    flex-shrink: 0;
    margin: -3px -6px -3px 0;
  }

  // the menu button shows on hover or keyboard focus, like the prototype
  &-dotRow {
    opacity: 0;
    transition: opacity 150ms;

    &--open {
      opacity: 1;
      background: $cp-wash;
    }
  }

  &:hover &-dotRow,
  &:focus-within &-dotRow {
    opacity: 1;
  }

  &-trash img {
    width: 14px;
    height: 14px;
  }

  &-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  &-top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    min-height: 16px;
  }

  &-code {
    @include cp-text(12px, 16px, 500);
    color: var(--ink-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &--min &-code {
    @include cp-text(13px, 18px, 600);
  }

  &-name {
    @include cp-text(14px, 18px, 600);
    color: $cp-ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &-info {
    @include cp-text(11px, 14px);
    color: $cp-muted;
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  &-credits {
    white-space: nowrap;
  }

  &-semesters {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:before {
      margin-right: 4px;
      content: '·';
    }
  }

  &-buttons {
    display: flex;
    justify-content: space-around;
    margin: 0.5rem;
  }
}

// a requirement conflict: amber border (warning tokens)
.conflict {
  border-color: $cp-warn-line;
  box-shadow: inset 0 0 0 1px $cp-warn-line;
}

// selected (open in the bottom bar): 2px border in a darker shade of the course color
.active {
  border-color: var(--ink-color);
  box-shadow: inset 0 0 0 1px var(--ink-color);
}

.rectangle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-65px);
  width: calc(106% - #{$colored-grabber-width});
  height: 80px;
  background-color: #a8e6cf;
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease;
}

.rectangle.expanded {
  transform: translateX(-50%) translateY(0px);
}
</style>
