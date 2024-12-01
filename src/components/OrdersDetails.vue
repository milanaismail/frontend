<template>
  <div class="body_template">
  <button class="back_button" @click="goBack">← Orders</button>
  <div class="order_info_status">
        <h2>Order ID: {{ order._id }} </h2> 
        <p :class="`status-${order.status.toLowerCase()}`"> {{ order.status }}</p>      </div>
  <div class="order_details_container" v-if="order">
    <div class="order_details_subcontainer">
      <!-- Product Details -->
      <div class="product_details"  v-for="(product, index) in order.products" :key="product.productId">
      <h2>Products</h2>
       <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product ID</th>
            <th>Colors</th>
            <th>Fabrics</th>
            <th>Size</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in order.products" :key="product.productId">
            <td>        <img src="https://via.placeholder.com/150" alt="Placeholder Image">     
            </td>
            <td>{{ product.productId }}</td>
            <td>
              <strong>Outside Left:</strong> {{ product.colors["outside_1"] || "N/A" }}<br />
              <strong>Outside Right:</strong> {{ product.colors["outside_2"] || "N/A" }}<br />
              <strong>Outside Front:</strong> {{ product.colors["outside_3"] || "N/A" }}<br />
              <strong>Inside:</strong> {{ product.colors["inside"] || "N/A" }}<br />
              <strong>Laces:</strong> {{ product.colors["laces"] || "N/A" }}<br />
              <strong>Sole Bottom:</strong> {{ product.colors["sole_bottom"] || "N/A" }}<br />
              <strong>Sole Top:</strong> {{ product.colors["sole_top"] || "N/A" }}
            </td>
            <td>
              <strong>Outside Left:</strong> {{ product.fabrics["outside_1"] || "N/A" }}<br />
              <strong>Outside Right:</strong> {{ product.fabrics["outside_2"] || "N/A" }}<br />
              <strong>Outside Front:</strong> {{ product.fabrics["outside_3"] || "N/A" }}<br />
              <strong>Inside:</strong> {{ product.fabrics["inside"] || "N/A" }}<br />
              <strong>Laces:</strong> {{ product.fabrics["laces"] || "N/A" }}<br />
              <strong>Sole Bottom:</strong> {{ product.fabrics["sole_bottom"] || "N/A" }}<br />
              <strong>Sole Top:</strong> {{ product.fabrics["sole_top"] || "N/A" }}
            </td>
            <td>{{ product.size }}</td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>{{ product.quantity }}</td>
            <td>{{ formatPrice(product.price * product.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- shipping details-->
    <div class="order_info_shipping">
      <h2>Shipping Details</h2>
      <div class="order_info_shipping_subcontainer">
        <p><strong>Shipping Method:</strong> {{ order.shippingMethod || "N/A" }}</p>
        <p>{{ order.shippingPrice  || "N/A"  }}</p>
      </div>
    </div>

    <!-- payment details-->
    <div class="order_info_payment">
      <h2>Payment Details</h2>
      <div class="order_info_payment_subcontainer">
        <p><strong>Subtotal:</strong> {{ formatPrice(calculateTotalPrice()) }}</p>
        <!--shipping cost-->
        <p><strong>Shipping:</strong> {{ order.shippingPrice || "N/A" }}</p>
        <!--total price-->
        <p><strong>Total:</strong> {{ formatPrice(calculateTotalPrice() + order.shippingPrice) }}</p>
      </div>
    </div>
  </div>
    <!-- Customer Details -->
    <div class="order_info">
    <div class="order_info_container">
      <div class="order_info_contact">
        <h2>Customer </h2> 
        <p><strong>Contact info:</strong></p>
        <p>{{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.email || "N/A" }}</p>
        <p>{{ order.customer?.phone || "N/A" }}</p>
      </div>
      <div class="order_info_shipping_adress">
        <p><strong>Ship to:</strong></p>
        <p> {{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.address || "N/A" }}</p>
        <p>{{ order.customer?.cityCode || "N/A" }}</p>
      <p><strong>Created:</strong></p>
        <p> {{ formatDate(order.createdAt) }}</p>
      </div>
      <div class="order_info_date">
        <p><strong>Order date:</strong></p>
      <p>{{ formatDate(order.createdAt) }}</p>
      </div>
      <div class="order_info_total">
        <p><strong>Total price:</strong></p>
        <p>{{ formatPrice(calculateTotalPrice()) }}</p>
      </div>
    </div>
    <div v-if="confirmationVisible" class="confirmation-modal">
  <div class="modal-content">
    <p>Are you sure you want to delete this order?</p>
    <div class="modal-actions">
      <button @click="confirmDeleteOrder" class="confirm-button">Yes</button>
      <button @click="hideDeleteConfirmation" class="cancel-button">No</button>
    </div>
  </div>
</div>

<!-- Success Modal -->
<div v-if="successModalVisible" class="success-modal">
      <p>Status updated successfully!</p>
      <button @click="closeSuccessModal">OK</button>
    </div>
  

    <button class="delete_button" @click="showDeleteConfirmation">Delete Order</button>

    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
      error: null,
      confirmationVisible: false,
      successModalVisible: false, // Add this to control the success modal visibility
    };
  },
  async created() {
    try {
      const response = await fetch(
        `https://sneaker-config.onrender.com/api/v1/orders/${this.$route.params.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch order details");
    const orderData = await response.json();

    // Combine firstName and lastName into fullName dynamically
    if (orderData.customer) {
      orderData.customer.fullName = `${orderData.customer.firstName} ${orderData.customer.lastName}`;
      orderData.customer.cityCode = `${orderData.customer.postalCode} ${orderData.customer.city}`;

    }

    this.order = orderData;
  } catch (err) {
    this.error = err.message;
  }
},
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    },
    goBack() {
      this.$router.push("/orders");
    },
  calculateTotalPrice() {
      if (!this.order || !this.order.products) return 0;
      return this.order.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    },
    showDeleteConfirmation() {
    this.confirmationVisible = true;
  },
  hideDeleteConfirmation() {
    this.confirmationVisible = false;
  },
  async confirmDeleteOrder() {
    try {
      const response = await fetch(
        `https://sneaker-config.onrender.com/api/v1/orders/${this.$route.params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete order");
      
      // Instead of alert, set successModalVisible to true to show the success modal
      this.successModalVisible = true;

      // Optionally, navigate to the orders page after a short delay to allow the user to see the success modal
      setTimeout(() => {
        this.$router.push("/orders");
      }, 2000); // Delay for 2 seconds before redirecting
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete the order. Please try again.");
    } finally {
      this.confirmationVisible = false;
    }
  },

  // Method to close the success modal
  closeSuccessModal() {
    this.successModalVisible = false;
  },
},
};
</script>

