<template>
  <div class="auth">
    <div class="character"></div>
    <div class="logo"></div>
    <div class="login-box">
      <div v-if="pageMethod == 'login'">
        <h1 class="display-4">Authentication</h1>
        <p class="lead small">You are registered on this server. Insert your account's password to proceed with the authentication.</p>
      </div>
      <div v-if="pageMethod == 'register'">
        <h1 class="display-4">Registration</h1>
        <p class="lead small">You are not registered on this server. Insert your account's password to proceed with the reegistration.</p>
      </div>
      <div class="input-group">
        <input v-model="password" :type="showPassword == true ? 'text' : 'password'" class="form-control"
          placeholder="Password">
        <div @click="showPassword = !showPassword" class="input-group-prepend">
          <span class="input-group-text">
            <i :class="showPassword != true ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
      </div>
      <button v-if="pageMethod == 'login'" @click="sendAuth(true)" class="btn btn-primary mt-3">Login</button>
      <button v-if="pageMethod == 'register'" @click="sendAuth(false)" class="btn btn-primary mt-3">Register</button>
    </div>
    <div class="copyright">Gamemode v0.0.1 - Last update: 09.03.2019</div>
  </div>
</template>

<script>
  export default {
    name: "Auth",
    data: function () {
      return {
        submitExecuted: false,
        password: "",
        showPassword: false
      };
    },
    methods: {
      sendAuth: function (type) {
        if (this.submitExecuted == true) return Swal({
          title: "Error!",
          text: "Please wait before submitting again!",
          type: "error",
          confirmButtonText: "Understood"
        });
        let password = this.password;
        if (password.length < 1) {
          return Swal({
            title: "Error!",
            text: "Please fill the input before submitting!",
            type: "error",
            confirmButtonText: "Understood"
          });
        }
        this.submitExecuted = true;
        setTimeout(() => {
          this.submitExecuted = false;
        }, 5000);
        mp.trigger(type == true ? "sendLoginData" : "sendRegisterData", password);
      }
    },
    watch: {
      alert: function (val) {
        Swal({
          title: "Error!",
          text: val,
          type: "error",
          confirmButtonText: "Understood."
        });
      }
    },
    computed: {
      pageMethod() {
        return this.$store.state.auth.pageMethod;
      },
      alert() {
        return this.$store.state.auth.alert;
      }
    }
  };
</script>