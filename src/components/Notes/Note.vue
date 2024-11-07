<template>
  <div
    class="note"
    :class="{ expanded: isExpanded }"
    :style="noteStyle"
    @click.stop="toggleNote"
  ></div>
</template>

<script>
export default {
  name: 'Note',
  props: {
    initialTranslateY: { type: String, default: '20px' },
    expandedTranslateY: { type: String, default: '-10px' },
    width: { type: String, default: '200px' },
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
  height: 80px; /* Full height when expanded */
  background-color: #a8e6cf; /* Pastel green */
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease; /* Smooth slide transition */
}
</style>
