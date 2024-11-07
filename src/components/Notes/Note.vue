<template>
  <div class="note" :class="{ expanded: isExpanded }" :style="noteStyle" @click="expandNote">
    <!-- Show editable text area and icon only when expanded -->
    <div v-if="isExpanded" class="note-content">
      <!-- <textarea
        v-model="noteText"
        placeholder="Add a note..."
        class="note-textarea"
      ></textarea> -->
      <!-- <span>Add a note...</span> -->
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
      noteText: '', // Holds the note text entered by the user
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

/* Style for the text area container */
.note-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 25px; /* Increased padding to push down content */
  padding-left: 10px;
}

/* Style for the text area */
.note-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  color: #555; /* Text color */
  font-size: 14.48px;
  font-family: inherit;
  text-align: left;
  padding-top: 15px; /* Adjusts position of placeholder text */
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
  cursor: pointer; /* Show cursor to indicate it's clickable */
  transition: color 0.3s ease; /* Smooth transition for hover effect */
}

.note-icon:hover {
  color: blue; /* Darker shade on hover */
}
</style>
