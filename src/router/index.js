import { createRouter, createWebHistory } from "vue-router";
import OrdersOverview from "../components/OrdersOverview.vue";
import OrderDetails from "../components/OrdersDetails.vue";
import AdminLogin from "../components/AdminLogin.vue";
import Unauthorized from "../components/Unauthorized.vue";

const routes = [
{ path: "/", component: AdminLogin }, // Admin Login Page
  { path: "/orders", component: OrdersOverview },
  { path: "/orders/:id", component: OrderDetails },
  { path: "/unauthorized", component: Unauthorized },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