<style scoped>
.body_template {
  background-color: #f9f9f9;
  padding: 50px;
}
.order_details_container {
  display: flex;
  flex-direction: row; /* Stack items vertically */
  gap: 20px; /* Space between blocks */
  border-radius: 8px;
}

.order_details_subcontainer {
  display: flex;
  flex-direction: column; /* Arrange items horizontally */
  gap: 20px; /* Space between columns */
  flex: 3;
}

.order_info, 
.product_details,
.order_info_shipping,
.order_info_payment {
  background-color: white; /* Light background for blocks */
  border-radius: 10px; /* Rounded corners for each block */
  padding: 20px; /* Internal padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for each block */
}

.order_info{
  flex: 1;
}

h1, h2 {
  color: #333;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  border-left: none;
  border-right: none;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td{
  vertical-align: top; /* Add this line to align content to the top */

}

.back_button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline; /* Add this line to underline the text */

}

.back_button:hover{
  opacity: 0.8;
}


.sub-title {
  font-weight: bold;
  text-transform: uppercase;
}
.order_info_shipping_subcontainer{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.order_info_payment_subcontainer p{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.order_info_status{
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  margin-bottom: 10px;
}

.status-pending {
  background-color: #ded2ff;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.status-delivered {
  background-color: #9cff9a;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.status-cancelled {
  background-color: #ff9a9c;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}
.delete_button{
  padding: 10px 20px;
  background-color: #fc5f61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: center; 
}

.delete_button:hover {
  opacity: 0.9;
}


.order_info{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  color: white
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
.confirm-button {
  background-color: #fc5f61;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f4f4f4;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover,
.cancel-button:hover {
  opacity: 0.8;
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


</style>