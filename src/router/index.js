import { createRouter, createWebHistory } from "vue-router";
import OrdersOverview from "../components/OrdersOverview.vue";
import OrderDetails from "../components/OrdersDetails.vue";
import AdminLogin from "../components/AdminLogin.vue";
import OrderPage from "../components/OrderPage.vue";

const routes = [
{ path: "/login", component: AdminLogin }, // Admin Login Page
  { path: "/orders", component: OrdersOverview },
  { path: "/orders/:id", component: OrderDetails },
  { path: "/order", component: OrderPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
