import { createRouter, createWebHashHistory } from "vue-router";
import Tabela from "../components/Tabela.vue";
import Add from "../components/AddFlightView.vue";
import All from "../components/FlightsView.vue";
import AddBook from "../components/AddBook.vue";
import Books from "../components/Books.vue";
import FliterBooks from "../components/FilterBooks.vue";
import FactoryHomePage from "../components/FactoryHomePage.vue";
import ChocolateFactory from "../components/ChocolateFactory.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import Cart from "../components/Cart.vue";
import User from "../components/User.vue";

const routes = [
  {
    path: "/",
    name: "factoryHomePage",
    component: FactoryHomePage,
  },
  {
    path: "/factory/:id",
    name: "factory",
    component: ChocolateFactory,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/addbook",
    name: "addbook",
    component: AddBook,
  },
  {
    path: "/books",
    name: "books",
    component: Books,
  },
  {
    path: "/filter",
    name: "filter",
    component: FliterBooks,
  },
  {
    path: "/add",
    name: "add",
    component: Add,
  },
  {
    path: "/all",
    name: "all",
    component: All,
  },
  {
    path: "/tabela",
    name: "tabela",
    component: Tabela,
  },
  {
    path: "/users/:username",
    name: "users",
    component: User,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const userRole = localStorage.getItem("userRole");

  if (requiresAuth && userRole !== "customer") {
    next("/login");
  } else {
    next();
  }
});

export default router;
