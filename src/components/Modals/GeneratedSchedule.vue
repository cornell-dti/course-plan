<template>
  <div
    class="generated-schedule"
    @click="checkClickOutside"
    ref="modalBackground"
    data-cyId="generated-schedule"
  >
    <div class="generated-schedule-main">
      <div class="generated-schedule-content">
        <div class="generated-schedule-cancel">
          <button data-cyId="generated-schedule-cancel" @click="cancel">
            <img
              class="generated-schedule-cancel-icon"
              src="@/assets/images/x.svg"
              alt="x to close modal"
            />
          </button>
        </div>
        <div class="generated-schedule-top">
          <div class="generated-schedule-header">
            <span
              ><img
                class="generated-schedule-header-emoji"
                src="@/assets/images/waveEmoji.svg"
                alt="wave"
              />
              Say hello to your generated schedule!</span
            >
          </div>
          <div class="generated-schedule-description">
            Please download before closing or it won't be saved!
          </div>
        </div>
      </div>
      <div class="generated-schedule-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['closeGeneratedSchedule'],
  computed: {},
  methods: {
    cancel() {
      this.$emit('closeGeneratedSchedule');
    },
    checkClickOutside(e: MouseEvent) {
      if (e.target === this.$refs.modalBackground) {
        this.cancel();
      }
    },
  },
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
button:hover {
  opacity: 0.5;
}

input {
  background-color: none;
}
.generated-schedule {
  padding: 1rem;
  width: 100%;
  &-main {
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    width: 46rem;
  }

  &-cancel {
    cursor: pointer;
    text-align: right;
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 5;

    &-icon {
      margin: 11px 11px 0 0;
    }
  }

  &-header {
    font-weight: bold;
    font-size: 36px;
    color: $onboardingGray;
    text-align: center;

    &-emoji {
      width: 36px;
      height: 36px;
      vertical-align: text-top;
    }
  }

  &-description {
    font-weight: 300;
    font-size: 18px;
    line-height: 18px;
    color: $onboardingGray;
    text-align: center;
  }

  &-content {
    position: relative;
    padding: 2.5rem 2.5rem 0 2.5rem;
  }
}
</style>
