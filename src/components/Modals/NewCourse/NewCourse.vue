<template>
  <div class="newCourse">
    <div class="newCourse-text">Search Course Roster</div>
    <course-selector
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      placeholder='"CS1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCourseModal"
      @on-select="onSelectCourse"
    />
    <div v-if="isCourseModelSelectingSemester && selectedCourse == null">
      <div class="newCourse-title">Add this class to the following semester</div>
      <div class="newCourse-semester-edit">
        <newSemester
          :type="season"
          :year="year"
          :isCourseModelSelectingSemester="isCourseModelSelectingSemester"
          @updateSemProps="updateSemProps"
        ></newSemester>
      </div>
    </div>
    <div v-if="selectedCourse != null">
      <!-- if a course is selected -->
      <div v-if="isCourseModelSelectingSemester">
        <div class="newCourse-text">Selected Semester</div>
        <div class="newCourse-semester">
          <span class="newCourse-name">
            <img class="newCourse-season-emoji" :src="seasonImg[season]" alt="season-emoji" />
            {{ season }}
            {{ year }}
          </span>
        </div>
      </div>
      <selected-requirement-editor
        :key="courseSelectorKey"
        :editMode="editMode"
        :selectedRequirementIDs="selectedRequirementIDs"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="potentialRequirements"
        :radioPotentialRequirements="mockRadioPotentialRequirement"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectedRequirementEditor, {
  RequirementWithID,
} from '@/components/Modals/NewCourse/SelectedRequirementEditor.vue';
import CourseSelector, {
  MatchingCourseSearchResult,
} from '@/components/Modals/NewCourse/CourseSelector.vue';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import { FirestoreSemesterType } from '@/user-data';
import { SingleMenuRequirement } from '@/requirements/types';

export default Vue.extend({
  components: { CourseSelector, SelectedRequirementEditor },
  props: {
    semesterID: String,
    season: String as PropType<FirestoreSemesterType>,
    year: Number,
    isCourseModelSelectingSemester: Boolean,
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
  },
  data() {
    return {
      selectedRequirementIDs: [] as readonly string[],
      relatedRequirements: [] as readonly RequirementWithID[],
      potentialRequirements: [] as readonly RequirementWithID[],
      radioPotentialRequirements: [] as readonly (readonly RequirementWithID[])[],
      editMode: false,
      courseSelectorKey: 0,
      selectedCourse: null as MatchingCourseSearchResult | null,
      selectorSemesterId: '',
    };
  },
  computed: {
    seasonImg(): Readonly<Record<FirestoreSemesterType, string>> {
      return { Fall: fall, Spring: spring, Winter: winter, Summer: summer };
    },
    mockRadioPotentialRequirement(): readonly (readonly RequirementWithID[])[] {
      return [
        [
          { id: '111', name: 'option 1' },
          { id: '222', name: 'option 2' },
        ],
      ];
    },
  },
  methods: {
    closeCourseModal() {
      this.$emit('close-course-modal');
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      this.$emit('edit-mode');
    },
    onSelectCourse(result: MatchingCourseSearchResult) {
      this.$emit('toggle-left-button');
      this.$emit('allow-add', false);
      this.$emit('on-course-select', result);
      this.selectedCourse = result;
      this.getReqsRelatedToCourse(result);
    },
    reset() {
      this.editMode = false;
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
      this.selectedRequirementIDs = [];
      this.relatedRequirements = [];
      this.potentialRequirements = [];
      this.radioPotentialRequirements = [];
    },
    updateSemProps(season: string, year: number) {
      this.$emit('updateSemProps', season, year);
    },
    getReqsRelatedToCourse(selectedCourse: MatchingCourseSearchResult) {
      const relatedRequirements: RequirementWithID[] = [];
      const potentialRequirements: RequirementWithID[] = [];

      // parse through reqs object
      for (let i = 0; i < this.reqs.length; i += 1) {
        const subreqs = this.reqs[i].ongoing;
        for (let j = 0; j < subreqs.length; j += 1) {
          // requirements

          const subRequirement = subreqs[j].requirement;
          if (subRequirement.fulfilledBy === 'courses') {
            const { courses } = subRequirement;
            for (let k = 0; k < courses.length; k += 1) {
              for (const [, ids] of Object.entries(courses[k])) {
                if (ids.includes(selectedCourse.id)) {
                  relatedRequirements.push({ id: subreqs[j].id, name: subRequirement.name });
                  break;
                }
              }
            }
          }
          // potential requirements
          if (subreqs[j].fulfilledBy === 'self-check') {
            potentialRequirements.push({ id: subreqs[j].id, name: subRequirement.name });
          }
          this.relatedRequirements = relatedRequirements;
          this.potentialRequirements = potentialRequirements;
          this.selectedRequirementIDs = relatedRequirements.map(it => it.id);
        }
      }
    },
    onSelectedChange(selected: readonly string[]) {
      this.selectedRequirementIDs = selected;
    },
    next() {
      this.editMode = false;
    },
    goBack() {
      if (this.editMode) {
        this.editMode = false;
        this.$emit('allow-add', false);
      } else {
        this.selectedCourse = null;
        this.$emit('toggle-left-button');
        this.$emit('allow-add', true);
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
  }
  &-dropdown {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $inactiveGray;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
  &-semester {
    margin-top: 8px;
    margin-bottom: 15px;
    &-edit {
      width: 50%;
    }
  }
  &-name {
    position: relative;
    border-radius: 11px;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $darkGray;
  }
  &-season-emoji {
    height: 18px;
    margin-top: -4px;
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
}
</style>
