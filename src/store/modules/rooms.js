import axios from 'axios';
import dayjs from 'dayjs';

dayjs().format();

export default ({
  namespaced: true,
  state: {
    // home 頁面
    rooms: [],
    // room、checkout 頁面
    room: [],
    roomItemBooked: [],
    // room 頁面
    imageActive: '',
    // rooms 頁面
    roomsDetil: [],
    roomsBooked: [],
  },
  actions: {
    getRooms(context, payload) {
      const apiUrl = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms';
      context.commit('LOADING', true, { root: true });
      axios.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        // 若頁面為 Home
        if (payload.form === 'home') {
          context.commit('ROOMS', res.data.items);
          context.commit('LOADING', false, { root: true });
          context.dispatch('messageModules/updateMessage', { message: '資料載入成功', status: 'success' }, { root: true });
        } else {
          // 若頁面為 Rooms
          axios.all(res.data.items.map(item => axios.get(`https://challenge.thef2e.com/api/thef2e2019/stage6/room/${item.id}`, {
            headers: {
              Authorization: process.env.API_TOKEN,
              accept: 'application/json',
            },
          }))).then(axios.spread((...resAll) => {
            context.commit('ROOMSDETIL', resAll.map(resItem => resItem.data.room[0]));

            const booked = [];
            resAll.forEach((resItem) => {
              booked.push({
                maxNum: resItem.data.room[0].descriptionShort.GuestMax,
                roomId: resItem.data.room[0].id,
                booked: resItem.data.booking.map(item => item.date),
              });
            });
            context.commit('ROOMSBOOKED', booked);
            context.commit('LOADING', false, { root: true });
            context.dispatch('messageModules/updateMessage', { message: '資料載入成功', status: 'success' }, { root: true });

            // 若頁面為 Rooms 且有 search 資料
            if (payload.search) {
              const search = payload.search;
              search.roomsBooked = context.state.roomsBooked;
              context.dispatch('searchModules/updateUnavailableRoom', search, { root: true });
            }
          }));
        }
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('messageModules/updateMessage', { message: '糟糕~ 出錯了!', status: 'danger' }, { root: true });
      });
    },
    getRoomItem(context, id) {
      const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${id}`;
      context.commit('LOADING', true, { root: true });
      axios.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        context.commit('ROOM', res.data.room[0]);
        context.commit('IMAGEACTIVE', res.data.room[0].imageUrl[0]);
        context.commit('ROOMITEMBOOKED', res.data.booking);
        context.commit('calendarModules/HIGHLIGHTED', context.state.roomItemBooked, { root: true });
        context.commit('LOADING', false, { root: true });
        context.dispatch('messageModules/updateMessage', { message: '資料載入成功', status: 'success' }, { root: true });
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('messageModules/updateMessage', { message: '糟糕~ 出錯了!', status: 'danger' }, { root: true });
      });
    },
  },
  mutations: {
    // home 頁面
    ROOMS(state, status) {
      state.rooms = status;
    },
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
    // rooms 頁面
    ROOMSDETIL(state, status) {
      state.roomsDetil = status;
    },
    ROOMSBOOKED(state, status) {
      state.roomsBooked = status;
    },
  },
  getters: {
    rooms: state => state.rooms,
    room: state => state.room,
    roomItemBooked: state => state.roomItemBooked,
    imageActive: state => state.imageActive,
    roomsDetil: state => state.roomsDetil,
    roomsBooked: state => state.roomsBooked,
  },
});
