<template>
  <div class="semesterMenu">
    <div class="semesterMenu-section" :class="{ 'd-none': isOpenModal }">
      <div class="semesterMenu-content">
        <div class="semesterMenu-content" @click="openEditSemesterModal">
          <div class="semesterMenu-left">
            <img class="semesterMenu-icon" src="@/assets/images/edit.svg" />
            <span class="semesterMenu-edit">Edit Semester</span>
          </div>
        </div>
      </div>
    </div>
    <div class="semesterMenu-section" :class="{ 'd-none': isOpenModal }">
      <div class="semesterMenu-content">
        <div class="semesterMenu-content" @click="openDeleteSemesterModal">
          <div class="semesterMenu-left">
            <img class="semesterMenu-icon" src="@/assets/images/trash.svg" />
            <span class="semesterMenu-delete">Delete Semester</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
};
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
