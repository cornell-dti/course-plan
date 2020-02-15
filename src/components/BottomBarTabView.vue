<template>
  <div class="bottombartabview">
    <div v-for="bottomCourse in bottomCourses" :key="bottomCourse.id" class="bottombartabview-courseWrapper">
      <bottombartab
        v-bind="bottomCourse"
        :id="bottomCourse.id"
        :subject="bottomCourse.subject"
        :number="bottomCourse.number"
        :color="bottomCourse.color"
        :courseObj ="bottomCourse"
        @bottomBarTabToggle="bottomBarTabToggle"
        @deleteBottomTab="deleteBottomTab"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import BottomBarTab from '@/components/BottomBarTab';

Vue.component('bottombartab', BottomBarTab);

export default {
  props: {
    bottomCourses: Array,
  },

  methods: {
    bottomBarTabToggle(courseObj) {
      this.$emit('bottomBarTabToggle', courseObj);
    },

    deleteBottomTab(subject, number) {
      for (let i = 0; i < this.bottomCourses.length; i += 1) {
        if (this.bottomCourses[i].subject === subject && this.bottomCourses[i].number === number) {
          this.bottomCourses.splice(i, 1);
          break;
        }
      }
    }
  }
};

</script>

<style scoped lang="scss">
.bottombartabview {
  width: 50%;
  display: flex;
  flex-direction: row;

  &-courseWrapper {
    margin-right: 0.25rem;
  }
}
</style>
