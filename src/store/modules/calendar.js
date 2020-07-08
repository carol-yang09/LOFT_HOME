import dayjs from 'dayjs';

dayjs().format();

export default ({
  namespaced: true,
  state: {
    disabledStart: {
      to: new Date(dayjs().endOf('day')), // 從 今日 23:59:59 以前 disabled
      from: new Date(dayjs().endOf('day').add(3, 'month')), //  從 今天加 3 個月 之後 disabled
    },
    disabledEnd: {
      to: new Date(dayjs().endOf('day')), // 從 今日 23:59:59 以前 disabled
      from: new Date(dayjs().endOf('day').add(3, 'month')), // 從 今天加 3 個月 之後 disabled
    },
    highlighted: {
      dates: [],
      includeDisabled: true,
    },
  },
  actions: {
    updateDisabledEnd(context, payload) {
      let limitTo = '';
      switch (payload) {
        // 若 payload 沒值則改為預設值
        case undefined:
          limitTo = new Date(dayjs().endOf('day'));
          break;
        default:
          // 若 payload 有值則改為 payload
          limitTo = new Date(dayjs(payload).startOf('day'));
          break;
      }

      context.commit('DISABLEDEND', {
        to: limitTo, // 從 今日 23:59:59 或 checkIn 天 以前 disabled
        from: new Date(dayjs().endOf('day').add(3, 'month')), // 從 今天加 3 個月 之後 disabled
      });
    },
    resetCalendar(context) {
      context.commit('DISABLEDEND', {
        to: new Date(dayjs().endOf('day')),
        from: new Date(dayjs().endOf('day').add(3, 'month')),
      });
      context.commit('HIGHLIGHTED', []);
    },
  },
  mutations: {
    DISABLEDEND(state, status) {
      state.disabledEnd = status;
    },
    HIGHLIGHTED(state, status) {
      state.highlighted = {
        dates: status,
        includeDisabled: true,
      };
    },
  },
  getters: {
    disabledStart: state => state.disabledStart,
    disabledEnd: state => state.disabledEnd,
    highlighted: state => state.highlighted,
  },
});
