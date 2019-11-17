<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>
    <div class="reqs-college">
      <h2 class="name">College Requirements</h2>
      <div class="progress"><div class="progress-bar college-color" style="width: 33%" role="progressbar"></div></div>
      <p class="progress-text"><strong>46/120</strong> Total Credits Inputted on Schedule</p>
      <button class="view btn college-color">
        View All College Requirements
      </button>
      <div class="separator"></div>
      <h2 class="name">Major Requirements</h2>
      <div class="progress"><div class="progress-bar major-color" style="width: 60%" role="progressbar"></div></div>
      <p class="progress-text"><strong>16/30</strong> Total Credits Inputted on Schedule</p>
      <button class="view btn major-color">
        View All Major Requirements
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {}
</script>

<style scoped lang="scss">

.college-color {
  background-color: #2BBCC6;
}

.major-color {
  background-color: #4D53DC;
}

.requirements {
  width: 30rem;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}

h1.title {
  margin: 0 0 0 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
}

h2.name {
  margin: 1.5rem 0 1.5rem 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
}

.progress-text {
  margin: 0.3125rem 0 0.7rem 0;
  font-style: normal;
  font-size: 12px;
  line-height: 12px;
}

button.view {
  min-height: 40px;
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: white;
  text-transform: uppercase;
}

.separator {
  margin: 2rem 0 0 0;
  height: 1px;
  width: 100%;
  background-color: #D7D7D7;
}

</style>