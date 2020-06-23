import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Main from "@/Main.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:planData",
    name: "Home",
    component: Main,
    props: true,
  },
  {
    path: "/",
    name: "Home",
    component: Main,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
