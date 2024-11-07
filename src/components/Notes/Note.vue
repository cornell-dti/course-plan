<template>
  <div class="note" :class="{ expanded: isExpanded }" :style="noteStyle" @click.stop="toggleNote">
    <!-- Show "Add a note..." text only when expanded -->
    <div v-if="isExpanded" class="note-content">
      <span>Add a note...</span>
      <img src="@/assets/images/notes/arrow.svg" alt="Arrow icon" class="note-icon" />
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
        filter: 'brightness(1.7) saturate(0.3)', // Adjust for a lighter, pastel look
      };
    },
  },
  methods: {
    toggleNote() {
      this.isExpanded = !this.isExpanded;
      this.$emit('toggle', this.isExpanded);
    },
  },
};
</script>

<style scoped>
.note {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 80px; /* Initial height */
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease, filter 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  overflow: hidden; /* Ensures text stays within bounds */
}

.note.expanded {
  height: 80px; /* Full height for expanded state */
}

/* Style for the "Add a note..." text */
.note-content {
  /* font-size: 1rem; */
  font-size: 14.48px;
  color: #555; /* Text color */
  font-family: inherit;
  text-align: left;
  padding: 2px 10px;
  width: 100%;
  /* padding-bottom: 5px; */
}
/* Style for the icon */
.note-icon {
  width: 20.18px; /* Adjust size as needed */
  height: 20.18px;
  position: absolute;
  bottom: 12px;
  right: 10px;
  color: grey;
  opacity: 1;
}
</style>
