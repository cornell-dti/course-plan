<template>
  <div class="newCourse">
    <div v-if="!isOnboard" class="newCourse-text">{{ text }}</div>
    <!-- TODO: for some reason this breaks the dropdown <div v-if="selected" class="newCourse-name newCourse-requirements-container">{{ selectedCourse }}</div> -->
    <div class="autocomplete">
      <input
        :class="onboardingStyle(placeholderText, isOnboard)"
        :id="'dropdown-' + semesterID"
        :ref="'dropdown-' + semesterID"
        :placeholder="placeholder"
        @keyup.esc="closeCourseModal"
        @keyup.enter="addCourse"
      />
    </div>
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
    <div v-if="!isOnboard && selected">
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
          <binaryButton
            v-for="choice in binaryPotentialReqs"
            :key="choice[0]"
            :choices="choice"
          ></binaryButton>
        </div>
      </div>
      <div v-if="!editMode" class="newCourse-link" @click="toggleEditMode()">
        {{ editReqsText }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import coursesJSON from '@/assets/courses/courses.json';
import EditRequirement from '@/components/Modals/NewCourse/EditRequirement.vue';
import BinaryButton from '@/components/Modals/NewCourse/BinaryButton.vue';

Vue.component('editRequirement', EditRequirement);
Vue.component('binaryButton', BinaryButton);

const fall = require('@/assets/images/fallEmoji.svg');
const spring = require('@/assets/images/springEmoji.svg');
const winter = require('@/assets/images/winterEmoji.svg');
const summer = require('@/assets/images/summerEmoji.svg');

export default Vue.extend({
  props: {
    isOnboard: Boolean,
    semesterID: Number,
    placeholderText: String,
    season: String,
    year: Number,
    isCourseModelSelectingSemester: Boolean,
    reqs: Array,
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
      requirements: [],
      potentialReqs: [],
      binaryPotentialReqs: [],
      editMode: false,
      selectedCourse: '',
      selectedCourseID: -1,
      selectorSemesterId: '',
      selectedReqs: [],
    };
  },
  computed: {
    text() {
      return 'Search Course Roster';
    },
    placeholder() {
      return this.placeholderText !== 'Select one'
        ? this.placeholderText
        : '"CS110", "Multivariable Calculus", etc';
    },
    potReqs() {
      return this.potentialReqs.join(', ');
    },
    relatedReqs() {
      return this.requirements.join(', ');
    },
    hasReqs() {
      return this.requirements.length !== 0;
    },
    hasPotReqs() {
      return this.potentialReqs.length !== 0;
    },
    editReqsText() {
      return this.potentialReqs.length !== 0 ? 'Add these Requirements' : 'Edit Requirements';
    },
  },
  mounted() {
    // Activate focus and set input to empty
    const input = document.getElementById(`dropdown-${this.semesterID}`);
    input.value = '';
    input.focus();

    this.autocomplete(document.getElementById(`dropdown-${this.semesterID}`), coursesJSON);
  },
  methods: {
    closeCourseModal() {
      this.$emit('close-course-modal');
    },
    autocomplete(inp, courses) {
      /* the autocomplete function takes two arguments,
      @inp: input
      @courses: object of courses from JSON
      */
      let currentFocus;
      const inpCopy = inp;
      function removeActive(x) {
        /* a function to remove the "active" class from all autocomplete items: */
        for (let i = 0; i < x.length; i += 1) {
          x[i].classList.remove('autocomplete-active');
        }
      }
      function addActive(x) {
        /* a function to classify an item as "active": */
        if (!x) return;
        /* start by removing the "active" class on all items: */
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        /* add class "autocomplete-active": */
        x[currentFocus].classList.add('autocomplete-active');
      }
      function closeAllLists(elmnt) {
        /* close all autocomplete lists in the document,
        except the one passed as an argument: */
        const x = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < x.length; i += 1) {
          if (elmnt !== x[i] && elmnt !== inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /* execute a function when someone writes in the text field: */
      inp.addEventListener('input', () => {
        let a;
        const val = inp.value.toUpperCase();
        /* close any already open lists of autocompleted values */
        closeAllLists();
        if (!val) return;
        currentFocus = -1;
        /* create a DIV element that will contain the items (values): */
        // search after value length of 2 to reduce search times of courses
        if (val.length >= 2) {
          a = document.createElement('DIV');
          a.setAttribute('id', `${inp.id}autocomplete-list`);
          a.setAttribute('class', 'autocomplete-items');
          /* append the DIV element as a child of the autocomplete container: */
          inp.parentNode.appendChild(a);

          /* code array for results that contain course code and title array for results that contain title */
          const code = [];
          const title = [];

          for (const attr in courses) {
            if (courses[attr]) {
              const result = {
                title: `${attr}: ${courses[attr].t}`,
                roster: courses[attr].r,
                id: courses[attr].i,
              };
              if (attr.toUpperCase().includes(val) && attr !== 'lastScanned') {
                code.push(result);
              } else if (courses[attr].t && courses[attr].t.toUpperCase().includes(val)) {
                title.push(result);
              }
            }
          }

          // Sort both results by title
          code.sort((first, second) => first.title - second.title);
          title.sort((first, second) => first.title - second.title);

          /* prioritize code matches over title matches */
          let match = code.concat(title);

          // limit the number of results to 10
          match = match.slice(0, 10);

          match.forEach(newTitle => {
            /* check if the item starts with the same letters as the text field value: */
            /* create a DIV element for each matching element: */
            /* reinitialize b for every input div */
            const div = document.createElement('DIV');
            /* make the matching letters bold: */
            div.innerHTML = newTitle.title;
            /* insert a input field that will hold the current array item's value: */
            div.innerHTML += `<input type='hidden' value="${newTitle.title}" name="${newTitle.roster}">`;
            /* execute a function when someone clicks on the item value (DIV element): */
            div.addEventListener('click', () => {
              /* insert the value for the autocomplete text field: */
              inpCopy.value = newTitle.title;
              inpCopy.name = newTitle.roster;
              this.selectedCourseID = newTitle.id;
              this.selectedCourse = newTitle.title;
              this.selected = true;
              this.$emit('toggle-left-button');
              this.$emit('allow-add', false);
              this.getReqsRelatedToCourse();

              /* close the list of autocompleted values,
                  (or any other open lists of autocompleted values: */
              closeAllLists();
              if (this.isOnboard) {
                this.addCourse();
              }
            });
            a.appendChild(div);
          });
        }
      });
      /* execute a function presses a key on the keyboard: */
      inp.addEventListener('keydown', e => {
        let x = document.getElementById(`${inp.id}autocomplete-list`);
        if (x) x = x.getElementsByTagName('div');
        if (e.keyCode === 40) {
          /* If the arrow DOWN key is pressed,
            increase the currentFocus variable: */
          currentFocus += 1;
          /* and and make the current item more visible: */
          addActive(x);
        } else if (e.keyCode === 38) {
          // up
          /* If the arrow UP key is pressed,
            decrease the currentFocus variable: */
          currentFocus -= 1;
          /* and and make the current item more visible: */
          addActive(x);
        } else if (e.keyCode === 13) {
          /* If the ENTER key is pressed, prevent the form from being submitted, */
          e.preventDefault();
          if (currentFocus > -1) {
            /* and simulate a click on the "active" item: */
            if (x) x[currentFocus].click();
          }
        }
      });
      /* execute a function when someone clicks in the document: */
      document.addEventListener('click', e => {
        closeAllLists(e.target);
      });
    },
    checkIfLast(elem, list) {
      return elem === list[list.length - 1];
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      this.$emit('edit-mode');
    },
    reset() {
      this.editMode = false;
      this.selected = false;
      this.selectedCourse = '';
      this.selectedCourseID = -1;
      this.selectedReqs = [];
      this.requirements = [];
      this.potentialReqs = [];
    },
    updateSemProps(season, year) {
      this.$emit('updateSemProps', season, year);
    },
    getReqsRelatedToCourse() {
      const relatedReqs = [];
      const potReqs = [];

      // parse through reqs object
      for (let i = 0; i < this.reqs.length; i += 1) {
        const subreqs = this.reqs[i].ongoing;
        for (let j = 0; j < subreqs.length; j += 1) {
          // requirements
          if (subreqs[j].fulfilledBy === 'courses') {
            const { courses } = subreqs[j].requirement;
            if (typeof courses !== 'undefined') {
              for (let k = 0; k < courses.length; k += 1) {
                for (const [_, ids] of Object.entries(courses[k])) {
                  if (ids.includes(this.selectedCourseID)) {
                    relatedReqs.push(subreqs[j].requirement.name);
                    break;
                  }
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
    editReq(data) {
      const { name, isSelected } = data;
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
        // copied code from line 125 and 209 TODO - refactor
        const inpCopy = document.getElementById(`dropdown-${this.semesterID}`);
        inpCopy.value = '';
        this.$emit('toggle-left-button');
        this.$emit('allow-add', true);
      }
    },
    getSelectedReqs() {
      return this.selectedReqs;
    },
    addCourse() {
      if (this.$refs[`dropdown-${this.semesterID}`].value) this.$emit('addItem', this.semesterID);
    },
    onboardingStyle(placeholderText, isOnboard) {
      if (!isOnboard) {
        return 'newCourse-dropdown';
      }
      return placeholderText !== 'Select one'
        ? 'newCourse-onboarding'
        : 'newCourse-onboarding newCourse-onboardingEmpty';
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
  &-onboarding {
    font-size: 14px;
    line-height: 17px;
    color: $black;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $darkPlaceholderGray;
    border-radius: 0px;
    background-color: $white;
    &::placeholder {
      color: $black;
    }
  }
  &-onboardingEmpty {
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
input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
}
.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
}
.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: $white;
}
.autocomplete-items div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}
.autocomplete-active {
  /*when navigating through the items using the arrow keys:*/
  background-color: DodgerBlue !important;
  color: $white;
}
</style>
