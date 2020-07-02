// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import { email, required } from 'vee-validate/dist/rules';
import TW from 'vee-validate/dist/locale/zh_TW.json';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';

Vue.config.productionTip = false;

// vue-axios 設定

Vue.use(VueAxios, axios);
axios.defaults.withcredentials = true;

// vee-validate 設定

localize('zh_TW', TW);

extend('email', email);
extend('required', {
  ...required,
  message: '{_field_} 欄位不能空白',
});
extend('phone', {
  validate: (value) => {
    const phoneReg = /^(09)[0-9]{8}$/;
    return phoneReg.test(value); // args.len 取得參數
  },
  message: '請填寫正確電話號碼',
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// vue-awesome-swiper 設定

Vue.use(VueAwesomeSwiper);

// vue-loading-overlay 設定

Vue.component('Loading', Loading);
// Vue.use('Loading', Loading, {
//   color: '#000000',
// });

// Vue.component('Loading', Loading, {
//   canCancel: false,
//   color: '#000000',
//   loader: 'dots',
//   width: 50,
//   height: 50,
//   backgroundColor: '#ffffff',
//   isFullPage: true,
//   opacity: 0.8,
// });
// Vue.component('Loading', {
//   canCancel: false,
//   color: '#000000',
//   // loader: 'dots', //spinner/dots/bars
//   width: 50,
//   height: 50,
//   backgroundColor: '#000000',
//   isFullPage: true,
//   opacity: 0.8,
// });

// Vue.use(Loading, {
//   canCancel: false,
//   color: '#000000',
//   loader: 'dots',
//   width: 50,
//   height: 50,
//   backgroundColor: '#ffffff',
//   isFullPage: true,
//   opacity: 0.8,
// });

// Vue.use(Loading, {
//   canCancel: false,
//   color: '#000000',
//   loader: 'dots',
//   width: 50,
//   height: 50,
//   backgroundColor: '#ffffff',
//   isFullPage: true,
//   opacity: 0.8,
// });

// 自訂的 filter

Vue.filter('currency', currencyFilter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
