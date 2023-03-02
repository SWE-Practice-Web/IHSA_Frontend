<template>
  <div class="hero-image">
    <div class="card" style="background-color: lightgray; border-style: solid; border-color: black; border-width: 2px;">
      <div class="card-body">
        <div class="card">
          <div class="hello">
            <img alt="IHSA logo" src="../assets/ihsalogo.png" height="150" width="200">
            <div>
              <br>
              <div class="signup">
                <h5>
                  Username
                </h5>
                <input type="username" id="username" placeholder="Username">
                <h5>
                  Email
                </h5>
                <input type="email" id="email" placeholder="Email">
                <h5>
                  Password
                </h5>
                <input type="password" id="password" placeholder="Password">
                <h5>
                  Confirm password
                </h5>
                <input type="password" id="password" placeholder="Password">
                <br>
                <br>
                <button class="btn btn-dark" type="submit">Signup</button>
                <p>Have an account? <router-link class="nav-link" to="/Login">Login here</router-link> </p>
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
  name: 'SignupPage',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5 {
  margin-bottom: 0rem;
}

input {
  margin-bottom: 1rem;
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

.card-body {
  padding: 15px 30px;
}

.hello {
  padding: 0px 10px;
}

.hero-image {
  height: 93vh;
  width: 100%;
  background-image: url("../assets/ihsabackground.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
