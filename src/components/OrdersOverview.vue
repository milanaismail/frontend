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
          <td>{{ order._id.slice(0, 8) }}</td>          <td>{{ formatDate(order.createdAt) }}</td>
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
            <button class="view" @click="viewOrder(order._id)">View</button>
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
    <div>
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
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          // Redirect to Unauthorized page if access is forbidden
          this.$router.push("/unauthorized");
        } else {
          throw new Error(errorData.message || "Failed to fetch orders");
        }
      }
    // Fetch and log raw data
    const ordersData = await response.json();
    console.log("Fetched Orders Data:", ordersData);

    this.orders = ordersData.map((order) => {
      if (order.customer) {
        // Ensure firstName and lastName exist, or fallback to placeholders
        const firstName = order.customer.firstName || "Unknown";
        const lastName = order.customer.lastName || "Customer";

        // Add fullName dynamically
        order.customer.fullName = `${firstName} ${lastName}`;
      } else {
        console.warn(`Order missing customer details - ID: ${order._id}`);
        // Add a placeholder for missing customer details
        order.customer = { fullName: "Unknown Customer" };
      }

      return order;
    });

    // Log processed orders to verify transformation
    console.log("Processed Orders with fullName and Product IDs:", this.orders);
  } catch (err) {
    console.error("Error Fetching or Processing Orders:", err.message);
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
      this.$router.push("/"); // Redirect to login page
    },
  },
};
</script>



<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
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
  height: 100vh; 
  position: relative;
}
.orders_sub_container{
  flex: 5;
  padding: 20px 40px;
}

.orders_sub_container table {
  border-collapse: collapse;
  width: 100%;
}

.orders_sub_container thead {
  position: sticky;
  top: 0;
  z-index: 1; /* Zorg ervoor dat de header boven de tbody blijft */
  background-color: #000; /* Header-achtergrond */
  color: rgb(105, 255, 71);
}

.orders_sub_container tbody {
  display: block; /* Maakt de tbody scrollbaar */
  max-height: 450px; /* Pas de hoogte aan naar wens */
  overflow-y: auto; /* Scroll alleen verticaal */
}

.orders_sub_container tr {
  display: table;
  table-layout: fixed;
  width: 100%; /* Zorg dat rijen uitgelijnd blijven */
}

.orders_sub_container th, 
.orders_sub_container td {
  padding: 8px;
  text-align: left;
  border-left: none;
  border-right: none;
}

.orders_account {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  justify-content: space-between; /* Space between content and logout button */
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1); /* Optional shadow for separation */
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
  background: #ffffff; /* Pure white background */
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 400px;
  text-align: center;
}

.confirmation-modal p {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.confirmation-modal button {
  margin: 10px 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background-color: #28a745;
  color: white;
}

.confirmation-modal button:hover {
  opacity: 0.9;
}
.confirmation-modal button:last-child {
  background-color: #dc3545; 
}

.confirmation-modal button:last-child:hover {
  opacity: 0.9;
}

.success-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f0fff4; /* Light green background for success */
  padding: 30px;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 400px;
  text-align: center;
}

.success-modal p {
  font-size: 16px;
  color: #155724; /* Dark green for text */
  margin-bottom: 20px;
  font-weight: bold;
}

.success-modal button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #28a745; /* Green button */
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.success-modal button:hover {
  background-color: #218838; /* Darker green on hover */
}

.profile_picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.account_header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout_button {
  padding: 10px 20px;
  background-color: #fc5f61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: center; /* Center button horizontally */
}


.logout_button:hover {
  opacity: 0.9;
}

.number{
  font-size: 24px;
  font-weight: bold;
}

.view {
  background-color: white;
  color: #676767;
  border: 1px solid #676767;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.view:hover {
  background-color: #676767;
  color: white;
}



</style>
