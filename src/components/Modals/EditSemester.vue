<template>
  <div class="editSemesterModal">
    <div class="editSemesterModal-content" id="deleteSemester">
      <div class="editSemesterModal-top">
        <span class="editSemesterModal-title">{{ title }}</span>
        <img class="editSemesterModal-exit" src="@/assets/images/x.png" @click="closeCurrentModal" />
      </div>
      <div class="editSemesterModal-body">
        <newSemester
            class="modal-body"
            :currentSemesters="semesters"
            :id="deleteSemID"
            :isEdit="true"
            :year="deleteSemYear"
            :type="deleteSemType"
            @duplicateSemester="disableButton"
            ref="modalBodyComponent">
        </newSemester>
      </div>
      <div class="editSemesterModal-buttonWrapper">
        <button class="editSemesterModal-button" @click="closeCurrentModal">{{ cancel }}</button>
        <div class="editSemesterModal-button editSemesterModal-button--delete" :class='{"editSemesterModal-button--disabled": isDisabled }' @click="editSemester">
            <div class="editSemesterModal-button-left">
                <span class="editSemesterModal-button-left-text">Edit</span>
            </div>
        </div>
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
  props: {
    semesters: Array,
    deleteSemID: Number,
    deleteSemType: String,
    deleteSemYear: Number
  },
  data() {
    return {
      isDisabled: false
    };
  },
  computed: {
    text() {
      return 'Are you sure you want to edit this semester?';
    },
    cancel() {
      return 'Cancel';
    },
    title() {
      return 'Edit Semester';
    }
  },
  methods: {
    closeCurrentModal() {
      const modal = document.getElementById(`editSemesterModal-${this.deleteSemID}`);
      modal.style.display = 'none';
    },
    editSemester() {
      if (!this.isDisabled) {
        this.$parent.editSemester(this.deleteSemID);
        this.closeCurrentModal();
      }
    },
    disableButton(bool) {
      this.isDisabled = bool;
    }
  }
};
</script>

<style lang="scss">

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
    cursor: pointer;
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
.editSemesterModal {
  padding: 1rem;

  &-content {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1.2rem;
    width: 15.5rem;
    top: 4.75rem;
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
    cursor: pointer;
  }

  &-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #3D3D3D;
  }

  &-text {
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #3D3D3D;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    color: #508197;
    border-radius: 3px;
    border: 1px solid #508197;
    background-color: #ffffff;
    display: flex;
    justify-content: center;

    &-left {
        display: flex;
        flex-direction: row;
        justify-content: center;

        &-text {
            margin-top: auto;
            margin-bottom: auto;
            margin-left: 0.195rem;
        }
    }

    &--delete {
      color: #ffffff;
      background-color: #508197;
      margin-left: 0.8rem;
      border: none;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }

    &--disabled {
      opacity: .3;
      border: 1px solid #508197;
      background-color: #CCCCCC;
    }
  }
}

</style>
