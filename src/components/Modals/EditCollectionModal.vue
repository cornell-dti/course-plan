<template>
  <text-input-collection-modal
    title="Edit Collection"
    content-class="content-editCollection"
    left-button-text="Cancel"
    right-button-text="Save Changes"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="saveChanges"
    @collection-name="setCollectionName"
    @warn-state="isWarn"
    :placeholderCollection="oldCollectionName"
    :rightButtonIsDisabled="canSave"
    :maxlength="30"
    :isCollectionModal="true"
    label="Name"
  >
    <button class="editCollection-delete" @click="deleteCollection" :disabled="!canDelete">
      DELETE COLLECTION
    </button>
  </text-input-collection-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import TextInputCollectionModal from './TextInputCollectionModal.vue';

export default defineComponent({
  props: {
    oldCollectionName: { type: String, required: true },
  },
  components: { TextInputCollectionModal },
  emits: {
    'close-edit-modal': () => true,
    'delete-collection': (name: string) => typeof name === 'string',
    'edit-collection': (name: string, oldname: string) =>
      typeof name === 'string' && typeof oldname === 'string',
  },
  data() {
    return { isDisabled: false, shown: false, collectionName: '', warn: true };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-modal');
    },
    saveChanges() {
      if (!this.warn) {
        this.$emit('edit-collection', this.collectionName, this.oldCollectionName);
        this.$emit('close-edit-modal');
      }
    },
    deleteCollection() {
      this.$emit('delete-collection', this.oldCollectionName);
      this.$emit('close-edit-modal');
    },
    setCollectionName(collectionName: string) {
      this.collectionName = collectionName;
    },
    isWarn(warn: boolean) {
      this.warn = warn;
    },
  },
  computed: {
    collections() {
      return store.state.savedCourses.map(collection => collection.name);
    },
    canDelete() {
      return store.state.savedCourses.length > 1;
    },
    canSave() {
      return this.warn;
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';

.editCollection {
  &-delete {
    position: relative;
    bottom: 0.25rem;
    width: 100%;
    color: $primary;
    font-weight: 800;
    text-decoration: underline;
    &:disabled {
      color: $disabledGray;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.content-editCollection {
  width: 20rem;
  margin-top: 10rem;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}
</style>
