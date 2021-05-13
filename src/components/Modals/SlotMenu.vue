<template>
  <Teleport class="slotMenu" to="#modalTarget" aria-model="true">
    <button class="slotMenu-section" @click="openEditSlotModal">
      <div class="slotMenu-row">
        <div class="slotMenu-left">
          <img
            class="slotMenu-icon"
            src="@/assets/images/edit.svg"
            alt="edit requirement pencil icon"
          />
          <span class="slotMenu-edit">Edit</span>
        </div>
      </div>
    </button>
    <button class="slotMenu-section" @click="openDeleteSlotModal">
      <div class="slotMenu-row">
        <div class="slotMenu-left">
          <img
            class="slotMenu-icon"
            src="@/assets/images/trash.svg"
            alt="delete requirement trashcan icon"
          />
          <span class="slotMenu-delete">Delete</span>
        </div>
      </div>
    </button>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: { required: true, type: Boolean },
  },
  emits: ['open-delete-slot-modal', 'open-edit-slot-modal', 'update:modelValue', 'modal-closed'],
  setup(props, { emit }) {
    const modalBackground = ref((null as unknown) as HTMLDivElement);

    const close = () => {
      emit('modal-closed', true);
      emit('update:modelValue', false);
    };

    const openDeleteSlotModal = () => {
      emit('open-delete-slot-modal');
    };

    const openEditSlotModal = () => {
      emit('open-edit-slot-modal');
    };

    const closeOnClickOutside = (e: MouseEvent) => {
      if (e.target === modalBackground.value) close();
    };

    return { close, openDeleteSlotModal, openEditSlotModal, closeOnClickOutside };
  },
});
</script>

<style scope lang="scss">
@import '@/assets/scss/_variables.scss';

.slotMenu {
  background: $white;
  border: 1px solid #acacac;
  box-sizing: border-box;
  border-radius: 9px;
  position: absolute;
  right: -3rem;
  top: 36.5rem;
  z-index: 1;
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
  &-row {
    display: flex;
    flex-direction: row;
  }
  &-delete {
    color: #eb6d6d;
  }
  &-edit {
    color: black;
  }
  &-icon {
    margin-right: 1rem;
    &--color {
      width: 16px;
      height: 16px;
    }
  }
  &-left {
    display: flex;
    align-items: center;
  }
}
</style>
