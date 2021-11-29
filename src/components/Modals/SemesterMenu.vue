<template>
  <div class="semesterMenu">
    <button
      v-if="!isOpenModal"
      class="semesterMenu-section full-opacity-on-hover"
      @click="openEditSemesterModal"
      data-cyId="semesterMenu-edit"
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
      v-if="!isOpenModal"
      class="semesterMenu-section full-opacity-on-hover"
      @click="openClearSemesterModal"
      data-cyId="semesterMenu-clear"
    >
      <div class="semesterMenu-content">
        <div class="semesterMenu-content">
          <div class="semesterMenu-left">
            <img
              class="semesterMenu-icon"
              src="@/assets/images/erase.svg"
              alt="clear semester erase icon"
            />
            <span class="semesterMenu-edit">Clear Semester</span>
          </div>
        </div>
      </div>
    </button>
    <button
      v-if="!isOpenModal"
      class="semesterMenu-section full-opacity-on-hover"
      @click="openDeleteSemesterModal"
      data-cyId="semesterMenu-delete"
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
import { defineComponent } from 'vue';

export default defineComponent({
  emits: {
    'open-delete-semester-modal': () => true,
    'open-edit-semester-modal': () => true,
    'open-clear-semester-modal': () => true,
  },
  props: {
    isOpenModal: { type: Boolean, required: true },
  },
  methods: {
    openDeleteSemesterModal() {
      this.$emit('open-delete-semester-modal');
    },
    openEditSemesterModal() {
      this.$emit('open-edit-semester-modal');
    },
    openClearSemesterModal() {
      this.$emit('open-clear-semester-modal');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semesterMenu {
  background: $white;
  border: 1px solid $lightGray;
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
  &-edit,
  &-clear {
    color: black;
  }
}
</style>
