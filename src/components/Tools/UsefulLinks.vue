<template>
  <div class="links">
    <div v-for="{ title, link } in list" :key="title" class="links-group">
      <a class="links-link" :href="link">
        {{ title }}
        <img class="links-link-icon" src="@/assets/images/link-gray.svg" alt="external link" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    list(): { link: string; title: string }[] {
      return [
        {
          title: 'Student Center',
          link: 'https://studentcenter.cornell.edu/',
        },
        {
          title: 'Scheduler',
          link: 'https://classes.cornell.edu/scheduler/',
        },
        {
          title: 'Class Roster',
          link: 'https://classes.cornell.edu/browse/',
        },
        {
          title: 'Academic Calendar',
          link: 'https://registrar.cornell.edu/academic-calendar/',
        },
        {
          title: 'Cornell DTI',
          link: 'https://www.cornelldti.org/',
        },
      ];
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.links {
  display: flex;
  flex-direction: column;

  > :last-child {
    margin-bottom: 0;
  }

  &-link {
    color: #3d3d3d;
    text-decoration: underline;

    &:hover,
    &:focus,
    &:active {
      color: $yuxuanBlue;
    }

    display: flex;
    align-items: center;

    &-icon {
      margin-left: 0.25rem;
    }

    margin-bottom: 0.5rem;
  }
}
</style>
