<template>
  <flexible-modal
    title="Add Course"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addItem"
  >
    <div class="newCourse-text">Search Course Roster</div>
    <course-selector
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      placeholder='"CS1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="selectCourse"
    />
    <div v-if="isCourseModelSelectingSemester && selectedCourse == null">
      <div class="newCourse-title">Add this class to the following semester</div>
      <div class="newCourse-semester-edit">
        <new-semester
          :type="season"
          :year="year"
          :isCourseModelSelectingSemester="isCourseModelSelectingSemester"
          @updateSemProps="updateSemProps"
        />
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
        :selectedRequirementID="selectedRequirementID"
        :requirementsThatAllowDoubleCounting="requirementsThatAllowDoubleCounting"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="potentialRequirements"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectedRequirementEditor, {
  RequirementWithID,
} from '@/components/Modals/NewCourse/SelectedRequirementEditor.vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import CourseSelector, {
  MatchingCourseSearchResult,
} from '@/components/Modals/NewCourse/CourseSelector.vue';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import store from '@/store';
import { chooseSelectableRequirementOption } from '@/global-firestore-data';

export default Vue.extend({
  components: { CourseSelector, FlexibleModal, NewSemester, SelectedRequirementEditor },
  data() {
    return {
      selectedCourse: null as MatchingCourseSearchResult | null,
      selectedRequirementID: '',
      requirementsThatAllowDoubleCounting: [] as readonly string[],
      relatedRequirements: [] as readonly RequirementWithID[],
      potentialRequirements: [] as readonly RequirementWithID[],
      editMode: false,
      courseSelectorKey: 0,
      courseIsAddable: true,
      season: '' as FirestoreSemesterType,
      year: 0,
    };
  },
  props: {
    isCourseModelSelectingSemester: { type: Boolean, required: true },
  },
  computed: {
    leftButtonText(): string {
      if (this.selectedCourse == null && !this.editMode) return 'CANCEL';
      return 'BACK';
    },
    rightButtonText(): string {
      return this.editMode ? 'NEXT' : 'ADD';
    },
    seasonImg(): Readonly<Record<FirestoreSemesterType, string>> {
      return { Fall: fall, Spring: spring, Winter: winter, Summer: summer };
    },
    selectableRequirementChoices(): AppSelectableRequirementChoices {
      return store.state.selectableRequirementChoices;
    },
  },
  methods: {
    selectCourse(result: MatchingCourseSearchResult) {
      this.selectedCourse = result;
      this.getReqsRelatedToCourse(result);
    },
    getReqsRelatedToCourse(selectedCourse: MatchingCourseSearchResult) {
      const requirementsThatAllowDoubleCounting: string[] = [];
      const relatedRequirements: RequirementWithID[] = [];
      const potentialRequirements: RequirementWithID[] = [];
      const groupedRequirements = store.state.groupedRequirementFulfillmentReport;

      // parse through reqs object
      for (let i = 0; i < groupedRequirements.length; i += 1) {
        const subreqs = groupedRequirements[i].reqs.filter(
          it => it.minCountFulfilled < it.minCountRequired
        );
        for (let j = 0; j < subreqs.length; j += 1) {
          // requirements

          const subRequirement = subreqs[j].requirement;
          if (subRequirement.fulfilledBy === 'courses') {
            const { courses } = subRequirement;
            for (let k = 0; k < courses.length; k += 1) {
              for (const [, ids] of Object.entries(courses[k])) {
                if (ids.includes(selectedCourse.id)) {
                  if (subRequirement.allowCourseDoubleCounting) {
                    requirementsThatAllowDoubleCounting.push(subRequirement.name);
                  } else {
                    relatedRequirements.push({ id: subRequirement.id, name: subRequirement.name });
                  }
                  break;
                }
              }
            }
          }
          // potential self-check requirements
          if (subreqs[j].fulfilledBy === 'self-check') {
            if (!subRequirement.allowCourseDoubleCounting) {
              potentialRequirements.push({ id: subRequirement.id, name: subRequirement.name });
            }
          }
          this.requirementsThatAllowDoubleCounting = requirementsThatAllowDoubleCounting;
          this.relatedRequirements = relatedRequirements;
          this.potentialRequirements = potentialRequirements;
          this.selectedRequirementID =
            relatedRequirements.length > 0 ? relatedRequirements[0].id : '';
        }
      }
    },
    closeCurrentModal() {
      this.reset();
      this.$emit('close-course-modal');
    },
    // Note: Currently not used
    checkCourseDuplicate(key: string) {
      this.$emit('check-course-duplicate', key);
    },
    addItem() {
      if (this.editMode) {
        this.editMode = false;
      } else {
        this.addCourse();
      }
    },
    addCourse() {
      if (this.selectedCourse == null) return;
      const { roster, title } = this.selectedCourse;
      const requirementID = this.selectedRequirementID;

      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];

      fetch(
        `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}&q=${courseCode}`
      )
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach((resultJSONclass: CornellCourseRosterCourse) => {
            if (resultJSONclass.catalogNbr === number) {
              const course = { ...resultJSONclass, roster };
              if (this.courseIsAddable) {
                this.$emit('add-course', course, this.season, this.year);
                this.chooseSelectableRequirementOption(course.crseId.toString(), requirementID);
              }
            }
          });
        });

      this.reset();
      this.closeCurrentModal();
    },
    chooseSelectableRequirementOption(
      courseID: string,
      requirementID: string
    ): void {
      if (courseID && requirementID) {
        chooseSelectableRequirementOption({
          ...this.selectableRequirementChoices,
          [courseID]: requirementID,
        });
      }
    },
    onSelectedChange(selected: string) {
      this.selectedRequirementID = selected;
    },
    reset() {
      this.editMode = false;
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
      this.selectedRequirementID = '';
      this.relatedRequirements = [];
      this.potentialRequirements = [];
    },
    backOrCancel() {
      if (this.leftButtonText === 'BACK') {
        if (this.editMode) {
          this.editMode = false;
        } else {
          this.selectedCourse = null;
          this.courseSelectorKey += 1;
        }
      } else {
        this.closeCurrentModal();
      }
    },
    updateSemProps(season: FirestoreSemesterType, year: number) {
      this.season = season;
      this.year = year;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
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

.content-course {
  width: 27.75rem;
}

@media only screen and (max-width: 600px) {
  .content-course {
    width: 100%;
  }
}
</style>
