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
                <div>Introducing the newest and easiest</div>
                <div>way to plan courses at Cornell</div>
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
        <div class="drag phonepad row no-gutters">
          <img
            class="hide preview"
            src="@/assets/images/landing_new/img1.svg"
            alt="Dragging preview"
            aria-label="dragging preview"
            style="position: absolute"
          />
          <div class="comment comment-drag">
            <h1 class="head">Drag and Drop Courses</h1>
            <p class="sub-text">
              CoursePlan’s intuitive interface recommends courses based on unfulfilled requirements
              and allows you to easily drag and drop them into your planner
            </p>
          </div>
        </div>
      </div>

      <!-- SEMESTERS -->
      <div class="container-fluid p-0 center">
        <div class="semester phonepad row no-gutters">
          <div class="comment comment-sem">
            <h1 class="head">Plan Your Semesters</h1>
            <p class="sub-text">
              Use CoursePlan’s semesterly planner to choose courses well in advance and ensure that
              you never miss a requirement
            </p>
          </div>
          <img
            class="hide schedule"
            src="@/assets/images/landing_new/img2.svg"
            alt="Plan preview"
            aria-label="plan preview"
          />
        </div>
      </div>
      <br style="clear: both" />

      <!--FOOTER-->
      <custom-footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import firebase from 'firebase/app';

import CustomFooter from '@/components/Footer.vue';

import { GTagLoginEvent } from '@/gtag';
import * as fb from '@/firebase-frontend-config';
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
      const provider = new firebase.auth.GoogleAuthProvider();
      fb.auth
        .signInWithPopup(provider)
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
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.top-sec {
  background-image: url('@/assets/images/landing_new/top_rect.svg');
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
  font-size: 72px;
  line-height: 72px;
  color: $white;
}
.plan-subhead {
  padding-bottom: 2rem;
  font-style: normal;
  font-weight: 10;
  font-size: 32px;
  line-height: 34px;
  color: $white;
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
  background-color: #539d9b;
  border-radius: 6px;
  border-color: $emGreen;
  font-size: 20px;
  width: 100%;
  padding: 1rem 2rem;
  color: $white;
  &:hover,
  &:focus,
  &:active {
    border-color: #13807c;
    background-color: #13807c;
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
  margin-top: 350px;
}

.new {
  padding: 3.25rem 6.5rem 6rem 6.5rem;
  color: $black;
  display: flex;
  @media (max-width: $large-breakpoint) {
    flex-direction: column;
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
  font-size: 32px;
  text-align: left;
  color: $black;
  margin-top: 32px;
  max-width: 425px;
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
  font-weight: 600;
  line-height: 42px;
  font-size: 40px;
  color: $black;
  padding-bottom: 0px;
}
.head-center {
  font-weight: 600;
  font-size: 40px;
  color: $black;
  padding-bottom: 0px;
}

.hidden {
  opacity: 0;
}

.drag {
  padding: 6.25rem 6.25rem 0 6.25rem;
  @media (max-width: $large-breakpoint) {
    padding-left: 4rem;
  }
}
.preview {
  position: relative;
  left: -50px;
  margin-right: -32px;
  width: 700px;
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
    margin-left: 600px;
    @media (max-width: $large-breakpoint) {
      margin-left: 0;
    }
  }
  &-sem {
    padding: 8.75rem 3.25rem 15.75rem 3.25rem;
    margin: 0;
    margin-top: 200px;
    flex-shrink: 2;
    @media (max-width: $large-breakpoint) {
      margin-right: 0;
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
</style>
