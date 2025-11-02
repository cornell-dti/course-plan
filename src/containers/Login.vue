<template>
  <div>
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <div class="landing top-sec">
      <!--PLAN AHEAD-->
      <div class="container p-0 m-0">
        <div class="row top-bar phonepad no-gutters">
          <div class="col">
            <div class="row no-gutters top-section">
              <h1 class="plan-head mt-5">
                <div>Schedule Smarter</div>
                <div>Plan Ahead</div>
              </h1>
            </div>
            <div class="row no-gutters top-section">
              <div class="plan-subhead">
                <div>
                  Introducing the <span class="highlight">newest</span> and
                  <span class="highlight">easiest</span>
                </div>
                <div>way to <span class="highlight">plan your courses</span> at Cornell</div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col top-section">
                <button
                  @click="socialLogin"
                  class="email-button email-button--top"
                  variant="primary"
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 top-section image-wrapper image-wrapper--laptop">
            <img
              style="position: relative"
              class="laptop"
              aria-label="laptop"
              src="@/assets/images/landing_new/laptop.svg"
              alt="laptop preview"
            />
          </div>
        </div>
      </div>

      <!--NEW WAY-->
      <div class="new container p-0 new-way">
        <div class="row new no-gutters">
          <div class="col tasks">
            <figure class="figure">
              <img
                src="@/assets/images/landing_new/icon1.svg"
                class="sub--task"
                alt="checklist"
                aria-label="checklist"
              />
              <figcaption class="sub">Fully personalized to track your requirements</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img
                src="@/assets/images/landing_new/icon2.svg"
                class="sub--task"
                alt="browser"
                aria-label="browser"
              />
              <figcaption class="sub">Customizable interface to view your courses</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img
                src="@/assets/images/landing_new/icon3.svg"
                class="sub--task"
                alt="Network"
                aria-label="network"
              />
              <figcaption class="sub">Built-in system to check your progress</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img
                src="@/assets/images/landing_new/icon4.svg"
                class="sub--task"
                alt="Starred comment"
                aria-label="starred comment"
              />
              <figcaption class="sub">View course information all in one place</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <!-- DRAG -->
      <div class="container-fluid plan p-0 center">
        <div class="drag drag--first phonepad feature-section">
          <div class="feature-image">
            <img
              class="preview"
              src="@/assets/images/landing_new/img1.svg"
              alt="Dragging preview"
              aria-label="dragging preview"
            />
          </div>
          <div class="comment comment-drag">
            <h1 class="head">Drag and Drop Courses</h1>
            <p class="sub-text drag-text">
              Easily organize your schedule with CoursePlan's intuitive
              <strong>drag-and-drop interface,</strong>
              which recommends courses based on your unfulfilled requirements.
            </p>
          </div>
        </div>
      </div>

      <!-- SEMESTERS -->
      <div class="container-fluid p-0 center">
        <div class="semester phonepad feature-section">
          <div class="comment comment-sem">
            <h1 class="head">Plan Your Semesters</h1>
            <p class="sub-text semester-text">
              Stay ahead with CoursePlan's
              <strong>semesterly planner</strong>—select your courses early and ensure you never
              miss a requirement.
            </p>
          </div>
          <div class="feature-image" id="plan-preview-requiring-offset">
            <img
              class="schedule-centered"
              src="@/assets/images/landing_new/img2.svg"
              alt="Plan preview"
              aria-label="plan preview"
            />
          </div>
        </div>
      </div>

      <!-- TRACKING -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad feature-section">
          <div class="feature-image">
            <img
              class="preview"
              src="@/assets/images/landing_new/img3.svg"
              alt="Dragging preview"
              aria-label="dragging preview"
            />
          </div>
          <div class="comment comment-drag">
            <h1 class="head">Plan With Academic Tools</h1>
            <p class="sub-text track-text">
              <strong>Streamline your semester planning</strong> <br />
              with CoursePlan's academic tools, <br />
              including a dashboard, progress <br />tracker, and advisor contact list.
            </p>
          </div>
        </div>
      </div>

      <!-- GENERATE -->
      <div class="container-fluid p-0 center">
        <div class="semester phonepad feature-section">
          <div class="comment comment-sem notes-text-left">
            <h1 class="head">Schedule Generator</h1>
            <p class="sub-text generate-text">
              Effortlessly create your ideal schedule. Select your preferred classes and let
              CoursePlan generate <strong>optimized schedule suggestions</strong> on the Build page.
            </p>
          </div>
          <div class="feature-image">
            <img
              class="schedule-centered"
              src="@/assets/images/landing_new/img4.svg"
              alt="Notes preview"
              aria-label="Notes preview"
            />
          </div>
        </div>
      </div>

      <!-- MULTIPLE -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad feature-section">
          <div class="feature-image">
            <img
              class="preview"
              src="@/assets/images/landing_new/img5.svg"
              alt="Multiple-plan preview"
              aria-label="multiple-plan preview"
            />
          </div>
          <div class="comment comment-drag">
            <h1 class="head">Multiple Plans</h1>
            <p class="sub-text multiple-text">
              <strong>Explore different academic paths</strong> by<br />
              creating multiple versions of your <br />four-year plan to find the one that fits you
              best.
            </p>
          </div>
        </div>
      </div>

      <!-- SAVED -->
      <div class="container-fluid p-0 center">
        <div class="semester phonepad feature-section">
          <div class="comment comment-sem">
            <img
              src="@/assets/images/new_badge.svg"
              alt="NEW!"
              class="new-badge"
              aria-label="new feature badge"
            />
            <h1 class="head">Saved Courses</h1>
            <p class="sub-text saved-text">
              Easily <strong>save courses for the future</strong> <br />
              by adding them to a new or <br />existing collection. View, update, <br />and manage
              your saved courses <br />anytime on the Save page.
            </p>
          </div>
          <div class="feature-image">
            <img
              class="schedule-centered"
              src="@/assets/images/landing_new/img6.svg"
              alt="Saved courses preview"
              aria-label="saved courses preview"
            />
          </div>
        </div>
      </div>

      <!-- NOTES -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad feature-section">
          <div class="feature-image">
            <img
              class="preview"
              src="@/assets/images/landing_new/img7.svg"
              alt="Notes preview"
              aria-label="notes preview"
            />
          </div>
          <div class="comment comment-drag">
            <img
              src="@/assets/images/new_badge.svg"
              alt="NEW!"
              class="new-badge"
              aria-label="new feature badge"
            />
            <h1 class="head">Personal Notes</h1>
            <p class="sub-text notes-text">
              <strong>Keep track of important details</strong> by <br />
              adding notes and comments while <br />
              planning your courses.
            </p>
          </div>
        </div>
      </div>

      <!--FOOTER-->
      <custom-footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import CustomFooter from '@/components/Footer.vue';

