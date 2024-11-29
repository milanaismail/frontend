<template>
    <div class="order-page">
        <div class="header-order">
            <h1>CHECKOUT</h1>
            <button class="back_button">Continue browsing</button>
        </div>
      <div class="order-page-subcontainer">
      <!-- Client Information Form -->
      <div class="client-info">
        <h2>Customer information</h2>
        <form @submit.prevent="submitOrder">
        <div class="full-name">
          <label>
            First Name:
            <input type="text" v-model="client.firstName" required />
        </label>
        <label>
          Last Name:
          <input type="text" v-model="client.lastName" required />
        </label>
        </div>
          <label>
            Email:
            <input type="email" v-model="client.email" required />
          </label>
          <label>
            Phone:
            <input type="tel" v-model="client.phone" required />
          </label>
          <h2>Delivery details:</h2>
          <label>
            Address:
            <input v-model="client.address" required></input>
          </label>
          <label>
            Postal code:
            <input v-model="client.postalCode" required></input>
          </label>
            <label>
                City:
                <input v-model="client.city" required></input>
            </label>
          <button type="submit" class="place-order-button">Place Order</button>
        </form>
      </div>
            <!-- Shoe Configuration Summary -->
            <div class="shoe-summary">
  <h2>Product details</h2>
  <div class="image-and-colors">
    <img src="https://via.placeholder.com/150" alt="Placeholder Image">
    <div class="color-details">
      <div v-for="(value, part) in shoeConfig.colors" :key="part" class="shoe-part">
        <strong>{{ formatPartName(part) }}:</strong> {{ value }} ({{ shoeConfig.fabrics[part] || "N/A" }})
      </div>
    </div>
  </div>
  <p><strong>Size:</strong> {{ shoeConfig.size }}</p>
  <p><strong>Quantity:</strong> {{ shoeConfig.quantity }}</p>
  <p class="price"><strong>Total Price:</strong> {{ formatPrice(shoeConfig.price * shoeConfig.quantity) }}</p>
</div>
    </div>
</div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        shoeConfig: {
          productId: "abc123",
          colors: {
            "laces": "blue",
            "sole-top": "red",
            "sole-bottom": "yellow",
            "front-part": "blue",
            "upper-part": "green",
            "body": "gray",
            "lining": "red",
          },
          fabrics: {
            "laces": "cotton",
            "sole-top": "rubber",
            "sole-bottom": "rubber",
            "front-part": "rubber",
            "upper-part": "polyester",
            "body": "leather",
            "lining": "leather",
          },
          size: 42,
          price: 230,
          quantity: 1,
        },
        client: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          postalCode: "",
          city: "",
        },
      };
    },
    methods: {
      formatPartName(part) {
        return part.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
      },
      formatPrice(price) {
        return `$${price.toFixed(2)}`;
      },
      async submitOrder() {
        const orderData = {
          customer: { ...this.client },
          products: [
            {
              productId: this.shoeConfig.productId,
              colors: this.shoeConfig.colors,
              fabrics: this.shoeConfig.fabrics,
              size: this.shoeConfig.size,
              price: this.shoeConfig.price,
              quantity: this.shoeConfig.quantity,
            },
          ],
          totalPrice: this.shoeConfig.price * this.shoeConfig.quantity,
          status: "Pending",
        };
  
        try {
          const response = await fetch("https://sneaker-config.onrender.com/api/v1/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });
  
          if (!response.ok) {
            throw new Error("Failed to place the order");
          }
  
          alert("Order placed successfully!");
          this.$router.push("/thank-you"); // Redirect to a thank-you page
        } catch (error) {
          alert("An error occurred while placing the order: " + error.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .order-page {
    padding: 50px;   
    background-color: #f9f9f9;

  }
  .order-page-subcontainer{
    display: flex;
    gap: 20px;
  }

  .client-info{
    flex: 1;
  }

  .shoe-summary{
    flex: 1;
    height: fit-content;
  }


  h1, h2 {
    color: #333;
    margin-bottom: 10px;
  }
  
  .shoe-summary, .client-info {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for each block */

  }
  
  
  .shoe-part {
    margin: 5px 0;
  }
  
  label {
    display: block;
    margin: 10px 0;
  }
  
  input, textarea {
    width: -webkit-fill-available;
    padding: 15px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .place-order-button {
    padding: 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
  
  .place-order-button:hover {
    background-color: #0056b3;
  }

  .full-name{
    display: flex;
    justify-content: space-between;
  }

  .back_button{
    display: inline-block;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
}

.header-order{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.shoe-summary {
  display: flex;
  flex-direction: column;
}

.image-and-colors {
  display: flex;
  align-items: flex-start;
}

.image-and-colors img {
  margin-right: 20px; /* Ruimte tussen de afbeelding en de kleurdetails */
}

.shoe-part {
  margin-bottom: 10px; /* Ruimte tussen de verschillende onderdelen */
}

.price{
  display: flex;
  justify-content:space-between;
}


  </style>
  