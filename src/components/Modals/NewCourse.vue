<template>
  <div class="newCourse">
    <div class="newCourse-text">{{ text }}</div>
    <div class="autocomplete">
      <input class="newCourse-dropdown" :id="'dropdown-' + semesterID" :ref="'dropdown-' + semesterID" :placeholder="placeholder" @keyup.enter="addCourse" @keyup.esc="closeCourseModal" />
    </div>
  </div>
</template>

<script>
import coursesJSON from '../../assets/courses/courses.json';

export default {
  props: {
    semesterID: Number
  },
  computed: {
    text() {
      return 'Search or Create New Course';
    },
    placeholder() {
      return '"CS 1110", "Multivariable Calculus", etc.';
    }
  },
  mounted() {
    this.autocomplete(
      document.getElementById(`dropdown-${this.semesterID}`),
      coursesJSON
    );
  },
  methods: {
    closeCourseModal() {
      const modal = document.getElementById(`courseModal-${this.semesterID}`);
      modal.style.display = 'none';
    },
    autocomplete(inp, courses) {
      /* the autocomplete function takes two arguments,
      @inp: input
      @courses: object of courses from JSON
      */
      let currentFocus;
      const inpCopy = inp;
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
              const result = { title: `${attr}: ${courses[attr].t}`, roster: courses[attr].r };
              if (attr.toUpperCase().includes(val) && attr !== 'lastScanned') {
                code.push(result);
              } else if (
                courses[attr].t
                && courses[attr].t.toUpperCase().includes(val)
              ) {
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
              /* close the list of autocompleted values,
                  (or any other open lists of autocompleted values: */
              closeAllLists();
              this.addCourse();
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
      function removeActive(x) {
        /* a function to remove the "active" class from all autocomplete items: */
        for (let i = 0; i < x.length; i += 1) {
          x[i].classList.remove('autocomplete-active');
        }
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
      /* execute a function when someone clicks in the document: */
      document.addEventListener('click', e => {
        closeAllLists(e.target);
      });
    },

    addCourse() {
      if (this.$refs[`dropdown-${this.semesterID}`].value) this.$parent.addItem();
    }
  }
};
</script>

<style lang="scss">
// TODO: font family
.newCourse {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: #757575;
  }

  &-dropdown {
    font-size: 14px;
    line-height: 17px;
    color: #757575;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid #c4c4c4;

    &::placeholder {
      color: #b6b6b6;
    }
  }
}

.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
  width: 100%;
  margin-top: 0.5rem;
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
  background-color: #fff;
}
.autocomplete-items div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}
.autocomplete-active {
  /*when navigating through the items using the arrow keys:*/
  background-color: DodgerBlue !important;
  color: #ffffff;
}
</style>
