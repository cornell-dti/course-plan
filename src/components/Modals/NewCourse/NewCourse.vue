<template>
  <div class="newCourse">
    <div class="newCourse-text">{{ text }}</div>
    <!-- TODO: for some reason this breaks the dropdown <div v-if="selected" class="newCourse-name newCourse-requirements-container">{{ selectedCourse }}</div> -->
    <course-selector
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      :placeholder="placeholder"
      :autoFocus="true"
      @on-escape="closeCourseModal"
      @on-select="onSelectCourse"
    />
    <div v-if="isCourseModelSelectingSemester && !selected">
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
    <div v-if="selected">
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
      <div v-if="hasReqs">
        <div class="newCourse-title">This class fulfills the following requirement(s):</div>
        <div v-if="!editMode" class="newCourse-requirements-container">
          <div class="newCourse-requirements">
            {{ relatedReqs }}
          </div>
        </div>
        <div v-else class="newCourse-requirements-edit">
          <editRequirement
            v-for="req in requirements"
            :key="req"
            :name="req"
            :selected="true"
            :isClickable="true"
            @edit-req="editReq"
          />
        </div>
      </div>
      <div v-if="hasPotReqs">
        <div class="newCourse-title">
          This class could potentially fulfill the following requirement(s):
        </div>
        <div v-if="!editMode" class="newCourse-requirements-container">
          <div class="newCourse-name">
            {{ potReqs }}
          </div>
        </div>
        <div v-else class="newCourse-requirements-edit">
          <editRequirement
            v-for="potreq in potentialReqs"
            :key="potreq"
            :name="potreq"
            :isClickable="true"
            @edit-req="editReq"
          />
          <binary-button v-for="choice in binaryPotentialReqs" :key="choice[0]" :choices="choice" />
        </div>
      </div>
      <div v-if="!editMode" class="newCourse-link" @click="toggleEditMode()">
        {{ editReqsText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import EditRequirement from '@/components/Modals/NewCourse/EditRequirement.vue';
import BinaryButton from '@/components/Modals/NewCourse/BinaryButton.vue';
import CourseSelector, {
  MatchingCourseSearchResult,
} from '@/components/Modals/NewCourse/CourseSelector.vue';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import { FirestoreSemesterType } from '@/user-data';
import { SingleMenuRequirement } from '@/requirements/types';

Vue.component('editRequirement', EditRequirement);

export default Vue.extend({
  components: { BinaryButton, CourseSelector },
  props: {
    semesterID: String,
    placeholderText: String,
    season: String as PropType<FirestoreSemesterType>,
    year: Number,
    isCourseModelSelectingSemester: Boolean,
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
  },
  data() {
    return {
      seasonImg: {
        Fall: fall,
        Spring: spring,
        Winter: winter,
        Summer: summer,
      },
      selected: false,
      requirements: [] as string[],
      potentialReqs: [] as string[],
      binaryPotentialReqs: [] as (readonly [string, string])[],
      editMode: false,
      courseSelectorKey: 0,
      selectedCourse: null as MatchingCourseSearchResult | null,
      selectorSemesterId: '',
      selectedReqs: [] as string[],
    };
  },
  computed: {
    text(): string {
      return 'Search Course Roster';
    },
    placeholder(): string {
      return this.placeholderText !== 'Select one'
        ? this.placeholderText
        : '"CS1110", "Multivariable Calculus", etc';
    },
    potReqs(): string {
      return this.potentialReqs.join(', ');
    },
    relatedReqs(): string {
      return this.requirements.join(', ');
    },
    hasReqs(): boolean {
      return this.requirements.length !== 0;
    },
    hasPotReqs(): boolean {
      return this.potentialReqs.length !== 0;
    },
    editReqsText(): string {
      return this.potentialReqs.length !== 0 ? 'Add these Requirements' : 'Edit Requirements';
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
      this.selected = true;
      this.selectedCourse = result;
      this.getReqsRelatedToCourse(result);
    },
    reset() {
      this.editMode = false;
      this.selected = false;
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
      this.selectedReqs = [];
      this.requirements = [];
      this.potentialReqs = [];
    },
    updateSemProps(season: string, year: number) {
      this.$emit('updateSemProps', season, year);
    },
    getReqsRelatedToCourse(selectedCourse: MatchingCourseSearchResult) {
      const relatedReqs = [];
      const potReqs = [];

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
                  relatedReqs.push(subreqs[j].requirement.name);
                  break;
                }
              }
            }
          }
          // potential requirements
          if (subreqs[j].fulfilledBy === 'self-check') {
            potReqs.push(subreqs[j].requirement.name);
          }
          this.requirements = [...relatedReqs];
          this.potentialReqs = [...potReqs];
          this.selectedReqs = [...relatedReqs];
        }
      }
    },
    editReq({ name, isSelected }: Readonly<{ name: string; isSelected: boolean }>) {
      if (isSelected) {
        this.selectedReqs.push(name); // add to selectedReqs
      } else {
        // remove from selectedReqs
        const index = this.selectedReqs.indexOf(name);
        if (index > -1) {
          this.selectedReqs.splice(this.selectedReqs.indexOf(name), 1);
        }
      }
    },
    next() {
      this.editMode = false;

      // update potentialReqs by removing the ones that were selected
      const newPotReqs = [];
      for (let i = 0; i < this.potentialReqs.length; i += 1) {
        if (!this.selectedReqs.includes(this.potentialReqs[i])) {
          newPotReqs.push(this.potentialReqs[i]);
        }
      }
      // add the requirements that were deselected to potential requirements
      for (let i = 0; i < this.requirements.length; i += 1) {
        if (!this.selectedReqs.includes(this.requirements[i])) {
          newPotReqs.push(this.requirements[i]);
        }
      }
      this.requirements = [...this.selectedReqs];
      this.potentialReqs = [...newPotReqs];
    },
    goBack() {
      if (this.editMode) {
        this.editMode = false;
        this.selectedReqs = [...this.requirements];
        this.$emit('allow-add', false);
      } else {
        this.selected = false;
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
  &-requirements {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $emGreen;
    &-container {
      display: flex;
      flex-direction: row;
      margin-bottom: 13px;
    }
    &-edit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  &-space {
    margin-right: 5px;
  }
  &-link {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    text-decoration-line: underline;
    color: $yuxuanBlue;
    cursor: pointer;
  }
}
.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
  width: 100%;
  margin-top: 0.5rem;
  padding-bottom: 12px;
}
</style>
