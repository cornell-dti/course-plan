<template>
  <div class="onboarding-section">
    <div class="onboarding-subHeader">
      <span class="onboarding-subHeader--font">Cornell Swimming Test </span>
    </div>
    <div class="onboarding-inputs onboarding-inputs--name">
      <div class="onboarding-inputWrapper">
        <label class="onboarding-label"
          >Have you taken the Swim Test? (Choose yes if you are a transfer)</label
        >
        <div class="onboarding-inputs--radioWrapper">
          <label class="onboarding-inputs--radio--radioText" for="onboarding-transfer-swimming-yes">
            <input
              class="onboarding-inputs--radio"
              id="onboarding-transfer-swimming-yes"
              type="radio"
              v-model="radioValue"
              value="true"
            />
            <img class="checkmark" :src="swimYesImage" alt="checkmark" />
            Yes
          </label>
          <label class="onboarding-inputs--radio--radioText" for="onboarding-transfer-swimming-no">
            <input
              class="onboarding-inputs--radio"
              id="onboarding-transfer-swimming-no"
              type="radio"
              v-model="radioValue"
              value="false"
            />
            <img class="checkmark" :src="swimNoImage" alt="checkmark" />
            No
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import checkmarkSelected from '@/assets/images/checkmark-onboarding.svg';
import checkmarkUnselected from '@/assets/images/checkmark-empty.svg';

export default Vue.extend({
  props: { tookSwimTest: { type: Boolean, required: true } },
  data() {
    return { radioValue: String(this.tookSwimTest) };
  },
  watch: {
    radioValue(tookSwimTest: string): void {
      this.$emit('update-swim', tookSwimTest === 'true');
    },
  },
  computed: {
    swimYesImage(): string {
      return this.radioValue === 'true' ? checkmarkSelected : checkmarkUnselected;
    },
    swimNoImage(): string {
      return this.radioValue === 'false' ? checkmarkSelected : checkmarkUnselected;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>
