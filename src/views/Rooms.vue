<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="true"
     :z-index="999" :background-color="'#000'">
      <template slot="before">
        <span class="loading">LOFT</span>
      </template>
      <template slot="default">
        <span class="loading"><i class="fas fa-bahai fa-spin"></i></span>
      </template>
      <template slot="after">
        <span class="loading">HOME</span>
      </template>
    </loading>

    <!-- toolbar -->
    <div class="toolbar">
      <form action="" class="container toolbar_form">
        <div class="calendar">
          <datepicker placeholder="CheckIn" v-model="checkIn"
            :disabled-dates="disabledStart"
            :format="'dd/MM/yyyy'"
            :calendar-class="'calendar_calendar'"
            :wrapper-class="'calendar_wrap'"
            :input-class="'calendar_input'"
            :required="true"
          ></datepicker>
          <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
        </div>
        <div class="calendar">
          <datepicker placeholder="CheckOut" v-model="checkOut"
            :disabled-dates="disabledEnd"
            :format="'dd/MM/yyyy'"
            :calendar-class="'calendar_calendar'"
            :wrapper-class="'calendar_wrap'"
            :input-class="'calendar_input'"
            :required="true"
          ></datepicker>
          <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
        </div>
        <Counter counter-name="Adults" v-bind:number="adults" v-on:number="countAdults"
        ></Counter>
        <Counter counter-name="Kids" v-bind:number="kids"  v-on:number="countKids"
        ></Counter>
        <a href="#" class="btn btn-m btn-dark" @click.prevent="searchRoom()">Search</a>
      </form>
    </div>

    <div class="container rooms">
      <div class="search-info" v-if="searchInfo.isShow">
        搜尋結果：{{ searchInfo.checkIn }} ~ {{ searchInfo.checkOut }} | {{ searchInfo.sumNum }} 人
      </div>
      <div>
        <div class="card" v-for=" room in filterRooms" :key="room.id">
          <router-link :to="`rooms/${room.id}`" class="effect">
            <div class="effect_img"
             :style="{ 'background-image': 'url(' + room.imageUrl[0] + ')'}"></div>
            <div class="effect_rect">
              <p class="effect_rect_text">{{ room.name }}</p>
            </div>
          </router-link>
          <div class="card_body">
            <h5 class="card_title">
              {{ room.name }}
            </h5>
            <ul class="card_info">
              <li>
                | 人數：{{ room.descriptionShort.GuestMin }}
                 至 {{ room.descriptionShort.GuestMax }} 人
              </li>
              <li>| 坪數：{{ room.descriptionShort.Footage }}平方公尺</li>
              <li>| 床型：{{ room.descriptionShort.Bed[0] }}</li>
              <li v-if="room.amenities.Breakfast">| 餐點：附早餐</li>
              <li v-else>| 餐點：無</li>
            </ul>
            <ul class="row card_facilities">
              <template v-for="(facility, key) in room.amenities">
                <li v-if="room.amenities[key]" :key="key">
                  <i :class="amenities[key]"></i>
                </li>
              </template>
            </ul>
          </div>
          <div class="card_footer">
            <ul>
              <li class="card_price">平日每晚：<span>{{ room.holidayPrice | currency }}</span></li>
              <li class="card_price">假日每晚：<span>{{ room.normalDayPrice | currency }}</span></li>
            </ul>
            <div>
              <router-link :to="`rooms/${room.id}`" class="btn btn-m btn-outline-dark">
                MORE +
              </router-link>
              <a href="#" class="btn btn-m btn-dark" @click.prevent="bookRoom(room.id)">
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import Counter from '@/components/Counter';
import dayjs from 'dayjs';

dayjs().format();

