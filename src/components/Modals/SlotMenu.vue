<template>
  <teleport-modal
    content-class="content-slotmenu"
    :isSimpleModal="true"
    @modal-closed="closeCurrentModal"
    :hasClickableTransparentBackground="true"
    :hasCustomPosition="true"
    :position="position"
  >
    <button class="slotMenu-section full-opacity-on-hover" @click="openReplaceSlotModal">
      <!-- Replace slot menu item for selected course -->
      <div class="slotMenu-row">
        <div class="slotMenu-left">
          <img
            class="slotMenu-icon"
            src="@/assets/images/replace.svg"
            alt="replace requirement swap icon"
            data-cyId="replace-slot-item-complete"
          />
          <span class="slotMenu-replace">Replace</span>
        </div>
      </div>
    </button>
    <button class="slotMenu-section full-opacity-on-hover" @click="openDeleteSlotModal">
      <!-- Remove slot menu item for selected course -->
      <div class="slotMenu-row">
        <div class="slotMenu-left">
          <img
            class="slotMenu-icon"
            src="@/assets/images/trashcan.svg"
            alt="remove requirement trashcan icon"
            data-cyId="remove-slot-item"
          />
          <span class="slotMenu-remove">Remove</span>
        </div>
      </div>
    </button>
  </teleport-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

/**
 * Replace and remove slot menu items on the slot menu that opens from selecting
 * the gear icon for a complete subrequirement
 */
export default defineComponent({
  components: { TeleportModal },
  props: {
    position: { type: Object as PropType<{ x: number; y: number }>, required: true },
  },
  emits: {
    'open-delete-slot-modal': () => true,
    'open-replace-slot-modal': () => true,
    'close-slot-menu': (value: boolean) => typeof value === 'boolean',
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-slot-menu', false);
    },
    openDeleteSlotModal() {
      this.$emit('open-delete-slot-modal');
      this.closeCurrentModal();
    },
    openReplaceSlotModal() {
      this.$emit('open-replace-slot-modal');
      this.closeCurrentModal();
    },
  },
});
</script>

<style scope lang="scss">
@import '@/assets/scss/_variables.scss';

.slotMenu {
  background: $white;
  border: 1px solid $lightGray;
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
  &-remove {
    color: black;
  }
  &-replace {
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
