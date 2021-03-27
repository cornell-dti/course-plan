<template>
  <div class="semesterMenu">
    <button
      class="semesterMenu-section"
      :class="{ 'd-none': isOpenModal }"
      @click="openEditSemesterModal"
    >
      <div class="semesterMenu-content">
        <div class="semesterMenu-content">
          <div class="semesterMenu-left">
            <img
              class="semesterMenu-icon"
              src="@/assets/images/edit.svg"
              alt="edit semester pencil icon"
            />
            <span class="semesterMenu-edit">Edit Semester</span>
          </div>
        </div>
      </div>
    </button>
    <button
      class="semesterMenu-section"
      :class="{ 'd-none': isOpenModal }"
      @click="openDeleteSemesterModal"
    >
      <div class="semesterMenu-content">
        <div class="semesterMenu-content">
          <div class="semesterMenu-left">
            <img
              class="semesterMenu-icon"
              src="@/assets/images/trash.svg"
              alt="delete semester trashcan icon"
            />
            <span class="semesterMenu-delete">Delete Semester</span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      isOpenModal: false,
    };
  },
  methods: {
    openDeleteSemesterModal() {
      this.$emit('open-delete-semester-modal');
      this.isOpenModal = true;
    },
    openEditSemesterModal() {
      this.$emit('open-edit-semester-modal');
      this.isOpenModal = true;
    },
  },
});
</script>

<style scoped lang="scss">
.semesterMenu {
  background: #ffffff;
  border: 1px solid #acacac;
  box-sizing: border-box;
  border-radius: 9px;

  &-content {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    color: #404040;
    width: 12;
    cursor: pointer;
  }
  &-section {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    position: relative;
    width: 100%;
    &:hover,
    &:active,
    &:focus {
      background-color: rgba(50, 160, 242, 0.15);
    }
    &:first-child {
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }
    &:last-child {
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
    }
  }
  &-left {
    display: flex;
    align-items: center;
  }
  &-icon {
    margin-right: 1rem;
    &--color {
      width: 16px;
      height: 16px;
    }
  }
  &-delete {
    color: #eb6d6d;
  }
  &-edit {
    color: black;
  }
}
</style>
