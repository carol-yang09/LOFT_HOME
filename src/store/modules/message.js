export default ({
  namespaced: true,
  state: {
    messages: [],
  },
  actions: {
    updateMessage(context, { message, status }) {
      const timestamp = Math.floor(new Date() / 1000);
      context.commit('PUSH_MESSAGE', {
        message,
        status,
        timestamp,
      });
      context.dispatch('removeMessageWithTiming', timestamp);
    },
    removeMessage(context, index) {
      context.commit('REMOVE_MESSAGE', index);
    },
    removeMessageWithTiming(context, timestamp) {
      setTimeout(() => {
        context.state.messages.forEach((item, index) => {
          if (item.timestamp === timestamp) {
            context.commit('REMOVE_MESSAGE', index);
          }
        });
      }, 2000);
    },
  },
  mutations: {
    PUSH_MESSAGE(state, msg) {
      state.messages.push(msg);
    },
    REMOVE_MESSAGE(state, index) {
      state.messages.splice(index, 1);
    },
  },
  getters: {
    messages: state => state.messages,
  },
});
