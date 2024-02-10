<template>
  <div>
    <nav class="navbar" v-click-outside="closeMenuIfOpen">
      <div class="navbar-iconWrapper hamburger full-opacity-on-hover" data-cyId="navbar-menuButton"
        @click="menuOpen = !menuOpen"></div>
      <div class="navbar-top">
        <div class="navbar-iconWrapper course-plan-logo no-hover">
          <img class="navbar-icon" src="@/assets/images/branding/logo.svg" alt="Courseplan logo" />
        </div>
        <div class="navbar-iconWrapper hairlineWrapper no-hover">
          <img class="navbar-icon hairline" src="@/assets/images/navbar/hairline.svg" />
        </div>
        <div class="navbar-buttonWrapper desktop" @click="openPlan" data-cyId="openPlan">
          <button class="navbar-iconWrapper plan-icon full-opacity-on-hover" />
          <div class="navbar-iconText">
            <span>Plan</span>
          </div>
        </div>
        <div class="navbar-buttonWrapper desktop" @click="openTools" data-cyId="openTools">
          <button class="navbar-iconWrapper tools-icon full-opacity-on-hover" />
          <div class="navbar-iconText">
            <span>Tools</span>
          </div>
        </div>
        <div class="navbar-buttonWrapper desktop" @click="openProfile" data-cyId="editProfile">
          <button class="navbar-iconWrapper profile-icon full-opacity-on-hover" />
          <div class="navbar-iconText">
            <span>Profile</span>
          </div>
        </div>
        <div class="navbar-buttonWrapper desktop">
          <button class="navbar-iconWrapper schedule-builder-icon full-opacity-on-hover" />
          <div class="navbar-iconText">
            <span>Schedule Builder</span>
          </div>
        </div>
      </div>
      <div class="navbar-bottom">
        <button class="navbar-iconWrapper desktop logout-icon full-opacity-on-hover" @click="logout" />
      </div>
      <div v-if="menuOpen" class="navbar-menu" data-cyId="navbar-menu">
        <button class="nav-mobile-button" data-cyId="navbar-viewRequirements" @click="toggleRequirementsMobile">
          <div class="navbar-iconWrapper requirements-bar" />
          <span class="nav-mobile-button-text">
            {{ isDisplayingRequirementsMobile ? 'View Schedule' : 'View Requirements' }}
          </span>
        </button>
        <button class="nav-mobile-button" data-cyId="navbar-openPlan" @click="openPlan">
          <div class="navbar-iconWrapper plan-mobile-icon" />
          <span class="nav-mobile-button-text">Plan</span>
        </button>
        <button class="nav-mobile-button" data-cyId="navbar-openTools" @click="openTools">
          <div class="navbar-iconWrapper tools-mobile-icon" />
          <span class="nav-mobile-button-text">Tools</span>
        </button>
        <button class="nav-mobile-button" data-cyId="navbar-editProfile" @click="openProfile">
          <div class="navbar-iconWrapper profile-mobile-icon" />
          <span class="nav-mobile-button-text">Edit Profile</span>
        </button>
        <button class="nav-mobile-button" @click="logout">
          <div class="navbar-iconWrapper logout-mobile-icon" />
          <span class="nav-mobile-button-text">Log Out</span>
        </button>
        <div class="nav-menu-spacing" />
        <a class="nav-menu-dti-link" href="https://www.cornelldti.org/projects/courseplan/" target="_black"
          rel="noopener noreferrer">Cornell DTI @ 2021</a>
      </div>
    </nav>
    <div v-if="menuOpen" class="navbar-menu-background-shadow" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { GTagEvent } from '@/gtag';
import { clickOutside } from '@/utilities';

