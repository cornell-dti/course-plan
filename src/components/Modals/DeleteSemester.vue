<template>
  <div class="deleteSemesterModal">
    <div class="deleteSemesterModal-content" id="deleteSemester">
      <div class="deleteSemesterModal-top">
        <span class="deleteSemesterModal-title">{{ title }}</span>
        <img class="deleteSemesterModal-exit" src="@/assets/images/x.png" @click="closeCurrentModal" />
      </div>
      <div class="deleteSemesterModal-body">
        <div class="deleteSemesterModal-body-text">{{ text }}</div>
      </div>
      <div class="deleteSemesterModal-buttonWrapper">
        <button class="deleteSemesterModal-button" @click="closeCurrentModal">{{ cancel }}</button>
        <div class="deleteSemesterModal-button deleteSemesterModal-button--delete" @click="deleteSemester">
            <div class="deleteSemesterModal-button-left">
                <img class="deleteSemesterModal-button-left-icon" src="@/assets/images/trash-white.svg" />
                <span class="deleteSemesterModal-button-left-text">Delete</span>
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
    deleteSemID: Number,
    deleteSemType: String,
    deleteSemYear: Number
  },

  computed: {
    text() {
      return 'Are you sure you want to delete this semester? You cannot undo this action.';
    },
    cancel() {
      return 'Cancel';
    },
    title() {
      return 'Delete Semester';
    }
  },
  methods: {
    closeCurrentModal() {
      const modal = document.getElementById(`deleteSemesterModal-${this.deleteSemID}`);
      modal.style.display = 'none';
    },
    deleteSemester() {
      this.$emit('delete-semester', this.deleteSemType, this.deleteSemYear);
      this.closeCurrentModal();
    }
  }
};
</script>

<style lang="scss">
.deleteSemesterModal {
  padding: 1rem;

  &-content {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1.2rem;
    width: 24rem;
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
    height: 2rem;
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
  }
}

</style>
