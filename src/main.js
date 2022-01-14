import axios from "axios";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import {baseUrl} from '@/services/api/BaseUrl'
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";


import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);


const axiosInstance = axios.create({
  baseURL : baseUrl().apicms
});

axiosInstance.interceptors.request.use(

 function (config) {
   // Do something before request is sent
   // config.headers.common['interceptorheader'] = 'Interceptor Header';
   return config;
}, function (error) {
 // Do something with request error
 return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
 // Any status code that lie within the range of 2xx cause this function to trigger
 // Do something with response data
 return response;
}, function (error) {

   if(error.response.status === 401){
             const getToken = localStorage.getItem('auth')
             if(getToken !== null){ localStorage.removeItem('auth') }
             router.push('login')
   }
 
 // Any status codes that falls outside the range of 2xx cause this function to trigger
 // Do something with response error
 return Promise.reject(error);
});


import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

import CoolLightBox from "vue-cool-lightbox";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

Vue.use(CoolLightBox);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
