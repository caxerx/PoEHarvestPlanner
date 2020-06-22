import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:data",
    name: "Home",
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
