<template>
  <div>
    <div class="body-container">
      <top-bar />
      <pre class="analytics">{{ analyticsData }}</pre>
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
import { trackUsersCollection } from '@/firebase-frontend-config';

export default defineComponent({
  components: { CustomFooter, TopBar },
  mounted() {
    this.displayData();
  },
  data() {
    return {
      analyticsData: {},
    };
  },
  methods: {
    displayData() {
      trackUsersCollection.get().then(querySnapshot => {
        let newestDocData = {};
        let newestDocDate = new Date(0);

        querySnapshot.forEach(doc => {
          const isoTimestamp = doc.id;
          const date = new Date(isoTimestamp);
          if (date.getTime() > newestDocDate.getTime()) {
            newestDocDate = date;
            newestDocData = doc.data();
          }
        });

        const output = JSON.stringify(newestDocData, null, 2);
        return output;
      });
    },
  },
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
.body-container {
  min-height: 100vh;
}

.analytics {
  font-size: 14px;
  padding: 3.75rem 0 0 6.5rem;

  @media (max-width: 1154px) {
    padding: 0 0 0 3.125rem;
  }
}
</style>
