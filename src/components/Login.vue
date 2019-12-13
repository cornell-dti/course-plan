<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col1">
        <h1>CoursePlan</h1>
        <p>
          Welcome to CoursePlan, your destination for creating plans surrounding your curriculum and
          requirements
        </p>
      </div>
      <div class="col2">
        <form @submit.prevent>
          <h1>Welcome Back</h1>

          <div class="login-container">
            <button @click="socialLogin" class="social-button">
              <img alt="Google Logo" src="../assets/google-logo.png" />
            </button>

            <div class="login-description">Continue With Google Sign-In</div>
          </div>

          <!-- <label for="email1">Email</label>
          <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />

          <label for="password1">Password</label>
          <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />

          <button @click="login" class="button">Log In</button> -->

          <!-- <div class="extras">
          <a>Forgot Password</a>
          <a>Create an Account</a>
        </div> -->
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import firebase from 'firebase';
const fb = require('../firebaseConfig.js');

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
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
          this.$store.commit('setCurrentUser', user);
          this.$store.dispatch('fetchUserProfile');
          this.performingRequest = false;
          this.$router.push('/dashboard');
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
          this.$store.commit('setCurrentUser', user.user);
          this.$store.dispatch('fetchUserProfile');
          this.performingRequest = false;
          console.log(firebase.auth().currentUser);
          console.log(user.additionalUserInfo.profile);
          this.$router.push('/dashboard');
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
