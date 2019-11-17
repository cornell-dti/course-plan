<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>
    <div class="reqs-college">
      <div class="row top">
        <p class="name col p-0">College Requirements</p>
        <div class="col-1 p-0">
          <svg class="settings" x="0px" y="0px" viewBox="0 0 24 24"><path d="M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"></path></svg>
        </div>
      </div>
      <div class="progress"><div class="progress-bar college-color" style="width: 33%" role="progressbar"></div></div>
      <p class="progress-text"><strong>46/120</strong> Total Credits Inputted on Schedule</p>
      <button class="view btn college-color">
        View All College Requirements
      </button>
      <div class="separator"></div>
      <div class="row top">
        <p class="name col p-0">Major Requirements</p>
        <div class="col-1 p-0">
          <svg class="settings" x="0px" y="0px" viewBox="0 0 24 24"><path d="M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"></path></svg>
        </div>
      </div>
      <div class="progress"><div class="progress-bar major-color" style="width: 60%" role="progressbar"></div></div>
      <p class="progress-text"><strong>16/30</strong> Total Credits Inputted on Schedule</p>
      <button class="view btn major-color">
        View All Major Requirements
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {}
</script>

<style scoped lang="scss">

.college-color {
  background-color: #2BBCC6;
}

.major-color {
  background-color: #4D53DC;
}

.requirements {
  width: 30rem;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}

h1.title {
  margin: 0 0 0 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
}

.top {
  margin: 1.5rem 0 1.5rem 0;
}

.name {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
}

.settings {
  height: 14px;
  width: 14px;
  fill: #999999;
}

.progress-text {
  margin: 0.3125rem 0 0.7rem 0;
  font-style: normal;
  font-size: 12px;
  line-height: 12px;
}

button.view {
  min-height: 40px;
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: white;
  text-transform: uppercase;
}

.separator {
  margin: 2rem 0 0 0;
  height: 1px;
  width: 100%;
  background-color: #D7D7D7;
}

</style>