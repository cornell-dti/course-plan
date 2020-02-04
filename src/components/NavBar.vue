<template>
  <div class="navbar" :class="{ bottomPreview: isBottomPreview }">
    <div class="navbar-top">
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/branding/logo.svg">
      </div>
      <div class="navbar-iconWrapper" id="profileIcon" @click="editProfile"></div>
    </div>
    <div class="navbar-bottom">
      <div class="navbar-iconWrapper" id="logout" @click="logout"></div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
  props: {
    isBottomPreview: Boolean
  },

  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        window.location.reload(false);
      }, error => {
        // TODO: error
        console.log(error);
      });
    },
    editProfile() {
      this.$emit('editProfile');
    }
  }
};
</script>


<style scoped lang="scss">
.navbar {
  background-color: #F7F7F7;
  width: 4.5rem;
  height: 100vh;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2.25rem;
  padding-bottom: 2rem;

  &-iconWrapper {
    height: 2.5rem;
    width: 2.5rem;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;

    &:not(:first-child) {
      margin-top: 2.25rem;
    }
  }
}

#profileIcon {
  background-image: url('~@/assets/images/navbar/profileIcon.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/profileIconBlue.svg');
  }
}

#star {
  background-image: url('~@/assets/images/navbar/star.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/starBlue.svg');
  }
}

#logout {
  background-image: url('~@/assets/images/navbar/logout.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/logoutBlue.svg');
  }
}

.bottomPreview {
  padding-bottom: calc(2.25rem + 15px);
}
</style>
