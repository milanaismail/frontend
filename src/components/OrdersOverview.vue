<template>
  <div class="orders_container">
  <div class="orders_sub_container">
    <h1>Orders Overview</h1>
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
              <span :class="getStatusClass(order.status)">{{ order.status || "N/A" }}</span>
            </td>
          <td>
            <button @click="viewOrder(order._id)">View</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" style="color: red;">{{ error }}</p>
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
        case 'Pending':
          return 'status-pending';
        case 'Delivered':
          return 'status-delivered';
        case 'Cancelled':
          return 'status-cancelled';
        default:
          return '';
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
  background-color: #f4f4f4;
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

.status-pending {
  background-color: #DED2FF;
  padding: 10px 20px;
  border-radius: 4px;
}

.status-delivered {
  background-color: #9CFFA9;
  padding: 10px 20px;
  border-radius: 4px;
}

.status-cancelled {
  background-color: #FF9A9C;
  padding: 10px 20px;
  border-radius: 4px;
}

</style>
