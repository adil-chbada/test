import Vue from "vue";
import Vuetify from "vuetify";

import "vuetify/dist/vuetify.min.css";

import App from "./App";

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  iconfont: "mdi",
  theme: {
    error: "#dc3545",
    info: "#17a2b8",
    success: "#28a745",
    warning: "#ffc107"
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<app/>"
});
