import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import element from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";

let app: any;
app = createApp(App);
app.use(router);
app.use(store);
app.use(element);
app.config.globalProperties.$vm = app;
app.mount("#app");
