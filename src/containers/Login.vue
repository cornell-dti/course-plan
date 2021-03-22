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
                Schedule Smarter <br />
                Plan Ahead
              </h1>
            </div>
            <div class="row no-gutters top-section">
              <p class="plan-subhead">
                Introducing the newest and easiest way to plan courses at Cornell
              </p>
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
              <img src="@/assets/images/landing_new/icon1.svg" class="sub--task" alt="checklist" />
              <figcaption class="sub">Fully personalized to track your requirements</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img src="@/assets/images/landing_new/icon2.svg" class="sub--task" alt="browser" />
              <figcaption class="sub">Customizable interface to view your courses</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img src="@/assets/images/landing_new/icon3.svg" class="sub--task" alt="Network" />
              <figcaption class="sub">Built-in system to check your progress</figcaption>
            </figure>
          </div>
          <div class="col tasks">
            <figure class="figure">
              <img
                src="@/assets/images/landing_new/icon4.svg"
                class="sub--task"
                alt="Starred comment"
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
        <div class="semester phonepad row no-gutters float-right">
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
import Vue from 'vue';
import firebase from 'firebase/app';

import CustomFooter from '@/components/Footer.vue';

import { GTagLoginEvent } from '@/gtag';
import * as fb from '@/firebaseConfig';

const { whitelistCollection, landingEmailsCollection } = fb;

type Data = {
  loginForm: { email: string; password: string };
  waitlist: { email: string; major: string; time: string };
  performingRequest: boolean;
  errorMsg?: string;
};

