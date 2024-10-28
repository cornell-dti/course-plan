<template>
  <teleport-modal content-class="content-plan">
    <div class="textInput">
      <label class="textInput-label">{{ label }}</label>
      <div class="textInput-wrapper">
        <input
          class="textInput-userinput"
          :maxlength="maxlength"
          v-model="collectionName"
          :placeholder="placeholderCollection"
          @input="rightCollectionClicked"
          @keydown.delete="rightCollectionClicked"
        />
      </div>
      <slot />
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  props: {
    label: { type: String, default: '' },
    placeholderCollection: { type: String, default: '' },
    maxlength: { type: Number, default: 15 },
  },
  components: { TeleportModal },
  emits: {
    'collection-name': (collectionName: string) => typeof collectionName === 'string',
    'warn-state': (warn: boolean) => typeof warn === 'boolean',
  },
  methods: {
    rightCollectionClicked(): void {
      this.$emit('collection-name', this.collectionName);
      this.$emit('warn-state', this.ifWarn);
    },
  },
  data() {
    return { isDisabled: false, shown: false, collectionName: '' };
  },
  computed: {
    ifWarn() {
      return (
        store.state.savedCourses.some(collection => collection.name === this.collectionName) ||
        !this.collectionName
      );
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';

.textInput {
  &-label {
    font-weight: bold;
    top: 0.5rem;
    position: relative;
  }
  &-wrapper {
    height: 4.2rem;
  }
  &-userinput {
    border: 1px solid $darkPlaceholderGray;
    top: 0.5rem;
    position: relative;
    width: 100%;
    height: 2rem;
    padding-left: 0.5rem;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
}

.content-plan {
  width: 20rem;
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
