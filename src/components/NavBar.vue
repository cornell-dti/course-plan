<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/branding/logo.svg">
      </div>
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/navbar/profileIcon.svg">
      </div>
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/navbar/star.svg">
      </div>
    </div>
    <div class="navbar-bottom">
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/navbar/logout.svg">
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style scoped lang="scss">
.navbar {
  background-color: #F7F7F7;
  width: 4.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2.25rem;
  padding-bottom: 2.25rem;

  &-iconWrapper {
    &:not(:first-child) {
      margin-top: 2.25rem;
    }
  }
}
</style>
