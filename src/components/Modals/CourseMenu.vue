<template>
  <div class="courseMenu">
    <div class="courseMenu-content">
      <div class="courseMenu-section">
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="../../assets/images/paint.svg"/>
          <span class="courseMenu-text">Edit Color</span>
        </div>
        <img class="courseMenu-arrow" src="../../assets/images/move.svg"/>
      </div>
      <div class="courseMenu-section" v-on:click="deleteCourse">
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="../../assets/images/trash.svg"/>
          <span class="courseMenu-text">Delete</span>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  methods: {
    deleteCourse() {
      this.$emit("delete-course");
    }
  }
}
</script>

<style scoped lang="scss">
.courseMenu {
  background: #FFFFFF;
  border: 0.25px solid #ACACAC;
  box-sizing: border-box;
  border-radius: 9px;
  font-size: 14px;
  color: #404040;
  width: 9rem;

  &-section {
    display: flex;
    justify-content: space-between;
    padding: .5rem 1rem;
    

    &:hover,
    &:active,
    &:focus {
      background-color: #2fa1f2;
    }

    &:first-child {
      padding-top: 1rem;
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }

    &:last-child {
      padding-bottom: 1rem;
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
    }
  }

  &-icon {
    margin-right: 1rem;
  }
}

</style>