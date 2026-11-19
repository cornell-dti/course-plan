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
@import '@/assets/scss/_tokens.scss';

// V2 menu: white, 8px radius, popover shadow, 6px inset rows
.semesterMenu {
  @include cp-font;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  background: #fff;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;
  box-shadow: $cp-shadow-pop;
  animation: cp-in 160ms ease-out both;

  &-content {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  &-section {
    @include cp-reset-button;
    @include cp-text(13px, 18px);
    display: flex;
    width: 100%;
    padding: 8px 12px;
    border-radius: $cp-r-sm;
    color: $cp-ink;
    text-align: left;
    &:hover {
      background: $cp-subtle;
    }
    &:active {
      background: $cp-hover;
    }
    &:last-child:hover {
      background: $cp-err-bg;
    }
    &:last-child:active {
      background: $cp-err-line;
    }
  }
  &-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-icon {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
  &-delete {
    color: $cp-err;
  }
  &-edit,
  &-clear {
    color: $cp-ink;
  }
}
@keyframes cp-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
