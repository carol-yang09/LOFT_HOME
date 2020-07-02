import Vue from 'vue';

Vue.prototype.$bus = new Vue();

// vm.$bus.$emit('counter', number); 向外層傳遞
