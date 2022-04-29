<template>
  <div class="toolsContainer">
    <div class="toolsContainer-header">
      <div class="toolsContainer-title">
        <span>Hi Courseplanner!</span>
      </div>
      <div class="toolsContainer-subtitle">
        <span>Here are some resources to help you plan.</span>
      </div>
    </div>
    <div class="toolsContainer-cards">
      <card name="Contact Your Advisors" class="toolsContainer-card" id="advisors">
        <!--      <img src="@/assets/images/dots/threeDots.svg" alt="open menu for semester" />-->
      </card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Tools/Card.vue';

export default {
  components: { Card },
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.toolsContainer {
  background-color: #f6fafc;
  padding: 3rem 7rem;

  &-title {
    font-size: 36px;
    font-weight: bold;
    color: #3c3c3c;
    padding-bottom: 21px;
  }

  &-subtitle {
    font-size: 24px;
    color: #757575;
    padding-bottom: 30px;
  }

  &-cards {
    display: flex;
    flex-wrap: wrap;
  }

  &-card {
    margin: 5px;
  }
}

//@media only screen and (max-width: $medium-breakpoint) {
//  .toolsContainer {
//    padding: 5rem 4rem;
//
//    &-title {
//      font-size: 30px;
//    }
//
//    &-subtitle {
//      font-size: 12px;
//    }
//  }
//}
</style>
