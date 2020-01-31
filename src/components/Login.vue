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
                <div class="col col-md-4 ">
                    <div class="row no-gutters"><h1 class="plan-head mt-5">Plan Your Courses Ahead</h1></div>
                    <div class="row no-gutters"><p class="plan-subhead">Introducing the new and easiest way to plan courses at Cornell</p></div>
                    <div class="row justify-content-center">
                        <div class="col" >
                            <button  @click="socialLogin"  class="email-button" variant= "primary"> ACCESS ALPHA </button>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <img id= "hide"  style="position:relative" class="laptop" src="@/assets/images/laptop.png" alt = "laptop preview" />
                </div>
            </div>
        </div>

        <!--NEW WAY-->
        <div class="new container p-0">
            <h1 class= "new-1 phonepad head">New Way to Track Your Requirements </h1>
            <div class="row new no-gutters">
                <div class="col-12 col-md-6">
                    <div class="row tasks">
                        <div class="col-1 tasks"><img src="@/assets/images/Task1.svg" alt = "checklist"/></div>
                        <div class="col-11"><p class= "sub">Fully personalized to track your requirements</p></div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task2.svg" alt = "browser" /></div>
                        <div class="col-11"><p class= "sub">Customizable interface to view your courses</p>  </div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task3.svg" alt = "Network" /></div>
                        <div class="col-11"><p class= "sub">Built-in system to check your progress</p></div>
                    </div>
                    <div class="row tasks">
                        <div class="col-1 tasks"><img  src="@/assets/images/Task4.svg" alt = "Starred comment" /></div>
                        <div class="col-11"><p class= "sub">Recommends courses based on your needs</p> </div>
                    </div>
                </div>
                <div class="col-6 col-md-6">
                    <img id= "hide" style="position:absolute" class="women" src="@/assets/images/Person_planning.svg" alt = "women planning" />
                </div>
            </div>
        </div>

        <!-- DRAG -->
        <div class="container-fluid plan p-0">
            <div class="drag phonepad row no-gutters">
                <div class = "col-md-6" >
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
                <div class = "col-12 col-md-6 comment" >
                    <h1 class= "head">Plan Your Semesters</h1>
                    <p class= "sub">Use Courseplan’s semesterly planner to choose courses well in advance and ensure that you never miss a requirement</p>
                </div>
                <div class = "col-md-6" >
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
                  <div class="col-8 col-md-7 email m-0">
                      <input type="text" placeholder="Your Email Address" v-model="newUser.email" >
                  </div>
                  <div class="col-8 col-md-5 email ">
                      <button class="email-button" variant= "primary"  v-on:click="addUser(newUser.email)"> Add email </button>
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
                    <a  class="footer" href=" https://app.termly.io/document/privacy-policy/fcecc0e8-8af2-472d-8d27-b6b89d02a2be">Privacy Policy</a>
                </div>

            </div>
        </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

const fb = require('../firebaseConfig.js');

const { alphaWhitelistCollection, landingEmailsCollection } = fb;

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      newUser: {
        email: ''
      },
      performingRequest: false
    };
  },
  methods: {
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
        .then(user => {
          alphaWhitelistCollection.get().then(querySnapshot => {
            let isAlphaEmail = false;
            querySnapshot.forEach(doc => {
              if (doc.data().email === this.loginForm.email) {
                isAlphaEmail = true;
              }
            });
            this.performingRequest = false;
            if (!isAlphaEmail) {
              fb.auth.signOut();
              return;
            }

            this.$store.commit('setCurrentUser', user);
            this.$store.dispatch('fetchUserProfile');
            this.$router.push(`${process.env.BASE_URL}/`);
          });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    socialLogin() {
      this.performingRequest = true;
      const provider = new firebase.auth.GoogleAuthProvider();
      fb.auth
        .signInWithPopup(provider)
        .then(user => {
          // Check whitelist emails to ensure user can log in
          alphaWhitelistCollection.get().then(querySnapshot => {
            let isAlphaEmail = false;
            querySnapshot.forEach(doc => {
              if (doc.data().email === user.user.email) {
                isAlphaEmail = true;
              }
            });
            this.performingRequest = false;
            if (!isAlphaEmail) {
              fb.auth.signOut();
              return;
            }

            this.$store.commit('setCurrentUser', user.user);
            this.$store.dispatch('fetchUserProfile');
            this.$router.push(`${process.env.BASE_URL}/`);
          });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email));
    },
    addUser() {
      if (this.validateEmail(this.newUser.email)) {
        alert('Your email has been added to the waitlist. We\'ll be in touch shortly!');
        landingEmailsCollection.add(this.newUser);
      } else {
        alert('You have entered an invalid email address!');
      }
      this.newUser.email = '';
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

      @media (max-width: 1274px) {
        padding: 59px 104px 0px 104px;
        display: flex;
        flex-direction: column;
      }
    }
    .top-section {
      @media (max-width: 1274px) {
        display: flex;
        justify-content: center;
        text-align: left;
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
      }
    }
    .email-top{
      padding: 20px 20px 20px 20px;
    }
    .laptop{
      position: absolute;
      width: 900px;
    }
    .women{
      position: absolute;
      bottom: -120px;
    }

    .new{
      background-color: #1AA9A5;
      padding:50px 0px 96px 104px;
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
    .sub{
        font-weight: normal;
        font-size: 24px;
        color: #FFFFFF;
        margin : 0;
        padding: 0px 0px 0px 20px;
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
    .drag{
      background-color:  #105351;
      padding:59px 104px 0px 104px;
    }
    .preview{
      position: relative;
    }
    .schedule{
      margin-top: 16px;
      width: 700px;
    }
    .comment{
      text-align: left;
        padding: 170px 30px 250px 30px;
    }
    .semester{
      background-color:  #92C3E6;
      padding:0px 0px 0px 104px;
    }
    .first{
      background-color:  #508197;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding:180px 100px 100px 104px;
    }
    button{
      outline: none;
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
    @media (max-width:629px) {
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
