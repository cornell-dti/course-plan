<template>
  <div class="onboarding">
    <div class="onboarding-main">
      <div class="onboarding-content">
        <div class="onboarding-top">
          <div class="onboarding-header">👏Welcome to CoursePlan</div>
          <div class="onboarding-description">Let's get to know you first!</div>
        </div>
        <div class="onboarding-section">
          <div class="onboarding-subHeader">Your Name</div>
          <div class="onboarding-inputs onboarding-inputs--name">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <!-- TODO: Autofill -->
              <label class="onboarding-label">First Name*</label>
              <input class="onboarding-input"/>
            </div>
            <!-- TODO: Optional vs Required -->
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Middle Name</label>
              <input class="onboarding-input"/>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Last Name*</label>
              <input class="onboarding-input"/>
            </div>
          </div>
        </div>
        <div class="onboarding-section">
          <!-- TODO: Multiple colleges -->
          <div class="onboarding-subHeader">Your College</div>
          <div class="onboarding-inputs">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your College*</label>
              <input class="onboarding-input"/>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <!-- TODO: Add and remove functionality -->
              <label class="onboarding-label">Your Major*</label>
              <input class="onboarding-input"/>
            </div>
            <!-- TODO: Autofill -->
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your Minor</label>
              <input class="onboarding-input"/>
            </div>
          </div>
        </div>
      </div>
        <div class="onboarding-bottom">
        <button class="onboarding-button">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}

</script>

<style scoped lang="scss">
.onboarding {
  padding: 1rem;

  &-main {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 2.5rem;
    width: 36rem;
  }

  &-content {
    padding: 0 2.5rem 0 2.5rem;
  }

  &-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  &-header {
    // TODO: font-size is 40px on designs, but does not fit
    font-weight: bold;
    font-size: 38px;
    color: #4F4F4F;
  }

  &-description {
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;

    color: #757575;
  }

  &-section {
    margin-bottom: 1rem;
  }

  &-inputs {
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 9px;

    padding: 2rem;

    &--name {
      display: flex;
    }
  }

  &-subHeader {
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;

    color: #757575;
    margin-bottom: .75rem;
  }

  &-label {
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    color: #757575;

    margin-bottom: .5rem;
  }

  &-input {
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #757575;
    width: 100%;
    height: 1.75rem;

    background-color: white;
    border: 0.5px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 2px;
  }

  &-inputWrapper {
    &--name {
      width: calc(100% / 3);

      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }

    &--college {
      &:not(:last-child) {
        margin-bottom: 2rem;
      }
    }
  }

  &-bottom {
    display: flex;
    justify-content: center;

    border-top: 1px solid #E5E5E5;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    padding-top: 1rem;
    padding-bottom: 2.5rem;
  }

  &-button {
    background: #D7D7D7;
    border: 0.5px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 9px;

    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: #FFFFFF;

    min-width: 20rem;
    min-height: 1.75rem;

    &:hover,
    &:focus,
    &:active {
      background: #1AA9A5;
    }
  }
}
</style>