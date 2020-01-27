<template>
  <div class="deleteSemesterModal">
    <div class="deleteSemesterModal-content" id="deleteSemester">
      <div class="deleteSemesterModal-top">
        <span class="deleteSemesterModal-message">{{ message }}</span>
      </div>
      <div class="deleteSemesterModal-buttonWrapper">
        <button class="deleteSemesterModal-button" @click="closeCurrentModal">{{ cancel }}</button>
        <div class="deleteSemesterModal-button deleteSemesterModal-button--delete" @click="deleteSemester">
            <div class="deleteSemesterModal-button-left">
                <img class="deleteSemesterModal-button-left-icon" src="../../assets/images/trash-white.svg" />
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
  computed: {
    message() {
      return 'Are you sure you want to delete this semester and all of the courses in it?';
    },
    cancel() {
      return 'Cancel';
    }
  },
  methods: {
    closeCurrentModal() {
      const modal = document.getElementById('deleteSemesterModal');
      modal.style.display = 'none';
    },
    deleteSemester() {
      this.$emit('delete-semester');
      this.closeCurrentModal();
    }
  }
};
</script>

<style lang="scss">
// TODO: font family
.deleteSemesterModal {
  padding: 1rem;

  &-content {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
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

  &-message {
    font-size: 14px;
    line-height: 17px;
    color: #3D3D3D;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  &-button {
    width: 7rem;
    height: 2rem;
    color: #5B676D;
    border-radius: 3px;
    border: 1px solid #3d3d3d;
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
      background-color: #EB6D6D;
      margin-left: 0.8rem;
      border: none;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
  }
}

</style>
