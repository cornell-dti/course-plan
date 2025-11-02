<template>
  <div :class="['progress-wrapper', progress < 3 ? 'pulse' : '']">
    <div class="progress-container" @click="$emit('openFall2025Giveaway')">
      <div :class="['circle-glow', shouldGlow ? 'glow' : '']">
        <svg viewBox="0 0 100 100" class="progress-circle">
          <circle cx="50" cy="50" r="48" stroke="#4D7D92" stroke-width="4" fill="#f6fafc" />
          <path v-if="progress >= 1" d="M50,50 L10,20 A50,50 0 0,1 93.3,25 Z" fill="#4D7D92" />
          <path v-if="progress >= 2" d="M50,50 L93.3,25 A50,50 0 0,1 50,100 Z" fill="#4D7D92" />
          <path v-if="progress === 3" d="M40,10 L67,95 A46,50 0 0,1 10,20 Z" fill="#4D7D92" />
        </svg>
      </div>
      <div v-if="progress == 3" class="icon-container">🎉</div>
      <div v-if="progress < 3" class="icon-container">🎁</div>
    </div>
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
    shouldGlow: {
      type: Boolean,
      default: false, // glow only when explicitly told
    },
  },
};
</script>

<style scoped>
.progress-wrapper {
  transform: scale(0.5);
  transform-origin: center;
}
.progress-container {
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 100px;
}
.progress-container:hover {
  opacity: 50%;
}

.progress-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* start at top */
}

.icon-container {
  position: absolute;
  font-size: 40px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-container img {
  width: 40px;
  height: 40px;
}

@keyframes pulseOnce {
  0% {
    transform: scale(0.5);
  }
  2% {
    transform: scale(0.55);
  }
  4% {
    transform: scale(0.5);
  }
  6% {
    transform: scale(0.55);
  }
  8% {
    transform: scale(0.5);
  }
}

.pulse {
  animation: pulseOnce 30s ease-in-out infinite;
}
.circle-glow {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow {
  animation: glowEffect 1.5s ease-in-out infinite;
}

@keyframes glowEffect {
  0% {
    box-shadow: 0 0 0px #4d7d92;
  }
  50% {
    box-shadow: 0 0 50px #4d7d92;
  }
  100% {
    box-shadow: 0 0 0px #4d7d92;
  }
}
</style>
