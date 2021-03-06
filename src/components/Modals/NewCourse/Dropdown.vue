<template>
  <div>
    <button
      class="dropdown"
      type="button"
      @click="showDropdown = !showDropdown"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="showDropdown"
    >
      {{ selected }}
      <drop-down-arrow :isFlipped="showDropdown" fillColor="#148481" />
    </button>
    <ul v-if="showDropdown" class="dropdown-content">
      <li v-for="option in options" :key="option.id">
        <a
          @click="toggleSelectRequirement(option.id)"
          @keyup.enter="toggleSelectRequirement(option.id)"
          tabindex="0"
          >{{ option.name }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

type Data = {
  showDropdown: boolean;
};

export default Vue.extend({
  components: { DropDownArrow },
  props: {
    selectedID: { type: String, required: true },
    options: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
  },
  data(): Data {
    return {
      showDropdown: false,
    };
  },
  computed: {
    selected(): string {
      return this.options.find(option => option.id === this.selectedID).name;
    },
  },
  methods: {
    toggleSelectRequirement(id: string) {
      this.showDropdown = !this.showDropdown;
      this.$emit('on-selected-change', id);
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
      }
    }
  }
}
</style>
