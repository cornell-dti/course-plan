<template>
  <div class="note" :class="{ expanded: isExpanded }" :style="noteStyle" @click="expandNote">
    <div v-if="isExpanded" class="note-content">
      <input v-model="noteText" placeholder="Add a note..." class="note-input" />
      <img
        src="@/assets/images/notes/arrow.svg"
        alt="Arrow icon"
        class="note-icon"
        @click.stop="collapseNote"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Note',
  props: {
    initialTranslateY: { type: String, default: '-50px' },
    expandedTranslateY: { type: String, default: '-10px' },
    width: { type: String, default: '200px' },
    color: { type: String, default: '#a8e6cf' },
  },
  data() {
    return {
      isExpanded: false,
      noteText: '',
    };
  },
  computed: {
    noteStyle() {
      return {
        transform: `translateX(-50%) translateY(${
          this.isExpanded ? this.expandedTranslateY : this.initialTranslateY
        })`,
        width: this.width,
        backgroundColor: this.color,
        filter: 'brightness(1.7) saturate(0.3)',
      };
    },
  },
  methods: {
    expandNote() {
      if (!this.isExpanded) {
        this.isExpanded = true;
        this.$emit('toggle', this.isExpanded);
      }
    },
    collapseNote() {
      if (this.isExpanded) {
        this.isExpanded = false;
        this.$emit('toggle', this.isExpanded);
      }
    },
  },
};
</script>

<style scoped>
.note {
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
