<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>


      <div class="landing">
        <!--TOP BAR-->
        <div class="container p-0">
            <div class="row top-bar justify-content-between no-gutters">
                <div class="col-10">
                    <img class="logo" src="@/assets/images/logo.svg" alt = "logo" />
                  </div>
            </div>
        </div>

        <!--PLAN AHEAD-->
        <div class="container p-0 m-0">
            <div class="row top-bar phonepad no-gutters">
                <div class="col">
                    <div class="row no-gutters top-section"><h1 class="plan-head mt-5">Plan Your Courses Ahead</h1></div>
                    <div class="row no-gutters top-section"><p class="plan-subhead">Introducing the new and easiest way to plan courses at Cornell</p></div>
                    <div class="row justify-content-center">
                        <div class="col top-section" >
                            <button  @click="socialLogin"  class="email-button email-button--top" variant= "primary"> ACCESS BETA </button>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 top-section image-wrapper image-wrapper--laptop">
                    <img style="position:relative" class="laptop" src="@/assets/images/laptop.png" alt = "laptop preview" />
                </div>
            </div>
        </div>

        <!--NEW WAY-->
        <div class="new container p-0">
            <h1 class= "new-1 phonepad head">New Way to Track Your Requirements </h1>
            <div class="row new no-gutters">
                <div class="col-12 col-md-6 tasks-wrapper">
                    <div class="row tasks">
                        <div class="col-1 tasks"><img src="@/assets/images/Task1.svg" alt = "checklist"/></div>
                        <div class="col-11"><p class= "sub sub--task">Fully personalized to track your requirements</p></div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task2.svg" alt = "browser" /></div>
                        <div class="col-11"><p class= "sub sub--task">Customizable interface to view your courses</p>  </div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task3.svg" alt = "Network" /></div>
                        <div class="col-11"><p class= "sub sub--task">Built-in system to check your progress</p></div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task4.svg" alt = "Starred comment" /></div>
                        <div class="col-11"><p class= "sub sub--task">Recommends courses based on your needs</p> </div>
                    </div>
                </div>
                <div class="col-6 col-md-6 image-wrapper women-wrapper">
                    <img id= "hide" class="women" src="@/assets/images/Person_planning.svg" alt = "women planning" />
                </div>
            </div>
        </div>

        <!-- DRAG -->
        <div class="container-fluid plan p-0">
            <div class="drag phonepad row no-gutters">
                <div class = "col-md-6 image-wrapper image-wrapper--drag" >
                    <img id= "hide" style="position:relative" class="preview" src="@/assets/images/drag.svg" alt = "Dragging preview" />
                </div>
                <div class = "col-12 col-md-6 comment" >
                    <h1  class="head">Drag Your Course In</h1>
                    <p class= "sub"> Courseplan’s intuitive interface recommends courses based on unfulfilled
                        requirements and allows you to easily drag and drop them into your planner </p>
                </div>
            </div>
        </div>


        <!-- SEMESTERS -->
        <div class="container-fluid p-0 small">
            <div class="row semester phonepad m-0">
                <div class = "col-12 col-md-5 comment" >
                    <h1 class= "head">Plan Your Semesters</h1>
                    <p class= "sub">Use Courseplan’s semesterly planner to choose courses well in advance and ensure that you never miss a requirement</p>
                </div>
                <div class = "col-md-7 image-wrapper image-wrapper--semester" >
                    <img id= "hide" class="schedule" src="@/assets/images/schedule.svg" alt = "Plan preview" />
                </div>
            </div>
        </div>

        <!-- FIRST -->
        <div class="container justify-content-center phonepad first m-0">
          <div class = "container inside">
              <div class="row justify-content-center">
                <div class= "col justify-content-center">
                  <h1 class= "head-center text-center">Be The First One To Use It</h1>
                  <p class= "sub text-center" style= "padding: 30px; ">Gain early access by filling out your email below and help us grow into what you need!</p>
                </div>
              </div>
              <div class="row justify-content-center">
                  <div class="col-12 col-md-12 email m-0 pb-0">
                      <input class="waitlist-info" type="text" placeholder="Your Email Address" v-model="waitlist.email" >
                  </div>
                  <div class="col-12 col-md-12 email m-0">
                      <input class="waitlist-info" type="text" placeholder="Your Major" v-model="waitlist.major" >
                  </div>
                  <div class="col-12 col-md-12 email">
                      <button class="email-button" variant= "primary"  v-on:click="addUser()"> Join Waitlist </button>
                  </div>
              </div>
            </div>
          </div>


        <!--FOOTER-->
        <div class="container-fluid footer p-0">
            <div class= "row footer justify-content-center m-0">
                <div class="col-3 footer">
                    <a href ="https://www.cornelldti.org" class= "footer"> Cornell DTI @ {{getYear()}}</a>
                </div>
                <div class="col-3">
                    <p class= "footer">Built with ❤️</p>
                </div>
                <div class="col-3 footer">
                    <a  class="footer" href="https://app.termly.io/document/privacy-policy/fcecc0e8-8af2-472d-8d27-b6b89d02a2be">Privacy Policy</a>
                </div>

            </div>
        </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';

