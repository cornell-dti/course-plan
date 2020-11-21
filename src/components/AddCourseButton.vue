<template>
  <div
    class="semester-courseWrapper semester-addWrapper"
    :class="{ 'semester-addWrapper--compact': compact, 'my-2 mx-0': shouldClearPadding }"
    @click="onClick"
    data-intro-group="pageTour"
    data-step="3"
    data-intro='<b>Add your course in this semseter!</b><br>
      <div class = "introjs-bodytext">To start planning your college career, you should try adding a course in your current semester.</div>'
    data-disable-interaction="1"
  >
    <span class="semester-buttonText" :class="{ 'semester-buttonText--compact': compact }">
      <slot />
    </span>
  </div>
</template>

<script>
  import Vue, { PropType } from 'vue';

  export default Vue.extend({
    props: {
      compact: Boolean,
      shouldClearPadding: Boolean,
    },
    methods: {
      onClick() {
        this.$emit('click');
      }
    }
  })
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

@mixin hover-button {
  border-color: #15a6cf;
  background: rgba(0, 0, 0, 0.03);
  color: #15a6cf;
  cursor: pointer;
}

.semester {
  width: fit-content;
  position: relative;
  border-radius: 11px;

  &--compact {
    padding: 0.875rem 1.125rem;
  }

  &-courseWrapper {
    margin: 0.5rem 0 0.5rem 0;
  }

  &-addWrapper {
    margin-top: -5rem;
    width: 21.375rem;
    height: 4.625rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #d8d8d8;
    color: #d8d8d8;
    margin-left: 1.125rem;
    margin-right: 1.125rem;

    &--compact {
      margin-top: -1.2rem;
      width: 10rem;
      height: 2rem;
    }

    &:hover,
    &:active,
    &:focus {
      @include hover-button();
    }
  }

  &-buttonText {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    &--compact {
      font-size: 14px;
      line-height: 17px;
    }
  }
}

@media only screen and (max-width: 878px) {
  .semester {
    &-addWrapper {
      width: 17rem;
      &--compact {
        width: 10rem;
        height: 2rem;
      }
    }
  }
}
</style>