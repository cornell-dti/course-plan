<template>
  <div class="dropdown">
    <button class="dropdown-button" data-cyId="dropdown-button">
      <img class="dropdown-button--image" />
      View
    </button>
    <div class="dropdown-content">
      <order-dropdown-option
        :selected="true"
        image="/src/assets/images/schedule-view/view-settings/default-sem.svg"
        label="Default"
      />
      <order-dropdown-option
        :selected="true"
        image="/src/assets/images/schedule-view/view-settings/four-column.svg"
        label="Compact"
      />
      <order-dropdown-option
        :selected="true"
        image="/src/assets/images/schedule-view/view-settings/newest-arrow.svg"
        label="Newest"
      />
      <order-dropdown-option
        :selected="true"
        image="/src/assets/images/schedule-view/view-settings/oldest-arrow.svg"
        label="Oldest"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderDropdownOption from './OrderDropdownOption.vue';

export default defineComponent({
  components: { OrderDropdownOption },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.dropdown {
  position: relative;
  float: right;
  &-button {
    &--image {
      margin-right: 0.3em;
      width: 1em;
      content: url('@/assets/images/schedule-view/view-settings/settings.svg');
      :hover > & {
        content: url('@/assets/images/schedule-view/view-settings/settings-on-hover.svg');
      }
    }
    border: none;
    display: flex;
    align-items: center;
    line-height: 19px;
    font-size: 19px;
    color: $inactiveGray;
    padding-bottom: 0.5rem;
    &:hover {
      color: $viewButtonBlue;
    }
  }
  &-content {
    display: none;
    position: absolute;
    right: 0;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 12rem;
    padding: 0.5rem 0rem 0.5rem 0rem;
    background-color: $white;
    border: 1px solid $borderGray;
    box-sizing: border-box;
    box-shadow: 0px 5px 8px 2px $boxShadowGray;
    border-radius: 4px;
    :hover > & {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
