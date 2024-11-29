<template>
    <div class="login">
      <img class="logo" src="/swear_logo.png" alt="">
      <div class="input">
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
        password: "",
        error: null,
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch("https://sneaker-config.onrender.com/api/v1/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.email, password: this.password }),
          });
          if (!response.ok) {
            throw new Error("Invalid login credentials");
          }
          const data = await response.json();
          localStorage.setItem("token", data.token); // Store token
          this.$router.push("/orders"); // Redirect to orders overview
        } catch (err) {
          this.error = err.message;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
  }
  input {
    margin: 10px 0;
    padding: 10px;
    width: 430px;
    border-radius: 12px;
    border-color: darkgray;
  }

  button {
    margin: 10px 0;
    padding: 10px;
    width: 450px;
    background-color: #65F845;
    border: none;
    border-radius: 12px;
  }

  .logo{
    width: 40%;
  }

  .login{
    display: flex;
    flex-direction: row;
    gap: 200px;
    margin-left: 100px;
  }

  .input{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 150px;
  }
  </style>
  