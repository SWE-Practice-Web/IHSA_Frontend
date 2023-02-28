<template>
  <div class="hero-image">
    <div class="card" style="width: 22rem; margin: auto; top: 46px; background-color: lightgray; border-style: solid; border-color: black; border-width: 2px;">
      <div class="card-body">
        <h4 class="card-title">Login</h4>
        <div class="card" style="width: 18rem; margin: auto;">
          <div class="hello">
            <img alt="IHSA logo" src="../assets/ihsalogo.png" height="150" width="200">
            <div>
              <br>
              <div class="login">
                <h5>
                Username
                </h5>
                <input type="username" id="username" placeholder="Username">
                <h5>
                Password
                </h5>
                <input type="password" id="password" placeholder="Password">
                <br>
                <br>
                <button class="btn btn-dark" type="submit">Login</button>
                <p>Don't have an account? <a href="#">Sign Up</a> </p>
              </div>
            </div> 
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'LoginPage',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: rgb(255, 255, 255);
  padding: 20px;
}
h3 {
  margin: 40px 0 0;
  color: rgb(0, 0, 0);
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #4000ff;
}
.hero-image{
  height: 100vh;
  width: 100%;
  background-image: url("../assets/ihsabackground.JPG");
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

</style>
