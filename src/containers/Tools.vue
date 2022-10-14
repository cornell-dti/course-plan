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
      <card
        name="Progress Tracker"
        class="toolsContainer-card"
        id="progress"
        :desired-height="100"
      ></card>

      <card
        name="Export Schedule"
        class="toolsContainer-card"
        id="export"
        :desired-width="400"
        :desired-height="100"
      >
      </card>

      <card name="Contact Your Advisors" class="toolsContainer-card" id="advisors">
        <advisor-card></advisor-card>
      </card>

      <card
        name="Useful Links"
        class="toolsContainer-card"
        id="links"
        :desired-width="400"
        :desired-height="100"
      >
        <p>cornell.edu</p>
      </card>
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
    display: grid;
    grid-auto-columns: min-content;
    //grid-auto-rows: min-content;

    column-gap: 5rem;
    row-gap: 3rem;

    > :nth-child(1) {
      grid-column: 1/2;
      grid-row: 1/2;
    }

    > :nth-child(2) {
      grid-column: 2/3;
      grid-row: 1/2;
    }

    > :nth-child(3) {
      grid-column: 1/2;
      grid-row: 2/3;
    }

    > :nth-child(4) {
      grid-column: 2/3;
      grid-row: 2/3;
    }
  }
}
</style>
