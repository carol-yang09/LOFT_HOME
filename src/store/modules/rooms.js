import axios from 'axios';
import dayjs from 'dayjs';

dayjs().format();

export default ({
  namespaced: true,
  state: {
    // room、checkout 頁面
    room: [],
    roomItemBooked: [], // 已預約日期
    // room 頁面
    imageActive: '',
    // rooms 頁面
    roomsDetil: [],
    roomsBooked: [],
  },
  actions: {
    getRooms(context) {
      const apiUrl = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms';
      context.commit('LOADING', true, { root: true });
      axios.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        // if (payload.form === 'home') {
        //   context.commit('ROOMS', res.data.items);
        //   context.commit('LOADING', false, { root: true });
        //   context.dispatch('messageModules/updateMessage',
        //  { message: '資料載入成功', status: 'success' }, { root: true });
        // } else if (payload.form === 'rooms') {
        // 重置 roomsDetil、roomsBooked
        context.commit('RESET_ROOMSDETIL');
        context.commit('RESET_ROOMSBOOKED');

        res.data.items.forEach((item) => {
          context.dispatch('getRoomItem', { id: item.id, form: 'rooms' });
        });
        context.dispatch('messageModules/updateMessage', { message: '資料載入成功', status: 'success' }, { root: true });
        // }
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('messageModules/updateMessage', { message: '糟糕~ 出錯了!', status: 'danger' }, { root: true });
      });
    },
    getRoomItem(context, payload) {
      const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${payload.id}`;
      context.commit('LOADING', true, { root: true });
      axios.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        if (payload.form === 'rooms') {
          context.commit('PUSH_ROOMSDETIL', res.data.room[0]);
          context.commit('PUSH_ROOMSBOOKED', {
            maxNum: res.data.room[0].descriptionShort.GuestMax,
            roomId: res.data.room[0].id,
            booked: res.data.booking.map(item => item.date),
          });
          context.commit('LOADING', false, { root: true });
        } else {
          context.commit('ROOM', res.data.room[0]);
          context.commit('IMAGEACTIVE', res.data.room[0].imageUrl[0]);
          context.commit('ROOMITEMBOOKED', res.data.booking);
          context.commit('calendarModules/HIGHLIGHTED', context.state.roomItemBooked, { root: true });
          context.commit('LOADING', false, { root: true });
          context.dispatch('messageModules/updateMessage', { message: '資料載入成功', status: 'success' }, { root: true });
        }
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('messageModules/updateMessage', { message: '糟糕~ 出錯了!', status: 'danger' }, { root: true });
      });
    },
  },
  mutations: {
    // room、checkout 頁面
    ROOM(state, status) {
      state.room = status;
    },
    ROOMITEMBOOKED(state, status) {
      state.roomItemBooked = status.map(item => new Date(dayjs(item.date)));
    },
    // room 頁面
    IMAGEACTIVE(state, status) {
      state.imageActive = status;
    },
    // rooms 頁面 重置
    RESET_ROOMSDETIL(state) {
      state.roomsDetil = [];
    },
    RESET_ROOMSBOOKED(state) {
      state.roomsBooked = [];
    },
    // rooms 頁面
    PUSH_ROOMSDETIL(state, status) {
      state.roomsDetil.push(status);
    },
    PUSH_ROOMSBOOKED(state, status) {
      state.roomsBooked.push(status);
    },
    RESET_ROOMSSTORE(state) {
      state.room = [];
      state.roomItemBooked = [];
      state.imageActive = '';
      state.roomsDetil = [];
      state.roomsBooked = [];
    },
  },
  getters: {
    room: state => state.room,
    roomItemBooked: state => state.roomItemBooked,
    imageActive: state => state.imageActive,
    roomsDetil: state => state.roomsDetil,
    roomsBooked: state => state.roomsBooked,
  },
});