export default {
  data() {
    return {
      rooms: [],
      // vue-loading-overlay 預設開啟
      isLoading: true,
      // 搜尋資訊
      searchInfo: {
        isShow: false,
        checkIn: '',
        checkOut: '',
        sumNum: '',
      },
      // 訂房資料
      checkIn: '',
      checkOut: '',
      kids: 0,
      adults: 0,
      // 所有已被預約資訊
      roomBooked: [],
      // 不能預約的房型 id - 用於搜尋過濾
      unavailableRoom: [],
      // amenities icon
      amenities: {
        'Child-Friendly': 'fas fa-baby',
        'Pet-Friendly': 'fas fa-paw',
        'Room-Service': 'fas fa-concierge-bell',
        'Smoke-Free': 'fas fa-smoking',
        Breakfast: 'fas fa-utensils',
        'Air-Conditioner': 'fas fa-wind',
        'Mini-Bar': 'fas fa-glass-martini-alt',
        Refrigerator: 'fas fa-ice-cream',
        Sofa: 'fas fa-couch',
        Television: 'fas fa-tv',
        'Wi-Fi': 'fas fa-wifi',
        'Great-View': 'fas fa-mountain',
      },
    };
  },
  methods: {
    getRooms() {
      const vm = this;
      const apiUrl = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms';
      vm.$http.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        res.data.items.forEach((item) => {
          vm.getRoomItem(item.id);
        });
        vm.$bus.$emit('message', '資料載入成功');
      }).catch(() => {
        this.isLoading = false;
        vm.$bus.$emit('message', '糟糕~ 出錯了!', 'danger');
      });
    },
    getRoomItem(id) {
      const vm = this;
      const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${id}`;
      vm.$http.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        // 把所有房型資料放入 vm.rooms
        vm.rooms.push(res.data.room[0]);

        // 把所有房型 booking 資料、roomid、maxNum 放入 vm.roomBooked
        const booked = [];
        const maxNum = res.data.room[0].descriptionShort.GuestMax;
        const roomId = res.data.room[0].id;

        res.data.booking.forEach((item) => {
          booked.push(item.date);
        });

        vm.roomBooked.push({
          roomId,
          maxNum,
          booked,
        });
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
        vm.$bus.$emit('message', '糟糕~ 出錯了!', 'danger');
      });
    },
    // Count
    countKids(num) {
      this.kids = num;
    },
    countAdults(num) {
      this.adults = num;
    },
    // 訂房 - 跳轉到 checkorder 頁面
    bookRoom(id) {
      const vm = this;
      vm.$router.push({
        path: '/checkorder',
        query: {
          roomId: id,
          checkIn: '',
          checkOut: '',
        },
      });
    },
    // 搜尋
    searchRoom() {
      const vm = this;

      // 取得人數
      const sumNum = Number(vm.adults) + Number(vm.kids);

      if (sumNum > 0 && vm.checkIn && vm.checkOut) {
        const filterId = [];
        // 取得與 選擇日期(vm.calDateArray) 相撞的房型id 放入 filterId 陣列
        for (let i = 0; i < vm.roomBooked.length; i += 1) {
          for (let j = 0; j < vm.roomBooked[i].booked.length; j += 1) {
            if (vm.calDateArray.indexOf(vm.roomBooked[i].booked[j]) > -1) {
              // 取得不符合資格的 roomId
              filterId.push(vm.roomBooked[i].roomId);
              break;
            }
          }
        }

        vm.unavailableRoom = vm.roomBooked
          // 取得 不符合日期資格的房型 或 不符合人數資格的房型
          .filter(filterItem => filterId.indexOf(filterItem.roomId) > -1
           || filterItem.maxNum < sumNum)
          // 得到 所有不符合資格的房型 Id 陣列
          .map(item => item.roomId);

        // 在畫面上顯示搜尋條件
        vm.searchInfo.isShow = true;
        vm.searchInfo.checkIn = dayjs(vm.checkIn).format('YYYY/MM/DD');
        vm.searchInfo.checkOut = dayjs(vm.checkOut).format('YYYY/MM/DD');
        vm.searchInfo.sumNum = sumNum;
      } else {
        const alert = {
          isShow: true,
          title: '錯誤!',
          content: '請輸入完整資訊，謝謝您！',
          to: '',
        };
        vm.$bus.$emit('alert', alert, 'danger');

        // 清空 searchInfo
        vm.searchInfo = {};
      }

      // 清空過濾條件
      vm.checkIn = '';
      vm.checkOut = '';
      vm.kids = 0;
      vm.adults = 0;
    },

  },
  computed: {
    disabledStart() {
      // 取得今日 23:59:59
      const limitStart = new Date(dayjs().endOf('day'));
      // 取得今天加 3 個月
      const limitEnd = new Date(dayjs().endOf('day').add(3, 'month'));

      return {
        to: limitStart, // 從 ... 以前 disabled
        from: limitEnd, // 從 ... 之後 disabled
      };
    },
    disabledEnd() {
      const vm = this;
      let limitStart = '';

      if (vm.checkIn) {
        // 若 checkIn 有值 則取得 checkIn 天
        limitStart = new Date(dayjs(vm.checkIn).startOf('day'));
      } else {
        // 若 checkIn 無值 則取得 今日
        limitStart = new Date(dayjs().endOf('day'));
      }
      // 取得今天加 3 個月
      const limitEnd = new Date(dayjs().endOf('day').add(3, 'month'));

      return {
        to: limitStart, // 從 ... 以前 disabled
        from: limitEnd, // 從 ... 之後 disabled
      };
    },
    // 將選擇的日期儲存為陣列
    calDateArray() {
      const vm = this;
      const dateArray = [];
      if (vm.checkIn && vm.checkOut) {
        const start = vm.checkIn.getTime();
        const end = vm.checkOut.getTime();
        const oneDayLong = 1000 * 60 * 60 * 24;
        for (let t = start; t <= end; t += oneDayLong) {
          const time = dayjs(t).startOf('day').format('YYYY-MM-DD');
          dateArray.push(time);
        }
      }
      return dateArray;
    },
    // 過濾房型
    filterRooms() {
      const vm = this;
      return vm.rooms
        .filter(item => vm.unavailableRoom.indexOf(item.id) === -1);
    },
  },
  watch: {
    // 監聽
    checkIn(newValue) {
      // checkIn 若大於 checkOut 則把 checkOut 清空
      if (new Date(newValue) > new Date(this.checkOut)) {
        this.checkOut = '';
      }
    },
  },
  components: {
    Datepicker,
    Counter,
  },
  created() {
    const vm = this;
    vm.getRooms();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.rooms {
  padding: 2.5rem 0;
  @include desktop {
    padding: 2.5rem 2rem;
  }
  @include mobile-l {
    padding: 2.5rem 1rem;
  }
}

.search-info {
  margin-bottom: 3rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid $dark;
  font-size: $font-m;
}

// toolbar

.toolbar {
  padding: 1rem 0;
  background-color: $primary;
  @include desktop {
    padding: 1rem 1rem;
  }
}

.toolbar_form {
  display: flex;
  justify-content: space-between;
  @include desktop-s {
    flex-direction: column;
    width: 80%;
  }
  @include mobile-l {
    width: 90%;
  }
}

// calendar

.calendar {
  position: relative;
  @include desktop-s {
    margin-bottom: 1rem;
  }
}

.calendar_icon {
  position: absolute;
  top: 20%;
  right: 10px;
}

>>> .calendar_input {
  width: 100%;
  height: 100%;
  padding: 0.25rem 0.5rem;
  text-align: center;
}

>>> .calendar_wrap {
  height: 100%;
  > div:first-child {
    height: 100%;
  }
}
</style>
