<template>
    <div class="login">
      <div class="login-left">
        <img class="logo" src="/SWEAR_Logo_white.png" alt="">
      </div>
      <div class="input">
      <h1>Admin login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p class="error" v-if="error" style="color: red;">{{ error }}</p>
      </form>
    </div>
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

    // Controleer of de response een fout bevat
    if (!response.ok) {
      const errorData = await response.json(); // Backend error ophalen
      throw new Error(errorData.message || "Invalid login credentials");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // JWT-token opslaan
    this.$router.push("/orders"); // Doorverwijzen naar orderspagina
  } catch (err) {
    this.error = err.message; // Toon foutbericht in de UI
  }
}

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
  input , textarea{
    width: -webkit-fill-available;
    padding: 15px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  button {
    padding: 15px;
    margin: 5px 0;
    width: 450px;
    background-color: #65F845;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    opacity: 0.8;
  }

  .logo{
    width: 40%;
  }

  .login{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
  }

  .input{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error {
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
    color: red;
  }

  .login-left {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}

  h1{
    color: white;
  }

  </style>
  