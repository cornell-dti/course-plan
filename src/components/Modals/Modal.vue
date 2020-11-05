<template>
  <div class="modal">
    <div class="modal-content" :id="contentId">
      <div class="modal-top">
        <span class="modal-title">{{ title }}</span>
        <img class="modal-exit" src="../../assets/images/x.png" @click="closeCurrentModal"/>
      </div>
      <component
        class="modal-body"
        :is="body"
        :isOnboard="isOnboard"
        :semesterID="semesterID"
        :currentSemesters="currentSemesters"
        placeholderText = '"CS 1110", "Multivariable Calculus", etc.'
        @duplicateSemester="disableButton"
        ref="modalBodyComponent"
        :season="season"
        :year="year"
        :labels="true"
        :goBack="goBack"
      ></component>
      <div class="modal-buttonWrapper">
        <button class="modal-button" @click="backOrCancel">{{ leftButton }}</button>
        <button class="modal-button modal-button--add" :class='{"modal-button--disabled": isDisabled }' @click="addItem">{{ add }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import NewCourse from '@/components/Modals/NewCourse';
import NewCustomCourse from '@/components/Modals/NewCustomCourse';
import NewSemester from '@/components/Modals/NewSemester';
import EditSemester from '@/components/Modals/EditSemester';

Vue.component('newCourse', NewCourse);
Vue.component('newCustomCourse', NewCustomCourse);
Vue.component('newSemester', NewSemester);
Vue.component('editSemester', EditSemester);

export default {
  data() {
    return {
      isOnboard: false,
      courseIsAddable: true,
      isDisabled: false,
      leftButton: 'CANCEL',
      goBack: false
    };
  },
  props: {
    type: String,
    semesterID: Number,
    currentSemesters: Array,
    season: String,
    year: Number
  },
  mounted() {
    this.$root.$on('toggle-left-button', this.toggleLeftButton);
  },
  computed: {
    contentId() {
      return `content-${this.type}`;
    },
    title() {
      const start = 'New ';
      if (this.type === 'semester') {
        return `${start}Semester`;
      }
      if (this.type === 'course') {
        return `Add Course`;
      }
      return `${start}Custom Course`;
    },
    add() {
      return 'ADD';
    },
    cancel() {
      return 'CANCEL';
    },
    body() {
      if (this.type === 'semester') {
        return 'newSemester';
      }
      if (this.type === 'course') {
        return 'newCourse';
      }
      return 'newCustomCourse';
    }
  },
  methods: {
    disableButton(bool) {
      this.isDisabled = bool;
    },
    closeCurrentModal() {
      let modal;
      this.courseSelected = false;
      if (this.type === 'course') {
        modal = document.getElementById(`${this.type}Modal-${this.semesterID}`);
        this.$refs.modalBodyComponent.reset();
      } else {
        modal = document.getElementById(`${this.type}Modal`);
      }
      if (this.type === 'semester') {
        this.$refs.modalBodyComponent.resetDropdowns();
      }
      modal.style.display = 'none';
    },
    // Note: Currently not used
    checkCourseDuplicate(key) {
      this.$emit('check-course-duplicate', key);
    },
    addItem() {
      if (this.type === 'course') {
        const dropdown = document.getElementById(`dropdown-${this.semesterID}`);
        const title = dropdown.value;

        // TODO: can I make the valid assumption that the course code is up to the colon in the title?
        const key = title.substring(0, title.indexOf(':'));
        this.addCourse();
      } else if (this.type === 'semester') {
        this.addSemester();
      } else {
        // TODO: add custom course
      }
    },
    addCourse() {
      const dropdown = document.getElementById(`dropdown-${this.semesterID}`);
      const title = dropdown.value;
      // name used to transmit roster information
      const roster = dropdown.name;

      // TODO: can I make the valid assumption that the course code is up to the colon in the title?
      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];

      const parent = this.$parent;

      // To use for retrieve course data from Firebase
      // // TODO: error handling if course not found or some firebase error
      // docRef
      //   .get()
      //   .then(doc => {
      //     if (doc.exists && this.courseIsAddable) {
      //       parent.addCourse(doc.data());
      //     } else {
      //       // doc.data() will be undefined in this case
      //       console.log('No such document!');
      //     }
      //   })
      //   .catch(error => {
      //     console.log('Error getting document:', error);
      fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}&q=${courseCode}`)
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach(resultJSONclass => {
            if (resultJSONclass.catalogNbr === number) {
              const course = resultJSONclass;
              course.roster = roster;
              if (this.courseIsAddable) {
                parent.addCourse(course);
              }
            }
          });
        });

      // clear input and close modal when complete
      dropdown.value = '';
      this.closeCurrentModal();
    },
    addSemester() {
      if (!this.isDisabled) {
        const seasonInput = document.getElementById(`season-placeholder`);
        const yearInput = document.getElementById(`year-placeholder`);
        this.$parent.addSemester(
          seasonInput.innerHTML.trim(' ').split(' ')[0],
          parseInt(yearInput.innerHTML, 10)
        );

        this.closeCurrentModal();
      }
    },
    cancelMaybe() {
      if (this.type === 'course' && this.$refs.modalBodyComponent.isBack()) {
        return 'BACK';
      }
      return 'CANCEL';
    },
    toggleLeftButton() {
      if (this.leftButton === 'CANCEL') {
        this.leftButton = 'BACK';
      } else {
        this.leftButton = 'CANCEL';
      }
    },
    backOrCancel() {
      if (this.leftButton === 'BACK') {
        this.goBack = !this.goBack;
      } else {
        this.closeCurrentModal();
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_variables.scss";

.modal {
  padding: 1rem;

  &-content {
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-body {
    padding: 0;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &-exit {
    width: 10.5px;
    height: 10.5px;
  }

  &-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #3d3d3d;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    height: 1.8rem;
    color: #5b676d;
    border-radius: 3px;
    border: 1px solid #3d3d3d;
    background-color: $white;
    display: flex;
    justify-content: center;
    align-items: center;

    &--add {
      color: $white;
      background-color: $sangBlue;
      margin-left: 0.5rem;
      border: none;
    }

    &--disabled {
      opacity: .3;
      border: 1px solid $sangBlue;
      background-color: #CCCCCC;
    }
  }
}

#content-course {
  width: 27.75rem;
}

#content-semester {
  width: 15.5rem;
}

@media only screen and (max-width: 600px) {
  #content-course {
    width: 100%;
  }
}

</style>
