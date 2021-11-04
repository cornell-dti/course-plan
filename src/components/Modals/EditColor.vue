<template>
  <teleport-modal
    title="Edit Color"
    content-class="edit-color"
    left-button-text="Cancel"
    right-button-text="OK"
    :rightButtonIsDisabled="false"
    rightButtonAlt="edit color"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="editColor(picked)"
  >
    <div class="editColorModal-body">
      <div class="editColorModal-input">
        <div class="editColorModal-radio">
          <input name="scope" type="radio" id="course" value="course" v-model="picked" />
        </div>
        <div class="editColorModal-text">
          <label for="course">{{ courseText }}</label>
        </div>
      </div>
      <div class="editColorModal-input">
        <div class="editColorModal-radio">
          <input name="scope" type="radio" id="subject" value="subject" v-model="picked" />
        </div>
        <div class="editColorModal-text">
          <label for="subject">{{ subjectText }}</label>
        </div>
      </div>
    </div>
    <!-- @click="colorCourse(color)" -->
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import { GTagEvent } from '@/gtag';

export default defineComponent({
  components: { TeleportModal },
  props: {
    editedColor: { type: String, required: true },
  },
  data() {
    return {
      picked: '',
    };
  },
  emits: {
    'close-edit-color': () => true,
    'edit-color': () => true,
  },
  computed: {
    courseText() {
      return 'This course only';
    },
    subjectText() {
      return 'This academic subject';
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-color');
    },
    editColor(scope: string) {
      console.log(scope);
      console.log(this.editedColor);
      // this.$emit('edit-color');
      this.closeCurrentModal();
    },
    // colorCourse(color: { hex: string }) {
    //   this.$emit('color-course', color.hex.substring(1));
    //   GTagEvent(this.$gtag, 'course-edit-color');
    // },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.editColorModal {
  &-input {
    display: flex;
    padding-left: 5%;
  }

  &-radio {
    margin-right: 10px;
  }
}

.edit-color {
  width: 15rem;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .edit-color {
    width: 50%;
  }
}
</style>
