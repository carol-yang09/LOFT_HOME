import $ from 'jquery';
import router from '@/router/index';

export default ({
  namespaced: true,
  state: {
    alert: {
      isShow: false,
      title: '',
      content: '',
      to: '',
      status: '',
    },
  },
  actions: {
    openAlert(context, payload) {
      context.commit('ALERT', payload);
      $('body').css('overflow', 'hidden');
    },
    closeAlert(context, payload) {
      if (payload) {
        router.push(payload);
      }
      const alert = {
        isShow: false,
        title: '',
        content: '',
        to: '',
        status: '',
      };
      context.commit('ALERT', alert);
      $('body').css('overflow', 'auto');
    },
  },
  mutations: {
    ALERT(state, payload) {
      state.alert = payload;
    },
  },
  getters: {
    alert: state => state.alert,
  },
});
