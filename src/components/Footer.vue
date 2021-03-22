<template>
  <div class="container-fluid footer p-0 page_404">
    <div class="row footer justify-content-center m-0">
      <div class="col-3 footer">
        <a href="https://www.cornelldti.org/projects/courseplan/" class="footer underline">
          Cornell DTI @ {{ getYear() }}</a
        >
      </div>
      <div class="col-3">
        <p class="footer">Built with ❤️</p>
      </div>
      <div class="col-3 footer">
        <a
          class="footer underline"
          href="https://app.termly.io/document/privacy-policy/fcecc0e8-8af2-472d-8d27-b6b89d02a2be"
          >Privacy Policy</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    getYear() {
      const today = new Date();
      return today.getFullYear();
    },
  },
});
</script>

<style scoped lang="scss">
p.footer {
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
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.col-3.footer {
  text-align: center;
  padding-right: 0px;
  padding-left: 0px;
}
.row.footer {
  padding: 40px;
}
.underline {
  text-decoration: underline;
}
</style>
