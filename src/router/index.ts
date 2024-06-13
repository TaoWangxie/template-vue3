import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(), // hash模式:createWebHashHistory，history模式:createWebHistory
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/home/index.vue"),
      meta: {
        index: 0,
      },
    },
  ],
});

export default router;
