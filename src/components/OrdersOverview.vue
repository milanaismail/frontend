<template>
  <div class="orders_container">
  <div class="orders_sub_container">
    <h1>Orders </h1>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Created</th>
          <th>Customer</th>
          <th>Total Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td>{{ order._id }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
          <td>{{ order.customer?.fullName || "N/A" }}</td>
          <td>{{ order.totalPrice || "N/A" }}</td>
          <td>
              <!-- Dropdown for status -->
              <select
                :class="getStatusClass(order.status)"
                :value="order.status"
                @change="handleStatusChange(order, $event)"
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
          </td>
          <td>
            <button @click="viewOrder(order._id)">View</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
  <!-- Confirmation Div -->
  <div v-if="confirmationVisible" class="confirmation-modal">
      <p>
        Are you sure you want to change the status to
        <strong>{{ selectedStatus }}</strong>?
      </p>
      <button @click="applyStatusChange">Yes</button>
      <button @click="cancelStatusChange">No</button>
  </div>

    <!-- Success Modal -->
    <div v-if="successModalVisible" class="success-modal">
      <p>Status updated successfully!</p>
      <button @click="closeSuccessModal">OK</button>
    </div>
  
  <div class="orders_account">
      <div class="account_header">
        <img :src="profilePicture" alt="Profile Picture" class="profile_picture" />
        <h2>{{ accountName }}</h2>
      </div>
      <div class="account_overview">
        <h3>Overview</h3>
        <p>Total orders </p>
        <span class="number">{{ totalOrders }}</span>
        <p>Pending orders </p>
        <span class="number">{{ pendingOrders }}</span>
        <p>Delivered orders </p>
        <span class="number">{{ deliveredOrders }}</span>
        <p>Cancelled orders </p>
        <span class="number">{{ cancelledOrders }}</span>
      </div>
  <button @click="logout" class="logout_button">Log Out</button>
  </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      orders: [],
      error: null,
      confirmationVisible: false,
      successModalVisible: false,
      selectedOrderId: null,
      selectedStatus: null,
      previousStatus: null,
      profilePicture: "https://dummyimage.com/100x100/cccccc/000000.png&text=Profile",
      accountName: "John Doe", 
    };
  },
  computed: {
    totalOrders() {
      return this.orders.length;
    },
    pendingOrders() {
      return this.orders.filter((order) => order.status === "Pending").length;
    },
    deliveredOrders() {
      return this.orders.filter((order) => order.status === "Delivered").length;
    },
    cancelledOrders() {
      return this.orders.filter((order) => order.status === "Cancelled").length;
    },
  },
  async created() {
    try {
      const response = await fetch("https://sneaker-config.onrender.com/api/v1/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      this.orders = await response.json();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    viewOrder(orderId) {
      this.$router.push(`/orders/${orderId}`);
    },
    getStatusClass(status) {
      switch (status) {
        case "Pending":
          return "status-pending";
        case "Delivered":
          return "status-delivered";
        case "Cancelled":
          return "status-cancelled";
        default:
          return "";
      }
    },
    handleStatusChange(order, event) {
      this.previousStatus = order.status; // Store the current status
      this.selectedOrderId = order._id;
      this.selectedStatus = event.target.value; // Get the new status
      this.confirmationVisible = true; // Show the confirmation modal
    },
    async applyStatusChange() {
  try {
    const response = await fetch(
      `https://sneaker-config.onrender.com/api/v1/orders/${this.selectedOrderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: this.selectedStatus }),
      }
    );

    if (!response.ok) throw new Error("Failed to update status");

    // Update the order's status in the frontend
    const order = this.orders.find((o) => o._id === this.selectedOrderId);
    if (order) {
      order.status = this.selectedStatus; // Update the status in the orders array
    }

    this.confirmationVisible = false;
    this.successModalVisible = true; // Show the success modal
  } catch (err) {
    this.error = err.message;
  }
},
    cancelStatusChange() {
      this.confirmationVisible = false;

      // Revert the dropdown to the previous status
      const order = this.orders.find((o) => o._id === this.selectedOrderId);
      if (order) {
        order.status = this.previousStatus; // Restore the previous status
      }
    },
    closeSuccessModal() {
      this.successModalVisible = false; // Close the success modal
    },
    logout() {
      localStorage.removeItem("token"); // Remove token from local storage
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>



<style>
@import url('"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}


th, td {
  border: 1px solid #ccc;
  border-left: none;
  border-right: none;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #000;
  color: rgb(105, 255, 71);
  height: 50px;
}
.orders_container{
  display: flex;
}
.orders_sub_container{
  flex: 5;
  padding: 20px;
}
.orders_account{
  flex: 1;
  padding: 20px;
  background-color: #FDF7FF;
  height: 100vh;
}

select {
  padding: 10px 5px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: transparent;
  -webkit-appearance: menulist; /* Keeps the native dropdown arrow in Safari */
  -moz-appearance: menulist;
  outline: none;  
  appearance: menulist;
  border-right: 10px solid transparent

}

select:hover {
  cursor: pointer;
}
.status-pending {
  background-color: #ded2ff;
}

.status-delivered {
  background-color: #9cff9a;
}

.status-cancelled {
  background-color: #ff9a9c;
}

.confirmation-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.confirmation-modal p {
  margin-bottom: 20px;
}

.confirmation-modal button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.confirmation-modal button:last-child {
  background-color: #dc3545;
}

.confirmation-modal button:hover {
  opacity: 0.9;
}

.success-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #d4edda;
  padding: 20px;
  border: 1px solid #c3e6cb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.success-modal p {
  color: #155724;
  margin-bottom: 20px;
  font-weight: bold;
}

.success-modal button {
  padding: 8px 12px;
  border: none;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.success-modal button:hover {
  opacity: 0.9;
}
.profile_picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.account_header {
  display: flex;
  flex-direction: row;
  align-items: center;  
  gap: 10px;
} 

.logout_button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout_button:hover {
  opacity: 0.9;
}

.number{
  font-size: 24px;
  font-weight: bold;
}

</style>
