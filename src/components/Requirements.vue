<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>
    <div class="reqs" v-for="(req, index) in reqs" v-bind:key="req.id">
      <div class="row top">
        <p class="name col p-0">{{ req.name }}</p>
        <div class="col-1 text-right p-0">
          <button class="btn">
            <svg class="settings" x="0px" y="0px" viewBox="0 0 24 24"><path d="M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"></path></svg>
          </button>
        </div>
      </div>
      <div class="progress"><div class="progress-bar" v-bind:style="{ 'background-color': req.color, width: `${(req.progress/req.total)*100}%`}" role="progressbar"></div></div>
      <p class="progress-text"><strong>{{ req.progress }}/{{ req.total }}</strong> Total {{ req.count }} Inputted on Schedule</p>
      <button class="view btn" v-bind:class="{ none: req.displayDetails }" v-bind:style="{ 'background-color': req.color }" v-on:click="display(index)">
        View All College Requirements
      </button>
      <div class="detail" v-bind:class="{ none: !req.displayDetails }">
        <div class="todo">
          <div class="row detail-bar">
            <p class="col detail-text p-0">In-Depth {{ req.type }} Requirements</p> 
            <div class="text-right p-0">
              <button class="btn" v-on:click="close(index)">
                <img class="cancel" src="../assets/images/x.png" alt="X">
              </button>
            </div>
          </div>
          <div class="list" v-for="value in req.todo" v-bind:key="value.id">
            <div class="separator"></div>
            <div class="row req">
              <p class="col float-left p-0 req-name">{{ value.name }}</p>
              <p class="col float-right text-right p-0 req-progress">({{ value.progress }}/{{ value.total }} {{ value.count }})</p>
            </div>
          </div>
          <div class="separator"></div>
        </div>
        <div class="completed" v-if="req.completed.length > 0">
          <div class="row detail-bar">
            <p class="col detail-text p-0">Completed {{ req.type }} Requirements</p>
            <button class="btn" v-bind:style="{ 'color': req.color }">
              <p class="toggle" v-bind:class="{ none: !req.displayCompleted }" v-on:click="hide(index)">HIDE</p>
              <p class="toggle" v-bind:class="{ none: req.displayCompleted }" v-on:click="show(index)">SHOW</p>
            </button>
          </div>
          <div class="list" v-bind:class="{ none: !req.displayCompleted }" v-for="value in req.completed" v-bind:key="value.id">
            <div class="separator"></div>
            <div class="row req">
              <p class="col float-left p-0 req-name">{{ value.name }}</p>
              <p class="col float-right text-right p-0 req-progress">({{ value.progress }}/{{ value.total }} {{ value.count }})</p>
            </div>
          </div>
          <div class="separator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      reqs: [
        {
          name: "College Requirements",
          type: "College",
          count: "Credits",
          progress: 46,
          total: 120,
          color: '#2BBCC6',
          displayDetails: false,
          todo: [
            {
              name: "CALS Credits",
              count: "Credits",
              progress: 12,
              total: 55
            },
            {
              name: "PE Credits",
              count: "Credits",
              progress: 1,
              total: 2
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: "Quantitative Literacy",
              count: "Credits",
              progress: 2,
              total: 2
            },
            {
              name: "Chemistry/Physics",
              count: "Credits",
              progress: 1,
              total: 2
            }
          ]
        },
        {
          name: "Major Requirements",
          type: "Major",
          count: "Courses",
          progress: 4,
          total: 8,
          color: '#4D53DC',
          displayDetails: false,
          todo: [
            {
              name: "CALS Credits",
              count: "Credits",
              progress: 12,
              total: 55
            },
            {
              name: "PE Credits",
              count: "Credits",
              progress: 1,
              total: 2
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: "Quantitative Literacy",
              count: "Credits",
              progress: 2,
              total: 2
            },
            {
              name: "Chemistry/Physics",
              count: "Credits",
              progress: 1,
              total: 2
            }
          ]
        }
      ]
    }
  },

  methods: {
    display: function(index) {
      this.reqs[index].displayDetails = true;
    },
    close: function(index) {
      this.reqs[index].displayDetails = false;
    },
    show: function(index) {
      this.reqs[index].displayCompleted = true;
    },
    hide: function(index) {
      this.reqs[index].displayCompleted = false;
    }
  }
}
</script>

<style scoped lang="scss">

.btn {
  padding: 0;
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
  margin: 1.5rem 0 1rem 0;
}

.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
}

.settings {
  height: 14px;
  width: 14px;
  fill: #999999;
}

.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  line-height: 12px;
}

button.view {
  margin: 0.7rem 0 2rem 0;
  min-height: 40px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: white;
  text-transform: uppercase;
}

.detail-bar {
  margin: 1.625rem 0 0.8125rem 0;
  width: 100%;
}

.detail-text {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}

.cancel {
  height: 10px;
  width: 10px;
}

.toggle {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
}

.req {
  margin: 0.5rem 0 0 0;
  padding: 0;
  color: #757575;

  &-name {
    font-size: 14px;
    line-height: 14px;
  }

  &-progress {
    font-weight: bold;
    font-size: 12px;
    line-height: 12px;
  }
}

.separator {
  margin: 0 0 0 0;
  height: 1px;
  width: 100%;
  background-color: #D7D7D7;
}

.none {
  display: none;
}

</style>