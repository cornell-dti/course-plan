<template>
<div>
  <div class = "body-container">
    <!--TOP BAR-->
    <div class="container p-0">
        <div class="row top-bar justify-content-between no-gutters">
            <div class="col-10">
                <img class="logo" src="@/assets/images/logo.svg" alt = "logo" />
              </div>
        </div>
    </div>
    <!-- <img data-v-ef68022e="" src="img/logo.4d084161.svg" alt="logo" class="logo"> -->
    <div class = "message-container">
      <img class = "img-404" src="@/assets/images/404.svg" alt = "404">
      <div class = "oops-wrapper">
        <div id="oops" class="color_box">
          Oops...
          <br/>Page Not Found <img class = "thinking-face" src = "@/assets/images/thinking_face.svg">
        </div>
      </div>
    </div>
    <div class="back_to_home">
      <a class = "back_to_home_link" href = "/login">Back to home</a>
    </div>
    <div class = "footer-container">
    </div>
    <div class="container-fluid footer p-0 page_404">
        <div class= "row footer justify-content-center m-0">
            <div class="col-3 footer">
              <!-- <a href ="https://www.cornelldti.org" class= "footer"> Cornell DTI @ </a> -->
              <a href ="https://www.cornelldti.org" class= "footer"> Cornell DTI @ {{getYear()}}</a>
            </div>
            <div class="col-3">
                <p class= "footer">Built with ❤️</p>
            </div>
            <div class="col-3 footer">
                <a  class="footer" href="https://app.termly.io/document/privacy-policy/fcecc0e8-8af2-472d-8d27-b6b89d02a2be">Privacy Policy</a>
            </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  methods: {
    getYear() {
      const today = new Date();
      return today.getFullYear();
    }
  }
};
</script>


<style scoped lang="scss">

#oops {
  text-align: left;
  display: inline-block;
  font-weight: bold;
  font-size: 55px;
  color: #0a2327;
  vertical-align: top;
  @media(max-width: 1154px){
    margin-top: 8%;
    font-size: 7vw;
  }
  @media(max-width: 800px){
    margin-top: 8%;
    font-size: 9vw;
  }
}
.back_to_home {

  font-size: 35px;
  vertical-align: middle;
  text-align: center;
  color: #7b7d7e;
  margin-bottom: 6vh;
  margin-top: 6vh;
  height: 100px;
  @media(max-width: 800px){
    margin-top: 8%;
    font-size: 8vw;
  }

}

.container {
  max-width: 100%;
}
.page_404{
  bottom: 0;
  // position:absolute;
  @media(max-height: 600px){
    position: relative;
    bottom: 0;
  }
  // margin-top: -50px;
}
.top-bar{
  padding:59px 0px 0px 104px;

  @media (max-width: 1154px) {
    padding: 59px 104px 0px 104px;
    display: flex;
    flex-direction: column;
  }
}
a.back_to_home_link{
  color: #7b7d7e;
}
p.footer{
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
  margin-left: .5rem;
  margin-right: .5rem;
}
.col-3.footer{
  text-align: center;
  padding-right: 0px;
  padding-left: 0px;
}
.row.footer{
  padding : 40px;
}
.img-404{
  // min-width: 15vw;
  vertical-align: top;
  display: inline-block;
  @media(max-width: 1154px){
    width: 60%;
  }
  @media(max-width: 800px){
    width: 80%;
  }
}
.oops-wrapper{
  min-width: 20vw;
  display: inline-block;
  margin-left: 5%;
}
.message-container{
  display: flex;
  margin-bottom: 3%;
  margin-top: 5%;
  justify-content: center;
  @media(max-width: 1154px){
    margin-top: 8vh;
    flex-direction: column;
    align-items: center;
  }
}
.footer-container{
  height: 100%;
}
.thinking-face{
  margin-bottom: 1vw;
}
.body-container{
  min-height: 100vh;
}
</style>
