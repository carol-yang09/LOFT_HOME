import dayjs from 'dayjs';

dayjs().format();

export default ({
  namespaced: true,
  state: {
    searchInfo: {
      isShow: false,
      checkIn: '',
      checkOut: '',
      sumNum: '',
    },
    // 不能預約的房型 id - 用於搜尋過濾
    unavailableRoom: [],
    // 已被選擇的日期
    selectDateArray: [],
  },
  actions: {
    updateSelectDateArray(context, payload) {
      const dateArray = [];
      const start = payload.checkIn.getTime();
      const end = payload.checkOut.getTime();
      const oneDayLong = 1000 * 60 * 60 * 24;
      for (let t = start; t <= end; t += oneDayLong) {
        const time = dayjs(t).startOf('day').format('YYYY-MM-DD');
        dateArray.push(time);
      }
      context.commit('SELECTDATEARRAY', dateArray);
    },
    updateUnavailableRoom(context, payload) {
      context.dispatch('updateSelectDateArray', { checkIn: payload.checkIn, checkOut: payload.checkOut });

      const array = [...context.state.selectDateArray];
      const unavailableId = [];

      // 取得與 選擇日期(vm.selectDateArray) 相撞的房型id 放入 unavailableId 陣列
      for (let i = 0; i < payload.roomsBooked.length; i += 1) {
        for (let j = 0; j < payload.roomsBooked[i].booked.length; j += 1) {
          if (array.indexOf(payload.roomsBooked[i].booked[j]) > -1) {
            // 取得不符合資格的 roomId
            unavailableId.push(payload.roomsBooked[i].roomId);
            break;
          }
        }
      }

      const unavailable = payload.roomsBooked
        // 取得 不符合日期資格的房型 或 不符合人數資格的房型
        .filter(filterItem => unavailableId.indexOf(filterItem.roomId) > -1
          || filterItem.maxNum < payload.sumNum)
        // 得到 所有不符合資格的房型 Id 陣列
        .map(item => item.roomId);

      context.commit('UNAVAILABLEROOM', unavailable);
      context.commit('SEARCHINFO', {
        isShow: true,
        checkIn: dayjs(payload.checkIn).format('YYYY/MM/DD'),
        checkOut: dayjs(payload.checkOut).format('YYYY/MM/DD'),
        sumNum: payload.sumNum,
      });
    },
    resetSearch(context) {
      context.commit('SEARCHINFO', {
        isShow: false,
        checkIn: '',
        checkOut: '',
        sumNum: '',
      });
      context.commit('SELECTDATEARRAY', []);
      context.commit('UNAVAILABLEROOM', []);
    },
  },
  mutations: {
    SELECTDATEARRAY(state, status) {
      state.selectDateArray = status;
    },
    UNAVAILABLEROOM(state, status) {
      state.unavailableRoom = status;
    },
    SEARCHINFO(state, status) {
      state.searchInfo = status;
    },
  },
  getters: {
    selectDateArray: state => state.selectDateArray,
    unavailableRoom: state => state.unavailableRoom,
    searchInfo: state => state.searchInfo,
  },
});
