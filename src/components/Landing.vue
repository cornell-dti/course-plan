<template>
  <div >
    <div class="top-bar">
        <b-row  class>
            <b-col>
                <img class="logo" src="../assets/images/logo.svg" alt = "logo" />
            </b-col>
             <b-col cols ="3" align-self="center">
                 <b-row>
                    <b-button style="margin-right: 20px;" variant="outline-primary" class="signin-button"> Sign in </b-button>
                    <b-button variant="outline-primary" class="signin-button"> Log in </b-button>
                </b-row>
            </b-col>
        </b-row>
    </div>

    <div class="plan">
        <b-row>
            <b-col cols="5">
                <h1 class="plan-head">Plan Your Courses Ahead</h1>
                <p class="plan-subhead">Introducing the new way to plan courses at Cornell</p>
                <b-row class = "email">
                    <b-col cols="12" md="8"><input  class= "email-input" type="text" placeholder="Your Email Address" v-model="newUser.email" ></b-col>
                    <b-col cols="6" md="4"><b-button variant= "primary" class="email-button" v-on:click="addUser"> Get Started </b-button> </b-col>
                </b-row>
            </b-col>
            <b-col style="position:relative" cols= "6">
                <img class="laptop" src="../assets/images/laptop.svg" alt = "laptop preview" />
            </b-col>

        </b-row>

    </div>

    <div class= "green">
        <b-row>
            <b-col>
                <h1 class= "new-1"> New Way to Track Your Requirements </h1>
                <b-row class = "tasks">
                    <b-col cols="1"> <img  src="../assets/images/Task1.svg" alt = "checklist" /></b-col>
                    <b-col cols="11" >  <p class= "new">Fully personalized to track your requirements</p> </b-col>

                </b-row>
                <b-row class = "tasks">
                    <b-col cols="1"> <img  src="../assets/images/Task2.svg" alt = "browser" /></b-col>
                    <b-col cols="11" >  <p class= "new">Customizable interface to view your courses</p> </b-col>

                </b-row>
                <b-row class = "tasks">
                    <b-col cols="1"> <img  src="../assets/images/Task3.svg" alt = "Network" /></b-col>
                    <b-col cols="11" >  <p class= "new">Built-in system to check your progress</p> </b-col>
                </b-row>
                 <b-row class = "tasks">
                    <b-col cols="1"> <img  src="../assets/images/Task4.svg" alt = "Starred comment" /></b-col>
                    <b-col cols="11" >  <p class= "new">Recommends courses based on your needs</p> </b-col>
                </b-row>
            </b-col>
            <b-col>
                <img style="position:relative" class="women" src="../assets/images/Person_planning.svg" alt = "women planning" />
            </b-col>
        </b-row>
    </div>

    <div class= "drag">
        <b-row>
            <b-col>
                  <img class="preview" src="../assets/images/Drag1.svg" alt = "Dragging preview" />
            </b-col>
            <b-col>
                <h1 class= "new">Drage Your Course In</h1>
            </b-col>
        </b-row>
    </div>

    <div class= "blue">
        <b-row>
            <b-col>
                <h1 class= "new">Plan Your Semesters</h1>
            </b-col>
            <b-col>
                  <img class="schedule" src="../assets/images/schedule.svg" alt = "Dragging preview" />
            </b-col>

        </b-row>
    </div>

    <div class= "first">
        <b-row> <h1 class= "new-1 text-center">Be The First One To Use It</h1> </b-row>
        <b-row> <p class= "new text-center">Gain early access by filling out your email below and help us grow into what you need!</p> </b-row>
        <b-row class = "email">
            <b-col cols="8" ><input type="text" placeholder="Your Email Address" v-model="newUser.email" ></b-col>
            <b-col cols="4" ><b-button variant= "primary" class="email-button" v-on:click="addUser"> Get Started </b-button> </b-col>
        </b-row>
    </div>

  </div>
</template>

<script>
const firebaseConfig = require('@/firebaseConfig.js');

const { emailsCollection } = firebaseConfig;

export default {
  name: 'LandingPage',
  props: {

  },
  firebase: {
    users: emailsCollection
  },
  data() {
    return {
      newUser: {
        email: ''
      }
    };
  },
  methods: {
    addUser() {
      emailsCollection.add(this.newUser);
      this.newUser.email = '';
    }
  }
};

</script>

<style scoped lang="scss">
.signin-button{
    color: #1AA9A5;
    font-weight: 550;
    border-color: #1AA9A5;
    padding: 10px 30px;
    border-radius: 6px;
}

.top-bar{

    margin: 0px 0px 0px 0px;
     display: flex;
  flex-direction: column;
  padding:59px 0px 0px 104px;
}

.top-bar-row{
    display: flex;
    justify-content: space-between;
}
.plan{
    display: flex;
    flex-direction: column;
    padding:89px 0px 240px 104px;
    margin-right: 0px;
    max-width: 100%;
    &-green{
        background-color: #1AA9A5;
    }
}
.laptop{
    position: absolute;
    bottom: -300px;
}
.women{
    position: absolute;
    bottom: -100px;
}

.plan-head{
    font-weight: bold;
    font-size: 72px;
    line-height: 73px;
    color: #4F4F4F;

}
.plan-subhead{
    font-weight: 300;
    font-size: 32px;
    line-height: 34px;
    color: #000000;
}
.email{
    padding-top: 40px;
    width: 600px;
}
input{
    padding: 10px ;
    margin-right: 10px;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border-color:#1AA9A5;
}
.email-button{
    background-color: #1AA9A5;
    border-radius : 6px;
    border-color: #1AA9A5;
    width: 100%;
    padding : 15px 30px;
}
.green{
    background-color: #1AA9A5;
    margin-right: 0px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    padding:80px 0px 50px 104px;

    }

.drag{
    background-color:  #105351;
   max-width: 100%;
    display: flex;
    flex-direction: column;
    padding:0px 0px 89px 0px;

}

.blue{
    background-color:  #92C3E6;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    padding:89px 0px 89px 104px;
}


.first{
    background-color:  #508197;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding:20px 0px 89px 104px;
}

h1.new{
    font-weight: 600;
    font-size: 40px;
    padding-top: 200px;
    padding-bottom: 35px;

    color: #FFFFFF;
}

h1.new-1{
    font-weight: 600;
    font-size: 40px;
    padding-top: 30px;
    padding-bottom: 0px;

    color: #FFFFFF;
}

p.new{

    font-weight: normal;
    font-size: 24px;
    padding : 15px;
    padding-bottom : 25px;
    color: #FFFFFF;
    margin : 0;
}

.tasks{
    display: flex;
    align-items: center;
  justify-content: center;
    padding: 15px;
}

col.tasks{
    padding-right: 10px;
}

.email-end{
    padding-left: 400px;
    padding-right : 400px;
}

</style>
