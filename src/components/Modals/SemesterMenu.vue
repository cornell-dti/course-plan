<template>
  <div class="semesterMenu" id="semesterMenu" :class="{ 'd-none': isOpenModal }">
    <div class="semesterMenu-content">
      <div class="semesterMenu-section" @click="openDeleteSemesterModal">
        <div class="semesterMenu-left">
          <img class="semesterMenu-icon" src="@/assets/images/trash.svg" />
          <span class="semesterMenu-text">Delete Semester</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpenModal: false
    };
  },

  methods: {
    openDeleteSemesterModal() {
      this.$emit('open-delete-semester-modal');
      this.isOpenModal = true;
    }
  }
};
</script>

<style scoped lang="scss">
.semesterMenu {
  &-content {
    background: #ffffff;
    border: 1px solid #acacac;
    box-sizing: border-box;
    border-radius: 9px;
    font-size: 14px;
    color: #404040;
    width: 12rem;
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
      padding-top: 1rem;
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }

    &:last-child {
      padding-bottom: 1rem;
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

  &-text {
      color: #EB6D6D;
  }
}
</style>
