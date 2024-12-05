<template>
    <div class="unauthorized">
      <h1>Access Denied</h1>
      <p>You do not have the necessary permissions to access this page.</p>
      <button @click="goBack">Go Back</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goBack() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  .unauthorized {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
    color: white;
    text-align: center;
  }
  
  button {
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #65f845;
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
  </style>
  