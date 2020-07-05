import Vue from 'vue';
import Vuex from 'vuex';

import roomsModules from './modules/rooms';
import alertModules from './modules/alert';
import messageModules from './modules/message';
import searchModules from './modules/search';
import calendarModules from './modules/calendar';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true, // 嚴謹模式
  state: {
    isLoading: false,
  },
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status);
    },
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
  },
  getters: {
    isLoading: state => state.isLoading,
  },
  modules: {
    roomsModules,
    alertModules,
    messageModules,
    searchModules,
    calendarModules,
  },
});
