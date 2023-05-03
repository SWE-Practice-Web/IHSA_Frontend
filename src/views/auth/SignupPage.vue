<template>
  <div class="hero-image">
    <div class="card" style="background-color: lightgray; border-style: solid; border-color: black; border-width: 2px;">
      <div class="card-body">
        <div class="card">
          <div class="hello">
            <img alt="IHSA logo" src="../../assets/ihsalogo.png" height="150" width="200">
            <form @submit="signup">
              <br>
              <div class="signup d-flex flex-column justify-content-center align-items-center">
                <div class="d-flex flex-column w-75">
                  <input type="given-name" v-model="firstName" placeholder="First name" autocomplete="on" required>
                  <input type="family-name" v-model="lastName" placeholder="Last Name" autocomplete="on" required>
                  <input type="username" v-model="userName" placeholder="Username" autocomplete="on" required>
                  <input type="email" v-model="email" placeholder="Email" autocomplete="on" required>
                  <input type="password" v-model="passwordOriginal" placeholder="Password" autocomplete="on" required>
                  <input type="password" v-model="passwordConfirmed" placeholder="Confirm Password" autocomplete="on" required>
                </div>
                <br>
                <input role="button" type="submit" value="Submit" class="btn btn-primary"/>
                <p>Have an account? <router-link class="nav-link" to="/Login">Login here</router-link> </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'SignupPage',
  setup() {
    return {
      firstName: null,
      lastName: null,
      userName: null,
      passwordOriginal: null,
      passwordConfirmed: null,
      email:null
    }
  },
  methods: {
    signup() {
      if (this.passwordOriginal != this.passwordConfirmed) {
        this.$notify({
            title: 'Error',
            text: `Passwords don't match`,
            type: 'error'
          });
        return
      }
      const postData = {
        "firstName": this.firstName,
        "lastName": this.lastName,
        "email": this.email,
        "username": this.userName,
        "password": this.passwordConfirmed
      }
      this.$axios.post('/User/Register', postData)
        .then(() => {
          this.$router.push("/login")
          this.$notify({
            title: 'Success creating account',
            text: `Success creating account: Please log in!`,
            type: 'Success'
          });
        }).catch(() => {
          this.$notify({
            title: 'Error',
            text: `Error login in`,
            type: 'error'
          });
        })
    }
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
  background-image: url("../../assets/ihsabackground.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
