<template>
  <div class="newCourse">
    <div class="newCourse-content">
      <div class="newCourse-top">
        <span class="newCourse-title">{{ title }}</span>
        <img class="newCourse-exit" src=""/>
      </div>
      <div class="newCourse-text">{{ text }}</div>
      <div class="autocomplete">
        <input class="newCourse-dropdown" :placeholder="placeholder"/>
      </div>
      <div class="newCourse-buttonWrapper">
        <button class="newCourse-button" v-on:click="closeCourseModal">{{ cancel }}</button>
        <button class="newCourse-button newCourse-button--add">{{ add }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import courses from '../../assets/courses/courses.json'

export default {
  computed: {
    title() {
      return "New Course";
    },
    text() {
      return "Search or Create New Course";
    },
    placeholder() {
      return "\"CS 1110\", \"Multivariable Calculus\", etc.";
    },
    add() {
      return "ADD";
    },
    cancel() {
      return "CANCEL";
    }
  },
  mounted: function () {
    this.autocomplete(document.getElementsByClassName("newCourse-dropdown")[0], courses);
  },
  methods: {
    closeCourseModal: function (event) {
      let modal = document.getElementsByClassName("semester-newCourse")[0];
      modal.style.display = "none";
    },
    autocomplete(inp, courses) {
      /*the autocomplete function takes two arguments,
      @inp: input
      @courses: object of courses from JSON
      */
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
          var a, b, i, val = this.value.toUpperCase();
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) return false;
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          if (val.length >= 3) {
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);

            /*code array for results that contain course code and title array for results that contain title*/
            let code = [], title = [];
            for (let attr in courses) {
              if (~attr.toUpperCase().indexOf(val)) {
                code.push(courses[attr].title);
              }
              else if (courses[attr].title && ~courses[attr].title.toUpperCase().indexOf(val)) {
                  title.push(courses[attr].title);
              }
            }
            code.sort();
            title.sort();

            /*prioritize code matches over title matches*/
            let match = code.concat(title);

            match.map(title => {
              /*check if the item starts with the same letters as the text field value:*/
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = title;
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += `<input type='hidden' value="${title}"'>`;
              /*execute a function when someone clicks on the item value (DIV element):*/
                  b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
            })
          }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    },
  }
}
</script>

<style lang="scss">
// TODO: font family
.newCourse {
  padding: 1rem;

  &-content {
    background: #FFFFFF;
    border-radius: 9px;
    width: 27.75rem;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: .5rem;
  }

  &-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #3D3D3D;
  }

  &-description {
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
    padding: .5rem;
    border: 0.5px solid #C4C4C4;

    &::placeholder {
      color: #B6B6B6;
    }
  }

  &-buttonWrapper {
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    height: 2rem;
    color: #5B676D;
    border-radius: 3px;
    border: 1px solid #3D3D3D;
    background-color: #FFFFFF;

    &--add {
      color: #ffffff;
      background-color: #508197;
      margin-left: .5rem;
      border: none;
    }
  }
}

.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
  width: 100%;
  margin-top: .5rem;
  margin-bottom: 1rem;
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
  border-bottom: 1px solid #d4d4d4;
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