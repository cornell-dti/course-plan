<template>
  <nav class="navbar" :style="{ zIndex: modalIsOpen ? 1 : 2 }">
    <div
      class="navbar-iconWrapper hamburger full-opacity-on-hover"
      @click="menuOpen = !menuOpen"
    ></div>
    <div class="navbar-top">
      <div class="navbar-iconWrapper course-plan-logo no-hover">
        <img class="navbar-icon" src="@/assets/images/branding/logo.svg" alt="Courseplan logo" />
      </div>
      <button
        class="navbar-iconWrapper desktop profile-icon full-opacity-on-hover"
        @click="editProfile"
        data-cyId="editProfile"
      ></button>
    </div>
    <div class="navbar-bottom">
      <button
        class="navbar-iconWrapper desktop logout-icon full-opacity-on-hover"
        @click="logout"
      />
    </div>
    <div v-if="menuOpen" class="navbar-menu-background-shadow" @click="editProfile" />
    <div v-if="menuOpen" class="navbar-menu">
      <button class="nav-mobile-button" @click="toggleRequirementsBar">
        <div class="navbar-iconWrapper requirements-bar" />
        <span class="nav-mobile-button-text">
          {{ isOpeningRequirements ? 'View Schedule' : 'View Requirements' }}
        </span>
      </button>
      <button class="nav-mobile-button" @click="editProfile">
        <div class="navbar-iconWrapper profile-mobile-icon" />
        <span class="nav-mobile-button-text">Edit Profile</span>
      </button>
      <button class="nav-mobile-button" @click="logout">
        <div class="navbar-iconWrapper logout-mobile-icon" />
        <span class="nav-mobile-button-text">Log Out</span>
      </button>
      <div class="nav-menu-spacing" />
      <a
        class="nav-menu-dti-link"
        href="https://www.cornelldti.org/projects/courseplan/"
        target="_black"
        rel="noopener noreferrer"
        >Cornell DTI @ 2021</a
      >
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import firebase from 'firebase/app';
import { GTagEvent } from '@/gtag';

export default defineComponent({
  props: {
    isOpeningRequirements: { type: Boolean, required: true },
    modalIsOpen: { type: Boolean, required: true },
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    logout() {
      GTagEvent(this.$gtag, 'logout');
      firebase
        .auth()
        .signOut()
        .then(() => window.location.reload());
    },
    editProfile() {
      this.menuOpen = false;
      this.$emit('editProfile');
    },
    toggleRequirementsBar() {
      this.menuOpen = false;
      this.$emit('toggleRequirementsBar');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

$icon-size: 2.5rem;
$mobile-navbar-height: 4.5rem;

.navbar {
  background-color: #f7f7f7;
  width: 4.5rem;
  height: 100vh;
  display: flex;
  position: fixed;
  z-index: 1;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2.25rem;
  padding-bottom: 2rem;

  &-iconWrapper {
    width: $icon-size;
    height: $icon-size;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;

    &:not(:first-child) {
      margin-top: 2.25rem;
    }
  }

  .profile-icon {
    background-image: url('~@/assets/images/navbar/profileIcon.svg');

    &:hover,
    &:focus,
    &:active {
      background-image: url('~@/assets/images/navbar/profileIconBlue.svg');
    }
  }

  .requirements-bar {
    display: none;
    background-image: url('~@/assets/images/navbar/requirement-toggle.svg');
  }

  .hamburger {
    display: none;
    background-image: url('~@/assets/images/navbar/hamburger-gray.svg');

    &:hover,
    &:focus,
    &:active {
      background-image: url('~@/assets/images/navbar/hamburger-blue.svg');
    }
  }

  .logout-icon {
    background-image: url('~@/assets/images/navbar/logout.svg');

    &:hover,
    &:focus,
    &:active {
      background-image: url('~@/assets/images/navbar/logoutBlue.svg');
    }
  }

  .navbar-menu-background-shadow {
    display: none;
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    top: $mobile-navbar-height;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .navbar-menu {
    position: fixed;
    z-index: 3;
    left: 0;
    width: 16.5rem;
    top: $mobile-navbar-height;
    padding-top: 2rem;
    bottom: 0;
    display: none;
    background: $navMenuGray;

    .nav-menu-spacing {
      flex: 1 1 auto;
    }

    .nav-menu-dti-link {
      color: $lightPlaceholderGray;
      padding: 1rem;
      text-align: center;
    }
  }

  .profile-mobile-icon {
    background-image: url('~@/assets/images/navbar/profile-mobile-icon.svg');
  }

  .logout-mobile-icon {
    background-image: url('~@/assets/images/navbar/logout-mobile-icon.svg');
  }
}

.mobile {
  display: none;
}

.no-hover {
  cursor: default;
}

@media only screen and (max-width: $medium-breakpoint) {
  .navbar {
    width: 100%;
    flex-direction: row;
    height: 4.5rem;
    padding-top: 0rem;
    padding-bottom: 0rem;
    display: flex;
    flex-direction: row;

    .nav-mobile-button {
      border: 0;
      display: flex;
      width: 100%;
      margin: 0.5rem;
      align-items: center;
      background: transparent;
      color: $darkGray;

      .nav-mobile-button-text {
        text-align: left;
        margin: 0 0.5rem;
        line-height: $icon-size;
        flex: 1 1 auto;
        border-bottom: 1px solid $inactiveGray;
      }
    }

    &-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    &-bottom {
      // Give the RHS section the same width as left side icon, so that the logo can be centered.
      // --------------------------------------------
      // | hamburger | icon | empty but dummy width |
      // --------------------------------------------
      width: $icon-size;
    }

    &-iconWrapper {
      &:not(:first-child) {
        margin-top: 0rem;
      }
    }

    .hamburger,
    .requirements-bar,
    .navbar-menu-background-shadow {
      display: block;
    }

    .navbar-menu {
      display: flex;
      flex-direction: column;
    }
  }

  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }
}
</style>
