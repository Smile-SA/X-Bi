<template>
  <section class="content">
  <form method="POST" v-bind:action="this.login_user()"> 
        <div class="imgcontainer">
        <img src="static/img/CO2_Biller_-_logo.png" width="550" height="300" alt="Avatar" class="avatar">
      </div>
      <div class="container">
        <label for="tenant"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="tenant" required>
        <label for="password"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" required> 
        <button type="submit">Login</button>
        <label>
          <input type="checkbox" checked="checked" name="remember"> Remember me
        </label>  
      </div>
      <div class="container" style="background-color:#f1f1f1">
        <!-- <button type="button" @click="$router.push('home')"  class="cancelbtn">Cancel</button> -->
        <span class="psw" >  <a v-bind:href='this.signup()'> Create user  </a></span>
        <span class="psw" >Forgot <a v-bind:href='this.password()'>password?</a></span> 
      </div>
    </form>
  </section>
</template>
<script>
import { generateAPIUrl } from '../variables'

export default {
  name: 'Login',
  data () {
    return {
      api: generateAPIUrl()
    }
  },
  
  methods: {
  
    login_user: function() {
      return(`${this.api}/login_user`)
    },
    password: function() {
      return(`${this.api}/password`)
    },
    signup: function() {
      return(`${this.api}/signup`)
    }
  },
  
}

</script>

<style>
#notFound {
  padding: 10em;
}
body {font-family: Arial, Helvetica, sans-serif;}
form {border: 3px solid #f1f1f1;}

input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
  width:25%;
}

span.psw {
  float: right;
  padding-top: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
     display: block;
     float: none;
  }
  .cancelbtn {
     width: 100%;
  }
}
</style>
