<template>
  <div class="navbar" :class="{ bottomPreview: isBottomPreview }">
    <div class="navbar-top">
      <div class="navbar-iconWrapper">
        <img class="navbar-icon" src="@/assets/images/branding/logo.svg" alt="Courseplan logo" />
      </div>
      <div class="navbar-iconWrapper desktop" id="profileIcon" @click="editProfile"></div>
    </div>
    <div class="navbar-bottom">
      <div class="navbar-iconWrapper mobile requirementsBar" @click="toggleRequirementsBar"></div>
      <div class="navbar-iconWrapper mobile" id="profileIcon" @click="editProfile"></div>
      <div class="navbar-iconWrapper" id="logout" @click="logout"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase from 'firebase/app';

export default Vue.extend({
  props: {
    isBottomPreview: Boolean,
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(
          () => {
            window.location.reload(false);
          },
          error => {
            // TODO: error
            console.log(error);
          }
        );
    },
    editProfile() {
      this.$emit('editProfile');
    },
    toggleRequirementsBar() {
      this.$emit('toggleRequirementsBar');
    },
  },
});
</script>

<style scoped lang="scss">
.navbar {
  background-color: #f7f7f7;
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

.pointer {
  cursor: pointer;
}
#profileIcon {
  cursor: pointer;
  background-image: url('~@/assets/images/navbar/profileIcon.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/profileIconBlue.svg');
  }
}

.requirementsBar {
  cursor: pointer;
  background-image: url('~@/assets/images/navbar/hamburger-gray.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/hamburger-blue.svg');
  }
}

#star {
  cursor: pointer;
  background-image: url('~@/assets/images/navbar/star.svg');

  &:hover,
  &:focus,
  &:active {
    background-image: url('~@/assets/images/navbar/starBlue.svg');
  }
}

#logout {
  cursor: pointer;
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

.mobile {
  display: none;
}

@media only screen and (max-width: 878px) {
  .navbar {
    &-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    &-bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      min-width: 35%;
    }

    &-iconWrapper {
      &:not(:first-child) {
        margin-top: 0rem;
      }
    }
  }

  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }
}

@media only screen and (max-width: 600px) {
  .navbar {
    .requirementsBar {
      cursor: pointer;
      background-image: url('~@/assets/images/navbar/hamburger-gray.svg');

      &:hover {
        background-image: url('~@/assets/images/navbar/hamburger-gray.svg');
      }

      &:focus,
      &:active {
        background-image: url('~@/assets/images/navbar/hamburger-blue.svg');
      }
    }
  }
}
</style>
