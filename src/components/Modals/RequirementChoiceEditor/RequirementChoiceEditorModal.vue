<template>
  <TeleportModal
    v-if="course"
    :title="`Edit Requirement Choice for ${course.code}`"
    content-class="content-requirement-choice-editor-modal"
    rightButtonText="Done"
    @modal-closed="closeRequirementChoiceEditor"
    @right-button-clicked="closeRequirementChoiceEditor"
  >
    <requirement-choice-editor :course="course" />
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TeleportModal from '@/components/Modals/TeleportModal.vue';
import {
  closeRequirementChoiceEditor,
  immutableRequirementChoiceEditorState,
} from '@/components/Modals/RequirementChoiceEditor/RequirementChoiceEditorState';
import RequirementChoiceEditor from '@/components/Modals/RequirementChoiceEditor/RequirementChoiceEditor.vue';

export default defineComponent({
  components: { RequirementChoiceEditor, TeleportModal },
  computed: {
    course(): FirestoreSemesterCourse | null {
      return immutableRequirementChoiceEditorState.course;
    },
  },
  methods: { closeRequirementChoiceEditor },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.content-requirement-choice-editor-modal {
  width: 27.75rem;
}
@media only screen and (max-width: $small-medium-breakpoint) {
  .content-requirement-choice-editor-modal {
    width: 100%;
  }
}
</style>
