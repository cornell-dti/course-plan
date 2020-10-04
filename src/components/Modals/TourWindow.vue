<template>
  <div class="tour">
    <div class = "blackout">
      <div class ="intropage">
        <div class = "picture">
          <img src = "@/assets/images/Person_planning.svg" alt = "person planning">
        </div>
        <div class = "content">
          <div class = "title">
            {{ title }}
          </div>
          <div class = "body" v-html = text>
          </div>
          <button @click = "$emit('hide'); $emit('startTour')">
            {{ buttonText }}
          </button>
          <a @click = "$emit('skip')">
            {{ exit }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const clickOutside = {
  bind(el, binding, vnode) {
    el.event = event => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event, binding.arg);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.event);
  }
};

export default {
  props: {
    title: String,
    text: String,
    exit: String,
    buttonText: String
  },
  data() {
    return {
      hideOnClick: ''
    };
  },
  directives: {
    'click-outside': clickOutside
  }
};

</script>

<style scoped lang="scss">
.blackout{
  z-index: 100;
  background-color:rgba(0,0,0,0.5);
  position: absolute;
  width: 100vw;
  height: 100vh;
  left:0px;
  bottom:0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.intropage{
  z-index: 200;
  width: 40vw;
  height: 80vh;
  background-color:white;
  opacity: 1;
  position: absolute;
  border-radius: 9px;
  padding: 0px;
}
.picture{
  width: 100%;
  height: 66%;
  display: flex;
  justify-content: center;
  background-color: #1AA9A5;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  img{
    height: 100%;
  }
}
.content{
  width: 100%;
  height: 34%;
  border-radius: 9px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  padding-top: 2%;
  padding-bottom: 2%;
  .title{
    font-weight: 600;
  }
  .body{
    font-size: .9em;
    text-align: center;
    color: #757575;
    width: 90%;
  }
  button{
    background-color: #508197;
    color: white;
    border: none;
    padding-right: .7em;
    padding-left: .7em;
    padding-top: .3em;
    padding-bottom: .3em;
    font-style: normal;
    font-weight: normal;
    border-radius: 3px;
  }
  a{
    font-weight: normal;
  }
}

</style>
