<template>
  <div v-click-outside="closeDropdownIfOpen">
    <button
      class="dropdown"
      type="button"
      @click="showDropdown = !showDropdown"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="showDropdown"
      v-if="potentialRequirements.some(req => req.id === selectedID)"
      data-cyId="newCourse-requirementsDropdown"
    >
      <div class="warning-row">
        <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
        {{ selected }}
      </div>
      <drop-down-arrow :isFlipped="showDropdown" :fillColor="emGreen" />
    </button>
    <button
      v-else
      class="dropdown"
      type="button"
      @click="showDropdown = !showDropdown"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="showDropdown"
      data-cyId="newCourse-requirementsDropdown"
    >
      {{ selected === '' ? 'Select one (optional)' : selected }}
      <drop-down-arrow :isFlipped="showDropdown" :fillColor="emGreen" />
    </button>
    <ul v-if="showDropdown" class="dropdown-content">
      <li v-for="option in relatedRequirements.filter(it => it.id !== selectedID)" :key="option.id">
        <a
          @click="toggleSelectRequirement(option.id)"
          @keyup.enter="toggleSelectRequirement(option.id)"
          tabindex="0"
          data-cyId="newCourse-reqOption"
          >{{ option.name }}</a
        >
      </li>
      <li
        v-for="option in potentialRequirements.filter(it => it.id !== selectedID)"
        :key="option.id"
      >
        <a
          @click="toggleSelectRequirement(option.id)"
          @keyup.enter="toggleSelectRequirement(option.id)"
          tabindex="0"
          data-cyId="newCourse-reqOption"
        >
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
          {{ option.name }}
        </a>
      </li>
      <li>
        <a
          @click="toggleSelectRequirement('')"
          @keyup.enter="toggleSelectRequirement('')"
          tabindex="0"
          data-cyId="newCourse-reqOption"
        >
          None
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import { clickOutside } from '@/utilities';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { emGreen } from '@/assets/constants/scss-variables';

type Data = {
  showDropdown: boolean;
  emGreen: string;
};

export default defineComponent({
  components: { DropDownArrow },
  props: {
    selectedID: { type: String, required: true },
    relatedRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
    potentialRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
  },
  emits: {
    'on-selected-change': (id: string) => typeof id === 'string',
  },
  data(): Data {
    return {
      showDropdown: false,
      emGreen,
    };
  },
  computed: {
    selected(): string {
      if (this.selectedID === '') return '';
      const chosenRequirement = [...this.relatedRequirements, ...this.potentialRequirements].filter(
        it => it.id === this.selectedID
      );
      return chosenRequirement[0].name;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    toggleSelectRequirement(id: string) {
      this.showDropdown = !this.showDropdown;
      this.$emit('on-selected-change', id);
    },
    closeDropdownIfOpen() {
      this.showDropdown = false;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.dropdown {
  border: 1px solid $emGreen;
  box-sizing: border-box;
  border-radius: 4px;
  color: $emGreen;
  height: 36px;
  margin-bottom: 20px;
  background: none;
  width: 100%;
  line-height: 36px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 0px;
  &-content {
    list-style: none;
    background: $white;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 0px 0px 7px 7px;
    color: $lightPlaceholderGray;
    font-size: 14px;
    position: absolute;
    padding-left: 0px;
    width: 93%;
    li {
      a {
        padding: 13px 8px 8px;
        display: block;
        width: 100%;
        &:active,
        &:focus,
        &:hover {
          background: rgba(50, 160, 242, 0.1);
          border: 0;
        }
        .warning-icon {
          float: left;
          margin: 0.125rem 0.25rem 0 0;
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .warning {
    &-icon {
      float: left;
      margin-right: 0.25rem;
      width: 14px;
      height: 14px;
    }
    &-row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .dropdown-content {
    width: 90.5%;
  }
}
</style>
