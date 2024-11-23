<template>
  <div class="body_template">
  <button class="back_button" @click="goBack">Back to Orders</button>
  <div class="order_info_status">
        <h2>Order ID: {{ order._id }} </h2> 
        <p> {{ order.status }}</p>
      </div>
  <div class="order_details_container" v-if="order">
    <div class="order_info">
      <div class="order_info_contact">
        <h2>Customer </h2> 
        <p>Contact info</p>
        <p>{{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.email || "N/A" }}</p>
        <p>{{ order.customer?.phone || "N/A" }}</p>
      </div>
      <div class="order_info_billing">
        <p>bill to</p>
        <p> {{ order.customer?.fullName || "N/A" }}</p>
        <p>{{ order.customer?.billingAddress || "N/A" }}</p>
      </div>
      <div class="order_info_shipping">
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
    <!-- Product Details -->
    <div class="product_details"  v-for="(product, index) in order.products" :key="product.productId">
      <h2>Products</h2>
      <div class="product_details_image">
        <img src="https://via.placeholder.com/150" alt="Placeholder Image">     
      </div>
      <div class="product_details_config" >
        <span class="sub-title"><p>product id</p></span>
        <p>{{ product.productId }}</p>
        <span class="sub-title"><p>size</p></span>
        <p>{{ product.size }}</p>
        
        <span class="sub-title"><p>laces</p></span>
        <p> {{ product.colors.laces || "N/A" }}</p>
        <span class="sub-title"><p>sole top</p></span>
        <p> {{ product.colors.soletop || "N/A" }}</p>
        <span class="sub-title"><p>sole bottom</p></span>
        <p> {{ product.colors.soletop || "N/A" }}</p>
        <span class="sub-title"><p>front part</p></span>
        <p> {{ product.colors.frontpart || "N/A" }}</p>
        <span class="sub-title"><p>upper part</p></span>
        <p> {{ product.colors.upperpart || "N/A" }}</p>
        <span class="sub-title"><p>body</p></span>
        <p> {{ product.colors.bodypart || "N/A" }}</p>
        <span class="sub-title"><p>lining</p></span>
        <p> {{ product.colors.lining || "N/A" }}</p>
      </div>
      <div class="product_details_size" >
        <span class="sub-title"><p>size</p></span>
        <p> {{ product.size || "N/A" }}</p>
      </div>
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

    <!-- Back Button -->
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
  min-height: 100vh;
}
.order_details_container {
  margin: 50px 50px;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 20px; /* Space between blocks */
  border-radius: 8px;
}

.order_info, 
.customer_info, 
.product_details {
  background-color: white; /* Light background for blocks */
  border-radius: 10px; /* Rounded corners for each block */
  padding: 20px; /* Internal padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for each block */
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