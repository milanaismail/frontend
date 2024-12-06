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
        <button type="submit" :disabled="loading">
          <span v-if="!loading">Login</span>
          <span v-else>Loading...</span>
        </button>
        <p class="error" v-if="error" style="color: red;">{{ error }}</p>
      </form>
    </div>
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
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
      this.loading = true; // Set loading to true when API call starts
      this.error = null; // Reset error
      try {
        const response = await fetch("https://sneaker-config.onrender.com/api/v1/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid login credentials");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        this.$router.push("/orders");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false; // Set loading to false after API call completes
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
  .loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
  </style>
  