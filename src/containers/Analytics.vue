<template>
  <div>
    <div class="body-container">
      <top-bar />
      <div class="message-container">Hi</div>
      <div class="back_to_home">
        <a class="back_to_home_link" href="/login">Back to home</a>
      </div>
      <custom-footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CustomFooter from '@/components/Footer.vue';
import TopBar from '@/components/TopBar.vue';
import { functions } from '../firebase-frontend-config';

const trackUsers = functions.httpsCallable('TrackUsers');

trackUsers()
  .then(result => {
    // Read result of the Cloud Function.
    /** @type {any} */
    // const { data } = result;
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });

export default defineComponent({
  components: { CustomFooter, TopBar },
});
</script>

<style scoped lang="scss">
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

a.back_to_home_link {
  color: #7b7d7e;
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
.body-container {
  min-height: 100vh;
}
</style>
