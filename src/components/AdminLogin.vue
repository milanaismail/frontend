<template>
    <div>
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
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
    max-width: 300px;
    margin: 0 auto;
  }
  input, button {
    margin: 10px 0;
    padding: 10px;
  }
  </style>
  