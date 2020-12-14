<template>
  <div class="editSemesterModal">
    <div class="editSemesterModal-content" id="deleteSemester">
      <div class="editSemesterModal-top">
        <span class="editSemesterModal-title">{{ title }}</span>
        <img
          class="editSemesterModal-exit"
          src="@/assets/images/x.png"
          @click="closeCurrentModal"
        />
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
          @updateSemProps="updateSemProps"
          ref="modalBodyComponent"
        >
        </newSemester>
      </div>
      <div class="editSemesterModal-buttonWrapper">
        <button class="editSemesterModal-button" @click="closeCurrentModal">{{ cancel }}</button>
        <div
          class="editSemesterModal-button editSemesterModal-button--delete"
          :class="{ 'editSemesterModal-button--disabled': isDisabled }"
          @click="editSemester"
        >
          <div class="editSemesterModal-button-left">
            <span class="editSemesterModal-button-left-text">Edit</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import NewCourse from '@/components/Modals/NewCourse/NewCourse.vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import { AppSemester } from '@/user-data';

Vue.component('newCourse', NewCourse);
Vue.component('newSemester', NewSemester);

export default Vue.extend({
  props: {
    semesters: Array as PropType<readonly AppSemester[]>,
    deleteSemID: Number,
    deleteSemType: String,
    deleteSemYear: Number,
  },
  data() {
    return {
      isDisabled: false,
      season: '',
      year: '',
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
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-modal');
    },
    editSemester() {
      if (!this.isDisabled) {
        this.$emit('edit-semester', this.season, this.year);
        this.closeCurrentModal();
      }
    },
    disableButton(bool: boolean) {
      this.isDisabled = bool;
    },
    updateSemProps(season: string, year: string) {
      this.season = season;
      this.year = year;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

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
    background-color: $white;
    display: flex;
    justify-content: center;

    &--add {
      color: $white;
      background-color: $sangBlue;
      margin-left: 0.5rem;
      border: none;
    }
  }
}
.editSemesterModal {
  padding: 1rem;

  &-content {
    background: $white;
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
    color: #3d3d3d;
  }

  &-text {
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
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
    color: $sangBlue;
    border-radius: 3px;
    border: 1px solid $sangBlue;
    background-color: $white;
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
      color: $white;
      background-color: $sangBlue;
      margin-left: 0.8rem;
      border: none;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }

    &--disabled {
      opacity: 0.3;
      border: 1px solid $sangBlue;
      background-color: #cccccc;
    }
  }
}
</style>
