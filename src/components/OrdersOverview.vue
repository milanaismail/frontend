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
                v-model="order.status"
                @change="confirmStatusChange(order)"
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
  
  <div class="orders_account">
    <div>
      <h2>Account</h2>
      <h3>Overview</h3>
      <p>Total orders</p>
      <p>Pending orders</p>
      <p>Delivered orders</p>
      <p>Cancelled orders</p>
    </div>
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
      selectedOrderId: null,
      selectedStatus: null,
    };
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
      const options = { year: "numeric", month: "long", day: "numeric" };
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
    confirmStatusChange(order) {
      this.confirmationVisible = true;
      this.selectedOrderId = order._id;
      this.selectedStatus = order.status; // Fix: Track the correct status
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

        alert("Status updated successfully!");
        this.confirmationVisible = false; // Hide the confirmation modal
      } catch (err) {
        this.error = err.message;
      }
    },
    cancelStatusChange() {
      this.confirmationVisible = false;

      // Revert dropdown to the original value
      const order = this.orders.find((o) => o._id === this.selectedOrderId);
      if (order) {
        order.status = this.selectedStatus; // Restore the original status
      }
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

</style>
