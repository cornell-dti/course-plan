<!-- <template>
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
</style> -->
<!-- <template>
  <div
    class="note"
    :class="{ expanded: isExpanded }"
    :style="noteStyle"
    @click.stop="toggleNote"
  ></div>
</template>

<script>
export default {
  name: "Note",
  props: {
    initialTranslateY: { type: String, default: "-50px" },
    expandedTranslateY: { type: String, default: "-10px" },
    width: { type: String, default: "200px" },
    color: { type: String, default: "#a8e6cf" }, // Default color for the Note background
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  computed: {
    noteStyle() {
      return {
        transform: `translateX(-50%) translateY(${this.isExpanded ? this.expandedTranslateY : this.initialTranslateY})`,
        width: this.width,
        backgroundColor: this.color, // Set background color based on prop
      };
    },
  },
  methods: {
    toggleNote() {
      this.isExpanded = !this.isExpanded;
      this.$emit("toggle", this.isExpanded);
    },
  },
};
</script>

<style scoped>
.note {
  position: absolute;
  left: 50%;
  height: 80px; /* Full height when expanded */
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease; /* Smooth slide transition */
}
</style> -->
<!-- <template>
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
        filter: 'brightness(1.3)', // Adjust for a lighter shade
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
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease, filter 0.3s ease; /* Smooth slide and brightness transition */
}
</style> -->
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
        // filter: 'brightness(2)', // Increase to make it more pastel
        filter: 'brightness(1.7) saturate(0.3)',
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
  border-radius: 12.49px;
  cursor: pointer;
  z-index: 0;
  transition: transform 0.3s ease, filter 0.3s ease; /* Smooth slide and brightness transition */
}
</style>