export default defineComponent({
  props: {
    isDisplayingRequirementsMobile: { type: Boolean, required: true },
  },
  emits: ['openPlan', 'openTools', 'toggleRequirementsMobile', 'openProfile'],
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    logout() {
      GTagEvent(this.$gtag, 'logout');
      const auth = getAuth();
      signOut(auth).then(() => window.location.reload());
    },
    openPlan() {
      this.menuOpen = false;
      this.$emit('openPlan');
    },
    openTools() {
      this.menuOpen = false;
      this.$emit('openTools');
    },
    editProfile() {
      this.menuOpen = false;
    },
    openProfile() {
      this.menuOpen = false;
      this.$emit('openProfile');
    },
    toggleRequirementsMobile() {
      this.menuOpen = false;
      this.$emit('toggleRequirementsMobile');
    },
    closeMenuIfOpen() {
      this.menuOpen = false;
    },
  },
  directives: {
    'click-outside': clickOutside,
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
  position: sticky;
  top: 0;
  z-index: 2;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2.25rem;
  padding-bottom: 2rem;

  &-iconWrapper {
    width: $icon-size;
    height: $icon-size;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;
    justify-content: center;
  }

  &-buttonWrapper {
    cursor: pointer;
    margin-bottom: 1.5rem;
    justify-content: center;
    &:hover,
    &:focus,
    &:active {
      .navbar-iconText {
        color: #0d7acb;
      }

      .plan-icon {
        background-image: url('@/assets/images/navbar/planIconBlue.svg');
      }

      .tools-icon {
        background-image: url('@/assets/images/navbar/toolboxIconBlue.svg');
      }

      .profile-icon {
        background-image: url('@/assets/images/navbar/profileIconBlue.svg');
      }

      .schedule-builder-icon {
        background-image: url('@/assets/images/navbar/scheduleBuilderIconBlue.svg');
      }
    }
  }

  &-iconText {
    display: flex;
    justify-content: center;
    color: #808080;
  }

  .hairlineWrapper {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .hairline {
    width: 100%;
  }

  .plan-icon {
    background-image: url('@/assets/images/navbar/planIcon.svg');
  }

  .tools-icon {
    background-image: url('@/assets/images/navbar/toolboxIcon.svg');
  }

  .profile-icon {
    background-image: url('@/assets/images/navbar/profileIcon.svg');
  }

  .schedule-builder-icon {
    background-image: url('@/assets/images/navbar/scheduleBuilderIcon.svg');
  }

  .requirements-bar {
    display: none;
    background-image: url('@/assets/images/navbar/requirement-toggle.svg');
  }

  .hamburger {
    display: none;
    background-image: url('@/assets/images/navbar/hamburger-gray.svg');

    &:hover,
    &:focus,
    &:active {
      background-image: url('@/assets/images/navbar/hamburger-blue.svg');
    }
  }

  .logout-icon {
    background-image: url('@/assets/images/navbar/logout.svg');

    &:hover,
    &:focus,
    &:active {
      background-image: url('@/assets/images/navbar/logoutBlue.svg');
    }
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

  .plan-mobile-icon {
    background-image: url('@/assets/images/navbar/plan-mobile-icon.svg');
  }

  .tools-mobile-icon {
    background-image: url('@/assets/images/navbar/toolbox-mobile-icon.svg');
  }

  .profile-mobile-icon {
    background-image: url('@/assets/images/navbar/profile-mobile-icon.svg');
  }

  .logout-mobile-icon {
    background-image: url('@/assets/images/navbar/logout-mobile-icon.svg');
  }
}

.mobile {
  display: none;
}

.no-hover {
  cursor: default;
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

@media only screen and (max-width: $medium-breakpoint) {
  .navbar {
    width: 100%;
    flex-direction: row;
    height: 4.5rem;
    padding-top: 0rem;
    padding-bottom: 0rem;
    display: flex;
    position: fixed;
    flex-direction: row;
    z-index: 3;

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
    .requirements-bar {
      display: block;
    }

    .navbar-menu {
      display: flex;
      flex-direction: column;
    }
  }

  .navbar-menu-background-shadow {
    display: block;
  }

  .desktop {
    display: none;
  }

  .hairline,
  .hairlineWrapper {
    display: none;
  }

  .mobile {
    display: flex;
  }
}
</style>