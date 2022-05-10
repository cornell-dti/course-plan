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
        <advisor-card></advisor-card>
      </card>
      <!--      <card name="Another Card" class="toolsContainer-card" id="x" :desired-width="400">-->
      <!--        <h1>This one has a smaller width than default!</h1>-->
      <!--      </card>-->
    </div>
  </div>
</template>

<script>
import Card from '@/components/Tools/Card.vue';
import AdvisorCard from '@/components/Tools/AdvisorCard.vue';

export default {
  components: { AdvisorCard, Card },
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.toolsContainer {
  @media only screen and (max-width: $medium-breakpoint) {
    padding: 5rem 4rem;
  }
  background-color: #f6fafc;
  padding: 3rem 7rem;

  &-title {
    min-width: 100%;
    font-size: 36px;
    font-weight: bold;
    color: #3c3c3c;
    padding-bottom: 21px;
  }

  &-subtitle {
    font-size: 24px;
    color: #757575;
    padding-bottom: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }

  &-card {
    //  CSS handled in Card component. Go there to adjust margins.
  }
}
</style>
