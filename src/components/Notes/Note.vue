<template>
  <div class="note" :class="{ expanded: isExpanded }" :style="noteStyle" @click="expandNote">
    <div class="note-content" :class="{ visible: isExpanded }">
      <input
        v-model="note"
        placeholder="Add a note..."
        class="note-input"
        @keyup.enter="saveNote"
        @input="handleInput"
      />
      <img
        src="@/assets/images/notes/arrow.svg"
        alt="Arrow icon"
        class="note-icon"
        @click.stop="saveNote"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { coursesColorSet } from '@/assets/constants/colors';

export default {
  name: 'Note',
  props: {
    initialTranslateY: { type: String, default: '-50px' },
    expandedTranslateY: { type: String, default: '-10px' },
    width: { type: String, default: '200px' },
    color: { type: String, default: '#a8e6cf' },
    initialNote: { type: String, default: '' },
  },
  data() {
    return {
      isExpanded: false,
      note: this.initialNote,
      isDirty: false,
    };
  },
  watch: {
    expand(newVal) {
      if (newVal) this.isExpanded = true;
    },
  },
  computed: {
    noteStyle() {
      return {
        transform: `translateX(-50%) translateY(${
          this.isExpanded ? this.expandedTranslateY : this.initialTranslateY
        })`,
        width: this.width,
        backgroundColor: this.getLighterColor(this.color),
      };
    },
  },
  methods: {
    expandNote() {
      if (!this.isExpanded) {
        this.isExpanded = true;
      }
    },
    collapseNote() {
      if (this.isExpanded) {
        this.isExpanded = false;
      }
    },
    getLighterColor(color: string) {
      const colorObj = coursesColorSet.find(c => c.hex.toUpperCase() === color.toUpperCase());
      return colorObj ? colorObj.lighterHex : color;
    },
    saveNote() {
      this.$emit('save-note', this.note);
      this.isDirty = false;
      this.collapseNote();
    },
    handleInput() {
      this.isDirty = this.note !== this.initialNote;
    },
  },
};
</script>

<style scoped>
.note {
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.055);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 80px;
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease, filter 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  overflow: hidden;
}

.note.expanded {
  height: 80px;
}

.note-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-top: 15px;
  padding-left: 10px;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.note-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.note-input {
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  color: #555;
  font-size: 14.48px;
  font-family: inherit;
  padding: 5px 0;
}

.note-icon {
  width: 20.18px;
  height: 20.18px;
  margin-left: 8px;
  vertical-align: middle;
  color: grey;
  opacity: 1;
  cursor: pointer;
  transition: filter 0.3s ease;
  margin-right: 10px;
}

.note-icon:hover {
  filter: brightness(0.7);
}
</style>
