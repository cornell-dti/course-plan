<template>
  <div>
    <div class="body-container">
      <topbar />
      <div class="message-container">
        <img class="img-404" src="@/assets/images/404.svg" alt="404" />
        <div class="oops-wrapper">
          <div id="oops" class="color_box">
            Oops...
            <br />Page Not Found
            <img
              class="thinking-face"
              src="@/assets/images/thinking_face.svg"
              alt="thinking face"
            />
          </div>
        </div>
      </div>
      <div class="back_to_home">
        <a class="back_to_home_link" href="/login">Back to home</a>
      </div>
      <custom-footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Footer from '@/components/Footer.vue';
import TopBar from '@/components/TopBar.vue';

Vue.component('custom-footer', Footer);
Vue.component('topbar', TopBar);

export default Vue.extend({});
</script>

<style scoped lang="scss">
.logo {
  width: 12rem;
}
#oops {
  text-align: left;
  display: inline-block;
  font-weight: bold;
  font-size: 72px;
  color: #0a2327;
  vertical-align: top;
  @media (max-width: 1154px) {
    margin-top: 8%;
    font-size: 7vw;
  }
  @media (max-width: 800px) {
    margin-top: 8%;
    font-size: 9vw;
  }
}
.back_to_home {
  font-size: 32px;
  vertical-align: middle;
  text-align: center;
  color: #7b7d7e;
  margin-bottom: 10rem;
  margin-top: 6rem;
  height: 100px;
  @media (max-width: 1154px) {
    margin-bottom: 3rem;
  }
  @media (max-width: 800px) {
    margin-top: 8%;
    font-size: 8vw;
    margin-bottom: 0;
  }
}

.page_404 {
  bottom: 0;
  @media (max-height: 600px) {
    position: relative;
    bottom: 0;
  }
}
a.back_to_home_link {
  color: #7b7d7e;
}
.img-404 {
  vertical-align: top;
  display: inline-block;
  @media (max-width: 1154px) {
    width: 60%;
  }
  @media (max-width: 800px) {
    width: 80%;
  }
}
.oops-wrapper {
  min-width: 20vw;
  display: inline-block;
  margin-left: 5%;
}
.message-container {
  display: flex;
  margin-bottom: 3%;
  margin-top: 10%;
  justify-content: center;
  @media (max-width: 1154px) {
    margin-top: 8vh;
    flex-direction: column;
    align-items: center;
  }
}
.thinking-face {
  margin-bottom: 1vw;
  @media (max-width: 1154px) {
    width: 10vw;
  }
}
.body-container {
  min-height: 100vh;
}
</style>
