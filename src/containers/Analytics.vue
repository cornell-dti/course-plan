<template>
  <div>
    <div class="body-container" :class="{ 'no-data': !hasData() }">
      <top-bar />
      <div class="timestamp" v-if="hasData()">Data last retrieved at: {{ analyticsTimestamp }}</div>
      <pre class="analytics" v-if="hasData()">{{ analyticsData }}</pre>
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
import { retrieveAnalytics } from '@/global-firestore-data';

export default defineComponent({
  components: { CustomFooter, TopBar },
  mounted() {
    this.retrieveData();
  },
  data() {
    return {
      analyticsData: '',
      analyticsTimestamp: '',
    };
  },
  methods: {
    async retrieveData() {
      const analyticsObject = await retrieveAnalytics();
      this.analyticsData = analyticsObject.data;
      this.analyticsTimestamp = analyticsObject.timestamp;
    },
    hasData() {
      return this.analyticsData.length > 2;
    },
  },
});
</script>

<style scoped lang="scss">
.no-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
a.back_to_home_link {
  color: #7b7d7e;
}
.body-container {
  min-height: 100vh;
}

.timestamp {
  font-size: 16px;
  padding: 3.75rem 0 0 6.5rem;
  margin-bottom: 1rem;

  @media (max-width: 1154px) {
    padding: 0 0 0 3.125rem;
  }
}

.analytics {
  font-size: 14px;
  padding: 0 0 0 6.5rem;

  @media (max-width: 1154px) {
    padding: 0 0 0 3.125rem;
  }
}
</style>
