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
        :semesterID="semesterID"
        ref="modalBodyComponent"
      ></component>
      <div class="modal-buttonWrapper">
        <button class="modal-button" @click="closeCurrentModal">{{ cancel }}</button>
        <button class="modal-button modal-button--add" @click="addItem">{{ add }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import NewCourse from '@/components/Modals/NewCourse';
import NewCustomCourse from '@/components/Modals/NewCustomCourse';
import NewSemester from '@/components/Modals/NewSemester';

Vue.component('newCourse', NewCourse);
Vue.component('newCustomCourse', NewCustomCourse);
Vue.component('newSemester', NewSemester);

export default {
  data() {
    return {
      courseIsAddable: true
    };
  },
  props: {
    type: String,
    semesterID: Number
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
        return `${start}Course`;
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
    closeCurrentModal() {
      let modal;
      if (this.type === 'course') {
        modal = document.getElementById(`${this.type}Modal-${this.semesterID}`);
      } else {
        modal = document.getElementById(`${this.type}Modal`);
      }
      if (this.type === 'semester') {
        this.$refs.modalBodyComponent.resetDropdowns();
      }
      modal.style.display = 'none';
    },
    checkCourseDuplicate(key) {
      this.$emit('check-course-duplicate', key);
    },
    addItem() {
      if (this.type === 'course') {
        const dropdown = document.getElementById(`dropdown-${this.semesterID}`);
        const title = dropdown.value;

        // TODO: can I make the valid assumption that the course code is up to the colon in the title?
        const key = title.substring(0, title.indexOf(':'));
        this.checkCourseDuplicate(key);
        if (this.courseIsAddable) {
          this.addCourse();
        }
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
      const seasonInput = document.getElementById(`season-placeholder`);
      const yearInput = document.getElementById(`year-placeholder`);

      this.$parent.addSemester(
        seasonInput.innerHTML.trim(' ').split(' ')[1],
        parseInt(yearInput.innerHTML, 10)
      );

      this.closeCurrentModal();
    }
  }
};
</script>

<style lang="scss">
// TODO: font family
.modal {
  padding: 1rem;

  &-content {
    background: #ffffff;
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
    height: 2rem;
    color: #5b676d;
    border-radius: 3px;
    border: 1px solid #3d3d3d;
    background-color: #ffffff;
    display: flex;
    justify-content: center;

    &--add {
      color: #ffffff;
      background-color: #508197;
      margin-left: 0.5rem;
      border: none;
    }
  }
}

#content-course {
  width: 27.75rem;
}

#content-semester {
  width: 15.5rem;
}
</style>