import { GTagLoginEvent } from '@/gtag';
import store from '@/store';
import { checkNotNull } from '@/utilities';

type Data = {
  loginForm: { email: string; password: string };
  waitlist: { email: string; major: string; time: string };
  performingRequest: boolean;
  errorMsg?: string;
};

export default defineComponent({
  components: { CustomFooter },
  data(): Data {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      waitlist: {
        email: '',
        major: '',
        time: '',
      },
      performingRequest: false,
      errorMsg: undefined,
    };
  },
  methods: {
    socialLogin() {
      this.performingRequest = true;
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then(user => {
          if (user == null || user.user == null) {
            return;
          }
          const simplifiedUser = {
            displayName: checkNotNull(user.user.displayName),
            email: checkNotNull(user.user.email),
          };
          store.commit('setCurrentFirebaseUser', simplifiedUser);
          this.performingRequest = false;
          this.$router.push('/');
          GTagLoginEvent(this.$gtag, 'Google');
        })
        .catch(err => {
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    getYear(): number {
      const today = new Date();
      return today.getFullYear();
    },
  },
  mounted() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, 100);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px',
      }
    );

    document.querySelectorAll('.container-fluid').forEach(section => {
      section.classList.add('slide-in');
      observer.observe(section);
    });
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

@font-face {
  font-family: 'Proxima Nova';
  src: url('@/assets/fonts/Proxima Nova Alt Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Proxima Nova';
  src: url('@/assets/fonts/ProximaNova-Regular.otf') format('opentype'),
    url('@/assets/fonts/ProximaNova-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Proxima Nova';
  src: url('@/assets/fonts/ProximaNova-Bold.otf') format('opentype'),
    url('@/assets/fonts/ProximaNova-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.top-sec {
  background: url('@/assets/images/landing_new/top_rect.svg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  overflow: hidden;
  padding-top: 6.25rem;

  @media (max-width: $large-breakpoint) {
    padding-top: 0;
    background-size: cover;
  }
}

.logo {
  width: 12rem;
}
.section {
  padding: 0px;
  margin: 0px;
  max-width: 100%;
}
.container {
  max-width: 100%;
}
.top-bar {
  padding: 1.75rem 0 0 6.5rem;
  display: flex;
  align-items: center;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: $large-breakpoint) {
    padding: 1.75rem 1.5rem 0px 1.5rem;
    display: flex;
    flex-direction: column;
  }
}
.top-section {
  @media (max-width: $large-breakpoint) {
    display: flex;
    justify-content: center;
    text-align: center;
    max-width: 100%;
  }
}
.signin-button {
  color: $emGreen;
  font-weight: 550;
  border-color: $emGreen;
  padding: 0.625rem 2rem;
  border-radius: 6px;
}
.plan-head {
  padding-bottom: 2rem;
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 700;
  font-size: 72px;
  line-height: 73px;
  letter-spacing: 0;
  color: #ffffff;
}
.plan-subhead {
  padding-bottom: 2rem;
  font-style: normal;
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 300;
  font-size: 32px;
  line-height: 34px;
  color: $white;

  .highlight {
    font-weight: 700;
  }
}
input {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border-color: $emGreen;
  padding: 1rem 2rem;
}
.email {
  padding: 1.25rem;
  @media (max-width: 767px) {
    width: 350px;
    max-width: 350px;
    flex: unset;
  }
}
.email-button {
  border: 0;
  background-color: #13807c;
  border-radius: 6px;
  font-size: 20px;
  width: 100%;
  padding: 1rem 2rem;
  color: $white;
  &:hover,
  &:focus,
  &:active {
    border-color: #0e6561;
    background-color: #0e6561;
  }

  &--top {
    width: 13.5rem;
    @media (max-width: $large-breakpoint) {
      margin-bottom: 1rem;
    }
  }
}
.email-top {
  padding: 1.25rem;
}
.image-wrapper {
  @media (max-width: $large-breakpoint) {
    display: none;
  }

  &--drag {
    overflow: unset;
  }

  &--laptop {
    display: block;

    @media (max-width: $large-breakpoint) {
      display: block;
      text-align: center;
      margin-top: 2rem;
    }
  }
}
.laptop {
  position: relative;
  max-width: 100%;
  width: auto;
  height: auto;

  @media (max-width: $large-breakpoint) {
    max-width: 90%;
    margin: 0 auto;
  }
}

.new-way {
  margin-top: 0;
}

.new {
  padding: 3.25rem 6.5rem 3rem 6.5rem;
  color: $black;
  display: flex;
  margin-top: 8rem;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: $large-breakpoint) {
    flex-direction: column;
    margin-top: 4rem;
  }
}
.new-1 {
  text-align: left;
  padding: 7.5rem 0 3.75rem 6.5rem;
}
.tasks {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  color: $black;
}
.tasks-wrapper {
  @media (max-width: $large-breakpoint) {
    max-width: 100%;
    flex: unset;
  }
}

figure {
  text-align: center;
}

.sub-text {
  font-weight: normal;
  font-size: 30px;
  text-align: left;
  color: $black;
  margin-top: 32px;
  line-height: 2;

  strong {
    font-family: 'Proxima Nova', sans-serif;
    font-weight: 700;
    font-style: normal;
  }

  @media (max-width: $large-breakpoint) {
    text-align: center;
  }
}

.sub {
  font-weight: normal;
  font-size: 24px;
  text-align: center;
  color: $black;
  margin: 0;

  &--task {
    vertical-align: middle;
    padding-bottom: 2.5rem;
  }
}
.head {
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 700;
  line-height: 42px;
  font-size: 40px;
  color: $black;
  padding-bottom: 0px;
}

.hidden {
  opacity: 0;
}

.drag {
  overflow: visible;
  position: relative;

  padding: 6.25rem 6.25rem;

  &--first {
    margin-top: 0;
  }

  @media (max-width: $large-breakpoint) {
    padding: 3rem 2rem;
  }
}
.preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  transform: none;
  left: 0px;
  margin-right: -32px;
  max-width: 100%;
  width: 950px;
  margin-top: 300px;
  margin-bottom: 300px;
  transform: translateX(-8vw) !important;
  @media (max-width: 1200px) {
    width: 750px;
  }
}

.schedule-centered {
  position: relative;
  right: 0px;
  margin-left: 0;
  max-width: 100%;
  width: 1050px;
  margin-top: 300px;
  margin-bottom: 300px;
  justify-self: flex-end;
  flex-shrink: 0;
  transform: translateX(8vw) !important;

  @media (max-width: $large-breakpoint) {
    display: none;
  }
}

.schedule {
  justify-self: flex-end;
  flex-shrink: 0;

  width: 1050px;
  margin-left: -100px;
  margin-right: -290px;
}
.comment {
  @media (max-width: $large-breakpoint) {
    text-align: center;
    max-width: 100%;
    flex: unset;
  }

  &-drag {
    padding: 12.75rem 0rem 15.75rem 3.25rem;
    margin-left: 950px;
    margin-top: 600px;
    transform: translateY(-125px);
    width: 800px;
    z-index: 2; /* Ensure text appears above images */

    @media (max-width: $large-breakpoint) {
      margin-left: 0;
      width: auto;
      padding: 2rem;
      margin-top: 0;
      transform: none;
    }

    .sub-text {
      width: 600px;
      margin-right: 0;

      @media (max-width: $large-breakpoint) {
        width: 100%;
      }
    }

    &:has(.notes-text) {
      margin-top: 450px;
      margin-left: 950px;
      transform: translate(-20px, 200px);
      width: 800px;

      @media (max-width: $large-breakpoint) {
        margin-left: 0;
        margin-top: 0;
        transform: none;
        width: auto;
      }

      .head {
        margin-bottom: 30px;
      }

      .sub-text {
        width: 600px;
        margin-right: 0;
        line-height: 1.5;

        @media (max-width: $large-breakpoint) {
          width: 100%;
        }
      }
    }

    &:has(.track-text) {
      margin-top: 400px;
      transform: translateY(-150px);

      @media (max-width: $large-breakpoint) {
        margin-top: 0;
        transform: none;
      }
    }

    &:has(.multiple-text) {
      margin-top: 500px;
      transform: translateY(-100px);

      @media (max-width: $large-breakpoint) {
        margin-top: 0;
        transform: none;
      }
    }

    &:has(.track-text) {
      margin-top: 450px;
      margin-left: 950px;
      transform: translateY(-150px);
      width: 1000px;

      @media (max-width: $large-breakpoint) {
        margin-left: 0;
        margin-top: 0;
        transform: none;
        width: auto;
      }

      .head {
        margin-bottom: 30px;
      }

      .sub-text {
        width: 800px;
        margin-right: 0;
        margin-left: 0;
        line-height: 1.5;
        white-space: normal;

        @media (max-width: $large-breakpoint) {
          width: 100%;
        }

        strong {
          white-space: nowrap;
          display: inline;
        }
      }
    }
  }

  &-sem {
    padding: 0rem 3.25rem 15.75rem 3.25rem;
    margin: 0;
    margin-top: 550px;
    margin-right: 900px;
    transform: translate(10px, -120px);
    flex-shrink: 2;
    z-index: 2; /* Ensure text appears above images */

    @media (max-width: $large-breakpoint) {
      margin-right: 0;
      margin-left: 0;
      margin-top: 0;
      width: auto;
      padding: 2rem;
      transform: none;
    }

    &:has(.semester-text) {
      margin-right: 750px;
      margin-top: 650px;
      margin-left: 250px;
      transform: translate(-300px, -50px);

      @media (max-width: $large-breakpoint) {
        margin-right: 0;
        margin-left: 0;
        margin-top: 0;
        transform: none;
      }
    }

    &:has(.generate-text) {
      margin-right: 850px;
      margin-top: 500px;
      margin-left: 100px;
      transform: translate(0px, 190px);
      width: 800px;

      @media (max-width: $large-breakpoint) {
        margin-right: 0;
        margin-left: 0;
        margin-top: 0;
        width: auto;
        transform: none;
      }

      .sub-text {
        width: 450px;
        margin-right: 0;

        @media (max-width: $large-breakpoint) {
          width: 100%;
        }
      }
    }

    &:has(.saved-text) {
      margin-right: 850px;
      margin-top: 600px;
      margin-left: 100px;
      transform: translate(-75px, 125px);
      width: 800px;

      @media (max-width: $large-breakpoint) {
        margin-right: 0;
        margin-left: 0;
        margin-top: 0;
        width: auto;
        transform: none;
      }

      .sub-text {
        width: 600px;
        margin-right: 0;

        @media (max-width: $large-breakpoint) {
          width: 100%;
        }
      }
    }

    &.notes-text-left {
      margin-right: 850px;
      margin-left: 100px;

      @media (max-width: $large-breakpoint) {
        margin-right: 0;
        margin-left: 0;
      }
    }
  }
}
.semester {
  margin-top: -4rem;
  overflow: hidden;
}
.first {
  background-color: $sangBlue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 11.25rem 6.25rem 6.5rem 6.25rem;

  @media (max-width: 720px) {
    padding: 2.5rem 2rem 2.5rem 2rem;
  }
}
input:focus::placeholder {
  color: transparent;
}
button {
  outline: none;
}

p {
  padding: 0;
}
.container.inside {
  max-width: 600px;
}
@media (max-width: $large-breakpoint) {
  .top-bar {
    padding: 3rem;
  }
  .new {
    padding: 0px 3rem 6.25rem 3rem;
  }
  .phonepad {
    padding: 3rem;
  }
  .comment {
    padding: 6.25rem 2rem 6.25rem 2rem;
  }
  .center {
    margin: 0;
  }
}
*,
html {
  padding: 0;
  margin: 0;
}

.slide-in {
  opacity: 0;
  visibility: hidden;
  transition: all 1s ease-out;

  &:nth-child(even) {
    transform: translateX(50px);

    &.visible {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }
  }

  &:nth-child(odd) {
    transform: translateX(-50px);

    &.visible {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }
  }
}

.new-badge {
  display: block;
  margin-top: 0;
  margin-bottom: 1.5rem;
  width: 140px;
  height: 54px;

  @media (max-width: $large-breakpoint) {
    margin: 0 auto 2rem;
    width: 120px;
    height: auto;
  }
}

.comment-sem,
.comment-drag {
  padding: 0;
  margin: 0;
  transform: none;
  width: auto;
  position: static;
  z-index: auto;

  .sub-text,
  .head {
    text-align: inherit;
  }
}

.container-fluid.center {
  margin-bottom: 10vh;
  margin-top: -10vh;

  &:last-child {
    margin-bottom: 0;
  }

  &:has(.semester-text) {
    margin-bottom: -15vh;
    margin-top: -20vh;

    @media (max-width: $large-breakpoint) {
      margin-bottom: -5vh;
      margin-top: -5vh;
    }
  }

  &:has(.generate-text) {
    margin-bottom: -20vh;
    margin-top: -25vh;

    @media (max-width: $large-breakpoint) {
      margin-bottom: -5vh;
      margin-top: -5vh;
    }
  }

  &:has(.saved-text) {
    margin-bottom: -15vh;
    margin-top: -20vh;

    @media (max-width: $large-breakpoint) {
      margin-bottom: -5vh;
      margin-top: -5vh;
    }
  }
}

.container-fluid.plan:has(.track-text) {
  margin-bottom: 6rem;
  margin-top: 10rem;
}

.container-fluid.plan:has(.multiple-text) {
  margin-bottom: -20rem;
  margin-top: 15rem;
}

.container-fluid.plan:has(.notes-text) {
  margin-bottom: 2rem;
  margin-top: 7.5rem;

  @media (max-width: $large-breakpoint) {
    margin-bottom: 4rem;
  }
}

.container-fluid.plan:has(.drag-text) {
  margin-bottom: 6rem;
  margin-top: -18rem;
}

/* Add more specific mobile styling */
@media (max-width: 768px) {
  .plan-head {
    font-size: 56px;
    line-height: 60px;
  }

  .plan-subhead {
    font-size: 26px;
    line-height: 30px;
  }

  .head {
    font-size: 36px;
    line-height: 40px;
  }

  .sub-text {
    font-size: 24px;
    line-height: 32px;
  }

  .new {
    padding: 3rem 2rem;
  }

  .tasks {
    flex: 0 0 50%;
    max-width: 50%;
    margin-bottom: 2rem;
  }
}

/* Extra small devices */
@media (max-width: 576px) {
  .plan-head {
    font-size: 42px;
    line-height: 46px;
  }

  .plan-subhead {
    font-size: 22px;
    line-height: 26px;
  }

  .head {
    font-size: 32px;
    line-height: 36px;
  }

  .sub-text {
    font-size: 20px;
    line-height: 28px;
  }

  .sub {
    font-size: 18px;
  }

  .tasks {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .email-button {
    font-size: 16px;
    padding: 0.8rem 1.5rem;
  }

  .top-bar {
    padding: 1.5rem 1rem;
  }

  .phonepad {
    padding: 1.5rem;
  }
}

/* Make new-way section spacing more responsive */
.new-way {
  margin-top: 5vw;

  @media (max-width: $large-breakpoint) {
    margin-top: 2rem;
  }
}

/* Make "Plan Your Semesters" section match others */
.semester:has(.semester-text) {
  @media (max-width: $large-breakpoint) {
    &::before {
      background-size: contain !important;
      height: 180px !important;
      margin-bottom: 1rem;
    }
  }
}

/* Ensure layout is consistent between all sections */
.semester,
.drag {
  @media (max-width: $large-breakpoint) {
    padding-top: 200px !important; /* Consistent padding for all sections */
  }
}

/* Fix specific styling for Plan Your Semesters section's image */
.semester:has(.semester-text) {
  .schedule-centered {
    position: relative;
    top: -200px;
    right: -310px; /* Keep the current right positioning */
    width: 1400px; /* Increase the width from default 1050px */
    max-width: 120%; /* Allow image to be slightly larger than container */
  }
}

/* Improve consistency in section spacing for smaller screens */
@media (max-width: $large-breakpoint) {
  /* Ensure consistent section margins and spacing */
  .container-fluid.center,
  .container-fluid.plan {
    margin: 3rem 0 !important; /* Override all other margin settings to ensure consistency */
    padding: 0 1rem;
  }

  /* Ensure consistent text section spacing */
  .comment-drag,
  .comment-sem {
    padding: 2rem 1rem !important; /* Consistent padding */
    margin: 0 auto !important; /* Center and reset all margins */
    width: 100% !important; /* Consistent width */
    max-width: 600px !important; /* Consistent max width */
    transform: none !important; /* Reset all transforms */
  }

  /* Consistent section padding */
  .drag,
  .semester {
    padding: 200px 1rem 2rem 1rem !important; /* Space for images + consistent padding */
  }
}

/* Ensure image background quality on mobile */
@media (max-width: $large-breakpoint) {
  .drag::before,
  .semester::before {
    height: 180px !important;
    background-size: contain !important;
    background-position: center !important;
    opacity: 0.85 !important;
    top: 10px !important; /* Adjust position for consistency */
  }
}

/* Fix NEW badge display on mobile */
@media (max-width: $large-breakpoint) {
  .new-badge {
    margin: 0 auto 1.5rem auto !important;
    width: 100px !important;
    height: auto !important;
  }

  /* Ensure feature headings have consistent spacing */
  .head {
    margin-bottom: 1rem !important;
  }

  /* Consistent spacing between sections */
  .container-fluid.center:last-of-type {
    margin-bottom: 6rem !important; /* Extra space for the last section before footer */
  }
}

/* Improve mobile layout for feature text */
@media (max-width: 1200px) {
  .tasks {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }

  /* Ensure icons are properly sized */
  .sub--task {
    width: 60px;
    height: auto;
    padding-bottom: 1rem;
  }

  /* Fix layout to prioritize centered content */
  .new {
    text-align: center;
    padding: 2rem 1rem;
  }

  .row.new.no-gutters {
    justify-content: center;
  }

  /* Center all feature section text */
  .sub,
  .sub-text,
  .head {
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  /* Ensure tasks elements are centered */
  .tasks figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* Center text in middle feature sections */
  .sub-text {
    max-width: 90% !important;
  }
}

/* Improve mobile layout for feature text */
@media (max-width: 576px) {
  /* Add padding for better readability */
  .sub-text {
    padding: 0 0.5rem;
    max-width: 100% !important;
  }

  /* Ensure consistent text alignment */
  .tasks figcaption {
    padding: 0 1rem;
  }
}

/* Specific fix for feature descriptions in the screenshot */
@media (max-width: 1200px) {
  /* Add space between features */
  .tasks {
    margin-bottom: 2.5rem;
  }

  /* Fix specific feature text alignment shown in screenshot */
  .figure .sub {
    padding: 0 1rem;
    line-height: 1.4;
  }
}

/* General text alignment fix for responsive views */
@media (max-width: $large-breakpoint) {
  .figure {
    width: 100%;
    max-width: 280px;
  }

  figure figcaption.sub {
    width: 100%;
    margin: 0 auto;
  }
}

.feature-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 4rem 2rem;
  margin-bottom: 4rem;
  overflow: hidden;
  width: 100%;
  overflow: visible;
  position: relative;

  .feature-image {
    flex: 1 1 66%;
    max-width: 66%;
    text-align: center;
    overflow: visible; /* Allow children (like the img) to spill outside */
    position: relative;

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  }

  #plan-preview-requiring-offset {
    @media (min-width: $large-breakpoint) {
      margin-right: -15rem;
    }
  }

  .comment {
    flex: 1 1 33%;
    max-width: 33%;
    padding: 0;
    margin: 0;
    transform: none;
    position: static;
    z-index: auto;
    text-align: left;

    .sub-text {
      max-width: 100%;
      margin: 1rem 0 0 0;
      text-align: left;
    }

    .head {
      margin-bottom: 1rem;
      text-align: left;
    }

    .new-badge {
      margin-top: 0;
      margin-bottom: 1.5rem;
      display: block;
      margin-left: 0;
    }
  }

  @media (max-width: $large-breakpoint) {
    flex-direction: column;
    padding: 2rem 1.5rem;
    gap: 1.5rem;
    margin-bottom: 3rem;

    .feature-image {
      order: 1;
      max-width: 90%;
      width: 100%;
      flex-basis: auto;
      margin-bottom: 1rem;
      display: block;
    }

    .comment {
      order: 2;
      max-width: 100%;
      flex-basis: auto;
      text-align: center;

      .head,
      .sub-text {
        text-align: center;
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
      }

      .new-badge {
        margin: 0 auto 1.5rem auto !important;
      }
    }
  }
}

.container-fluid.center,
.container-fluid.plan {
  margin: 0 auto !important;
  padding: 0 !important;
  max-width: 1600px;
}

.preview,
.schedule-centered {
  display: block;
  visibility: visible;
  position: static !important;
  margin: 1em !important;
  width: auto;
  max-width: 100%;
  height: auto;
  left: auto;
  right: auto;
  top: auto;
  bottom: auto;
  transform: none;
}

@media (min-width: 977px) and (max-width: 1400px) {
  .image-wrapper--laptop {
    transform: scale(0.9);
    transform-origin: right center;
  }

  .laptop {
    max-width: 700px;
    margin-right: -50px;
  }

  .tasks {
    padding: 0.5rem;
  }

  .sub--task {
    padding-bottom: 1.5rem;
    max-width: 80px;
  }

  .sub {
    font-size: 20px;
  }
}

// Changed color for particular screens as otherwise the icons are invisible
@media (max-width: $large-breakpoint) {
  .tasks .figure .sub--task {
    filter: brightness(0) invert(0);
  }
}

@media (min-width: 2000px) {
  .tasks .figure .sub--task {
    filter: brightness(0) invert(0);
  }
}

/* Hide images on smaller devices */
@media (max-width: 1200px) {
  /* Hide all images by default */
  img:not(.sub--task) {
    display: none !important;
  }

  /* Hide image containers */
  .image-wrapper,
  .feature-image {
    display: none !important;
  }

  /* Ensure specific elements are hidden */
  .preview,
  .schedule-centered,
  .container-fluid img:not(.sub--task),
  .feature-section img:not(.sub--task),
  .drag img:not(.sub--task),
  .semester img:not(.sub--task) {
    display: none !important;
  }

  /* Keep task icons visible */
  .tasks img.sub--task {
    display: inline-block !important;
  }
}

/* Additional image hiding for mobile - removed as consolidated above */
</style>
