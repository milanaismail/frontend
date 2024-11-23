<template>
  <div class="body_template">
  <button class="back_button" @click="goBack">Back to Orders</button>
  <div class="order_info_status">
        <h2>Order ID: {{ order._id }} </h2> 
        <p> {{ order.status }}</p>
      </div>
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
              <strong>Laces:</strong> {{ product.colors.laces || "N/A" }}<br />
              <strong>Sole Top:</strong> {{ product.colors.soleTop || "N/A" }}<br />
              <strong>Sole Bottom:</strong> {{ product.colors.soleBottom || "N/A" }}<br />
              <strong>Front Part:</strong> {{ product.colors.frontPart || "N/A" }}<br />
              <strong>Upper Part:</strong> {{ product.colors.upperPart || "N/A" }}<br />
              <strong>Body:</strong> {{ product.colors.body || "N/A" }}<br />
              <strong>Lining:</strong> {{ product.colors.lining || "N/A" }}
            </td>
            <td>
              <strong>Laces:</strong> {{ product.fabrics.laces || "N/A" }}<br />
              <strong>Sole Top:</strong> {{ product.fabrics.soleTop || "N/A" }}<br />
              <strong>Sole Bottom:</strong> {{ product.fabrics.soleBottom || "N/A" }}<br />
              <strong>Front Part:</strong> {{ product.fabrics.frontPart || "N/A" }}<br />
              <strong>Upper Part:</strong> {{ product.fabrics.upperPart || "N/A" }}<br />
              <strong>Body:</strong> {{ product.fabrics.body || "N/A" }}<br />
              <strong>Lining:</strong> {{ product.fabrics.lining || "N/A" }}
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
      <p><strong>Shipping Method:</strong> {{ order.shippingMethod || "N/A" }}</p>
      <p><strong>Shipping Price:</strong> {{ order.shippingPrice  || "N/A"  }}</p>
    </div>

    <!-- payment details-->
    <div class="order_info_payment">
      <h2>Payment Details</h2>
      <!--subtotal-->
      <p><strong>Subtotal:</strong> {{ formatPrice(calculateTotalPrice()) }}</p>
      <!--shipping cost-->
      <p><strong>Shipping:</strong> {{ order.shippingPrice || "N/A" }}</p>
      <!--total price-->
      <p><strong>Total:</strong> {{ formatPrice(calculateTotalPrice() + order.shippingPrice) }}</p>
    </div>
  </div>
    <!-- Customer Details -->
    <div class="order_info">
      <div class="order_info_contact">
        <h2>Customer </h2> 
        <p>Contact info</p>
        <p>{{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.email || "N/A" }}</p>
        <p>{{ order.customer?.phone || "N/A" }}</p>
      </div>
      <div class="order_info_billing_adress">
        <p>bill to</p>
        <p> {{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.billingAddress || "N/A" }}</p>
      </div>
      <div class="order_info_shipping_adress">
        <p>ship to</p>
        <p> {{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.shippingAddress || "N/A" }}</p>
      <p><strong>Created:</strong> {{ formatDate(order.createdAt) }}</p>
      </div>
      <div class="order_info_date">
        <p>order date</p>
      <p>{{ formatDate(order.createdAt) }}</p>
      </div>
      <div class="order_info_total">
        <p>total price</p>
        <p>{{ formatPrice(calculateTotalPrice()) }}</p>
      </div>
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
      this.order = await response.json();
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
  },
};
</script>

<style scoped>
.body_template {
  background-color: #f9f9f9;
  height: 100vh;
}
.order_details_container {
  margin: 50px 50px;
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
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.back_button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back_button:hover {
  background-color: #0056b3;
}
.sub-title {
  font-weight: bold;
  text-transform: uppercase;
}

</style>