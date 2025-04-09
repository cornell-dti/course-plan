<template>
  <div class="progress-container">
    <svg viewBox="0 0 100 100" class="progress-circle">
      <circle cx="50" cy="50" r="50" fill="#f3f6f9" />
      <path v-if="progress >= 1" d="M50,50 L10,20 A50,50 0 0,1 93.3,25 Z" fill="#4f768c" />
      <path v-if="progress >= 2" d="M50,50 L93.3,25 A50,50 0 0,1 50,100 Z" fill="#4f768c" />
      <path v-if="progress === 3" d="M40,10 L67,95 A46,50 0 0,1 10,20 Z" fill="#4f768c" />
    </svg>
    <div class="icon-container">🎁</div>
  </div>
</template>

<script>
export default {
  name: 'FallGiveawayProgress',
  props: {
    progress: {
      type: Number,
      required: true,
      validator: val => [0, 1, 2, 3].includes(val),
    },
  },
};
</script>

<style scoped>
.progress-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* start at top */
}

.icon-container {
  position: absolute;
  font-size: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-container img {
  width: 40px;
  height: 40px;
}
</style>