export default Vue.extend({
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
          // Check whitelist emails to ensure user can log in
          if (user == null) {
            return;
          }
          this.checkEmailAccess(user);
        })
        .catch(err => {
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    checkEmailAccess({ user }: { user: firebase.User | null }) {
      if (user == null) {
        return;
      }
      const docRef = whitelistCollection.doc(user.email || '');
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            this.performingRequest = false;
            this.$router.push('/');
            GTagLoginEvent(this.$gtag, 'Google');
          } else {
            this.handleUserWithoutAccess();
          }
        })
        .catch(() => this.handleUserWithoutAccess());
    },

    handleUserWithoutAccess() {
      this.performingRequest = false;
      fb.auth.signOut();
      // eslint-disable-next-line no-alert
      alert(
        'Sorry, but you do not have access currently.\nPlease sign up below for email updates on when the platform is available and for a chance to test the platform early.'
      );
    },

    validateEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validateMajor(major: string): boolean {
      return major.trim().length > 0;
    },
    addUser() {
      if (this.validateEmail(this.waitlist.email) && this.validateMajor(this.waitlist.major)) {
        // eslint-disable-next-line no-alert
        alert("You have been added to the waitlist. We'll be in touch shortly!");

        // Add timestamp to data in YYYY-MM-DD hh:mm:ss
        const dt = new Date();
        this.waitlist.time = `${(dt.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${dt
          .getDate()
          .toString()
          .padStart(2, '0')}/${dt
          .getFullYear()
          .toString()
          .padStart(4, '0')} ${dt
          .getHours()
          .toString()
          .padStart(2, '0')}:${dt
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;

        // Add landing page data to Firebase
        landingEmailsCollection.add(this.waitlist);

        // Clear fields
        this.waitlist.email = '';
        this.waitlist.major = '';
      } else if (!this.validateEmail(this.waitlist.email)) {
        // eslint-disable-next-line no-alert
        alert('You have entered an invalid email address!');
      } else {
        // eslint-disable-next-line no-alert
        alert('You have not entered a major!');
      }
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
  background-image: url('../assets/images/landing_new/top_rect.svg');
  background-repeat: no-repeat;
  background-size: 100vw 900px;
  overflow: hidden;
  padding-top: 100px;

  @media (max-width: 1154px) {
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
  padding: 29px 0px 0px 104px;

  @media (max-width: 1154px) {
    padding: 29px 104px 0px 104px;
    display: flex;
    flex-direction: column;
  }
}
.top-section {
  @media (max-width: 1154px) {
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
  padding: 10px 30px;
  border-radius: 6px;
}
.plan-head {
  padding-bottom: 30px;
  font-size: 60px;
  line-height: 60px;
  color: white;
}
.plan-subhead {
  padding-bottom: 30px;
  font-style: normal;
  font-weight: 100;
  font-size: 25px;
  line-height: 35px;
  color: white;
}
input {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border-color: $emGreen;
  padding: 15px 30px;
}
.email {
  padding: 20px;
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
  width: 100%;
  padding: 15px 30px;
  color: white;
  &:hover,
  &:focus,
  &:active {
    border-color: #13807c;
    background-color: #13807c;
  }

  &--top {
    width: 13.5rem;
    @media (max-width: 1154px) {
      margin-bottom: 1rem;
    }
  }
}
.email-top {
  padding: 20px 20px 20px 20px;
}
.image-wrapper {
  @media (max-width: 1154px) {
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
  @media (max-width: 1154px) {
    max-width: inherit;
  }
}

.new-way {
  margin-top: 350px;
}

.new {
  padding: 50px 104px 96px 104px;
  color: black;
  @media (min-width: 1155px) {
    margin-bottom: -120px;
  }
}
.new-1 {
  text-align: left;
  padding: 120px 0px 59px 104px;
}
.tasks {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: black;
}
.tasks-wrapper {
  @media (max-width: 1154px) {
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
  color: black;
  margin-top: 32px;
  max-width: 425px;
  @media (max-width: 1154px) {
    text-align: left;
  }
}

.sub {
  font-weight: normal;
  font-size: 24px;
  text-align: center;
  color: black;
  margin: 0;

  &--task {
    vertical-align: middle;
    padding-bottom: 38px;
  }
}
.head {
  font-weight: 600;
  line-height: 38px;
  font-size: 40px;
  color: black;
  padding-bottom: 0px;
}
.head-center {
  font-weight: 600;
  font-size: 40px;
  color: black;
  padding-bottom: 0px;
}

.hidden {
  opacity: 0;
}

.women {
  @media (max-width: 1274px) {
    width: 62vw;
  }
}
.drag {
  padding: 104px 104px 0px 104px;
  @media (max-width: 1154px) {
    padding-left: 64px;
  }
}
.preview {
  position: relative;
  left: -50px;
  margin-right: -32px;
  width: 900px;
  @media (max-width: 1274px) {
    margin-left: 0px;
    width: 62vw;
  }
}
.schedule {
  position: relative;
  width: 1050px;
  margin-left: -100px;
  margin-right: -280px;

  @media (max-width: 1274px) {
    margin-right: 0;
    width: 50vw;
  }
}
.comment {
  padding: 170px 50px 250px 50px;
  text-align: left;
  @media (max-width: 1154px) {
    text-align: center;
    max-width: 100%;
    flex: unset;
  }
  &-drag {
    margin-left: 750px;
    @media (max-width: 1154px) {
      margin-left: 0;
    }
  }
  &-sem {
    margin: 0;
    margin-top: 200px;
    margin-right: -50px;
    @media (max-width: 1154px) {
      margin-right: 0;
    }
  }
}
.semester {
  padding: 0px 0px 0px 104px;
  overflow: hidden;
  @media (max-width: 1154px) {
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
  padding: 180px 100px 104px 100px;

  @media (max-width: 720px) {
    padding: 40px 30px 40px 30px;
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
@media (max-width: 1154px) {
  img.hide {
    display: none;
  }
  .top-bar {
    padding: 50px;
  }
  .new {
    padding: 0px 50px 100px 50px;
  }
  .phonepad {
    padding: 50px;
    text-align: center;
  }
  .comment {
    text-align: center;
    padding: 100px 30px 100px 30px;
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