const fb = require('../firebaseConfig.js');

const { whitelistCollection, landingEmailsCollection } = fb;

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      waitlist: {
        email: '',
        major: ''
      },
      performingRequest: false
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
          this.checkEmailAccess(user);
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    checkEmailAccess(user) {
      const docRef = whitelistCollection.doc(user.user.email);
      docRef.get().then(doc => {
        if (doc.exists) {
          this.performingRequest = false;
          this.$store.commit('setCurrentUser', user.user);
          this.$store.dispatch('fetchUserProfile');
          this.$router.push(`${process.env.BASE_URL}/`);
        } else {
          this.handleUserWithoutAccess();
        }
      }).catch(error => {
        console.log(error);
        this.handleUserWithoutAccess();
      });
    },

    handleUserWithoutAccess() {
      this.performingRequest = false;
      fb.auth.signOut();
      alert('Sorry, but you do not have access currently.\nPlease sign up below for email updates on when the platform is available and for a chance to test the platform early.');
    },

    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email));
    },
    validateMajor(major) {
      return major.trim().length > 0;
    },
    addUser() {
      if (this.validateEmail(this.waitlist.email) && this.validateMajor(this.waitlist.major)) {
        alert('You have been added to the waitlist. We\'ll be in touch shortly!');
        landingEmailsCollection.add(this.waitlist);

        // Clear fields
        this.waitlist.email = '';
        this.waitlist.major = '';
      } else if (!this.validateEmail(this.waitlist.email)) {
        alert('You have entered an invalid email address!');
      } else {
        alert('You have not entered a major!');
      }
    },
    getYear() {
      const today = new Date();
      return today.getFullYear();
    }

  }
};
</script>

