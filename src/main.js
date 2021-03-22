import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import VueAxios from "./plugins/axios";
//import axios from "axios";
import apexcharts from "apexcharts";
import JsonExcel from "vue-json-excel";
import Fragment from "vue-fragment";

Vue.config.productionTip = false;

Vue.component("downloadExcel", JsonExcel);
//Vue.prototype.$axios = axios;

new Vue({
  VueAxios,
  //axios,
  Fragment,
  vuetify,
  apexcharts,
  JsonExcel,
  render: (h) => h(App)
}).$mount("#app");
