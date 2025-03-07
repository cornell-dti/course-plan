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
        <div class="drag drag--first phonepad row no-gutters">
          <img
            class="hide preview"
            src="@/assets/images/landing_new/img1.svg"
            alt="Dragging preview"
            aria-label="dragging preview"
            style="position: absolute"
          />
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
        <div class="semester phonepad row no-gutters">
          <div class="comment comment-sem">
            <h1 class="head">Plan Your Semesters</h1>
            <p class="sub-text semester-text">
              Stay ahead with CoursePlan's
              <strong>semesterly planner</strong>—select your courses early and ensure you never
              miss a requirement.
            </p>
          </div>
          <img
            class="hide schedule-centered"
            src="@/assets/images/landing_new/img2.svg"
            alt="Plan preview"
            aria-label="plan preview"
            style="position: absolute"
          />
        </div>
      </div>

      <!-- TRACKING -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad row no-gutters">
          <img
            class="hide preview"
            src="@/assets/images/landing_new/img3.svg"
            alt="Dragging preview"
            aria-label="dragging preview"
            style="position: absolute"
          />
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
        <div class="semester phonepad row no-gutters">
          <div class="comment comment-sem notes-text-left">
            <h1 class="head">Schedule Generator</h1>
            <p class="sub-text generate-text">
              Effortlessly create your ideal schedule. Select your preferred classes and let
              CoursePlan generate <strong>optimized schedule suggestions</strong> on the Build page.
            </p>
          </div>
          <img
            class="hide schedule-centered"
            src="@/assets/images/landing_new/img4.svg"
            alt="Notes preview"
            aria-label="Notes preview"
            style="position: absolute"
          />
        </div>
      </div>

      <!-- MULTIPLE -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad row no-gutters">
          <img
            class="hide preview"
            src="@/assets/images/landing_new/img5.svg"
            alt="Multiple-plan preview"
            aria-label="multiple-plan preview"
            style="position: absolute"
          />
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
        <div class="semester phonepad row no-gutters">
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
          <img
            class="hide schedule-centered"
            src="@/assets/images/landing_new/img6.svg"
            alt="Plan preview"
            aria-label="plan preview"
            style="position: absolute"
          />
        </div>
      </div>

      <!-- NOTES -->
      <div class="container-fluid plan p-0 center">
        <div class="drag phonepad row no-gutters">
          <img
            class="hide preview"
            src="@/assets/images/landing_new/img7.svg"
            alt="Notes preview"
            aria-label="notes preview"
            style="position: absolute"
          />
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
  background-size: 100vw 900px;
  overflow: hidden;
  padding-top: 6.25rem;

  @media (max-width: $large-breakpoint) {
    padding-top: 0;
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

  @media (max-width: $large-breakpoint) {
    padding: 1.75rem 6.5rem 0px 6.5rem;
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
  }
}
.laptop {
  position: relative;
  width: 900px;
  @media (max-width: $large-breakpoint) {
    max-width: inherit;
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

  // Drag and Drop section
  &.drag-text {
    max-width: 550px;
    margin-top: 32px;
    margin-right: 200px;
    margin-bottom: 0;
    margin-left: 0;
  }

  // Plan Your Semesters section
  &.semester-text {
    max-width: 520px;
    margin-top: 32px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
  }

  // Academic Tools section
  &.track-text {
    max-width: 800px;
    margin-top: 32px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    line-height: 1.5;
    white-space: normal;

    strong {
      white-space: nowrap; // Keep the strong text together
      display: inline; // Ensure inline display
    }
  }

  // Schedule Generator section
  &.generate-text {
    max-width: 450px;
    margin-top: 32px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
  }

  // Multiple Plans section
  &.multiple-text {
    max-width: 520px;
    margin-top: 32px;
    margin-bottom: 0;
    margin-left: 0;

    @media (max-width: $large-breakpoint) {
      max-width: 100%;
    }
  }

  // Saved Courses section
  &.saved-text {
    max-width: 600px;
    margin-top: 32px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
  }

  // Notes Feature section
  &.notes-text {
    max-width: 500px;
    margin-top: 32px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
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
.head-center {
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 700;
  font-size: 40px;
  color: $black;
  padding-bottom: 0px;
}

.hidden {
  opacity: 0;
}

.drag {
  padding: 6.25rem 6.25rem;

  &--first {
    margin-top: 0;
  }

  @media (max-width: $large-breakpoint) {
    padding: 3rem 2rem;
  }
}
.preview {
  position: relative;
  left: 0px;
  margin-right: -32px;
  width: 950px;
  margin-top: 300px;
  margin-bottom: 300px;
}

.schedule-centered {
  position: relative;
  right: 0px;
  margin-left: 0;
  width: 1050px;
  margin-top: 300px;
  margin-bottom: 300px;
  justify-self: flex-end;
  flex-shrink: 0;

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

    @media (max-width: $large-breakpoint) {
      margin-left: 0;
      width: auto;
    }

    .sub-text {
      width: 600px;
      margin-right: 0;
    }

    &:has(.notes-text) {
      margin-top: 450px;
      margin-left: 950px;
      transform: translate(-20px, 200px);
      width: 800px;

      .head {
        margin-bottom: 30px;
      }

      .sub-text {
        width: 600px;
        margin-right: 0;
        line-height: 1.5;
      }
    }

    &:has(.track-text) {
      margin-top: 400px;
      transform: translateY(-150px);
    }

    &:has(.multiple-text) {
      margin-top: 500px;
      transform: translateY(-100px);
    }

    &:has(.track-text) {
      margin-top: 450px;
      margin-left: 950px;
      transform: translateY(-150px);
      width: 1000px;

      .head {
        margin-bottom: 30px;
      }

      .sub-text {
        width: 800px;
        margin-right: 0;
        margin-left: 0;
        line-height: 1.5;
        white-space: normal;

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

    &:has(.semester-text) {
      margin-right: 750px;
      margin-top: 650px;
      margin-left: 250px;
      transform: translate(-300px, -50px);
    }

    &:has(.generate-text) {
      margin-right: 850px;
      margin-top: 500px;
      margin-left: 100px;
      transform: translate(0px, 190px);
      width: 800px;

      .sub-text {
        width: 450px;
        margin-right: 0;
      }
    }

    &:has(.saved-text) {
      margin-right: 850px;
      margin-top: 600px;
      margin-left: 100px;
      transform: translate(-75px, 125px);
      width: 800px;

      .sub-text {
        width: 600px;
        margin-right: 0;
      }
    }

    &.notes-text-left {
      margin-right: 850px;
      margin-left: 100px;
    }

    @media (max-width: $large-breakpoint) {
      margin-right: 0;
      margin-left: 0;
      width: auto;
    }
  }
}
.semester {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-top: -4rem;
  overflow: hidden;
  @media (max-width: $large-breakpoint) {
    display: flex;
    justify-content: center;
  }
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
  img.hide {
    display: none;
  }
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
    text-align: center;
    padding: 6.25rem 2rem 6.25rem 2rem;
  }
  .input {
    width: 200px;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
}
*,
html {
  padding: 0;
  margin: 0;
}

.section-new {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 2rem;
  overflow: hidden;

  @media (max-width: $large-breakpoint) {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}

.preview-new {
  width: 800px;
  margin: 0 2rem;

  @media (max-width: $large-breakpoint) {
    width: 100%;
    margin: 1rem 0;
  }
}

.comment-new {
  padding: 4rem 3.25rem;
  margin: 0;
  flex-shrink: 0;
  max-width: 500px;

  @media (max-width: $large-breakpoint) {
    text-align: center;
    max-width: 100%;
    padding: 2rem;
  }
}

.notes-text-left {
  margin-left: 100px;
  text-align: left;

  .head,
  .sub-text {
    text-align: left;
  }

  @media (max-width: $large-breakpoint) {
    margin-left: 0;
    text-align: center;

    .head,
    .sub-text {
      text-align: center;
    }
  }
}

.slide-in {
  opacity: 0;
  visibility: hidden;
  transition: all 2s ease-out; // Even slower animation

  // Even sections slide from right
  &:nth-child(even) {
    transform: translateX(200px); // Start further right

    &.visible {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }
  }

  // Odd sections slide from left
  &:nth-child(odd) {
    transform: translateX(-200px); // Start further left

    &.visible {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }
  }
}

.new-badge {
  display: block;
  margin-top: -2rem;
  margin-bottom: 3rem;
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
  position: relative;

  @media (max-width: $large-breakpoint) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.container-fluid.center {
  margin-bottom: 10rem;
  margin-top: -10rem;

  &:last-child {
    margin-bottom: 0;
  }

  // Plan Your Semesters section
  &:has(.semester-text) {
    margin-bottom: -15rem;
    margin-top: -20rem;
  }

  // Schedule Generator section
  &:has(.generate-text) {
    margin-bottom: -20rem;
    margin-top: -25rem;
  }

  // Saved Courses section
  &:has(.saved-text) {
    margin-bottom: -15rem;
    margin-top: -20rem;
  }
}

.container-fluid.plan:has(.track-text) {
  margin-bottom: 6rem;
  margin-top: 10rem; //adjust spacing of the progress tracker
}

// Add specific styling for Multiple Plans section
.container-fluid.plan:has(.multiple-text) {
  margin-bottom: -20rem;
  margin-top: 15rem;
}

// Add specific styling for Notes Feature section
.container-fluid.plan:has(.notes-text) {
  margin-bottom: -5rem;
  margin-top: 7.5rem;
}

// Add specific styling for Drag and Drop section
.container-fluid.plan:has(.drag-text) {
  margin-bottom: 6rem;
  margin-top: -18rem;
}
</style>