<style scoped lang="scss">
    .section{
      padding:0px;
      margin: 0px;
      max-width: 100%;
    }
    .container {
      max-width: 100%;
    }
    .top-bar{
      padding:59px 0px 0px 104px;

      @media (max-width: 1154px) {
        padding: 59px 104px 0px 104px;
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
    .signin-button{
      color: #1AA9A5;
      font-weight: 550;
      border-color: #1AA9A5;
      padding: 10px 30px;
      border-radius: 6px;
    }
    .plan{
      padding:59px 0px 59px 104px;
    }
    .plan-head{
      padding-bottom: 30px;
      font-size: 60px;
      line-height: 60px;
      color: #4F4F4F;
    }
    .plan-subhead{
      padding-bottom: 30px;
      font-style: normal;
      font-weight: 300;
      font-size: 25px;
      line-height: 35px;
      color: #000000;
    }
    input{
        width: 100%;
        height: 100%;
        border-radius: 6px;
        border-color:#1AA9A5;
        padding : 15px 30px;
    }
    .email{
      padding: 20px;
      @media (max-width: 767px) {
        width: 350px;
        max-width: 350px;
        flex: unset;
      }
    }
    .email-button{
      border: 0;
      background-color: #1AA9A5;
      border-radius : 6px;
      border-color: #1AA9A5;
      width: 100%;
      padding : 15px 30px;
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
    .email-top{
      padding: 20px 20px 20px 20px;
    }
    .image-wrapper {
      overflow: hidden;
      @media (max-width: 1154px) {
        display: none;
      }
      &--drag {
        overflow: unset;
      }
      &--laptop {
        display: block;
      }
      &--semester {
        display: flex;
        justify-content: flex-end;
      }
    }
    .laptop{
      position: relative;
      width: 900px;
      @media (max-width: 1154px) {
        max-width: inherit;
      }
    }
    .women{
      position: relative;
    }
    .women-wrapper {
      margin-top: -120px
    }

    .new{
      background-color: #1AA9A5;
      padding:50px 0px 96px 104px;
      @media (min-width: 1155px) {
        margin-bottom: -120px;
      }
    }
    .new-1{
      text-align: left;
        padding: 120px 0px 59px 104px;
    }
    .tasks{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
    .tasks-wrapper {
      @media (max-width: 1154px) {
        max-width: 100%;
        flex: unset;
      }
    }
    .sub{
        font-weight: normal;
        font-size: 24px;
        color: #FFFFFF;
        margin: 0;

        &--task {
          margin-left: 2rem;
        }
    }
    .head{
        font-weight: 600;
        font-size: 40px;
        color: #FFFFFF;
        padding-bottom: 0px;
    }
    .head-center{
      font-weight: 600;
      font-size: 40px;
      color: #FFFFFF;
      padding-bottom: 0px;
    }

    .women {
      @media (max-width: 1274px) {
        width: 62vw;
      }
    }
    .drag{
      background-color:  #105351;
      padding:59px 104px 0px 104px;
      @media (max-width: 1154px) {
        display: flex;
        justify-content: center;
      }
    }
    .preview{
      position: relative;

      @media (max-width: 1274px) {
        width: 62vw;
      }
    }
    .schedule{
      margin-top: 16px;
      width: 650px;

      @media (max-width: 1274px) {
        width: 50vw;
      }
    }
    .comment{
      text-align: left;
      padding: 170px 30px 250px 30px;
      @media (max-width: 1154px) {
        max-width: 100%;
        flex: unset;
      }
    }
    .semester{
      background-color:  #92C3E6;
      padding:0px 0px 0px 104px;
      @media (max-width: 1154px) {
        display: flex;
        justify-content: center;
      }
    }
    .first{
      background-color:  #508197;
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
    button{
      outline: none;
    }
    p {
      padding: 0;
    }
    p.footer{
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 28px;
      color: #757575;
    }
    a.footer {
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 28px;
      color: #757575;
    }
    .col-3 {
      margin-left: .5rem;
      margin-right: .5rem;
    }
    .col-3.footer{
      text-align: center;
    }
    .row.footer{
      padding : 40px;
    }
    .container.inside{
      max-width: 600px;
    }
    @media (max-width: 1335px) {

    }
    @media (max-width:1154px) {
      img#hide{
        display: none;
      }
      .top-bar{
        padding:50px;
      }
      .new{
        padding:0px 50px 100px 50px;
      }
      .phonepad{
        padding:50px;
        text-align: center;
      }
      .comment{
        text-align:center;
        padding: 100px 30px 100px 30px;
      }
      .input{
        width:200px;
      }
      .center{
        display:flex;
        justify-content: center;
        align-items: center;
        margin: 0;
      }

    }
    *, html {padding:0; margin:0;}


</style>
