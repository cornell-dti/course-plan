<template>
  <div
    class="schedule-generate"
    @click="checkClickOutside"
    ref="modalBackground"
    data-cyId="schedule-generate"
  >
    <div class="schedule-generate-main">
      <div class="schedule-generate-cancel">
        <button data-cyId="schedule-generate-cancel" @click="cancel">
          <img
            class="schedule-generate-cancel-icon"
            src="@/assets/images/x.svg"
            alt="x to close modal"
          />
        </button>
      </div>
      <div class="schedule-generate-content">
        <div class="schedule-generate-top">
          <div class="schedule-generate-header">
            <span
              ><img
                class="schedule-generate-header-emoji"
                src="@/assets/images/waveEmoji.svg"
                alt="wave"
              />
              Say hello to your generated schedule!</span
            >
          </div>
          <div class="schedule-generate-description">
            Please download before closing or it won't be saved!
          </div>
        </div>
      </div>
      <div class="schedule-generate-bottom"></div>
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
.schedule-generate {
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

    &-icon {
      margin: 25px 25px 0 0;
    }
  }

  &-header {
    // TODO: font-size is 40px on designs, but does not fit
    font-weight: bold;
    font-size: 38px;
    color: $onboardingGray;
    text-align: center;

    &-emoji {
      width: 38px;
      height: 38px;
      vertical-align: text-top;
    }
  }

  &-description {
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    color: $onboardingGray;
    text-align: center;
  }

  &-content {
    padding: 2.5rem 2.5rem 0 2.5rem;
  }
}
</style>
