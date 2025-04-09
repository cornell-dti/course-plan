<template>
  <div class="container-fluid footer p-0 page_404">
    <div class="row footer justify-content-center m-0">
      <div class="col-3 footer">
        <a href="https://www.cornelldti.org/projects/courseplan/" class="footer" target="_blank">
          Cornell DTI @ {{ getYear() }}</a
        >
      </div>

      <div class="col-3">
        <p class="footer">
          Built with
          <img src="@/assets/images/landing_new/RedHeart.svg" width="24" height="24" />
        </p>
      </div>
      <div class="col-3 footer">
        <a class="footer" target="_blank" href="/policy">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    getYear() {
      const today = new Date();
      return today.getFullYear();
    },
  },
});
</script>

<style scoped lang="scss">
.container-fluid.footer {
  margin-top: 400px;
}
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
a:hover {
  opacity: 0.95;
}
</style>
