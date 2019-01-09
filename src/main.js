import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/main.less"; // global css
import "@fortawesome/fontawesome-free/css/all.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "animate.css/animate.min.css";
import VueQuillEditor from "vue-quill-editor";

import api from "../src/api/index";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$api = api;
Vue.use(VueQuillEditor /* { default global options } */);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
