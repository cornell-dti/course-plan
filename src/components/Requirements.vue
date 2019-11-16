<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>
    <div class="reqs-college">
      <h2 class="name">College Requirements</h2>
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {}
</script>

<style scoped lang="scss">

.requirements {
  width: 30rem;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}
.title {
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
}

.name {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
}

</style>